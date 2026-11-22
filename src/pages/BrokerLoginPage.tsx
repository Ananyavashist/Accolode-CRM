import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AccoladeLogo } from "@/components/ui/AccoladeLogo";
import { ChevronRight, Eye, EyeOff } from "@/components/ui/icons";
import { useBroker } from "@/store/BrokerContext";
import { cn } from "@/lib/utils";

export function BrokerLoginPage() {
  const navigate = useNavigate();
  const { login, enterDemoDashboard } = useBroker();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password.trim()) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;
    let ready = false;
    flushSync(() => {
      ready = login(email.trim(), { signup: mode === "signup" });
    });
    navigate(ready ? "/" : "/onboarding", { replace: true });
  };

  const skipToDashboard = () => {
    enterDemoDashboard();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-swatch-charcoal px-6 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8 shadow-pop">
        <div className="mb-8 flex items-center gap-2">
          <AccoladeLogo size={32} />
          <span className="text-lg font-semibold text-swatch-charcoal">Accolade</span>
        </div>

        <h1 className="text-2xl font-bold text-ink">
          {mode === "signup" ? "Create an account" : "Sign in"}
        </h1>

        <div className="mt-6 flex gap-2 rounded-lg border border-hairline bg-sidebar p-1">
          {(
            [
              ["signup", "Sign up"],
              ["signin", "Sign in"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                mode === id ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={cn(
                "input-field mt-1.5",
                (touched.email || errors.email) && !email.trim() && "border-status-awaiting",
              )}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-status-awaiting" role="alert">
                {errors.email}
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={cn(
                  "input-field pr-11",
                  (touched.password || errors.password) && !password.trim() && "border-status-awaiting",
                )}
                aria-invalid={Boolean(errors.password)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-sidebar hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="mt-1 text-xs text-status-awaiting" role="alert">
                {errors.password}
              </p>
            )}
          </label>

          <button type="submit" className="btn-primary w-full gap-1.5">
            {mode === "signup" ? "Continue" : "Sign in"}
            <ChevronRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <button
        type="button"
        onClick={skipToDashboard}
        className="fixed bottom-6 right-6 z-50 rounded-lg border border-white/20 bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-pop transition-colors hover:bg-sidebar"
      >
        Skip to dashboard
      </button>
    </div>
  );
}