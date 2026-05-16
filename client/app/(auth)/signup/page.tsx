"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Spinner } from "@/components/Spinner";
import { CheckCircle2, Sparkles, Zap, Shield, Globe, ArrowRight } from "lucide-react";

interface SignupResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ApiErrorResponse {
  message: string;
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.post<SignupResponse>("/auth/signup", {
        name,
        email,
        password,
      });
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorResponse = err as ApiErrorResponse;
      setError(errorResponse.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--base)] overflow-hidden relative">
      {/* BACKGROUND INTERACTIVE MESH - Optimized for Mobile */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] md:w-[50%] h-[50%] bg-[var(--accent)] opacity-[0.05] md:opacity-[0.03] blur-[100px] md:blur-[120px] rounded-full animate-mesh"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[50%] h-[50%] bg-[var(--accent)] opacity-[0.05] md:opacity-[0.03] blur-[100px] md:blur-[120px] rounded-full animate-mesh stagger-2"></div>
        
        {/* Mobile-only floating particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-[var(--accent)] rounded-full animate-float opacity-20 lg:hidden"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-float-slow opacity-10 lg:hidden stagger-3"></div>
      </div>

      {/* Left Column - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-transparent p-16 flex-col justify-between z-10">
        <div className="animate-fadeIn">
          <div className="flex items-center space-x-3 mb-2">
             <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[#0A0A0A] shadow-[var(--shadow-accent)]">
                <Sparkles size={24} />
             </div>
             <h1 className="font-serif text-[32px] text-[var(--text-primary)] tracking-tight">PEBLO NOTES</h1>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--accent)] opacity-60 ml-1">The Intelligence Workspace</p>
        </div>
        
        <div className="relative">
          {/* FLOATING PREVIEW CARDS */}
          <div className="absolute -top-32 -left-8 w-64 p-4 glass-card rounded-[var(--radius-lg)] animate-float opacity-80 shadow-2xl pointer-events-none">
             <div className="font-mono text-[10px] text-[var(--accent)] mb-2">RECENT NOTE</div>
             <div className="h-2 w-3/4 bg-[var(--border)] rounded mb-2"></div>
             <div className="h-1.5 w-full bg-[var(--surface-3)] rounded"></div>
          </div>

          <div className="absolute -bottom-16 -right-4 w-72 p-5 glass-card rounded-[var(--radius-lg)] animate-float-slow opacity-90 shadow-2xl pointer-events-none stagger-2">
            <div className="font-serif text-[18px] text-[var(--accent)] mb-2">✦ Weekly Insights</div>
            <div className="flex items-end space-x-1 h-12">
               <div className="flex-1 bg-[var(--accent)] opacity-20 rounded-t h-[40%]"></div>
               <div className="flex-1 bg-[var(--accent)] opacity-40 rounded-t h-[70%]"></div>
               <div className="flex-1 bg-[var(--accent)] opacity-100 rounded-t h-[90%]"></div>
               <div className="flex-1 bg-[var(--accent)] opacity-60 rounded-t h-[50%]"></div>
            </div>
          </div>

          <h2 className="font-serif text-[64px] text-[var(--text-primary)] leading-[1.05] mb-8 animate-fadeIn stagger-1">
            Build your <br/> digital <span className="italic text-[var(--accent)]">second brain.</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-6 animate-fadeIn stagger-2 max-w-lg">
            <div className="flex items-start space-x-3 group">
              <div className="mt-1 text-[var(--accent)] group-hover:scale-110 transition-transform"><Zap size={18} /></div>
              <div>
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-1">Instant Insights</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-normal">Deep summaries generated by Llama 3.1 in seconds.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group">
              <div className="mt-1 text-[var(--accent)] group-hover:scale-110 transition-transform"><Globe size={18} /></div>
              <div>
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-1">Public Portals</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-normal">Share your research with one-click private links.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group">
              <div className="mt-1 text-[var(--accent)] group-hover:scale-110 transition-transform"><Shield size={18} /></div>
              <div>
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-1">Secure by Default</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-normal">Your data is encrypted and yours alone to control.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group">
              <div className="mt-1 text-[var(--accent)] group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
              <div>
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-1">Auto-Save Core</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-normal">Every keystroke is persisted without you ever clicking save.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 animate-fadeIn stagger-4 opacity-50">
            <div className="font-serif text-[18px]">PEBLO</div>
            <div className="h-4 w-[1px] bg-[var(--border)]"></div>
            <div className="font-mono text-[10px] tracking-widest uppercase">Member of Eleven Group</div>
        </div>
      </div>

      {/* Form Column - Centered on Mobile */}
      <div className="flex-1 flex flex-col items-center p-6 md:p-12 relative z-10 overflow-y-auto lg:justify-center pt-24 lg:pt-12">
        
        {/* MOBILE HEADER - Only visible on small screens */}
        <div className="lg:hidden w-full max-w-[420px] mb-8 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[#0A0A0A] shadow-[var(--shadow-accent)]">
                <Sparkles size={18} />
             </div>
             <h1 className="font-serif text-[24px] text-[var(--text-primary)] tracking-tight">PEBLO NOTES</h1>
          </div>
          <h2 className="font-serif text-[40px] text-[var(--text-primary)] leading-tight mb-2">
            Build your <br/> digital <span className="italic text-[var(--accent)]">second brain.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-[14px]">Simple, powerful, AI-driven.</p>
        </div>

        <div className="w-full max-w-[420px] glass-card border border-[var(--border)] rounded-[var(--radius-lg)] p-8 md:p-12 shadow-[var(--shadow-lg)] animate-scaleIn stagger-1">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-[28px] md:text-[32px] text-[var(--text-primary)] mb-2">Get started</h2>
            <p className="text-[var(--text-secondary)] text-[14px]">Join the next generation of note-taking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fadeIn stagger-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-[0.1em]">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full h-[52px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 text-[14px] text-[var(--text-primary)] transition-all duration-300 focus:border-[var(--accent)] focus:bg-[var(--surface-3)] focus:shadow-[0_0_0_4px_var(--accent-glow)] outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div className="animate-fadeIn stagger-2">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-[0.1em]">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full h-[52px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 text-[14px] text-[var(--text-primary)] transition-all duration-300 focus:border-[var(--accent)] focus:bg-[var(--surface-3)] focus:shadow-[0_0_0_4px_var(--accent-glow)] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            <div className="animate-fadeIn stagger-3">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-[0.1em]">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full h-[52px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 text-[14px] text-[var(--text-primary)] transition-all duration-300 focus:border-[var(--accent)] focus:bg-[var(--surface-3)] focus:shadow-[0_0_0_4px_var(--accent-glow)] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 8 chars)"
              />
            </div>

            {error && (
              <div className="animate-fadeIn rounded-[var(--radius-sm)] bg-[var(--danger-dim)] border border-[var(--danger)]/10 p-4 text-[12px] text-[var(--danger)] flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-[var(--danger)] animate-pulse"></div>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full h-[52px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] text-[#0A0A0A] font-bold text-[14px] transition-all duration-300 hover:brightness-110 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(232,213,163,0.15)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeIn stagger-4"
            >
              {loading ? <Spinner size="sm" /> : (
                <div className="flex items-center space-x-2">
                  <span>Create Free Account</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-[13px] text-[var(--text-muted)] animate-fadeIn stagger-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--text-primary)] font-medium hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] hover:border-[var(--accent)] pb-0.5">
              Sign in here
            </Link>
          </div>
        </div>

        {/* MOBILE FEATURES GRID - Optimized for small screens */}
        <div className="lg:hidden w-full max-w-[420px] mt-16 pb-12 animate-fadeIn stagger-4 space-y-10">
           <div className="grid grid-cols-1 gap-8">
              <div className="flex items-start space-x-4 group">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] text-[var(--accent)]"><Zap size={20} /></div>
                <div>
                  <h4 className="text-[15px] font-medium text-[var(--text-primary)] mb-1">Instant Insights</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Deep summaries generated by Llama 3.1 in seconds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] text-[var(--accent)]"><Globe size={20} /></div>
                <div>
                  <h4 className="text-[15px] font-medium text-[var(--text-primary)] mb-1">Public Portals</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Share your research with one-click private links.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] text-[var(--accent)]"><Shield size={20} /></div>
                <div>
                  <h4 className="text-[15px] font-medium text-[var(--text-primary)] mb-1">Secure by Default</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Your data is encrypted and yours alone to control.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] text-[var(--accent)]"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="text-[15px] font-medium text-[var(--text-primary)] mb-1">Auto-Save Core</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Every keystroke is persisted without you ever clicking save.</p>
                </div>
              </div>
           </div>
           
           <div className="pt-8 border-t border-[var(--border)] flex items-center justify-center space-x-4 opacity-40">
              <div className="font-serif text-[16px]">PEBLO</div>
              <div className="h-3 w-[1px] bg-[var(--border)]"></div>
              <div className="font-mono text-[9px] tracking-widest uppercase">Eleven Group</div>
           </div>
        </div>
      </div>
    </div>
  );
}
