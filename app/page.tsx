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
      tips.push({ good: true, title: "Photo count looks solid!", detail: `${numPhotos} photos gives guests a crystal-clear picture of your space.` });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-16 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 tracking-wide uppercase">
          ✨ Listing Optimization Tool
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Rental Listing Checkup
        </h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto">
          Audit your property listing details and get instant, plain-language insights to attract more bookings.
        </p>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <form onSubmit={analyzeListing} className="space-y-6">
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4">1. Listing Core</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Listing Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Cozy 2BR Loft with Skyline View" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe your space, neighborhood, check-in process..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition h-32 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Aim for 40+ words with check-in and neighborhood details.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Total Photos</label>
                  <input 
                    type="number" 
                    value={photos} 
                    onChange={(e) => setPhotos(e.target.value)} 
                    min="0" 
                    placeholder="e.g. 10" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4">2. Pricing Strategy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Your Nightly ($)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    min="0" 
                    placeholder="120" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Nearby Average ($)</label>
                  <input 
                    type="number" 
                    value={nearbyPrice} 
                    onChange={(e) => setNearbyPrice(e.target.value)} 
                    min="0" 
                    placeholder="110" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4">3. Key Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {IMPORTANT_AMENITIES.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition">
                    <input type="checkbox" value={amenity} onChange={handleAmenity} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> 
                    <span className="text-sm text-slate-700 font-medium">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer">
              Check My Listing →
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm sticky top-8">
          {!report ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl text-indigo-600">
                📊
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">Awaiting Your Listing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Fill out the form on the left and click check to generate your custom property score and feedback tips.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                  {report.score}
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wider uppercase text-slate-500">Listing Score</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {report.score >= 8 ? "✨ Looking Strong" : report.score >= 5 ? "📈 Room to Improve" : "⚠️ Needs Work"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {report.tips.map((t, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex gap-3.5 items-start ${t.good ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-amber-50/50 border-amber-200 text-amber-900'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${t.good ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.good ? '✓' : '!'}
                    </span>
                    <div>
                      <strong className="block text-sm font-semibold mb-0.5 text-slate-900">{t.title}</strong>
                      <span className="text-xs text-slate-600 leading-relaxed">{t.detail}</span>
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