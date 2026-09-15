"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';

export default function AuthNav() {
  const [user, setUser] = useState(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check for an existing session on load
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // Listen for sign ins and sign outs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    // Pull the name from the metadata we save during sign-up
    const name = user.user_metadata?.first_name || "Host";
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-700">Hello, {name}!</span>
        <button onClick={handleSignOut} className="text-sm font-medium text-slate-500 hover:text-red-600 transition">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="text-sm font-medium bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition shadow-sm active:scale-95">
      Sign In
    </Link>
  );
}