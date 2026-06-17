import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Layout from "./pages/Layout"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Workspace from "./pages/Workspace"
import Landing from "./pages/Landing"
import { Toaster } from "@/components/ui/sonner"

export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/workspace/:workspaceId" element={<Workspace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster />
   
    </QueryClientProvider>
  )
}

export default App
