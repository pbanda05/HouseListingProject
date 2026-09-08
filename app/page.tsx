"use client";

import { useState, FormEvent, ChangeEvent } from "react";

const IMPORTANT_AMENITIES = ["WiFi", "Air conditioning", "Free parking", "Washer", "Kitchen", "Heating", "Workspace", "TV"];

export default function ListingCheckup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState("");
  const [price, setPrice] = useState("");
  const [nearbyPrice, setNearbyPrice] = useState("");
  const [checkedAmenities, setCheckedAmenities] = useState<string[]>([]);
  const [report, setReport] = useState<{ score: number; tips: any[] } | null>(null);

  const handleAmenity = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (e.target.checked) {
      setCheckedAmenities([...checkedAmenities, val]);
    } else {
      setCheckedAmenities(checkedAmenities.filter((a) => a !== val));
    }
  };

  const analyzeListing = (e: FormEvent) => {
    e.preventDefault();
    const tips = [];
    const numPhotos = Number(photos) || 0;
    const numPrice = Number(price) || 0;
    const numNearby = Number(nearbyPrice) || 0;

    // Photos check
    if (numPhotos === 0) {
      tips.push({ good: false, title: "No photo count entered", detail: "Add photos of every room — listings with more photos consistently get more bookings." });
    } else if (numPhotos < 5) {
      tips.push({ good: false, title: "Add more photos", detail: `You have ${numPhotos}. Aim for at least 10, covering every room and outdoor space.` });
    } else if (numPhotos < 10) {
      tips.push({ good: false, title: "A few more photos would help", detail: `You have ${numPhotos}. Listings with 10+ photos convert significantly better.` });
    } else {
      tips.push({ good: true, title: "Photo count looks fantastic!", detail: `${numPhotos} photos gives guests a crystal-clear picture of your space.` });
    }

    // Description check
    const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
    if (wordCount < 40) {
      tips.push({ good: false, title: "Description is a bit short", detail: `You're at ${wordCount} words. Flesh out the neighborhood vibe and special perks.` });
    } else {
      tips.push({ good: true, title: "Great description length", detail: `${wordCount} words gives guests plenty of detail to feel confident.` });
    }

    const descLower = description.toLowerCase();
    if (!descLower.includes("check-in") && !descLower.includes("check in")) {
      tips.push({ good: false, title: "Missing check-in instructions", detail: "Guests love clarity on how and when they get into the property." });
    }
    if (!descLower.includes("neighborhood") && !descLower.includes("area") && !descLower.includes("walk")) {
      tips.push({ good: false, title: "Highlight your neighborhood", detail: "Mention local coffee spots, transit, or walkability to build excitement." });
    }

    // Title check
    if (title.length < 20) {
      tips.push({ good: false, title: "Title could be punchier", detail: "Mention a standout feature like a view, patio, or prime location." });
    } else {
      tips.push({ good: true, title: "Catchy, clear title", detail: "This stands out nicely in crowded search feeds." });
    }

    // Price check
    if (numPrice > 0 && numNearby > 0) {
      const diff = (numPrice - numNearby) / numNearby;
      if (diff > 0.15) {
        tips.push({ good: false, title: "Priced above neighborhood average", detail: `You're at $${numPrice} vs $${numNearby} nearby. Ensure your amenities justify the premium!` });
      } else if (diff < -0.15) {
        tips.push({ good: false, title: "You might be leaving money on the table", detail: `At $${numPrice} vs $${numNearby} nearby, you have room to scale up your pricing.` });
      } else {
        tips.push({ good: true, title: "Sweet-spot pricing", detail: `$${numPrice} is right in line with competitive local rates.` });
      }
    }

    // Amenities check
    const importantMissing = IMPORTANT_AMENITIES.slice(0, 6).filter(a => !checkedAmenities.includes(a));
    if (importantMissing.length > 0) {
      tips.push({ good: false, title: "Missing high-demand filters", detail: `Consider adding: ${importantMissing.join(", ")} if available.` });
    } else {
      tips.push({ good: true, title: "Top amenities fully covered", detail: "You have all the key filters guests search for checked off." });
    }

    const goodCount = tips.filter(t => t.good).length;
    const scoreOutOf10 = Math.round((goodCount / tips.length) * 10);

    setReport({ score: scoreOutOf10, tips });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative max-w-5xl mx-auto pt-16 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 tracking-wide uppercase">
          ✨ AI-Powered Listing Optimization
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Supercharge Your Rental Listing
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Get an instant, data-driven audit of your property listing and actionable insights to boost bookings.
        </p>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Panel */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/20">
          <form onSubmit={analyzeListing} className="space-y-6">
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">01. Listing Core</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Listing Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Luxury 2BR Loft with Skyline View" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe your space, neighborhood, check-in process..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition h-32 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Tip: Aim for 40+ words with check-in and local highlights.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Total Photos</label>
                  <input 
                    type="number" 
                    value={photos} 
                    onChange={(e) => setPhotos(e.target.value)} 
                    min="0" 
                    placeholder="e.g. 12" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-800" />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">02. Pricing Strategy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Your Nightly ($)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    min="0" 
                    placeholder="140" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Nearby Average ($)</label>
                  <input 
                    type="number" 
                    value={nearbyPrice} 
                    onChange={(e) => setNearbyPrice(e.target.value)} 
                    min="0" 
                    placeholder="130" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-800" />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">03. Key Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {IMPORTANT_AMENITIES.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <input type="checkbox" value={amenity} onChange={handleAmenity} className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900" /> 
                    <span className="text-sm text-slate-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.99] cursor-pointer">
              Analyze My Listing 🚀
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl sticky top-8">
          {!report ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                📊
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Awaiting Your Listing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fill out the form on the left and hit analyze to generate your custom property audit score and fix recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-md shadow-indigo-500/30">
                  {report.score}
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wider uppercase text-slate-400">Optimization Score</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {report.score >= 8 ? "🔥 Conversion Machine" : report.score >= 5 ? "⚡ Room to Optimize" : "⚠️ Needs Attention"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {report.tips.map((t, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex gap-3.5 items-start ${t.good ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${t.good ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {t.good ? '✓' : '!'}
                    </span>
                    <div>
                      <strong className="block text-sm font-semibold mb-0.5 text-white">{t.title}</strong>
                      <span className="text-xs text-slate-300 leading-relaxed">{t.detail}</span>
                    </div>
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