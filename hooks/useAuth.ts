import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "@/types/api-response";
import type { User } from "@/types/auth";

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: ({ signal }) => AxiosResponse<User>("/api/me", { signal }),
    retry: false, // important: avoid retry loops on 401
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      AxiosResponse("/api/auth/login", {
        method: "POST",
        data: payload,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => AxiosResponse<{ ok: true }>("/api/auth/logout", { method: "POST" }),
    onSuccess: async () => {
  
      qc.setQueryData(["me"], null);
      await qc.invalidateQueries();
    },
  });
}


