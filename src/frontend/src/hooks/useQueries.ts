import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Role, T__1 } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<T__1 | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fullName,
      role,
    }: { fullName: string; role: Role }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.saveCallerUserProfile(fullName, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorksheets() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["worksheets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorksheets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetStudentPhonics(studentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studentPhonics", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === null) return [];
      return actor.getStudentPhonics(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== null,
    refetchInterval: 10000,
  });
}

export function useSubmitTestSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      score,
    }: { studentId: bigint; score: bigint }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.submitTestSession(studentId, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["studentPhonics"] });
    },
  });
}
