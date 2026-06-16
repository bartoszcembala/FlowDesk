import { Link, useNavigate } from "react-router-dom"
import { HiOutlineMenu } from "react-icons/hi"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useQueryClient } from "@tanstack/react-query"
import { useCurrentUser } from "@/lib/queries/userQueries"
import { toast } from "sonner"

export function NavigationBar() {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()

  async function handleLogout() {
    await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include",
    })

    navigate("/landing")
    toast.success("Logged out successfully", { position: "bottom-center" })
    queryClient.setQueryData(["user"], null)
    queryClient.invalidateQueries({ queryKey: ["user"] })
  }
  return (
    <NavigationMenu className="min-w-full border-b">
      <NavigationMenuList className="min-w-[99vw] px-3 py-2">
        <div className="flex h-10 min-w-full items-center justify-between">
          <Link to="/landing" className="flex">
            <span className="mr-2 h-6 w-6 items-center justify-center rounded-sm bg-indigo-500">
              <HiOutlineMenu className="m-auto h-full w-4" />
            </span>
            <h1 className="text-bold flex text-xl tracking-wide">FlowDesk</h1>
          </Link>
          {!user && (
            <div className="flex justify-items-end">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    (navigationMenuTriggerStyle(),
                    "hover:bg-indigo-600 focus:bg-indigo-500")
                  }
                >
                  <Link
                    className="ml-2 transform rounded-md bg-indigo-500 text-neutral-200"
                    to="/login"
                  >
                    Login
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </div>
          )}{" "}
          {user && (
            <div className="flex gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link className="text-neutral-200" to="/">
                    Docs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link className="text-neutral-200" to="/workspace">
                    Workspace
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="">
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <button
                    className="cursor-pointer text-neutral-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </div>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
