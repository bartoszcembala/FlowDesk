import { Link } from "react-router-dom"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useQueryClient } from "@tanstack/react-query"
import { useCurrentUser } from "@/lib/queries/userQueries"

export function NavigationBar() {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()

  async function handleLogout() {
    await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include",
    })

    queryClient.setQueryData(["user"], null)
    queryClient.invalidateQueries({ queryKey: ["user"] })
  }
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Docs</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/workspace">Workspace</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/login">Login</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {user && (
          <NavigationMenuItem className="fixed right-30">
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <button className="cursor-pointer" onClick={handleLogout}>
                Logout
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
