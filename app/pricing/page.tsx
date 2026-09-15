"use client";

import { useState, FormEvent } from "react";
import { createClient } from "../utils/supabase";

export default function PricingAdvisor() {
  const [baseRate, setBaseRate] = useState("");
  const [weekendPremium, setWeekendPremium] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [occupancy, setOccupancy] = useState("70");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  
  const [strategyName, setStrategyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [projection, setProjection] = useState<{
    monthlyRevenue: number;
    annualRevenue: number;
    cleaningRevenue: number;
    netProfit: number;
    tips: string[];
  } | null>(null);

  const supabase = createClient();

  const calculateRevenue = (e: FormEvent) => {
    e.preventDefault();
    setSaveMessage("");
    
    const rate = Number(baseRate) || 0;
    const weekendRate = rate + (Number(weekendPremium) || 0);
    const cleaning = Number(cleaningFee) || 0;
    const occRate = Number(occupancy) / 100 || 0;
    const expenses = Number(monthlyExpenses) || 0;

    const totalBookedDays = Math.round(30 * occRate);
    const weekendDaysBooked = Math.round(8 * occRate);
    const weekdayDaysBooked = totalBookedDays - weekendDaysBooked;
    
    const estimatedStays = Math.max(1, Math.round(totalBookedDays / 3));

    const roomRevenue = (weekdayDaysBooked * rate) + (weekendDaysBooked * weekendRate);
    const cleaningRev = estimatedStays * cleaning;
    const totalMonthly = roomRevenue + cleaningRev;
    const totalNet = totalMonthly - expenses;

    const tips = [];
    if (cleaning > rate * 0.75) tips.push("Your cleaning fee is quite high compared to your nightly rate. This can deter shorter stays.");
    if (occRate < 0.5) tips.push("At under 50% occupancy, consider lowering your base rate slightly to attract more bookings.");
    if (Number(weekendPremium) === 0) tips.push("You aren't charging a weekend premium. You are likely leaving money on the table for Friday/Saturday bookings.");
    if (totalNet < 0) tips.push("Warning: Your estimated monthly expenses currently exceed your projected rental revenue.");
    if (tips.length === 0) tips.push("Your pricing strategy looks well-balanced and profitable based on these metrics!");

    setProjection({
      monthlyRevenue: totalMonthly,
      annualRevenue: totalMonthly * 12,
      cleaningRevenue: cleaningRev,
      netProfit: totalNet,
      tips
    });
  };

  const saveStrategy = async () => {
    setIsSaving(true);
    setSaveMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSaveMessage("❌ You must be logged in to save strategies.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("pricing_strategies").insert({
      user_id: user.id,
      strategy_name: strategyName.trim() || "My Rental Strategy",
      base_rate: Number(baseRate) || 0,
      weekend_premium: Number(weekendPremium) || 0,
      cleaning_fee: Number(cleaningFee) || 0,
      occupancy_rate: Number(occupancy) || 0,
      fixed_costs: Number(monthlyExpenses) || 0,
    });

    setIsSaving(false);

    if (error) {
      console.error(error);
      setSaveMessage("❌ Error saving strategy. Try again.");
    } else {
      setSaveMessage("✅ Strategy saved successfully!");
      setStrategyName("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <header className="max-w-4xl mx-auto pt-16 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-4 tracking-wide uppercase">
          💰 Revenue Calculator
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Pricing & Profit Advisor
        </h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto">
          Forecast your monthly Airbnb revenue, visualize hidden costs, and optimize your nightly rates.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <form onSubmit={calculateRevenue} className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">1. Nightly Rates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Base Rate ($)</label>
                  <input type="number" required value={baseRate} onChange={(e) => setBaseRate(e.target.value)} placeholder="150" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Weekend Premium (+$)</label>
                  <input type="number" value={weekendPremium} onChange={(e) => setWeekendPremium(e.target.value)} placeholder="50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">2. Fees & Occupancy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Cleaning Fee ($)</label>
                  <input type="number" value={cleaningFee} onChange={(e) => setCleaningFee(e.target.value)} placeholder="100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Est. Occupancy Rate: {occupancy}%</label>
                  <input type="range" min="10" max="100" step="5" value={occupancy} onChange={(e) => setOccupancy(e.target.value)} className="w-full accent-emerald-600" />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">3. Monthly Expenses</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Total Fixed Costs ($)</label>
                <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} placeholder="e.g. 1500 (Mortgage, HOA, Utilities)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer">
              Calculate Profit →
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm sticky top-8">
          {!projection ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl text-emerald-600">📈</div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">Awaiting Data</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Enter your rates and expenses on the left to see your projected revenue.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                <div className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1">Projected Monthly Revenue</div>
                <div className="text-4xl font-bold tracking-tight">${projection.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-slate-400 mt-2">Annual Run Rate: <span className="text-white">${projection.annualRevenue.toLocaleString()}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Cleaning Rev</div>
                  <div className="text-lg font-bold text-slate-900">${projection.cleaningRevenue.toLocaleString()}</div>
                </div>
                <div className={`p-4 rounded-2xl border ${projection.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`text-xs font-semibold tracking-wider uppercase mb-1 ${projection.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Net Profit</div>
                  <div className={`text-lg font-bold ${projection.netProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                    ${projection.netProfit.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Save Strategy Box */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Save Strategy</h4>
                <input 
                  type="text" 
                  value={strategyName} 
                  onChange={(e) => setStrategyName(e.target.value)} 
                  placeholder="Strategy Name (e.g. Summer Setup)" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" 
                />
                <button 
                  onClick={saveStrategy}
                  disabled={isSaving}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save to Account 💾"}
                </button>
                {saveMessage && (
                  <p className="text-xs font-medium text-center mt-1">{saveMessage}</p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Pricing Insights</h4>
                {projection.tips.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 leading-relaxed">
                    💡 {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}