import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginFormInputs, SignUpFormInputs, User } from "@/types"

export function useLogin() {
  const queryClient = useQueryClient()

  const mutation = useMutation<User, Error, LoginFormInputs>({
    mutationFn: async (userInformations) => {
      const res = await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInformations),
      })

      const responseReady = await res.json()
      queryClient.setQueryData(["user"], responseReady.data.user)
      return responseReady.data.user as User
    },
  })

  return {
    login: mutation.mutateAsync,
    isLogging: mutation.isPending,
  }
}

export function useSignUp() {
  const mutation = useMutation<User, Error, SignUpFormInputs>({
    mutationFn: async (userInformations) => {
      const res = await fetch(`http://localhost:3000/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInformations),
      })
      const responseReady = await res.json()
      return responseReady.data.user as User
    },
  })

  return {
    signUp: mutation.mutateAsync,
    isSigningUp: mutation.isPending,
  }
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/users/me", {
        credentials: "include",
      })

      if (!res.ok) {
        if (res.status === 401) return null
        throw new Error("Failed to fetch user")
      }

      const data = await res.json()
      return data.data.user as User
    },
  })
}
