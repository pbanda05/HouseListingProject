import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-[85vh] selection:bg-indigo-600 selection:text-white">
      {/* Hero Section */}
      <header className="max-w-4xl mx-auto pt-24 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Smarter tools for <br className="hidden md:block" />
          <span className="text-indigo-600">short-term rental</span> hosts.
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing and start optimizing. Use our suite of free, data-driven calculators and audits to maximize your listing's revenue and visibility.
        </p>
      </header>

      {/* Tools Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Tool 1 Card */}
          <Link href="/checkup" className="block group">
            <div className="h-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Checkup</h2>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Audit your property description, photos, and amenities to see how you stack up against top-performing listings.
              </p>
              <div className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Launch Tool <span>→</span>
              </div>
            </div>
          </Link>

          {/* Tool 2 Card */}
          <Link href="/pricing" className="block group">
            <div className="h-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Pricing Advisor</h2>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Forecast your monthly revenue, visualize hidden costs, and find the perfect sweet-spot for your nightly rates.
              </p>
              <div className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Launch Tool <span>→</span>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}