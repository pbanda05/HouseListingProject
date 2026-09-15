"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const router = useRouter();
  const supabase = createClient();

  const handleOAuth = async (provider: 'google') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      if (password !== confirmPassword) {
        setMessage("Error: Passwords do not match.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { first_name: name, phone: phone } }
      });

      if (error) setMessage(error.message);
      else {
        if (!data.session) {
          setMessage("Success! Check your email for the verification link.");
          localStorage.setItem('showSignupToast', 'true');
          setPassword("");
          setConfirmPassword("");
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

  const alertColor = message.toLowerCase().includes('error') || message.includes('Invalid') 
    ? 'bg-red-50 text-red-600 border border-red-100' 
    : 'bg-emerald-50 text-emerald-600 border border-emerald-100';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-500">
            {isSignUp 
              ? "Sign up to start maximizing your rental revenue." 
              : "Enter your details to access your saved tools."}
          </p>
        </div>

        {/* --- OAUTH BUTTONS --- */}
        <button 
          type="button" 
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-sm transition-all active:scale-[0.99] mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.1-1.93 3.31-4.78 3.31-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.23 1.05-3.7 1.05-2.85 0-5.27-1.93-6.14-4.52H2.18v2.85C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.86 14.1c-.22-.66-.35-1.37-.35-2.1s.13-1.44.35-2.1V7.05H2.18C1.43 8.55 1 10.23 1 12s.43 3.45 1.18 4.95l3.68-2.85z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.22 1.66l3.16-3.16C17.46 2.18 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.68 2.85c.87-2.59 3.29-4.52 6.14-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-semibold">Or continue with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {isSignUp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="host@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
            </div>
          )}

          {message && (
            <div className={"text-sm font-medium p-4 rounded-xl mt-4 " + alertColor}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all active:scale-[0.99] mt-6 disabled:opacity-50">
            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <button 
            type="button"
            onClick={() => { 
              setIsSignUp(!isSignUp); 
              setMessage(""); 
              setPassword(""); 
              setConfirmPassword("");
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}