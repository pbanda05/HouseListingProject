"use client";
import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { createClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';

export default function AuthNav() {
  const [user, setUser] = useState(null);
  const [toastState, setToastState] = useState('hidden');
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
      
      if (event === 'SIGNED_IN') {
        // NEW LOGIC: Only show if the local storage flag exists
        if (typeof window !== 'undefined' && localStorage.getItem('showSignupToast') === 'true') {
          setToastState('visible');
          setTimeout(() => setToastState('hidden'), 4000); 
          
          // Delete the flag so it never shows on future log ins
          localStorage.removeItem('showSignupToast');
        }
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
      {/* Floating Centered Toast Notification */}
      <div 
        className={`fixed top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[100] border border-slate-700 transition-all duration-1000 ease-in-out ${
          toastState === 'visible' 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-lg shrink-0">
          ✓
        </div>
        <p className="text-sm font-medium pr-2">Authentication Successful, {name}!</p>
      </div>

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