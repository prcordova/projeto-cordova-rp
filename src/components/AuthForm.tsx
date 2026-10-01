"use client";

import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const token = new URLSearchParams(window.location.search).get("token");
    const path = mode === "login" ? "/api/auth/login"
      : mode === "register" ? "/api/auth/register"
      : mode === "forgot" ? "/api/auth/forgot"
      : "/api/auth/reset";
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        token
      })
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message || (data.ok ? "Pronto." : "Não foi possível concluir."));
    if (data.ok && (mode === "login" || mode === "reset")) window.location.href = "/conta";
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-2xl border border-yellow-400/35 bg-black p-6">
      {mode === "register" ? <input name="name" required placeholder="Nome" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
      {mode !== "reset" ? <input name="email" type="email" required placeholder="E-mail" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
      {mode !== "forgot" ? <input name="password" type="password" required minLength={8} placeholder="Senha" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
      <button disabled={loading} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">{loading ? "Enviando..." : "Continuar"}</button>
      {mode !== "register" ? <a href="/api/auth/discord" className="block text-center text-sm text-yellow-400">Entrar com Discord</a> : null}
      {message ? <p className="text-sm text-yellow-100">{message}</p> : null}
    </form>
  );
}
