import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type Task = {
  id: string
  title: string
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}

function SortableTask({ task }: { task: Task }) {
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
      className="cursor-grab rounded-lg border px-5 py-2"
    >
      {task.title}
    </div>
  )
}

function SortableColumn({
  column,
  addTask,
}: {
  column: Column
  addTask: (columnId: string) => void
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
        className="mb-4 cursor-grab text-2xl font-bold"
        {...attributes}
        {...listeners}
      >
        {column.title}
      </div>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {column.tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
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
}

export function WorkspaceBoard({
  columns,
  setColumns,
  addTask,
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

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      setColumns((prev) => arrayMove(prev, activeColumnIndex, overColumnIndex))
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

    if (activeColumn.id === overColumn.id) {
      setColumns((prev) =>
        prev.map((column) =>
          column.id === activeColumn.id
            ? {
                ...column,
                tasks: arrayMove(column.tasks, activeTaskIndex, overTaskIndex),
              }
            : column
        )
      )

      return
    }

    const activeTask = activeColumn.tasks[activeTaskIndex]

    setColumns((prev) =>
      prev.map((column) => {
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
    )
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <SortableContext
        items={columns.map((column) => column.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6 px-4 py-6">
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              addTask={addTask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}