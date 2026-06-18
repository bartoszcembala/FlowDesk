import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { LuCircleMinus } from "react-icons/lu"
import { Send } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Column, Task, Workspace } from "@/types"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Workspace() {
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
  const navigate = useNavigate()
  const [isChatOpen, setIsChatOpen] = useState(true)

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
              <div className="flex h-170 flex-col">
                <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Hey team, how is the e-commerce project going?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                      Backend authentication is finished. Users can now register
                      and log in.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Nice! I'm currently working on the product listing page.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Great. Have we connected the frontend to the API yet?
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Not yet, but React Query integration is next on my list.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                      Product and cart endpoints are already available for
                      testing.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Perfect. What about Stripe payments?
                    </div>
                  </div>{" "}
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                      Basic Stripe integration is done. I still need to handle
                      webhooks.
                    </div>
                  </div>{" "}
                  {/* <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>

                    <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                      Once the checkout UI is finished, I'll connect it to
                      Stripe.
                    </div>
                  </div>{" "} */}
                </CardContent>

                <CardFooter className="border-t p-4">
                  <div className="flex w-full gap-3">
                    <Input placeholder="Type here..." />

                    <Button className="cursor-pointer">
                      <Send />
                    </Button>
                  </div>
                </CardFooter>
              </div>
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
    </div>
  )
}
