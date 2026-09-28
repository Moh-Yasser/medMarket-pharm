export const PROFILE_KEYS = {
  all: ["profile"] as const,
  me: () => [...PROFILE_KEYS.all, "me"] as const,
}

