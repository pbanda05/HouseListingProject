"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName
          }
        }
      });
      if (error) setMessage(error.message);
      else {
        if (!data.session) {
          setMessage("Success! Check your email for the verification link.");
          // NEW LOGIC: Set a flag so the app knows this is a first-time verification
          localStorage.setItem('showSignupToast', 'true');
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  };

  const alertColor = message.includes('error') || message.includes('Invalid') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-500">
            {isSignUp 
              ? "Sign up to save your pricing strategies." 
              : "Enter your details to access your saved tools."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
              <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Alex" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="host@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>

          {message && (
            <div className={"text-sm font-medium p-3 rounded-xl " + alertColor}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all active:scale-[0.99] mt-2 disabled:opacity-50">
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}