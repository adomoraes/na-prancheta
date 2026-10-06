<?php

namespace Database\Seeders;

use App\Models\Plano;
use App\Models\Time;
use Illuminate\Database\Seeder;

class PlanosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $planoAmador = Plano::updateOrCreate(
            ['slug' => 'amador'],
            [
                'nome' => 'Plano Amador',
                'descricao' => 'Ideal para 1 elenco e até 25 atletas com gestão de jogos e vaquinha.',
                'preco_mensal_centavos' => 4990,
                'preco_anual_centavos' => 49900,
                'max_elencos' => 1,
                'max_atletas' => 25,
                'recursos' => [
                    'Prancheta Tática 4-3-3',
                    'Controle de Vestiário T-35',
                    'Vaquinha PIX de Arbitragem',
                    'Almoxarifado e Fechamento de Malas',
                ],
                'ativo' => true,
            ]
        );

        $planoCampeao = Plano::updateOrCreate(
            ['slug' => 'campeao'],
            [
                'nome' => 'Plano Campeão',
                'descricao' => 'Até 3 elencos, 80 atletas e scouts avançados de finalizações e minutagem.',
                'preco_mensal_centavos' => 9990,
                'preco_anual_centavos' => 99900,
                'max_elencos' => 3,
                'max_atletas' => 80,
                'recursos' => [
                    'Tudo do Plano Amador',
                    'Scouts Completos e Leaderboard',
                    'Até 3 Elencos (Principal, Veterano, Quadro B)',
                    'Histórico Completo de Partidas',
                ],
                'ativo' => true,
            ]
        );

        $planoLiga = Plano::updateOrCreate(
            ['slug' => 'liga'],
            [
                'nome' => 'Plano Liga',
                'descricao' => 'Elencos ilimitados, atletas ilimitados e múltiplos gestores com suporte dedicado.',
                'preco_mensal_centavos' => 19990,
                'preco_anual_centavos' => 199900,
                'max_elencos' => 999,
                'max_atletas' => 9999,
                'recursos' => [
                    'Tudo do Plano Campeão',
                    'Elencos e Atletas Ilimitados',
                    'Múltiplos Administradores e Comissão Técnica',
                    'Suporte Prioritário Via WhatsApp',
                ],
                'ativo' => true,
            ]
        );

        // Garante que o time fundador legado receba o Plano Liga e status ativo
        $timesLegados = Time::whereNull('plano_id')->get();
        foreach ($timesLegados as $time) {
            $time->update([
                'plano_id' => $planoLiga->id,
                'status' => 'ativo',
                'slug' => $time->slug ?? 'na-prancheta-fc',
                'sigla' => $time->sigla ?? 'NPFC',
                'cor_primaria' => $time->cor_primaria ?? '#10b981',
                'cor_secundaria' => $time->cor_secundaria ?? '#0f172a',
            ]);
        }
    }
}
