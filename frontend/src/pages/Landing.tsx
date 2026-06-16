import { useNavigate } from "react-router-dom"

const tasks = {
  todo: [
    {
      title: "Redesign homepage layout",
      tag: "Design",
      tagColor: "purple",
      avatars: ["A"],
    },
    {
      title: "Write unit tests for API",
      tag: "Backend",
      tagColor: "cyan",
      avatars: ["M"],
    },
    {
      title: "Stripe payment integration",
      tag: "Payments",
      tagColor: "yellow",
      avatars: ["K", "A"],
    },
  ],
  inProgress: [
    {
      title: "Drag & drop between columns",
      tag: "Frontend",
      tagColor: "purple",
      avatars: ["M"],
    },
    {
      title: "WebSocket live notifications",
      tag: "Real-time",
      tagColor: "cyan",
      avatars: ["A", "K"],
    },
  ],
  done: [
    {
      title: "JWT authentication",
      tag: "Auth",
      tagColor: "green",
      avatars: ["K"],
    },
    {
      title: "Database schema design",
      tag: "Backend",
      tagColor: "cyan",
      avatars: ["M"],
    },
  ],
}

const avatarColors: Record<string, string> = {
  A: "#6366f1",
  M: "#14b8a6",
  K: "#ec4899",
}

const tagStyles: Record<string, React.CSSProperties> = {
  purple: { background: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
  cyan: { background: "rgba(34,211,238,0.12)", color: "#67e8f9" },
  green: { background: "rgba(74,222,128,0.12)", color: "#86efac" },
  yellow: { background: "rgba(251,191,36,0.12)", color: "#fcd34d" },
}

const features = [
  {
    icon: "🧲",
    color: "rgba(99,102,241,0.15)",
    textColor: "#a5b4fc",
    title: "Drag & drop",
    desc: "Move tasks across columns with a single mouse gesture.",
  },
  {
    icon: "⚡",
    color: "rgba(34,211,238,0.1)",
    textColor: "#67e8f9",
    title: "Real-time sync",
    desc: "Changes appear instantly for everyone via WebSockets.",
  },
  {
    icon: "👥",
    color: "rgba(74,222,128,0.1)",
    textColor: "#86efac",
    title: "Team collaboration",
    desc: "Invite your whole team, assign tasks, and track progress together.",
  },
  {
    icon: "💬",
    color: "rgba(251,191,36,0.1)",
    textColor: "#fcd34d",
    title: "Comments",
    desc: "Discuss every task inline without leaving the board.",
  },
  {
    icon: "📋",
    color: "rgba(236,72,153,0.1)",
    textColor: "#f9a8d4",
    title: "Multiple boards",
    desc: "Separate boards for every project, sprint, or team.",
  },
  {
    icon: "🔔",
    color: "rgba(59,130,246,0.1)",
    textColor: "#93c5fd",
    title: "Notifications",
    desc: "Alerts when someone assigns you a task or drops a comment.",
  },
]

interface TaskCardProps {
  title: string
  tag: string
  tagColor: string
  avatars: string[]
  done?: boolean
}

function TaskCard({ title, tag, tagColor, avatars, done }: TaskCardProps) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 6,
        padding: "8px 10px",
        marginBottom: 6,
        fontSize: 12,
        color: done ? "#666" : "#ccc",
        textDecoration: done ? "line-through" : "none",
        opacity: done ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {title}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}
      >
        <span
          style={{
            ...tagStyles[tagColor],
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 500,
          }}
        >
          {tag}
        </span>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          {avatars.map((av, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: avatarColors[av] ?? "#6366f1",
                border: "1px solid #1a1a1a",
                marginLeft: i === 0 ? 0 : -4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 500,
                color: "white",
              }}
            >
              {av}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#f0f0f0",
        minHeight: "100vh",
      }}
    >


      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "5rem 2rem 3rem",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(99,102,241,0.15)",
            border: "0.5px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 20,
            marginBottom: "1.5rem",
          }}
        >
          ⚡ Live collaboration powered by WebSockets
        </div>

        <h1
          style={{
            fontSize: 42,
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          Ship projects
          <br />
          <span style={{ color: "#6366f1" }}>without the mess</span>
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "#888",
            lineHeight: 1.7,
            marginBottom: "2rem",

          }}
        >
          Boards, tasks, comments, and drag & drop — all synced in real time
          across your entire team. Like Trello and Jira, but yours.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "#6366f1",
              color: "white",
              border: "none",
              padding: "10px 22px",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🚀 Get started free
          </button>
          <button
            onClick={() => navigate("/demo")}
            style={{
              background: "transparent",
              color: "#888",
              border: "0.5px solid rgba(255,255,255,0.18)",
              padding: "10px 22px",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ▶ Watch demo
          </button>
        </div>
      </section>

      {/* Board preview */}
      <div
        style={{
          width: "100%",
          padding: "2rem 1.5rem 0",
          maxWidth: 680,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, #0a0a0a)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: 11,
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              flex: 1,
              height: 0.5,
              background: "rgba(255,255,255,0.08)",
              display: "block",
            }}
          />
          live board preview
          <span
            style={{
              flex: 1,
              height: 0.5,
              background: "rgba(255,255,255,0.08)",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            overflow: "hidden",
            maxHeight: 280,
          }}
        >
          {[
            { label: "To do", items: tasks.todo, done: false },
            { label: "In progress", items: tasks.inProgress, done: false },
            { label: "Done", items: tasks.done, done: true },
          ].map((col) => (
            <div
              key={col.label}
              style={{
                background: "#111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#888",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {col.label}
                <span
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#888",
                    fontSize: 10,
                    padding: "1px 6px",
                    borderRadius: 10,
                  }}
                >
                  {col.items.length}
                </span>
              </div>
              {col.items.map((task, i) => (
                <TaskCard key={i} {...task} done={col.done} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section
        style={{ maxWidth: 680, margin: "4rem auto 0", padding: "0 1.5rem" }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          everything you need
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: "4rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: f.color,
                  color: f.textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  fontSize: 16,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "#f0f0f0",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          textAlign: "center",
          padding: "3rem 2rem 4rem",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Ready to get organized?
        </h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: "1.5rem" }}>
          Join teams that stopped managing projects in spreadsheets.
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            padding: "10px 22px",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🚀 Get started free
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: "1rem",
            fontSize: 12,
            color: "#888",
          }}
        >
          <div style={{ display: "flex" }}>
            {["A", "M", "K"].map((av, i) => (
              <div
                key={av}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: avatarColors[av],
                  border: "1.5px solid #0a0a0a",
                  marginLeft: i === 0 ? 0 : -6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {av}
              </div>
            ))}
          </div>
          <span style={{ color: "#fbbf24" }}>★★★★★</span>
          <span>Trusted by 200+ teams</span>
        </div>
      </div>
    </div>
  )
}
