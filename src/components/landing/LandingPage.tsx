import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingProblemSolution } from './LandingProblemSolution';
import { LandingFeatureShowcase } from './LandingFeatureShowcase';
import { LandingMarketThesis } from './LandingMarketThesis';
import { LandingBusinessModel } from './LandingBusinessModel';
import { LandingROICalculator } from './LandingROICalculator';
import { LandingSocialProof } from './LandingSocialProof';
import { LandingFooter } from './LandingFooter';
import { LandingLeadModal } from './LandingLeadModal';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 font-['Plus_Jakarta_Sans']">
      
      {/* 1. Navbar de Navegação e CTAs */}
      <LandingNavbar 
        onEnterApp={onEnterApp} 
        onOpenPitchModal={() => setIsPitchModalOpen(true)} 
      />

      {/* 2. Conteúdo Principal */}
      <main className="flex-1">
        
        {/* Hero Section de Alto Impacto */}
        <LandingHero 
          onEnterApp={onEnterApp} 
          onOpenPitchModal={() => setIsPitchModalOpen(true)} 
        />

        {/* Problema vs Solução (O Caos vs Na Prancheta) */}
        <LandingProblemSolution />

        {/* Showcase Interativo dos 5 Pilares */}
        <LandingFeatureShowcase onEnterApp={onEnterApp} />

        {/* Tese de Mercado & Oportunidade TAM/SAM/SOM */}
        <LandingMarketThesis />

        {/* Modelo de Negócios (4 Motores de Monetização) */}
        <LandingBusinessModel onOpenPitchModal={() => setIsPitchModalOpen(true)} />

        {/* Calculadora Interativa de Economia & ROI da Rodada */}
        <LandingROICalculator onEnterApp={onEnterApp} />

        {/* Validação de Vestiário & Prova Social */}
        <LandingSocialProof />

      </main>

      {/* 3. Rodapé Institucional */}
      <LandingFooter 
        onEnterApp={onEnterApp} 
        onOpenPitchModal={() => setIsPitchModalOpen(true)} 
      />

      {/* 4. Modal de Captação de Leads de Investidores */}
      <LandingLeadModal 
        isOpen={isPitchModalOpen} 
        onClose={() => setIsPitchModalOpen(false)} 
      />

    </div>
  );
};
