"use client";

import { useEffect, useState } from "react";

export default function VerificarPage() {
  const [message, setMessage] = useState("Confirmando e-mail...");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    }).then((response) => response.json()).then((data) => {
      setMessage(data.message || "Não foi possível confirmar.");
    }).catch(() => setMessage("Não foi possível confirmar."));
  }, []);

  return <p className="text-center text-lg">{message}</p>;
}
