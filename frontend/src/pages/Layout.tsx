import { NavigationBar } from "@/components/NavigationBar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="py-16">
      <NavigationBar />

      <Outlet />
    </div>
  )
}
