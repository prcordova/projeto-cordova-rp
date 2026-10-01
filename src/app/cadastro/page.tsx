import { AuthForm } from "@/components/AuthForm";

export default function CadastroPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-extrabold">Criar conta</h1>
      <AuthForm mode="register" />
    </div>
  );
}
