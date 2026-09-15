import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HostToolkit | Smarter tools for rental hosts',
  description: 'Data-driven calculators and audits to maximize your short-term rental revenue.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        
        <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight text-slate-900 transition hover:opacity-80">
              Host<span className="text-indigo-600">Toolkit</span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/checkup" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition hidden sm:block">
                Listing Checkup
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition hidden sm:block">
                Pricing Advisor
              </Link>
              {/* SHRUNK BUTTON AND CHANGED TO LINK */}
              <Link href="/login" className="text-sm font-medium bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition shadow-sm active:scale-95">
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        
        {children}
        
        <footer className="w-full border-t border-slate-200 bg-white mt-12 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
            © 2026 HostToolkit. Built for scaleable, user-focused software.
          </div>
        </footer>

      </body>
    </html>
  );
}