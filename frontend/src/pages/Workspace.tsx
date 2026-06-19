import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { LuCircleMinus } from "react-icons/lu"
import { useAddWorkspaceMember } from "@/lib/queries/workspaceQueries"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

import {
  useCreateTask,
  useCreateWorkspace,
  useDeleteTask,
  useUpdateTaskCompleted,
  useUpdateWorkspaceLayout,
  useWorkspace,
  useWorkspaces,
} from "@/lib/queries/workspaceQueries"
import { WorkspaceBoard } from "@/components/WorkspaceBoard"
import { Link, useParams } from "react-router-dom"
import type { Column, Task, Workspace } from "@/types"

import { WorkspaceChat } from "@/components/WorkspaceChat"
import { useCurrentUser } from "@/lib/queries/userQueries"
import { toast } from "sonner"

export default function Workspace() {
  const { data: user } = useCurrentUser()
  const { workspaceId } = useParams()
  const { workspaces } = useWorkspaces()
  const { createWorkspace } = useCreateWorkspace()
  const { workspace } = useWorkspace(workspaceId!)
  const [columns, setColumns] = useState<Column[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [workspaceTitle, setWorkspaceTitle] = useState("")
  const { updateTaskCompleted } = useUpdateTaskCompleted(workspaceId!)
  const { updateWorkspaceLayout } = useUpdateWorkspaceLayout(workspaceId!)
  const { deleteTask } = useDeleteTask(workspaceId!)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const { addWorkspaceMember } = useAddWorkspaceMember(workspaceId!)

  function addMember() {
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
  useEffect(() => {
    if (!workspace) return

    setColumns(
      workspace.columns.map((column: Column) => ({
        id: column.id,
        title: column.title,
        //position: column.position,
        tasks: column.tasks.map((task: Task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed ?? false,
        })),
      }))
    )
  }, [workspace, workspaceId])

  function openAddTaskDialog(columnId: string) {
    setSelectedColumnId(columnId)
    setIsTaskDialogOpen(true)
  }

  function openAddWorkspaceDialog() {
    setIsWorkspaceDialogOpen(true)
  }

  function removeTask(taskId: string) {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }))
    )

    deleteTask(taskId)
  }

  function createWorkspaceFn() {
    createWorkspace({ name: workspaceTitle })
    setWorkspaceTitle("")
    setIsWorkspaceDialogOpen(false)
  }

  function toggleTaskCompleted(taskId: string) {
    updateTaskCompleted({
      taskId,
    })
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        ),
      }))
    )
  }

  const { createTask: createTaskMutation } = useCreateTask(workspaceId!)
  function createTask() {
    if (!selectedColumnId || !taskTitle.trim()) return

    createTaskMutation({
      title: taskTitle,
      columnId: selectedColumnId,
    })

    setTaskTitle("")
    setSelectedColumnId(null)
    setIsTaskDialogOpen(false)
  }
  
  return (
    <div className="relative mx-12">
      {/* Workspace dropdown */}
      <div className="absolute top-6 left-0 z-10 flex gap-3">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
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
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mb-3 flex flex-col gap-2">
            {workspaces?.map((workspace: Workspace) => (
              <Link
                onClick={() => setIsOpen(false)}
                key={workspace.id}
                className="mx-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
                to={`/workspace/${workspace.id}`}
              >
                {workspace.name}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <button
          onClick={openAddWorkspaceDialog}
          className="h-10 cursor-pointer rounded-lg border px-4 py-2"
        >
          Create Workspace
        </button>
      </div>
      <button
        onClick={() => setIsAddMemberDialogOpen(true)}
        className="h-10 cursor-pointer rounded-lg border px-4 py-2"
      >
        Add Member
      </button>
      {/* Chat */}
      <div className="fixed top-20 right-5 z-20">
        <Collapsible open={isChatOpen} onOpenChange={setIsChatOpen}>
          <Card className="w-100 overflow-hidden pt-0">
            <CardHeader className="flex h-10 items-center justify-between border-b bg-neutral-800 py-4">
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

      {/* Board */}
      <div className="flex pt-20">
        <WorkspaceBoard
          columns={columns}
          setColumns={setColumns}
          addTask={openAddTaskDialog}
          toggleTaskCompleted={toggleTaskCompleted}
          deleteTask={removeTask}
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

          <Button className="cursor-pointer" onClick={createTask}>
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

          <Button onClick={createWorkspaceFn} className="cursor-pointer">
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

          <Button onClick={addMember} className="cursor-pointer">
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
