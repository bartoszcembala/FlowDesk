import { useEffect, useState } from "react"
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

import { Trash2 } from "lucide-react"
import { HiOutlineBars3, HiArrowTopRightOnSquare } from "react-icons/hi2"
import { MdDragIndicator } from "react-icons/md"

import { Checkbox } from "./ui/checkbox"

type SortableTaskProps = {
  task: Task
  toggleTaskCompleted: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

function SortableTask({
  task,
  toggleTaskCompleted,
  deleteTask,
}: SortableTaskProps) {
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
      <MdDragIndicator className="h-5 w-5 shrink-0" />

      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTaskCompleted(task.id)}
        onPointerDown={(event) => event.stopPropagation()}
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
        onPointerDown={(event) => event.stopPropagation()}
        className="cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

type SortableColumnProps = {
  column: Column
  addTask: (columnId: string) => void
  toggleTaskCompleted: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

function SortableColumn({
  column,
  addTask,
  toggleTaskCompleted,
  deleteTask,
}: SortableColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="w-90 shrink-0 rounded-xl border p-4"
    >
      <div
        className="mb-4 flex cursor-grab items-center gap-2 text-2xl font-bold active:cursor-grabbing"
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
        type="button"
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
  addColumn: () => void
  addTask: (columnId: string) => void
  toggleTaskCompleted: (taskId: string, completed: boolean) => void
  deleteTask: (taskId: string) => void
  updateWorkspaceLayout: (columns: Column[]) => void
}

export function WorkspaceBoard({
  columns,
  addColumn,
  addTask,
  toggleTaskCompleted,
  deleteTask,
  updateWorkspaceLayout,
}: WorkspaceBoardProps) {
  const [localColumns, setLocalColumns] = useState<Column[]>([])

  useEffect(() => {
    setLocalColumns(columns)
  }, [columns])

  function findColumn(taskOrColumnId: string) {
    const column = localColumns.find((column) => column.id === taskOrColumnId)

    if (column) return column

    return localColumns.find((column) =>
      column.tasks.some((task) => task.id === taskOrColumnId)
    )
  }
  function handleToggleTaskCompleted(taskId: string) {
    let nextCompleted = false

    setLocalColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id !== taskId) return task

          nextCompleted = !task.completed

          return {
            ...task,
            completed: nextCompleted,
          }
        }),
      }))
    )

    toggleTaskCompleted(taskId, nextCompleted)
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const activeColumnIndex = localColumns.findIndex(
      (column) => column.id === activeId
    )

    const overColumnIndex = localColumns.findIndex(
      (column) => column.id === overId
    )

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      const newColumns = arrayMove(
        localColumns,
        activeColumnIndex,
        overColumnIndex
      )

      setLocalColumns(newColumns)
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

    if (activeColumn.id === overColumn.id) {
      if (overTaskIndex === -1) return

      const newColumns = localColumns.map((column) =>
        column.id === activeColumn.id
          ? {
              ...column,
              tasks: arrayMove(column.tasks, activeTaskIndex, overTaskIndex),
            }
          : column
      )

      setLocalColumns(newColumns)
      updateWorkspaceLayout(newColumns)
      return
    }

    const activeTask = activeColumn.tasks[activeTaskIndex]

    const newColumns = localColumns.map((column) => {
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

    setLocalColumns(newColumns)
    updateWorkspaceLayout(newColumns)
  }

  return (
    <div className="flex gap-6">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext
          items={localColumns.map((column) => column.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 py-6">
            {localColumns.map((column) => (
              <SortableColumn
                key={column.id}
                column={column}
                addTask={addTask}
                toggleTaskCompleted={handleToggleTaskCompleted}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addColumn}
        className="mt-6 flex h-12 cursor-pointer items-center gap-2 rounded-lg border px-6 tracking-wide"
      >
        Add Column
        <HiArrowTopRightOnSquare className="h-5 w-5" />
      </button>
    </div>
  )
}
