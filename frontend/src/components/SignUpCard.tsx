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
import type { SignUpFormInputs } from "@/types"
import { Link } from "react-router-dom"

import { useForm, type SubmitHandler } from "react-hook-form"
import { useSignUp } from "@/lib/queries/userQueries"

export function SignUpCard() {
  const { register, handleSubmit, reset } = useForm<SignUpFormInputs>()
  const { signUp } = useSignUp()

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    signUp(data)

    reset()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign up for an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
        <CardAction>
          <Button variant="link">
            <Link to="/login">Log in</Link>
          </Button>
        </CardAction>
      </CardHeader>{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                {...register("username")}
              />
            </div>
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
                  className="inline-block ml-auto text-sm underline-offset-4 hover:underline"
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
        <CardFooter className="flex-col gap-2 mt-4">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <Button variant="outline" className="w-full">
            Sign Up with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
