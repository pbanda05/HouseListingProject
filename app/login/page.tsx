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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      // 1. Validate that passwords match before doing anything
      if (password !== confirmPassword) {
        setMessage("Error: Passwords do not match.");
        setLoading(false);
        return;
      }

      // 2. Send all the new metadata to Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: name,
            phone: phone
          }
        }
      });

      if (error) setMessage(error.message);
      else {
        if (!data.session) {
          setMessage("Success! Check your email for the verification link.");
          localStorage.setItem('showSignupToast', 'true');
          
          // Clear sensitive fields after success
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

  // Turn the box red if it's an error, green if it's a success
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

        <form className="space-y-4" onSubmit={handleAuth}>
          
          {/* --- SIGN UP ONLY FIELDS (TOP) --- */}
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

          {/* --- SHARED FIELDS --- */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="host@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
          </div>

          {/* --- SIGN UP ONLY FIELDS (BOTTOM) --- */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
            </div>
          )}

          {/* --- STATUS MESSAGE --- */}
          {message && (
            <div className={"text-sm font-medium p-4 rounded-xl mt-4 " + alertColor}>
              {message}
            </div>
          )}

          {/* --- SUBMIT BUTTON --- */}
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
              setPassword(""); // Reset passwords when toggling views
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