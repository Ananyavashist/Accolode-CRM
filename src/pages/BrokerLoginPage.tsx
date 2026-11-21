import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/icons";
import { useBroker } from "@/store/BrokerContext";
import { cn } from "@/lib/utils";

export function BrokerLoginPage() {
  const navigate = useNavigate();
  const { login } = useBroker();
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
    const ready = login(email.trim());
    navigate(ready ? "/" : "/onboarding", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <section className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <span className="icon-btn border-primary/20 bg-primary/5 text-primary">
              <Navigation size={18} />
            </span>
            <span className="text-lg font-semibold text-swatch-charcoal">Accolade</span>
          </div>

          <h1 className="text-2xl font-bold text-ink">
            {mode === "signup" ? "Create an account" : "Sign in"}
          </h1>
          <p className="page-lede mt-1">
            Broker workspace for leads, clients, and pipeline in one place.
          </p>

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
                    "input-field pr-16",
                    (touched.password || errors.password) && !password.trim() && "border-status-awaiting",
                  )}
                  aria-invalid={Boolean(errors.password)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-ink-muted hover:text-ink"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-status-awaiting" role="alert">
                  {errors.password}
                </p>
              )}
            </label>

            <button type="submit" className="btn-primary w-full">
              {mode === "signup" ? "Continue" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-muted">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      <aside className="relative flex min-h-[280px] flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-swatch-charcoal p-8 text-white lg:max-w-[48%]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="relative max-w-md">
          <p className="text-lg leading-relaxed text-white/95">
            My experience with Accolade has made client capacity easy. Scheduling visits,
            negotiation, and lead management stay in one flow.
          </p>
          <p className="mt-6 text-sm font-semibold">Bettie Porter</p>
          <p className="text-sm text-white/75">Senior Marketing Manager</p>
        </div>
        <p className="relative text-xs text-white/60">Broker onboarding · November 2026</p>
      </aside>
    </div>
  );
}