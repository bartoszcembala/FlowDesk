import { LoginCard } from "@/components/LoginCard"
import { useCurrentUser } from "@/lib/queries/userQueries"

export default function Login() {
  const { data: user } = useCurrentUser()

  return (
    <div>
      <LoginCard />
      <div>Hello: {user?.username}</div>
    </div>
  )
}
