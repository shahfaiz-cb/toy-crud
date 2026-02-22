import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "auth";

export function Navbar() {
  const { token, removeJWT } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    removeJWT()
    navigate("/auth/sign-in")
  }

  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-divider bg-background backdrop-blur supports-backdrop-filter:bg-background/80">
      <h1
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        ToyCRUD
      </h1>

      <div className="flex gap-3">
        {!token ? (
          <>
            <Button variant="secondary" onPress={() => navigate("/auth/sign-up")}>
              Sign Up
            </Button>
            <Button variant="primary" onPress={() => navigate("/auth/sign-in")}>
              Sign In
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onPress={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="danger" onPress={logout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}