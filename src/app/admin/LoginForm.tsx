"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border px-3 py-2"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--bg))",
            color: "hsl(var(--text))",
          }}
        />
      </label>

      {state.error && (
        <p className="text-sm" role="alert" style={{ color: "hsl(var(--danger))" }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tap inline-flex w-full items-center justify-center rounded-xl px-5 font-semibold disabled:opacity-60"
        style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
      >
        {pending ? "Comprobando…" : "Entrar"}
      </button>
    </form>
  );
}
