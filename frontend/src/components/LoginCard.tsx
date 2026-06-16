import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/lib/queries/userQueries"
import type { LoginFormInputs } from "@/types"

import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function LoginCard() {
  const navigate = useNavigate()
  const { login } = useLogin()
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>()

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data).then(() => {
      navigate("/workspace")
      toast.success("Logged in successfully", { position: "bottom-center" })
    })

    reset()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
