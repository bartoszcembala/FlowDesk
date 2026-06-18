import type { Column, Task } from "@/types"
import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Checkbox } from "./ui/checkbox"
import { HiOutlineBars3 } from "react-icons/hi2"
import { MdDragIndicator } from "react-icons/md"
import { HiArrowTopRightOnSquare } from "react-icons/hi2"
import { Trash2 } from "lucide-react"

function SortableTask({
  task,
  toggleTaskCompleted,
  deleteTask,
}: {
  task: Task
  toggleTaskCompleted: (taskId: string) => void
  deleteTask: (taskId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-3 rounded-lg border px-2 py-2 active:cursor-grabbing"
    >
      <MdDragIndicator className="h-5 w-5" />

      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTaskCompleted(task.id)}
        onPointerDown={(e) => e.stopPropagation()}
        className="h-5 w-5 cursor-pointer"
      />

      <div
        className={`flex-1 ${
          task.completed ? "text-muted-foreground line-through" : ""
        }`}
      >
        {task.title}
      </div>
      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        onPointerDown={(e) => e.stopPropagation()}
        className="cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

function SortableColumn({
  column,
  addTask,
  toggleTaskCompleted,
  deleteTask,
}: {
  column: Column
  addTask: (columnId: string) => void
  toggleTaskCompleted: (taskId: string) => void
  deleteTask: (taskId: string) => void
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="w-80 rounded-xl border p-4"
    >
      <div
        className="mb-4 flex cursor-grab items-center gap-2 text-2xl font-bold"
        {...attributes}
        {...listeners}
      >
        <HiOutlineBars3 />
        {column.title}
      </div>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {column.tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => addTask(column.id)}
        className="mt-4 cursor-pointer rounded border px-3 py-1"
      >
        Add Task
      </button>
    </div>
  )
}

type WorkspaceBoardProps = {
  columns: Column[]
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
  addTask: (columnId: string) => void
  toggleTaskCompleted: (taskId: string) => void
  deleteTask: (taskId: string) => void
  updateWorkspaceLayout: (columns: Column[]) => void
}

export function WorkspaceBoard({
  columns,
  setColumns,
  addTask,
  toggleTaskCompleted,
  deleteTask,
  updateWorkspaceLayout,
}: WorkspaceBoardProps) {
  function findColumn(taskOrColumnId: string) {
    const column = columns.find((column) => column.id === taskOrColumnId)

    if (column) return column

    return columns.find((column) =>
      column.tasks.some((task) => task.id === taskOrColumnId)
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const activeColumnIndex = columns.findIndex(
      (column) => column.id === activeId
    )

    const overColumnIndex = columns.findIndex((column) => column.id === overId)

    // Przesuwanie kolumn
    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex)

      setColumns(newColumns)
      updateWorkspaceLayout(newColumns)

      return
    }

    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)

    if (!activeColumn || !overColumn) return

    const activeTaskIndex = activeColumn.tasks.findIndex(
      (task) => task.id === activeId
    )

    const overTaskIndex = overColumn.tasks.findIndex(
      (task) => task.id === overId
    )

    if (activeTaskIndex === -1) return

    // Przesuwanie taska w tej samej kolumnie
    if (activeColumn.id === overColumn.id) {
      const newColumns = columns.map((column) =>
        column.id === activeColumn.id
          ? {
              ...column,
              tasks: arrayMove(column.tasks, activeTaskIndex, overTaskIndex),
            }
          : column
      )

      setColumns(newColumns)
      updateWorkspaceLayout(newColumns)

      return
    }

    // Przesuwanie taska między kolumnami
    const activeTask = activeColumn.tasks[activeTaskIndex]

    const newColumns = columns.map((column) => {
      if (column.id === activeColumn.id) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== activeId),
        }
      }

      if (column.id === overColumn.id) {
        const newTasks = [...column.tasks]

        if (overTaskIndex === -1) {
          newTasks.push(activeTask)
        } else {
          newTasks.splice(overTaskIndex, 0, activeTask)
        }

        return {
          ...column,
          tasks: newTasks,
        }
      }

      return column
    })

    setColumns(newColumns)
    updateWorkspaceLayout(newColumns)
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
  return (
    <div className="flex gap-6">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext
          items={columns.map((column) => column.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 py-6">
            {columns.map((column) => (
              <SortableColumn
                key={column.id}
                column={column}
                addTask={addTask}
                toggleTaskCompleted={toggleTaskCompleted}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        onClick={addColumn}
        className="mt-6 flex h-12 cursor-pointer items-center gap-2 rounded-lg border px-6 tracking-wide"
      >
        Add Column
        <HiArrowTopRightOnSquare className="h-5 w-5" />
      </button>
    </div>
  )
}
