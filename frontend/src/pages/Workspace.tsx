import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronsUpDown } from "lucide-react"
import { LuCircleMinus } from "react-icons/lu"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { WorkspaceBoard } from "@/components/WorkspaceBoard"
import { WorkspaceChat } from "@/components/WorkspaceChat"

import {
  useAddWorkspaceMember,
  useCreateColumn,
  useCreateTask,
  useCreateWorkspace,
  useDeleteTask,
  useUpdateTaskCompleted,
  useUpdateWorkspaceLayout,
  useWorkspace,
  useWorkspaces,
} from "@/lib/queries/workspaceQueries"
import { useCurrentUser } from "@/lib/queries/userQueries"

import type { Workspace } from "@/types"
import Spinner from "@/components/Spinner"

export default function Workspace() {
  const { workspaceId } = useParams()
  const { data: user } = useCurrentUser()

  const { workspaces, isLoadingWorkspaces } = useWorkspaces()

  const selectedWorkspaceId = workspaceId ?? workspaces?.[0]?.id

  const { workspace, isLoadingWorkspace } = useWorkspace(
    selectedWorkspaceId ?? ""
  )

  const { createWorkspace } = useCreateWorkspace()
  const { createTask } = useCreateTask(workspaceId!)
  const { createColumn } = useCreateColumn(workspaceId!)
  const { deleteTask } = useDeleteTask(workspaceId!)
  const { updateTaskCompleted } = useUpdateTaskCompleted(workspaceId!)
  const { updateWorkspaceLayout } = useUpdateWorkspaceLayout(workspaceId!)
  const { addWorkspaceMember } = useAddWorkspaceMember(workspaceId!)

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false)
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)

  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [workspaceTitle, setWorkspaceTitle] = useState("")
  const [memberEmail, setMemberEmail] = useState("")

  function openAddTaskDialog(columnId: string) {
    setSelectedColumnId(columnId)
    setIsTaskDialogOpen(true)
  }

  function handleCreateWorkspace() {
    if (!workspaceTitle.trim()) return

    createWorkspace({ name: workspaceTitle })
    setWorkspaceTitle("")
    setIsWorkspaceDialogOpen(false)
  }

  function handleCreateTask() {
    if (!selectedColumnId || !taskTitle.trim()) return

    createTask({
      title: taskTitle,
      columnId: selectedColumnId,
    })

    setTaskTitle("")
    setSelectedColumnId(null)
    setIsTaskDialogOpen(false)
  }

  function handleCreateColumn() {
    const title = prompt("Column name")
    if (!title?.trim()) return

    createColumn({ title })
  }

  function handleAddMember() {
    if (!memberEmail.trim()) return

    addWorkspaceMember(
      { email: memberEmail },
      {
        onSuccess: () => {
          setMemberEmail("")
          setIsAddMemberDialogOpen(false)
          toast.success("Member added")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }
  console.log(workspaces, isLoadingWorkspaces)
  if (isLoadingWorkspaces) {
    return <Spinner />
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="-translate-y-50 text-center">
          <h1 className="mb-4 text-2xl font-bold">No workspaces</h1>

          <Button onClick={() => setIsWorkspaceDialogOpen(true)}>
            Create Workspace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-12">
      <div className="absolute top-6 left-0 z-10 flex gap-3">
        <Collapsible
          open={isWorkspaceDropdownOpen}
          onOpenChange={setIsWorkspaceDropdownOpen}
          className="flex w-87.5 flex-col gap-2 rounded-sm bg-neutral-900"
        >
          <div className="flex items-center justify-between gap-4 rounded-sm bg-neutral-900 px-4 py-1">
            <h4 className="text-xl font-semibold tracking-wide">
              <span className="text-gray-300">Workspace: </span>
              <span className="font-bold tracking-wide">{workspace?.name}</span>
            </h4>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 cursor-pointer"
              >
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mb-3 flex flex-col gap-2">
            {workspaces?.map((workspace: Workspace) => (
              <Link
                key={workspace.id}
                to={`/workspace/${workspace.id}`}
                onClick={() => setIsWorkspaceDropdownOpen(false)}
                className="mx-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
              >
                {workspace.name}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <button
          onClick={() => setIsWorkspaceDialogOpen(true)}
          className="h-10 cursor-pointer rounded-lg border px-4 py-2"
        >
          Create Workspace
        </button>
      </div>

      <div className="fixed top-20 right-120 z-20">
        <Collapsible open={isMembersOpen} onOpenChange={setIsMembersOpen}>
          <Card className="w-80 overflow-hidden pt-0">
            <CardHeader className="flex h-10 items-center justify-between border-b py-4">
              <CardTitle>Members</CardTitle>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <LuCircleMinus className="h-5 w-5" />
                </Button>
              </CollapsibleTrigger>
            </CardHeader>

            <CollapsibleContent className="px-3 pb-3">
              {workspace?.members?.map((member) => (
                <div
                  key={member.id}
                  className="my-2 flex items-center justify-between gap-2 rounded-sm border px-4 py-2"
                >
                  <div>
                    <h3 className="text-sm font-medium">
                      {member.user.username}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>

                  <span className="rounded-full border px-2 py-1 text-xs">
                    {member.role}
                  </span>
                </div>
              ))}

              <button
                onClick={() => setIsAddMemberDialogOpen(true)}
                className="mt-2 h-10 w-full cursor-pointer rounded-lg border px-4 py-2"
              >
                Add Member
              </button>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <div className="fixed top-20 right-5 z-20">
        <Collapsible open={isChatOpen} onOpenChange={setIsChatOpen}>
          <Card className="w-100 overflow-hidden pt-0">
            <CardHeader className="flex h-10 items-center justify-between border-b py-4">
              <CardTitle>Chat</CardTitle>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <LuCircleMinus className="h-5 w-5" />
                </Button>
              </CollapsibleTrigger>
            </CardHeader>

            <CollapsibleContent>
              {workspaceId && (
                <WorkspaceChat
                  workspaceId={workspaceId}
                  currentUserId={user?.id ?? ""}
                />
              )}
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <div className="flex pt-20">
        <WorkspaceBoard
          columns={workspace?.columns ?? []}
          addColumn={handleCreateColumn}
          addTask={openAddTaskDialog}
          toggleTaskCompleted={(taskId, completed) =>
            updateTaskCompleted({ taskId, completed })
          }
          deleteTask={deleteTask}
          updateWorkspaceLayout={updateWorkspaceLayout}
        />
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>

          <Input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title..."
          />

          <Button onClick={handleCreateTask} className="cursor-pointer">
            Create
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isWorkspaceDialogOpen}
        onOpenChange={setIsWorkspaceDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>

          <Input
            value={workspaceTitle}
            onChange={(e) => setWorkspaceTitle(e.target.value)}
            placeholder="Workspace title..."
          />

          <Button onClick={handleCreateWorkspace} className="cursor-pointer">
            Create
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          <Input
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="User email..."
          />

          <Button onClick={handleAddMember} className="cursor-pointer">
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
