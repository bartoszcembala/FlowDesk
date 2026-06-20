import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { LoginCard } from "./LoginCard"

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock("@/lib/queries/userQueries", () => ({
  useLogin: () => ({
    login: mockLogin,
  }),
}))

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe("LoginCard", () => {
  it("renders login form", () => {
    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    )

    expect(screen.getByText("Login to your account")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
  })

  it("calls login after submitting form", async () => {
    mockLogin.mockResolvedValueOnce({})

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText("Email"), "test@test.com")
    await userEvent.type(screen.getByLabelText("Password"), "password123")

    await userEvent.click(screen.getByRole("button", { name: "Login" }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      })
    })
  })

  it("navigates to workspace after successful login", async () => {
    mockLogin.mockResolvedValueOnce({})

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText("Email"), "test@test.com")
    await userEvent.type(screen.getByLabelText("Password"), "password123")

    await userEvent.click(screen.getByRole("button", { name: "Login" }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/workspace")
    })
  })
})
