import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"

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
  useCreateWorkspace,
  useWorkspace,
  useWorkspaces,
} from "@/lib/queries/workspaceQueries"
import { WorkspaceBoard, type Column } from "@/components/WorkspaceBoard"
import { Link, useParams } from "react-router-dom"

export default function Workspace() {
  const { workspaces } = useWorkspaces()
  const { createWorkspace } = useCreateWorkspace()
  const { workspaceId } = useParams()
  const { workspace } = useWorkspace(workspaceId!)
  const [columns, setColumns] = useState<Column[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState("")

  useEffect(() => {
    if (!workspaces?.[0]) return

    if (!workspaceId) {
      setColumns(
        workspaces[0].columns.map((column) => ({
          id: column.id,
          title: column.title,
          tasks: column.tasks.map((task) => ({
            id: task.id,
            title: task.title,
          })),
        }))
      )
    }

    if (workspaceId) {
      setColumns(
        workspace.columns.map((column) => ({
          id: column.id,
          title: column.title,
          tasks: column.tasks.map((task) => ({
            id: task.id,
            title: task.title,
          })),
        }))
      )
    }
  }, [workspaces])

  function openAddTaskDialog(columnId: string) {
    setSelectedColumnId(columnId)
    setIsTaskDialogOpen(true)
  }

  function createTask() {
    if (!selectedColumnId || !taskTitle.trim()) return

    setColumns((prev) =>
      prev.map((column) =>
        column.id === selectedColumnId
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  id: crypto.randomUUID(),
                  title: taskTitle,
                },
              ],
            }
          : column
      )
    )

    setTaskTitle("")
    setSelectedColumnId(null)
    setIsTaskDialogOpen(false)
  }

  function addColumn() {
    const title = prompt("Column name")
    if (!title) return

    setColumns((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        tasks: [],
      },
    ])
  }

  async function createWorkspaceFn() {
    try {
      const workspace = await createWorkspace({
        name: "name4",
      })

      setColumns(
        workspace.columns.map((column) => ({
          id: column.id,
          title: column.title,
          tasks: column.tasks.map((task) => ({
            id: task.id,
            title: task.title,
          })),
        }))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const currentWorkspaceName = workspaces?.[0]?.name ?? "No workspace"

  return (
    <div className="mx-10">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="mt-6 flex w-87.5 flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-xl font-semibold tracking-wide">
            {workspaceId ? workspace?.name : currentWorkspaceName}
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

        <CollapsibleContent className="flex flex-col gap-2">
          {workspaces?.map((workspace) => (
            <Link
              key={workspace.id}
              className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
              to={`/workspace/${workspace.id}`}
            >
              {workspace.name}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <WorkspaceBoard
        columns={columns}
        setColumns={setColumns}
        addTask={openAddTaskDialog}
      />

      <button
        onClick={addColumn}
        className="cursor-pointer rounded-lg border px-4 py-2"
      >
        Add Column
      </button>

      <button
        onClick={createWorkspaceFn}
        className="cursor-pointer rounded-lg border px-4 py-2"
      >
        Create Workspace
      </button>

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

          <Button onClick={createTask}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
