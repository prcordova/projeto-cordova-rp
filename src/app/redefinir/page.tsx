import { AuthForm } from "@/components/AuthForm";

export default function RedefinirPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-extrabold">Nova senha</h1>
      <AuthForm mode="reset" />
    </div>
  );
}
