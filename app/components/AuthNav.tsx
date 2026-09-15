"use client";
import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { createClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';

export default function AuthNav() {
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      // When the user clicks the email link or logs in, trigger the popup!
      if (event === 'SIGNED_IN') {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000); // Auto-hide after 5 seconds
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const name = user?.user_metadata?.first_name || "Host";

  return (
    <Fragment>
      {/* Floating Success Popup */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 border border-slate-700 transition-all">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl">
            ✓
          </div>
          <div>
            <p className="text-sm font-bold">Authentication Successful</p>
            <p className="text-xs text-slate-300">Welcome to your account, {name}!</p>
          </div>
        </div>
      )}

      {/* Normal Navigation Items */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700">Hello, {name}!</span>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate-500 hover:text-red-600 transition">
            Sign Out
          </button>
        </div>
      ) : (
        <Link href="/login" className="text-sm font-medium bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition shadow-sm active:scale-95">
          Sign In
        </Link>
      )}
    </Fragment>
  );
}