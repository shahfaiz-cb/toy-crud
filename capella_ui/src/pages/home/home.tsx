import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "auth";

export function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to <span className="text-primary">ToyCRUD</span>
        </h1>

        <p className="text-lg text-gray-400">
          A simple yet powerful way to manage your tasks efficiently.
          Stay organized. Stay productive.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 pt-4">
          {!token ? (
            <>
              <Button
                size="lg"
                variant="primary"
                onPress={() => navigate("/auth/sign-in")}
              >
                Sign In
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onPress={() => navigate("/auth/sign-up")}
              >
                Create Account
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              variant="primary"
              onPress={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}