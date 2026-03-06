import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { I18nProvider, useI18n } from "@/hooks/useI18n";
import Navbar from "@/components/Navbar";

const AuthPageInner = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { lang } = useI18n();

  const labels = {
    loginTitle: { nl: "Inloggen", en: "Sign In", da: "ورود" },
    signupTitle: { nl: "Account Aanmaken", en: "Create Account", da: "ایجاد حساب" },
    email: { nl: "E-mailadres", en: "Email address", da: "آدرس ایمیل" },
    password: { nl: "Wachtwoord", en: "Password", da: "رمز عبور" },
    name: { nl: "Volledige naam", en: "Full name", da: "نام کامل" },
    loginBtn: { nl: "Inloggen", en: "Sign In", da: "ورود" },
    signupBtn: { nl: "Registreren", en: "Sign Up", da: "ثبت نام" },
    switchToSignup: { nl: "Nog geen account? Registreer", en: "No account? Sign up", da: "حساب ندارید؟ ثبت نام کنید" },
    switchToLogin: { nl: "Heb je al een account? Log in", en: "Already have an account? Sign in", da: "حساب دارید؟ وارد شوید" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        // Check if user is admin and redirect accordingly
        const { data: session } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: isAdmin } = await (await import("@/integrations/supabase/client")).supabase.rpc("has_role", {
            _user_id: session.session.user.id,
            _role: "admin",
          });
          if (isAdmin) {
            navigate("/ariana-admin-7x9k");
            return;
          }
        }
      } else {
        await signUp(email, password, fullName);
      }
      navigate("/my-orders");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 border border-border">
            <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              {isLogin ? l("loginTitle") : l("signupTitle")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={l("name")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={l("email")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={l("password")}
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm font-body text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 rounded-xl font-body text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLogin ? l("loginBtn") : l("signupBtn")}
              </button>
            </form>

            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="mt-4 w-full text-center text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? l("switchToSignup") : l("switchToLogin")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AuthPage = () => (
  <I18nProvider>
    <AuthPageInner />
  </I18nProvider>
);

export default AuthPage;
