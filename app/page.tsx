"use client";
import { useState, useEffect } from "react";
import { createClient } from "./utils/supabase";

export default function Home() {
  const [userName, setUserName] = useState("Host");
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Grab first_name from custom sign-up metadata or full_name from Google OAuth
        const name = user.user_metadata?.first_name || user.user_metadata?.full_name || "Host";
        setUserName(name);
      }
    };
    getUserData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Hello, {userName}
        </h1>
        <p className="text-slate-600">
          Welcome back to HostToolkit. Your pricing strategies and rental tools are ready.
        </p>
      </div>
    </main>
  );
}