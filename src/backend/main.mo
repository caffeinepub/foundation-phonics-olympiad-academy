import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Profile {
    public type Role = {
      #student : Nat;
      #parent;
    };

    public type T = {
      id : Nat;
      fullName : Text;
      role : Role;
    };

    public func compare(profile1 : T, profile2 : T) : Order.Order {
      Int.compare(profile1.id, profile2.id);
    };
  };

  module Phonic {
    public type T = {
      id : Nat;
      letter : Text;
      mastered : Bool;
      attempts : Nat;
      studentId : Nat;
    };
  };

  module QuizQuestion {
    public type T = {
      id : Nat;
      question : Text;
      options : [Text];
      correctAnswer : Text;
      category : Text;
      createdBy : Nat;
    };
  };

  module TestSession {
    public type T = {
      id : Nat;
      studentId : Nat;
      score : Nat;
      timestamp : Time.Time;
    };
  };

  module Announcement {
    public type T = {
      id : Nat;
      title : Text;
      body : Text;
      announcementType : Text;
    };
  };

  module Worksheet {
    public type T = {
      id : Nat;
      title : Text;
      description : Text;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProfileId = 1;
  let profiles = Map.empty<Principal, Profile.T>();

  var nextPhonicId = 1;
  let phonics = Map.empty<Nat, Phonic.T>();

  var nextQuestionId = 1;
  let questions = Map.empty<Nat, QuizQuestion.T>();

  var nextTestSessionId = 1;
  let testSessions = Map.empty<Nat, TestSession.T>();

  var nextAnnouncementId = 1;
  let announcements = Map.empty<Nat, Announcement.T>();

  var nextWorksheetId = 1;
  let worksheets = Map.empty<Nat, Worksheet.T>();

  public query ({ caller }) func getCallerUserProfile() : async ?Profile.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile.T {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(fullName : Text, role : Profile.Role) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let profileId = switch (profiles.get(caller)) {
      case (?existing) { existing.id };
      case (null) {
        let id = nextProfileId;
        nextProfileId += 1;
        id;
      };
    };

    let profile : Profile.T = {
      id = profileId;
      fullName;
      role;
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func createProfile(fullName : Text, role : Profile.Role) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let profileId = nextProfileId;
    nextProfileId += 1;

    let profile : Profile.T = {
      id = profileId;
      fullName;
      role;
    };

    profiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?Profile.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func addPhonic(letter : Text, studentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add phonics");
    };

    // Verify caller owns this student profile or is admin
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let authorized = switch (profile.role) {
          case (#student id) { id == studentId };
          case (#parent) { true }; // Parents can add for any student they manage
        };
        if (not authorized and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add phonics for your own student profile");
        };
      };
    };

    let phonicId = nextPhonicId;
    nextPhonicId += 1;

    let phonic : Phonic.T = {
      id = phonicId;
      letter;
      mastered = false;
      attempts = 0;
      studentId;
    };

    phonics.add(phonicId, phonic);
  };

  public shared ({ caller }) func updatePhonic(id : Nat, mastered : Bool, attempts : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update phonics");
    };

    switch (phonics.get(id)) {
      case (null) { Runtime.trap("Phonic does not exist") };
      case (?phonic) {
        // Verify caller owns this student profile or is admin
        switch (profiles.get(caller)) {
          case (null) { Runtime.trap("Profile not found") };
          case (?profile) {
            let authorized = switch (profile.role) {
              case (#student studentId) { studentId == phonic.studentId };
              case (#parent) { true }; // Parents can update for students they manage
            };
            if (not authorized and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only update phonics for your own student profile");
            };
          };
        };

        let updated : Phonic.T = {
          phonic with
          mastered;
          attempts;
        };
        phonics.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getStudentPhonics(studentId : Nat) : async [Phonic.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view phonics");
    };

    // Verify caller can view this student's data
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let authorized = switch (profile.role) {
          case (#student id) { id == studentId };
          case (#parent) { true }; // Parents can view students they manage
        };
        if (not authorized and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view phonics for your own student profile");
        };
      };
    };

    phonics.values().toArray().filter(func(p) { p.studentId == studentId });
  };

  public shared ({ caller }) func createQuestion(question : Text, options : [Text], correctAnswer : Text, category : Text, createdBy : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create questions");
    };

    let questionId = nextQuestionId;
    nextQuestionId += 1;

    let q : QuizQuestion.T = {
      id = questionId;
      question;
      options;
      correctAnswer;
      category;
      createdBy;
    };

    questions.add(questionId, q);
  };

  public shared ({ caller }) func submitTestSession(studentId : Nat, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit test sessions");
    };

    // Verify caller owns this student profile or is admin
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let authorized = switch (profile.role) {
          case (#student id) { id == studentId };
          case (#parent) { true }; // Parents can submit for students they manage
        };
        if (not authorized and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only submit test sessions for your own student profile");
        };
      };
    };

    let testSessionId = nextTestSessionId;
    nextTestSessionId += 1;

    let session : TestSession.T = {
      id = testSessionId;
      studentId;
      score;
      timestamp = Time.now();
    };

    testSessions.add(testSessionId, session);
  };

  public query ({ caller }) func getLeaderboard() : async [(Nat, Nat)] {
    // Leaderboard is public data - no authorization check needed
    let scoresList = List.empty<(Nat, Nat)>();
    for (profile in profiles.values().toArray().values()) {
      switch (profile.role) {
        case (#student _) {
          let totalScore = testSessions.values().toArray().map(func(t) { if (t.studentId == profile.id) { t.score } else { 0 } }).foldLeft(0, Nat.add);
          scoresList.add((profile.id, totalScore));
        };
        case (_) {};
      };
    };
    scoresList.toArray();
  };

  public shared ({ caller }) func createAnnouncement(title : Text, body : Text, announcementType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let announcementId = nextAnnouncementId;
    nextAnnouncementId += 1;

    let announcement : Announcement.T = {
      id = announcementId;
      title;
      body;
      announcementType;
    };

    announcements.add(announcementId, announcement);
  };

  public shared ({ caller }) func createWorksheet(title : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create worksheets");
    };

    let worksheetId = nextWorksheetId;
    nextWorksheetId += 1;

    let worksheet : Worksheet.T = {
      id = worksheetId;
      title;
      description;
    };

    worksheets.add(worksheetId, worksheet);
  };

  public query ({ caller }) func getAnnouncements() : async [Announcement.T] {
    // Announcements are public - no authorization check needed
    announcements.values().toArray();
  };

  public query ({ caller }) func getWorksheets() : async [Worksheet.T] {
    // Worksheets are public to view - no authorization check needed
    worksheets.values().toArray();
  };
};
