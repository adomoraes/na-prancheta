<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LegacyInitialDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // 1. TIME PRINCIPAL
            $timeId = '11111111-1111-1111-1111-111111111111';
            DB::table('times')->updateOrInsert(
                ['id' => $timeId],
                [
                    'nome' => 'Os Canabis F.C.',
                    'escudo_url' => 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&q=80',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // 2. POSIÇÕES TÁTICAS 4-3-3
            $posicoes = [
                ['id' => 1, 'nome' => 'Goleiro', 'sigla' => 'GOL', 'coord_x_percent' => 50, 'coord_y_percent' => 90],
                ['id' => 2, 'nome' => 'Lateral Direito', 'sigla' => 'LAD', 'coord_x_percent' => 85, 'coord_y_percent' => 70],
                ['id' => 3, 'nome' => 'Zagueiro Direito', 'sigla' => 'ZAG_DIR', 'coord_x_percent' => 62, 'coord_y_percent' => 75],
                ['id' => 4, 'nome' => 'Zagueiro Esquerdo', 'sigla' => 'ZAG_ESQ', 'coord_x_percent' => 38, 'coord_y_percent' => 75],
                ['id' => 5, 'nome' => 'Lateral Esquerdo', 'sigla' => 'LAE', 'coord_x_percent' => 15, 'coord_y_percent' => 70],
                ['id' => 6, 'nome' => 'Volante', 'sigla' => 'VOL', 'coord_x_percent' => 50, 'coord_y_percent' => 55],
                ['id' => 7, 'nome' => 'Meia Direita', 'sigla' => 'MC_DIR', 'coord_x_percent' => 70, 'coord_y_percent' => 45],
                ['id' => 8, 'nome' => 'Meia Esquerda', 'sigla' => 'MC_ESQ', 'coord_x_percent' => 30, 'coord_y_percent' => 45],
                ['id' => 9, 'nome' => 'Ponta Direita', 'sigla' => 'PTD', 'coord_x_percent' => 80, 'coord_y_percent' => 25],
                ['id' => 10, 'nome' => 'Centroavante', 'sigla' => 'CA', 'coord_x_percent' => 50, 'coord_y_percent' => 20],
                ['id' => 11, 'nome' => 'Ponta Esquerda', 'sigla' => 'PTE', 'coord_x_percent' => 20, 'coord_y_percent' => 25],
            ];
            foreach ($posicoes as $pos) {
                DB::table('posicoes_campo')->updateOrInsert(['id' => $pos['id']], $pos);
            }

            // 3. ELENCO & USUÁRIOS
            $atletasRaw = [
                ['id_num' => 1, 'nome' => 'Lucas Silva', 'apelido' => 'Lucão', 'phone' => '11987654321', 'camisa' => 1, 'pos_p' => 'GOL', 'pos_s' => 'ZAG', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 2, 'nome' => 'Rodrigo Medeiros', 'apelido' => 'Digão', 'phone' => '11976543210', 'camisa' => 3, 'pos_p' => 'ZAG', 'pos_s' => 'VOL', 'vinculo' => 'mensalista', 'role' => 'admin', 'atrasado' => false],
                ['id_num' => 3, 'nome' => 'Felipe Santos', 'apelido' => 'Felipinho', 'phone' => '11965432109', 'camisa' => 2, 'pos_p' => 'LAD', 'pos_s' => 'MC', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 4, 'nome' => 'Gabriel Costa', 'apelido' => 'Biel', 'phone' => '11954321098', 'camisa' => 4, 'pos_p' => 'ZAG', 'pos_s' => 'LAE', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 5, 'nome' => 'Thiago Oliveira', 'apelido' => 'Thiaguinho', 'phone' => '11943210987', 'camisa' => 6, 'pos_p' => 'LAE', 'pos_s' => 'MEI', 'vinculo' => 'mensalista', 'role' => 'tesoureiro', 'atrasado' => false],
                ['id_num' => 6, 'nome' => 'Bruno Ferreira', 'apelido' => 'Brunão', 'phone' => '11932109876', 'camisa' => 5, 'pos_p' => 'VOL', 'pos_s' => 'ZAG', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 7, 'nome' => 'Danilo Lima', 'apelido' => 'Dan', 'phone' => '11921098765', 'camisa' => 8, 'pos_p' => 'MC', 'pos_s' => 'VOL', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 8, 'nome' => 'André Souza', 'apelido' => 'Deco', 'phone' => '11910987654', 'camisa' => 10, 'pos_p' => 'MEI', 'pos_s' => 'PTE', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 9, 'nome' => 'Rafael Barbosa', 'apelido' => 'Rafinha', 'phone' => '11909876543', 'camisa' => 7, 'pos_p' => 'PTD', 'pos_s' => 'MC', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 10, 'nome' => 'Matheus Castro', 'apelido' => 'Theus', 'phone' => '11998765432', 'camisa' => 9, 'pos_p' => 'CA', 'pos_s' => 'PTD', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 11, 'nome' => 'Gustavo Martins', 'apelido' => 'Guga', 'phone' => '11987651122', 'camisa' => 11, 'pos_p' => 'PTE', 'pos_s' => 'MC', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 12, 'nome' => 'Leonardo Prado', 'apelido' => 'Léo', 'phone' => '11976542233', 'camisa' => 19, 'pos_p' => 'CA', 'pos_s' => 'PTD', 'vinculo' => 'convidado', 'role' => 'atleta', 'atrasado' => true],
                ['id_num' => 13, 'nome' => 'Vinícius Rocha', 'apelido' => 'Vini', 'phone' => '11965433344', 'camisa' => 14, 'pos_p' => 'VOL', 'pos_s' => 'LAD', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 14, 'nome' => 'Carlos Eduardo', 'apelido' => 'Kadu', 'phone' => '11954324455', 'camisa' => 13, 'pos_p' => 'ZAG', 'pos_s' => 'LAD', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
                ['id_num' => 15, 'nome' => 'Marcelo Pires', 'apelido' => 'Marcelinho', 'phone' => '11943215566', 'camisa' => 12, 'pos_p' => 'GOL', 'pos_s' => 'ZAG', 'vinculo' => 'mensalista', 'role' => 'atleta', 'atrasado' => false],
            ];

            $userIdMap = [];
            $atletaIdMap = [];
            $passwordHash = Hash::make('na-prancheta-2026');

            foreach ($atletasRaw as $raw) {
                $numHex = str_pad(dechex($raw['id_num']), 12, '0', STR_PAD_LEFT);
                $userId = "00000000-0000-0000-0001-{$numHex}";
                $atletaId = "00000000-0000-0000-0002-{$numHex}";

                $userIdMap[$raw['id_num']] = $userId;
                $atletaIdMap[$raw['id_num']] = $atletaId;

                DB::table('users')->updateOrInsert(
                    ['id' => $userId],
                    [
                        'name' => $raw['nome'],
                        'phone' => $raw['phone'],
                        'email' => Str::slug($raw['apelido']) . '@naprancheta.com.br',
                        'password' => $passwordHash,
                        'role' => $raw['role'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                DB::table('atletas')->updateOrInsert(
                    ['id' => $atletaId],
                    [
                        'time_id' => $timeId,
                        'user_id' => $userId,
                        'nome' => $raw['nome'],
                        'apelido' => $raw['apelido'],
                        'numero_camisa' => $raw['camisa'],
                        'posicao_principal' => $raw['pos_p'],
                        'posicao_secundaria' => $raw['pos_s'],
                        'tipo_vinculo' => $raw['vinculo'],
                        'ativo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // 4. PARTIDA PRINCIPAL
            $partidaId = '33333333-3333-3333-3333-333333333333';
            DB::table('partidas')->updateOrInsert(
                ['id' => $partidaId],
                [
                    'time_id' => $timeId,
                    'adversario' => 'União Alvinegra F.C.',
                    'data_partida' => now()->addDays(2)->format('Y-m-d'),
                    'horario_inicio' => '10:00:00',
                    'horario_chegada_t70' => '08:50:00',
                    'horario_prelecao_t35' => '09:25:00',
                    'local_nome' => 'Arena Soccer Ville — Campo 1 Oficial',
                    'local_endereco' => 'Av. do Futebol, 1000 - São Paulo/SP',
                    'local_maps_url' => 'https://maps.google.com/?q=Arena+Soccer+Ville',
                    'cor_uniforme' => 'Branco com Faixa Diagonal (Goleiro Cinza)',
                    'limite_confirmados' => 16,
                    'meta_arrecadacao_centavos' => 30000,
                    'valor_cota_centavos' => 2500,
                    'chave_pix_cobranca' => 'tesoureiro@naprancheta.com.br',
                    'status' => 'pre_jogo',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // 5. CONFIRMAÇÕES DE PRESENÇA & VAQUINHA
            $tesoureiroUserId = $userIdMap[5]; // Thiaguinho
            foreach ($atletasRaw as $raw) {
                $atletaId = $atletaIdMap[$raw['id_num']];
                $presencaId = "00000000-0000-0000-0004-" . str_pad(dechex($raw['id_num']), 12, '0', STR_PAD_LEFT);
                $vaquinhaId = "00000000-0000-0000-0005-" . str_pad(dechex($raw['id_num']), 12, '0', STR_PAD_LEFT);

                // Confirmação
                DB::table('confirmacoes_presenca')->updateOrInsert(
                    ['id' => $presencaId],
                    [
                        'partida_id' => $partidaId,
                        'atleta_id' => $atletaId,
                        'status' => 'confirmado',
                        'atrasado_prelecao_t35' => $raw['atrasado'],
                        'chegou_vestiario_em' => now()->subMinutes(50),
                        'respondido_em' => now()->subDay(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                // Lançamento Financeiro
                $pago = ($raw['id_num'] <= 8);
                DB::table('vaquinha_lancamentos')->updateOrInsert(
                    ['id' => $vaquinhaId],
                    [
                        'partida_id' => $partidaId,
                        'atleta_id' => $atletaId,
                        'valor_devido_centavos' => 2500,
                        'status' => $pago ? 'pago' : 'pendente',
                        'pago_em' => $pago ? now()->subHours(3) : null,
                        'tesoureiro_id' => $pago ? $tesoureiroUserId : null,
                        'metodo_pagamento' => 'pix',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // 6. ITENS DO ALMOXARIFADO
            $itens = [
                ['id' => '00000000-0000-0000-0006-000000000001', 'time_id' => $timeId, 'nome' => 'Mala 1 — Fardamento Principal (Branco/Verde)', 'categoria' => 'uniforme', 'quantidade_total' => 22, 'estado_conservacao' => 'bom'],
                ['id' => '00000000-0000-0000-0006-000000000002', 'time_id' => $timeId, 'nome' => 'Mala 2 — Fardamento Reserva (Azul Marinho)', 'categoria' => 'uniforme', 'quantidade_total' => 22, 'estado_conservacao' => 'excelente'],
                ['id' => '00000000-0000-0000-0006-000000000003', 'time_id' => $timeId, 'nome' => 'Bolsão com 6 Bolas Oficiais Penalty Campo', 'categoria' => 'bola', 'quantidade_total' => 6, 'estado_conservacao' => 'bom'],
                ['id' => '00000000-0000-0000-0006-000000000004', 'time_id' => $timeId, 'nome' => 'Kit Aquecimento (Cones e Pratos)', 'categoria' => 'treino_cones', 'quantidade_total' => 1, 'estado_conservacao' => 'bom'],
            ];
            foreach ($itens as $item) {
                DB::table('itens_almoxarifado')->updateOrInsert(['id' => $item['id']], $item);
            }

            // 7. CONFERÊNCIA DE MALAS & TRAVA DA RESENHA
            $kaduUserId = $userIdMap[14]; // Carlos Eduardo (Kadu)
            DB::table('conferencias_malas')->updateOrInsert(
                ['partida_id' => $partidaId],
                [
                    'id' => '77777777-7777-7777-7777-777777777777',
                    'custodiante_id' => $kaduUserId,
                    'camisas_recolhidas' => 22,
                    'todas_camisas_desviradas' => true,
                    'bolas_recolhidas' => 6,
                    'kit_cones_recolhido' => true,
                    'mala_trancada_no_carro' => true,
                    'resenha_liberada' => true,
                    'liberada_em' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // 8. SCOUTS & ELEIÇÃO DE MVP (Matheus / Theus como MVP único)
            $scouts = [
                ['id_num' => 10, 'gols' => 2, 'assistencias' => 1, 'ca' => 0, 'cv' => 0, 'gs' => 0, 'min' => 40, 'mvp' => true],
                ['id_num' => 8,  'gols' => 1, 'assistencias' => 2, 'ca' => 1, 'cv' => 0, 'gs' => 0, 'min' => 45, 'mvp' => false],
                ['id_num' => 9,  'gols' => 1, 'assistencias' => 0, 'ca' => 0, 'cv' => 0, 'gs' => 0, 'min' => 40, 'mvp' => false],
                ['id_num' => 1,  'gols' => 0, 'assistencias' => 0, 'ca' => 0, 'cv' => 0, 'gs' => 1, 'min' => 50, 'mvp' => false],
            ];
            foreach ($scouts as $sc) {
                $atletaId = $atletaIdMap[$sc['id_num']];
                $scoutId = "00000000-0000-0000-0008-" . str_pad(dechex($sc['id_num']), 12, '0', STR_PAD_LEFT);
                DB::table('scouts_partida')->updateOrInsert(
                    ['id' => $scoutId],
                    [
                        'partida_id' => $partidaId,
                        'atleta_id' => $atletaId,
                        'gols' => $sc['gols'],
                        'assistencias' => $sc['assistencias'],
                        'cartoes_amarelos' => $sc['ca'],
                        'cartoes_vermelhos' => $sc['cv'],
                        'gols_sofridos_goleiro' => $sc['gs'],
                        'minutos_jogados' => $sc['min'],
                        'foi_mvp' => $sc['mvp'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        });
    }
}
