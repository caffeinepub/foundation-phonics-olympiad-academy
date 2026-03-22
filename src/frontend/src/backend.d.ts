import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface T__3 {
    id: bigint;
    title: string;
    announcementType: string;
    body: string;
}
export type Role = {
    __kind__: "student";
    student: bigint;
} | {
    __kind__: "parent";
    parent: null;
};
export interface T__2 {
    id: bigint;
    studentId: bigint;
    mastered: boolean;
    attempts: bigint;
    letter: string;
}
export interface T {
    id: bigint;
    title: string;
    description: string;
}
export interface T__1 {
    id: bigint;
    role: Role;
    fullName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPhonic(letter: string, studentId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, body: string, announcementType: string): Promise<void>;
    createProfile(fullName: string, role: Role): Promise<void>;
    createQuestion(question: string, options: Array<string>, correctAnswer: string, category: string, createdBy: bigint): Promise<void>;
    createWorksheet(title: string, description: string): Promise<void>;
    getAnnouncements(): Promise<Array<T__3>>;
    getCallerUserProfile(): Promise<T__1 | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<[bigint, bigint]>>;
    getProfile(user: Principal): Promise<T__1 | null>;
    getStudentPhonics(studentId: bigint): Promise<Array<T__2>>;
    getUserProfile(user: Principal): Promise<T__1 | null>;
    getWorksheets(): Promise<Array<T>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(fullName: string, role: Role): Promise<void>;
    submitTestSession(studentId: bigint, score: bigint): Promise<void>;
    updatePhonic(id: bigint, mastered: boolean, attempts: bigint): Promise<void>;
}
