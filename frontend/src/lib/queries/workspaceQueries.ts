import type { Column } from "@/types"
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

      if (!res.ok) {
        throw new Error(responseReady.message || "Failed to create workspace")
      }

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

import { useQuery } from "@tanstack/react-query"

export function useWorkspaces() {
  const query = useQuery({
    queryKey: ["workspaces"],

    queryFn: async () => {
      const res = await fetch(
        "http://localhost:3000/api/workspaces/get-workspaces",
        {
          credentials: "include",
        }
      )

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message || "Failed to get workspaces")
      }

      return responseReady.data.workspaces
    },
  })

  return {
    workspaces: query.data,
    isLoadingWorkspaces: query.isPending,
  }
}

export function useWorkspace(workspaceId: string) {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],

    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/workspaces/${workspaceId}`,
        {
          credentials: "include",
        }
      )

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message)
      }

      return responseReady.data.workspace
    },

    enabled: !!workspaceId,
  })

  return {
    workspace: query.data,
    isLoadingWorkspace: query.isPending,
    workspaceError: query.error,
    refetchWorkspace: query.refetch,
  }
}

export function useUpdateTaskCompleted(workspaceId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      const res = await fetch(
        `http://localhost:3000/api/workspaces/${taskId}/completed`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: true,
          }),
        }
      )

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message)
      }

      return responseReady.data.task
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      })
    },
  })

  return {
    updateTaskCompleted: mutation.mutate,
    updateTaskCompletedAsync: mutation.mutateAsync,

    isUpdatingTaskCompleted: mutation.isPending,
    updateTaskCompletedError: mutation.error,

    resetUpdateTaskCompleted: mutation.reset,
  }
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      })

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message)
      }

      return responseReady.data.task
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      })
    },
  })

  return {
    deleteTask: mutation.mutate,
    deleteTaskAsync: mutation.mutateAsync,
    isDeletingTask: mutation.isPending,
    deleteTaskError: mutation.error,
  }
}

export function useUpdateWorkspaceLayout(workspaceId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (columns: Column[]) => {
      const res = await fetch(
        `http://localhost:3000/api/workspaces/${workspaceId}/layout`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            columns,
          }),
        }
      )

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message)
      }

      return responseReady.data.workspace
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      })
    },
  })

  return {
    updateWorkspaceLayout: mutation.mutate,
    updateWorkspaceLayoutAsync: mutation.mutateAsync,
    isUpdatingWorkspaceLayout: mutation.isPending,
    updateWorkspaceLayoutError: mutation.error,
  }
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      title,
      columnId,
    }: {
      title: string
      columnId: string
    }) => {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          columnId,
        }),
      })

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message)
      }

      return responseReady.data.task
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      })
    },
  })

  return {
    createTask: mutation.mutate,
    createTaskAsync: mutation.mutateAsync,
    isCreatingTask: mutation.isPending,
    createTaskError: mutation.error,
  }
}

export function useWorkspaceMessages(workspaceId: string) {
  const query = useQuery({
    queryKey: ["workspace-messages", workspaceId],

    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/workspaces/${workspaceId}/messages`,
        {
          credentials: "include",
        }
      )

      const responseReady = await res.json()

      if (!res.ok) {
        throw new Error(responseReady.message || "Failed to get messages")
      }

      return responseReady.data.messages
    },

    enabled: !!workspaceId,
  })

  return {
    messages: query.data,
    isLoadingMessages: query.isPending,
  }
}
