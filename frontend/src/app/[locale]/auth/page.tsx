"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Mail, Lock, User } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (pw: string): number => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = ["bg-error", "bg-warning", "bg-warning", "bg-success"];

  if (!password) return null;

  return (
    <div className="flex gap-1.5 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < strength ? colors[strength - 1] : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
      }

      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed. Is Supabase running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Fluent</h1>
          </div>

          <Card variant="glass" padding="lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signup" : "signin"}
                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  {isSignUp ? t("signUp") : t("signIn")}
                </h2>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm mb-4"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <Input
                      label={t("displayName")}
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  )}

                  <Input
                    label={t("email")}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<Mail className="h-4 w-4" />}
                  />

                  <div>
                    <Input
                      label={t("password")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      leftIcon={<Lock className="h-4 w-4" />}
                    />
                    {isSignUp && <PasswordStrength password={password} />}
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    {isSignUp ? t("signUp") : t("signIn")}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                {isSignUp ? t("hasAccount") : t("noAccount")}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
