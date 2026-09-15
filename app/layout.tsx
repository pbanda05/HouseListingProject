import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import AuthNav from './components/AuthNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HostToolkit | Smarter tools for rental hosts',
  description: 'Data-driven calculators and audits to maximize your short-term rental revenue.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between`}>
        
        {/* Sticky Top Navigation */}
        <nav className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-xs">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 transition hover:opacity-80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                H
              </div>
              <span>Host<span className="text-indigo-600">Toolkit</span></span>
            </Link>

            {/* Right: Nav Links + Auth */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
                <Link href="/checkup" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Listing Checkup
                </Link>
                <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Pricing Advisor
                </Link>
              </div>

              <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-3">
                <AuthNav />
              </div>
            </div>

          </div>
        </nav>

        {/* Main Content Area with proper top spacing */}
        <main className="flex-grow pt-28 pb-16">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
            © 2026 HostToolkit. Built for scalable, user-focused software.
          </div>
        </footer>

      </body>
    </html>
  );
}