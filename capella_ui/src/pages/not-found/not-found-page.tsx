import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-6 text-center">
      
      <div className="max-w-md space-y-6">
        <h1 className="text-6xl font-bold text-slate-800">
          404
        </h1>

        <p className="text-lg text-slate-600">
          Oops. The page you're looking for doesn't exist.
        </p>

        <Button
          size="lg"
          variant="primary"
          onPress={() => navigate("/")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}