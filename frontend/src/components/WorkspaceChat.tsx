import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useWorkspaceMessages } from "@/lib/queries/workspaceQueries"

type ChatMessage = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    email: string
    avatar?: string
  }
}

export function WorkspaceChat({
  workspaceId,
  currentUserId,
}: {
  workspaceId: string
  currentUserId: string
}) {
  const { messages } = useWorkspaceMessages(workspaceId)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const [content, setContent] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [localMessages])

  useEffect(() => {
    if (!messages) return
    setLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!workspaceId) return

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    })

    setSocket(newSocket)

    newSocket.on("connect", () => {
      newSocket.emit("workspace:join", { workspaceId })
    })

    newSocket.on("connect_error", (error) => {
      console.log("SOCKET CONNECT ERROR:", error.message)
    })

    newSocket.on("message:new", (message: ChatMessage) => {
      setLocalMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === message.id)
        if (alreadyExists) return prev
        return [...prev, message]
      })
    })

    return () => {
      newSocket.emit("workspace:leave", { workspaceId })
      newSocket.disconnect()
    }
  }, [workspaceId])

  function sendMessage() {
    if (!socket) {
      console.log("NO SOCKET")
      return
    }

    if (!socket.connected) {
      console.log("SOCKET NOT CONNECTED")
      return
    }

    if (!content.trim()) return

    console.log("SENDING MESSAGE:", {
      workspaceId,
      content,
    })

    socket.emit("message:send", {
      workspaceId,
      content,
    })

    setContent("")
  }

  return (
    <div className="flex h-170 flex-col">
      <div className="chat-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
        <div className={`flex justify-start gap-2`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>

          <div
            className={`max-w-[75%] rounded-2xl bg-zinc-100 px-4 py-2 dark:bg-zinc-800`}
          >
            <div className="mb-1 text-xs font-medium">Bartosz Cembala</div>
            Welcome in your Workspace.
          </div>
        </div>
        {localMessages.map((message) => {
          const isMine = message.user.id === currentUserId
          return (
            <div
              ref={messagesEndRef}
              key={message.id}
              className={`flex gap-2 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {!isMine && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? "bg-neutral-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800"
                }`}
              >
                {!isMine && (
                  <div className="mb-1 text-xs font-medium">
                    {message.user.username}
                  </div>
                )}

                {message.content}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-4">
        <div className="flex w-full gap-3">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage()
            }}
            placeholder="Type here..."
          />

          <Button onClick={sendMessage} className="cursor-pointer">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  )
}
