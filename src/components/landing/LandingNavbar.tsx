import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  ArrowRight, 
  Sparkles, 
  Menu, 
  X, 
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface LandingNavbarProps {
  onEnterApp: () => void;
  onOpenPitchModal: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onEnterApp, onOpenPitchModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'O Produto', href: '#produto' },
    { label: 'Os 5 Pilares', href: '#pilares' },
    { label: 'Tese & Mercado', href: '#mercado' },
    { label: 'Monetização', href: '#monetizacao' },
    { label: 'Calculadora ROI', href: '#calculadora' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/60 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & SportsTech Badge */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-emerald-400 group-hover:rotate-6 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white font-['Cabinet_Grotesk'] leading-none">
                  Na Prancheta
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono mt-1">
                  SportsTech SaaS
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rodada Seed 2026</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenPitchModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 rounded-lg transition-all duration-200 hover:border-zinc-600 shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Solicitar Pitch Deck</span>
            </button>

            <button
              onClick={onEnterApp}
              className="group inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onEnterApp}
              className="px-2.5 py-1.5 text-xs font-bold text-zinc-950 bg-emerald-400 rounded-lg"
            >
              App
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800 px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPitchModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Solicitar Pitch Deck</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterApp();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-zinc-950 bg-emerald-400 rounded-lg shadow-md shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Testar Demo Operacional</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
