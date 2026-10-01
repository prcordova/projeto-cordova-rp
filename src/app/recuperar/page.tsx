import { AuthForm } from "@/components/AuthForm";

export default function RecuperarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-extrabold">Recuperar senha</h1>
      <AuthForm mode="forgot" />
    </div>
  );
}
