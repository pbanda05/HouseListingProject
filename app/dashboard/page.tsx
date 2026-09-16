"use client";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase";
import Link from "next/link";

type PricingStrategy = {
  id: string;
  user_id: string;
  strategy_name: string;
  created_at: string;
  base_rate: number;
  weekend_premium: number;
  cleaning_fee: number;
  occupancy_rate: number;
  fixed_costs: number;
};

export default function DashboardPage() {
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStrategies = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("pricing_strategies")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setStrategies(data);
      }
      setLoading(false);
    };
    fetchStrategies();
  }, []);

  const deleteStrategy = async (id: string) => {
    const { error } = await supabase.from("pricing_strategies").delete().eq("id", id);
    if (!error) {
      setStrategies(strategies.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <header className="max-w-4xl mx-auto pt-24 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 tracking-wide uppercase">
          📊 Host Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Your Saved Strategies
        </h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto">
          View, manage, and review all your saved pricing and revenue scenarios in one place.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">Saved Calculations ({strategies.length})</h2>
          <Link href="/pricing" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            + Create New Strategy
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading your strategies...</div>
        ) : strategies.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl text-indigo-600">📁</div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No saved strategies yet</h3>
            <p className="text-slate-500 text-sm mb-6">Head over to the Pricing Advisor to calculate and save your first strategy.</p>
            <Link href="/pricing" className="inline-block py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm">
              Open Pricing Advisor →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strat) => (
              <div key={strat.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{strat.strategy_name}</h3>
                    <span className="text-xs text-slate-400">
                      {new Date(strat.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase font-semibold">Base Rate</span>
                      <span className="font-bold text-slate-900">${strat.base_rate}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase font-semibold">Weekend +</span>
                      <span className="font-bold text-slate-900">+${strat.weekend_premium}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase font-semibold">Cleaning Fee</span>
                      <span className="font-bold text-slate-900">${strat.cleaning_fee}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase font-semibold">Occupancy</span>
                      <span className="font-bold text-slate-900">{strat.occupancy_rate}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Fixed Costs: <strong className="text-slate-900">${strat.fixed_costs}</strong>/mo</span>
                  <button
                    onClick={() => deleteStrategy(strat.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Delete Strategy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}