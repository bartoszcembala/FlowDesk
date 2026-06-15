import { useMutation } from "@tanstack/react-query"
import type { LoginFormInputs, User } from "@/types"

export function useLogin() {
  const mutation = useMutation<User, Error, LoginFormInputs>({
    mutationFn: async (userInformations) => {
      const res = await fetch(`http://localhost:3000/api/users/login`, {
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
    login: mutation.mutateAsync,
    isLogging: mutation.isPending,
  }
}

export function useSignUp() {
    const mutation = useMutation<User, Error, LoginFormInputs>({
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