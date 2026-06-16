import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateWorkspaceData {
  name: string
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (workspaceData: CreateWorkspaceData) => {
      const res = await fetch("http://localhost:3000/api/workspaces/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(workspaceData),
      })

      const responseReady = await res.json()

      return responseReady.data.workspace
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      })
    },
  })

  return {
    createWorkspace: mutation.mutateAsync,
    isCreatingWorkspace: mutation.isPending,
  }
}
