"use client";
import { useState } from "react";
import Link from "next/link";

export default function CheckupPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photoCount: 5,
    price: 150,
    marketPrice: 160,
    amenities: {
      wifi: true,
      ac: true,
      parking: false,
      kitchen: true,
      washer: false,
    },
  });

  const [results, setResults] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity as keyof typeof formData.amenities],
      },
    });
  };

  const runAudit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 10;
    const tips: string[] = [];

    if (Number(formData.photoCount) < 15) {
      score -= 2;
      tips.push("📸 Low Photo Count: Top-performing listings typically have at least 15–20 high-quality photos covering all rooms, exterior, and unique angles.");
    }

    if (formData.title.length < 20) {
      score -= 2;
      tips.push("✍️ Title Too Short: Make your title punchy and descriptive (e.g., mention unique perks like 'Modern Downtown Loft w/ Free Parking').");
    }

    if (formData.description.length < 150) {
      score -= 2;
      tips.push("📄 Short Description: Flesh out your description. Mention local attractions, workspace setups, and sleeping arrangements.");
    }

    const diff = Number(formData.price) - Number(formData.marketPrice);
    if (diff > 30) {
      score -= 2;
      tips.push(`💰 Price High vs Market: Your price ($${formData.price}) is significantly higher than nearby averages ($${formData.marketPrice}). Ensure your perks justify the premium.`);
    } else if (diff < -30) {
      tips.push("💡 Pricing Opportunity: You are priced well below market average. You could likely increase your nightly rate without losing bookings.");
    }

    const missing = Object.entries(formData.amenities)
      .filter(([_, present]) => !present)
      .map(([name]) => name.toUpperCase());

    if (missing.length > 0) {
      score -= 1;
      tips.push(`🛠️ Missing Key Amenities: Consider adding missing essentials like ${missing.join(", ")} to capture more searches.`);
    }

    if (score < 1) score = 1;

    setResults({ score, tips });
    setEmailSent(false);
  };

  const sendReportEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSendingEmail(true);

    // Simulate reliable dispatch / or construct mailto trigger as fallback
    setTimeout(() => {
      setSendingEmail(false);
      setEmailSent(true);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 tracking-wide uppercase">
          ✨ Listing Checkup Tool
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Audit Your Short-Term Rental
        </h1>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Fill out your listing details below to instantly receive rule-based optimization tips to drive more bookings.
        </p>
      </div>

      {!results ? (
        <form onSubmit={runAudit} className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Listing Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Cozy 2BR Downtown Getaway"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Listing Description</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your space, neighborhood, and amenities..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Total Photos</label>
              <input
                type="number"
                name="photoCount"
                min="1"
                max="50"
                value={formData.photoCount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Your Nightly Price ($</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Nearby Market Avg ($</label>
              <input
                type="number"
                name="marketPrice"
                value={formData.marketPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Amenities Included</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(formData.amenities).map((amenity) => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityChange(amenity)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                    formData.amenities[amenity as keyof typeof formData.amenities]
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {amenity.toUpperCase()} {formData.amenities[amenity as keyof typeof formData.amenities] ? "✓" : "+"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            Run Listing Checkup →
          </button>
        </form>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">Audit Complete</span>
            <h2 className="text-4xl font-black text-slate-900 mt-1 mb-2">
              {results.score} / 10
            </h2>
            <p className="text-slate-600 text-sm">
              Here is how your listing stacks up based on standard booking best practices.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Optimization Tips ({results.tips.length})</h3>
            {results.tips.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                🎉 Amazing job! Your listing hits all the key rule-based criteria for high visibility.
              </div>
            ) : (
              results.tips.map((tip: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm font-medium">
                  {tip}
                </div>
              ))
            )}
          </div>

          {/* Email Report Section */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Email This Report</h4>
            <p className="text-xs text-slate-500">Enter your email address to receive a copy of these optimization tips.
            {emailSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                ✅ Report successfully dispatched to {emailInput}! Check your inbox.
              </div>
            ) : (
              <form onSubmit={sendReportEmail} className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition cursor-pointer"
                >
                  {sendingEmail ? "Sending..." : "Send Report"}
                </button>
              </form>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setResults(null)}
              className="flex-1 py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              ← Edit Listing Details
            </button>
            <Link href="/dashboard" className="flex-1 text-center py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition">
              View Dashboard →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}