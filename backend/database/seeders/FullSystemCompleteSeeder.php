<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FullSystemCompleteSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $passwordHash = Hash::make('na-prancheta-2026');

            // Remove partida legada pontual de seed antigo, se existir
            DB::table('partidas')->where('id', '33333333-3333-3333-3333-333333333333')->delete();

            // ==============================================================================
            // 1. TIME PRINCIPAL
            // ==============================================================================
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

            // ==============================================================================
            // 2. POSIÇÕES TÁTICAS DO CAMPO (FORMAÇÃO 4-3-3 PADRÃO)
            // ==============================================================================
            $posicoes = [
                ['id' => 1,  'nome' => 'Goleiro',           'sigla' => 'GOL',     'coord_x_percent' => 50, 'coord_y_percent' => 90],
                ['id' => 2,  'nome' => 'Lateral Direito',   'sigla' => 'LAD',     'coord_x_percent' => 85, 'coord_y_percent' => 70],
                ['id' => 3,  'nome' => 'Zagueiro Direito',  'sigla' => 'ZAG_DIR', 'coord_x_percent' => 62, 'coord_y_percent' => 75],
                ['id' => 4,  'nome' => 'Zagueiro Esquerdo', 'sigla' => 'ZAG_ESQ', 'coord_x_percent' => 38, 'coord_y_percent' => 75],
                ['id' => 5,  'nome' => 'Lateral Esquerdo',  'sigla' => 'LAE',     'coord_x_percent' => 15, 'coord_y_percent' => 70],
                ['id' => 6,  'nome' => 'Volante',           'sigla' => 'VOL',     'coord_x_percent' => 50, 'coord_y_percent' => 55],
                ['id' => 7,  'nome' => 'Meia Direita',      'sigla' => 'MC_DIR',  'coord_x_percent' => 70, 'coord_y_percent' => 45],
                ['id' => 8,  'nome' => 'Meia Esquerda',     'sigla' => 'MC_ESQ',  'coord_x_percent' => 30, 'coord_y_percent' => 45],
                ['id' => 9,  'nome' => 'Ponta Direita',     'sigla' => 'PTD',     'coord_x_percent' => 80, 'coord_y_percent' => 25],
                ['id' => 10, 'nome' => 'Centroavante',      'sigla' => 'CA',      'coord_x_percent' => 50, 'coord_y_percent' => 20],
                ['id' => 11, 'nome' => 'Ponta Esquerda',    'sigla' => 'PTE',     'coord_x_percent' => 20, 'coord_y_percent' => 25],
            ];
            foreach ($posicoes as $pos) {
                DB::table('posicoes_campo')->updateOrInsert(['id' => $pos['id']], $pos);
            }

            // ==============================================================================
            // 3. USUÁRIO ROOT MESTRE
            // ==============================================================================
            $existingRoot = DB::table('users')->where('email', 'root@naprancheta.com.br')->first();
            $rootUserId = $existingRoot ? $existingRoot->id : '00000000-0000-0000-0000-000000000001';
            DB::table('users')->updateOrInsert(
                ['email' => 'root@naprancheta.com.br'],
                [
                    'id' => $rootUserId,
                    'name' => 'Administrador Root',
                    'phone' => '11999990000',
                    'password' => $passwordHash,
                    'role' => 'root',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // ==============================================================================
            // 4. ELENCO DE 22 ATLETAS COM PERFIS, ROLES E NÚMEROS DE CALÇADO
            // ==============================================================================
            $elencoConfig = [
                ['id' => 1,  'nome' => 'Lucas Silva',        'apelido' => 'Lucão',      'camisa' => 1,  'pos_p' => 'GOL', 'pos_s' => 'ZAG', 'calcado' => 43, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 2,  'nome' => 'Rodrigo Medeiros',   'apelido' => 'Digão',      'camisa' => 3,  'pos_p' => 'ZAG', 'pos_s' => 'VOL', 'calcado' => 42, 'vinculo' => 'mensalista', 'role' => 'geral'],
                ['id' => 3,  'nome' => 'Felipe Santos',      'apelido' => 'Felipinho',  'camisa' => 2,  'pos_p' => 'LAD', 'pos_s' => 'MC',  'calcado' => 40, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 4,  'nome' => 'Gabriel Costa',      'apelido' => 'Biel',       'camisa' => 4,  'pos_p' => 'ZAG', 'pos_s' => 'LAE', 'calcado' => 41, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 5,  'nome' => 'Thiago Oliveira',    'apelido' => 'Thiaguinho', 'camisa' => 6,  'pos_p' => 'LAE', 'pos_s' => 'MEI', 'calcado' => 39, 'vinculo' => 'mensalista', 'role' => 'financeiro'],
                ['id' => 6,  'nome' => 'Bruno Ferreira',     'apelido' => 'Brunão',     'camisa' => 5,  'pos_p' => 'VOL', 'pos_s' => 'ZAG', 'calcado' => 42, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 7,  'nome' => 'Danilo Lima',        'apelido' => 'Dan',        'camisa' => 8,  'pos_p' => 'MC',  'pos_s' => 'VOL', 'calcado' => 41, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 8,  'nome' => 'André Souza',        'apelido' => 'Deco',       'camisa' => 10, 'pos_p' => 'MEI', 'pos_s' => 'PTE', 'calcado' => 40, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 9,  'nome' => 'Rafael Barbosa',     'apelido' => 'Rafinha',    'camisa' => 7,  'pos_p' => 'PTD', 'pos_s' => 'MC',  'calcado' => 39, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 10, 'nome' => 'Matheus Castro',     'apelido' => 'Theus',      'camisa' => 9,  'pos_p' => 'CA',  'pos_s' => 'PTD', 'calcado' => 42, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 11, 'nome' => 'Gustavo Martins',    'apelido' => 'Guga',       'camisa' => 11, 'pos_p' => 'PTE', 'pos_s' => 'MC',  'calcado' => 41, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 12, 'nome' => 'Leonardo Prado',     'apelido' => 'Léo',        'camisa' => 19, 'pos_p' => 'CA',  'pos_s' => 'PTD', 'calcado' => 43, 'vinculo' => 'convidado',  'role' => 'atleta'],
                ['id' => 13, 'nome' => 'Vinícius Rocha',     'apelido' => 'Vini',       'camisa' => 14, 'pos_p' => 'VOL', 'pos_s' => 'LAD', 'calcado' => 40, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 14, 'nome' => 'Carlos Eduardo',     'apelido' => 'Kadu',       'camisa' => 13, 'pos_p' => 'ZAG', 'pos_s' => 'LAD', 'calcado' => 42, 'vinculo' => 'mensalista', 'role' => 'almoxarifado'],
                ['id' => 15, 'nome' => 'Marcelo Pires',      'apelido' => 'Marcelinho', 'camisa' => 12, 'pos_p' => 'GOL', 'pos_s' => 'ZAG', 'calcado' => 43, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 16, 'nome' => 'José Carlos',        'apelido' => 'Zé Carlos',  'camisa' => 15, 'pos_p' => 'ZAG', 'pos_s' => 'VOL', 'calcado' => 44, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 17, 'nome' => 'Renato Silveira',    'apelido' => 'Renatinho',  'camisa' => 16, 'pos_p' => 'LAD', 'pos_s' => 'PTD', 'calcado' => 39, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 18, 'nome' => 'Paulo Henrique',     'apelido' => 'Paulinho',   'camisa' => 17, 'pos_p' => 'LAE', 'pos_s' => 'PTE', 'calcado' => 40, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 19, 'nome' => 'Wilson Junqueira',   'apelido' => 'Juninho',    'camisa' => 18, 'pos_p' => 'VOL', 'pos_s' => 'MC',  'calcado' => 41, 'vinculo' => 'mensalista', 'role' => 'atleta'],
                ['id' => 20, 'nome' => 'Alexandre Nogueira', 'apelido' => 'Magrão',     'camisa' => 22, 'pos_p' => 'GOL', 'pos_s' => 'VOL', 'calcado' => 44, 'vinculo' => 'avulso',      'role' => 'atleta'],
                ['id' => 21, 'nome' => 'Diego Alves',        'apelido' => 'Nenê',       'camisa' => 20, 'pos_p' => 'MEI', 'pos_s' => 'CA',  'calcado' => 41, 'vinculo' => 'mensalista', 'role' => 'tecnico'],
                ['id' => 22, 'nome' => 'Gilberto Santos',    'apelido' => 'Baiano',     'camisa' => 21, 'pos_p' => 'PTD', 'pos_s' => 'CA',  'calcado' => 42, 'vinculo' => 'avulso',      'role' => 'atleta'],
            ];

            $userIdMap = [];
            $atletaIdMap = [];

            foreach ($elencoConfig as $item) {
                $idNum = $item['id'];
                $slugApelido = Str::slug($item['apelido']);
                $email = "{$slugApelido}@naprancheta.com.br";

                $existingUser = DB::table('users')->where('email', $email)->first();
                $userId = $existingUser ? $existingUser->id : sprintf('00000000-0000-0000-0001-%012x', $idNum);

                $userIdMap[$idNum] = $userId;
                $phone = sprintf('119%08d', 80000000 + $idNum * 1234);

                DB::table('users')->updateOrInsert(
                    ['email' => $email],
                    [
                        'id' => $userId,
                        'name' => $item['nome'],
                        'phone' => $phone,
                        'password' => $passwordHash,
                        'role' => $item['role'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                $existingAtleta = DB::table('atletas')->where('user_id', $userId)->first();
                $atletaId = $existingAtleta ? $existingAtleta->id : sprintf('00000000-0000-0000-0002-%012x', $idNum);
                $atletaIdMap[$idNum] = $atletaId;

                DB::table('atletas')->updateOrInsert(
                    ['id' => $atletaId],
                    [
                        'time_id' => $timeId,
                        'user_id' => $userId,
                        'nome' => $item['nome'],
                        'apelido' => $item['apelido'],
                        'numero_camisa' => $item['camisa'],
                        'posicao_principal' => $item['pos_p'],
                        'posicao_secundaria' => $item['pos_s'],
                        'tipo_vinculo' => $item['vinculo'],
                        'numero_calcado' => $item['calcado'],
                        'ativo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            $tesoureiroUserId = $userIdMap[5]; // Thiaguinho (financeiro)
            $almoxarifeUserId = $userIdMap[14]; // Kadu (almoxarifado)

            // ==============================================================================
            // 5. LOCAIS & CAMPOS
            // ==============================================================================
            $locaisConfig = [
                [
                    'num' => 1,
                    'nome' => 'Arena Soccer Ville — Campo 1 Oficial',
                    'endereco' => 'Av. do Futebol, 1000 - São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=Arena+Soccer+Ville',
                    'tipo_piso' => 'Grama Sintética',
                    'observacoes' => 'Campo coberto com vestiários amplos e estacionamento.',
                ],
                [
                    'num' => 2,
                    'nome' => 'Playball Pompeia — Campo Society 2',
                    'endereco' => 'Rua Nicholas Boer, 120 - Pompeia, São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=Playball+Pompeia',
                    'tipo_piso' => 'Society',
                    'observacoes' => 'Área de churrasqueira, vestiário e bar no local.',
                ],
                [
                    'num' => 3,
                    'nome' => 'Gol de Placa Arena — Campo Premium',
                    'endereco' => 'Rua das Palmeiras, 450 - Tatuapé, São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=Gol+de+Placa+Arena',
                    'tipo_piso' => 'Grama Sintética',
                    'observacoes' => 'Gramado recém-trocado com amortecimento profissional.',
                ],
                [
                    'num' => 4,
                    'nome' => 'Espaço Bola de Ouro — Campo Central',
                    'endereco' => 'Av. Santo Amaro, 2300 - Brooklin, São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=Espaco+Bola+de+Ouro',
                    'tipo_piso' => 'Grama Natural',
                    'observacoes' => 'Campo aberto oficial. Travar chuteiras com travas de borracha.',
                ],
                [
                    'num' => 5,
                    'nome' => 'CDC Parque da Mooca — Campo 1',
                    'endereco' => 'Rua Taquari, 549 - Mooca, São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=CDC+Parque+da+Mooca',
                    'tipo_piso' => 'Grama Sintética',
                    'observacoes' => 'Excelente iluminação noturna e arquibancada coberta.',
                ],
                [
                    'num' => 6,
                    'nome' => 'Arena Anchieta — Quadra Coberta',
                    'endereco' => 'Via Anchieta, Km 12 - Sacomã, São Paulo/SP',
                    'maps_url' => 'https://maps.google.com/?q=Arena+Anchieta',
                    'tipo_piso' => 'Grama Sintética',
                    'observacoes' => 'Piso coberto anti-chuva, ideal para dias chuvosos.',
                ],
            ];

            $localIdMap = [];
            foreach ($locaisConfig as $loc) {
                $existingLoc = DB::table('locais')
                    ->where('time_id', $timeId)
                    ->where('nome', $loc['nome'])
                    ->first();
                $localId = $existingLoc ? $existingLoc->id : sprintf('22222222-2222-2222-0000-%012x', $loc['num']);
                $localIdMap[$loc['num']] = $localId;

                DB::table('locais')->updateOrInsert(
                    ['id' => $localId],
                    [
                        'time_id' => $timeId,
                        'nome' => $loc['nome'],
                        'endereco' => $loc['endereco'],
                        'maps_url' => $loc['maps_url'],
                        'tipo_piso' => $loc['tipo_piso'],
                        'observacoes' => $loc['observacoes'],
                        'ativo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // ==============================================================================
            // 6. ADVERSÁRIOS & RIVAIS
            // ==============================================================================
            $adversariosConfig = [
                ['num' => 1,  'nome' => 'União Alvinegra F.C.',   'resp' => 'Toninho Diretor', 'tel' => '11988887777', 'cor' => 'Preto e Branco',    'obs' => 'Rival clássico regional. Jogo pegado e truncado.'],
                ['num' => 2,  'nome' => 'Vila Real F.C.',         'resp' => 'Danilo Capitão',  'tel' => '11977776666', 'cor' => 'Azul e Amarelo',    'obs' => 'Time jovem e rápido no contra-ataque.'],
                ['num' => 3,  'nome' => 'Real Madruga F.C.',      'resp' => 'Seu Madruga',     'tel' => '11966665555', 'cor' => 'Laranja e Preto',    'obs' => 'Muita resenha e bom toque de bola no meio.'],
                ['num' => 4,  'nome' => 'Ajax do Morro',          'resp' => 'Marcos Alemão',   'tel' => '11955554444', 'cor' => 'Vermelho e Branco',  'obs' => 'Time forte fisicamente com bola aérea perigosa.'],
                ['num' => 5,  'nome' => 'Unidos da Vila F.C.',    'resp' => 'Beto Presidente', 'tel' => '11944443333', 'cor' => 'Verde e Amarelo',   'obs' => 'Adversário tradicional em amistosos matinais.'],
                ['num' => 6,  'nome' => 'Meninos da Colina',      'resp' => 'Vaguinho',        'tel' => '11933332222', 'cor' => 'Vinho e Dourado',   'obs' => 'Equipe experiente com veteranos qualificados.'],
                ['num' => 7,  'nome' => 'Só Canela F.C.',         'resp' => 'Chicão Zagueiro', 'tel' => '11922221111', 'cor' => 'Cinza e Azul',      'obs' => 'Jogo pegado com forte marcação individual.'],
                ['num' => 8,  'nome' => 'Chelsea da Quebrada',    'resp' => 'Dinho',           'tel' => '11911110000', 'cor' => 'Azul Royal',        'obs' => 'Ataque veloz com pontas habilidosos.'],
                ['num' => 9,  'nome' => 'Família & Bola F.C.',    'resp' => 'Zezinho',         'tel' => '11900009999', 'cor' => 'Bordô e Branco',    'obs' => 'Time família, muito disciplinado em campo.'],
                ['num' => 10, 'nome' => 'Estrela do Norte E.C.',  'resp' => 'Carlão',          'tel' => '11999998888', 'cor' => 'Amarelo e Preto',   'obs' => 'Campanha forte no campeonato da várzea.'],
            ];

            $adversarioIdMap = [];
            foreach ($adversariosConfig as $adv) {
                $existingAdv = DB::table('adversarios')
                    ->where('time_id', $timeId)
                    ->where('nome', $adv['nome'])
                    ->first();
                $advId = $existingAdv ? $existingAdv->id : sprintf('44444444-4444-4444-0000-%012x', $adv['num']);
                $adversarioIdMap[$adv['num']] = $advId;

                DB::table('adversarios')->updateOrInsert(
                    ['id' => $advId],
                    [
                        'time_id' => $timeId,
                        'nome' => $adv['nome'],
                        'responsavel_nome' => $adv['resp'],
                        'responsavel_telefone' => $adv['tel'],
                        'cor_uniforme_principal' => $adv['cor'],
                        'observacoes' => $adv['obs'],
                        'ativo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // ==============================================================================
            // 7. ITENS DO ALMOXARIFADO & PATRIMÔNIO DO TIME
            // ==============================================================================
            $itensAlmoxarifado = [
                [
                    'num' => 1,
                    'nome' => 'Mala 1 — Jogo Oficial Titular (Verde e Branco)',
                    'categoria' => 'uniforme',
                    'tipo_uniforme' => 'camisa',
                    'quantidade_total' => 22,
                    'tamanho' => 'G',
                    'cor' => 'Verde e Branco',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => 'Mala com 22 camisas numeradas do 1 ao 22 completas.',
                ],
                [
                    'num' => 2,
                    'nome' => 'Mala 2 — Jogo Oficial Reserva (Branco com Faixa)',
                    'categoria' => 'uniforme',
                    'tipo_uniforme' => 'camisa',
                    'quantidade_total' => 22,
                    'tamanho' => 'G',
                    'cor' => 'Branco com Faixa Verde',
                    'numero' => null,
                    'estado_conservacao' => 'novo',
                    'observacoes' => 'Segundo uniforme para partidas contra times de uniforme escuro.',
                ],
                [
                    'num' => 3,
                    'nome' => 'Mala 3 — Calções e Meiões Oficiais',
                    'categoria' => 'uniforme',
                    'tipo_uniforme' => 'calcao',
                    'quantidade_total' => 44,
                    'tamanho' => 'G',
                    'cor' => 'Preto / Verde',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => '22 calções pretos e 22 pares de meiões canelados verdes.',
                ],
                [
                    'num' => 4,
                    'nome' => 'Camisa 10 Titular Manga Longa Especial',
                    'categoria' => 'uniforme',
                    'tipo_uniforme' => 'camisa',
                    'quantidade_total' => 1,
                    'tamanho' => 'GG',
                    'cor' => 'Verde Escuro',
                    'numero' => '10',
                    'estado_conservacao' => 'novo',
                    'observacoes' => 'Camisa do capitão/artilheiro Deco.',
                ],
                [
                    'num' => 5,
                    'nome' => 'Bolsão com 8 Bolas Penalty S11 Ecoknit Oficiais',
                    'categoria' => 'bola',
                    'tipo_uniforme' => null,
                    'quantidade_total' => 8,
                    'tamanho' => 'Campo',
                    'cor' => 'Branco e Verde Fluorescente',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => 'Bolas calibradas a 11 lbs.',
                ],
                [
                    'num' => 6,
                    'nome' => 'Kit Aquecimento e Agilidade (Cones e Pratos)',
                    'categoria' => 'treino_cones',
                    'tipo_uniforme' => null,
                    'quantidade_total' => 2,
                    'tamanho' => null,
                    'cor' => 'Amarelo e Laranja',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => '20 cones furados com barreiras e 40 pratinhos demarcatórios.',
                ],
                [
                    'num' => 7,
                    'nome' => 'Jogo de Coletes Dupla Face (Amarelo / Laranja)',
                    'categoria' => 'uniforme',
                    'tipo_uniforme' => 'colete',
                    'quantidade_total' => 14,
                    'tamanho' => 'Único',
                    'cor' => 'Amarelo e Laranja',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => 'Usados no aquecimento t-25 e rachões preparatórios.',
                ],
                [
                    'num' => 8,
                    'nome' => 'Maleta de Primeiros Socorros & Massagem Esportiva',
                    'categoria' => 'acessorios',
                    'tipo_uniforme' => null,
                    'quantidade_total' => 1,
                    'tamanho' => null,
                    'cor' => 'Vermelha',
                    'numero' => null,
                    'estado_conservacao' => 'novo',
                    'observacoes' => 'Bolsa de gelo químico, spray analgésico, esparadrapos e bandagens elásticas.',
                ],
                [
                    'num' => 9,
                    'nome' => 'Garrafão Térmico de Hidratação 12L c/ Torneira',
                    'categoria' => 'acessorios',
                    'tipo_uniforme' => null,
                    'quantidade_total' => 2,
                    'tamanho' => '12L',
                    'cor' => 'Azul',
                    'numero' => null,
                    'estado_conservacao' => 'bom',
                    'observacoes' => 'Mantém isotônico ou água gelada para todo o elenco durante o jogo.',
                ],
                [
                    'num' => 10,
                    'nome' => 'Bomba de Ar Dupla Ação com Manômetro Digital',
                    'categoria' => 'acessorios',
                    'tipo_uniforme' => null,
                    'quantidade_total' => 1,
                    'tamanho' => null,
                    'cor' => 'Preta',
                    'numero' => null,
                    'estado_conservacao' => 'novo',
                    'observacoes' => 'Bomba portátil com agulha e medidor de pressão.',
                ],
            ];

            foreach ($itensAlmoxarifado as $item) {
                $itemId = sprintf('bbbbbbbb-bbbb-bbbb-0000-%012x', $item['num']);
                DB::table('itens_almoxarifado')->updateOrInsert(
                    ['id' => $itemId],
                    [
                        'time_id' => $timeId,
                        'nome' => $item['nome'],
                        'categoria' => $item['categoria'],
                        'tipo_uniforme' => $item['tipo_uniforme'],
                        'quantidade_total' => $item['quantidade_total'],
                        'tamanho' => $item['tamanho'],
                        'cor' => $item['cor'],
                        'numero' => $item['numero'],
                        'estado_conservacao' => $item['estado_conservacao'],
                        'observacoes' => $item['observacoes'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // ==============================================================================
            // 8. CRONOGRAMA DE 30 PARTIDAS (20 PASSADAS + 10 FUTURAS)
            // REGRA: 1 jogo por semana, a cada 3 sábados, 1 domingo
            // ==============================================================================
            $baseStartDate = Carbon::parse('2026-05-16'); // Sábado há 20 semanas

            // Formação padrão de titulares (4-3-3): 11 IDs de atletas por posição
            $titularesBase = [
                1 => 1,   // GOL: Lucão
                2 => 3,   // LAD: Felipinho
                3 => 2,   // ZAG_DIR: Digão
                4 => 4,   // ZAG_ESQ: Biel
                5 => 5,   // LAE: Thiaguinho
                6 => 6,   // VOL: Brunão
                7 => 7,   // MC_DIR: Dan
                8 => 8,   // MC_ESQ: Deco
                9 => 9,   // PTD: Rafinha
                10 => 10, // CA: Theus
                11 => 11, // PTE: Guga
            ];

            // Variação tática ocasional
            $titularesAlternativos = [
                1 => 15,  // GOL: Marcelinho
                2 => 17,  // LAD: Renatinho
                3 => 14,  // ZAG_DIR: Kadu
                4 => 16,  // ZAG_ESQ: Zé Carlos
                5 => 18,  // LAE: Paulinho
                6 => 13,  // VOL: Vini
                7 => 19,  // MC_DIR: Juninho
                8 => 21,  // MC_ESQ: Nenê
                9 => 22,  // PTD: Baiano
                10 => 12, // CA: Léo
                11 => 11, // PTE: Guga
            ];

            for ($i = 0; $i < 30; $i++) {
                $partidaNum = $i + 1;
                $isPassado = ($partidaNum <= 20);

                // Cálculo da Data: 1 jogo por semana, a cada 3 sábados, 1 domingo
                $weekStart = (clone $baseStartDate)->addWeeks($i);
                if ($i % 4 == 3) {
                    $gameDate = (clone $weekStart)->addDay(); // Domingo
                    $horarioInicio = ($i % 2 == 0) ? '09:00:00' : '11:00:00';
                } else {
                    $gameDate = clone $weekStart; // Sábado
                    $horarioInicio = ($i % 2 == 0) ? '10:00:00' : '16:00:00';
                }

                $inicioCarbon = Carbon::parse($gameDate->format('Y-m-d') . ' ' . $horarioInicio);
                $horarioT70 = (clone $inicioCarbon)->subMinutes(70)->format('H:i:s');
                $horarioT35 = (clone $inicioCarbon)->subMinutes(35)->format('H:i:s');

                // Rodízio de Adversários e Locais
                $advIndex = (($i % count($adversariosConfig))) + 1;
                $advData = $adversariosConfig[$advIndex - 1];
                $advId = $adversarioIdMap[$advIndex];

                $locIndex = (($i % count($locaisConfig))) + 1;
                $locData = $locaisConfig[$locIndex - 1];
                $locId = $localIdMap[$locIndex];

                $corUniforme = ($i % 2 == 0) ? 'Verde e Branco (Titular)' : 'Branco com Faixa Diagonal (Reserva)';
                $partidaId = sprintf('33333333-3333-3333-0000-%012x', $partidaNum);

                // Determinação do Status
                if ($isPassado) {
                    $status = 'encerrada';
                } elseif ($partidaNum === 21) {
                    $status = 'escalacao_definida'; // Jogo mais imediato (amanhã)
                } elseif ($partidaNum <= 23) {
                    $status = 'pre_jogo';
                } else {
                    $status = 'agendada';
                }

                // Criação da Partida
                DB::table('partidas')->updateOrInsert(
                    ['id' => $partidaId],
                    [
                        'time_id' => $timeId,
                        'local_id' => $locId,
                        'adversario_id' => $advId,
                        'adversario' => $advData['nome'],
                        'data_partida' => $gameDate->format('Y-m-d'),
                        'horario_inicio' => $horarioInicio,
                        'horario_chegada_t70' => $horarioT70,
                        'horario_prelecao_t35' => $horarioT35,
                        'local_nome' => $locData['nome'],
                        'local_endereco' => $locData['endereco'],
                        'local_maps_url' => $locData['maps_url'],
                        'cor_uniforme' => $corUniforme,
                        'limite_confirmados' => 16,
                        'meta_arrecadacao_centavos' => 40000,
                        'valor_cota_centavos' => 2500,
                        'chave_pix_cobranca' => 'tesoureiro@naprancheta.com.br',
                        'status' => $status,
                        'created_at' => (clone $inicioCarbon)->subDays(7),
                        'updated_at' => now(),
                    ]
                );

                // ==========================================================================
                // 8.1 ESCALAÇÃO TÁTICA DE TITULARES (4-3-3)
                // ==========================================================================
                if ($isPassado || $partidaNum === 21) {
                    $titularesUsados = ($partidaNum % 4 == 0) ? $titularesAlternativos : $titularesBase;
                    foreach ($titularesUsados as $posId => $atletaNum) {
                        $titularId = sprintf('77777777-7777-7777-%04x-%012x', $partidaNum, $posId);
                        DB::table('partida_titulares')->updateOrInsert(
                            ['partida_id' => $partidaId, 'posicao_campo_id' => $posId],
                            [
                                'id' => $titularId,
                                'atleta_id' => $atletaIdMap[$atletaNum],
                                'escalado_em' => (clone $inicioCarbon)->subHours(2),
                            ]
                        );
                    }
                }

                // ==========================================================================
                // 8.2 CONFIRMAÇÕES DE PRESENÇA & VAQUINHA
                // ==========================================================================
                foreach ($elencoConfig as $atletaItem) {
                    $atletaNum = $atletaItem['id'];
                    $atletaId = $atletaIdMap[$atletaNum];

                    $presencaId = sprintf('55555555-5555-5555-%04x-%012x', $partidaNum, $atletaNum);
                    $vaquinhaId = sprintf('66666666-6666-6666-%04x-%012x', $partidaNum, $atletaNum);

                    if ($isPassado) {
                        $isConfirmado = ($atletaNum <= 18 || ($atletaNum + $partidaNum) % 7 != 0);
                        if ($isConfirmado) {
                            $statusPresenca = 'confirmado';
                            $atrasado = ($atletaNum == 12 || ($atletaNum + $partidaNum) % 11 == 0);
                            $chegadaMinutosAntes = $atrasado ? 20 : 60;
                            $chegadaVestiario = (clone $inicioCarbon)->subMinutes($chegadaMinutosAntes);

                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => $statusPresenca,
                                    'atrasado_prelecao_t35' => $atrasado,
                                    'chegou_vestiario_em' => $chegadaVestiario,
                                    'respondido_em' => (clone $inicioCarbon)->subDays(3),
                                    'created_at' => (clone $inicioCarbon)->subDays(5),
                                    'updated_at' => $inicioCarbon,
                                ]
                            );

                            DB::table('vaquinha_lancamentos')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $vaquinhaId,
                                    'valor_devido_centavos' => 2500,
                                    'status' => 'pago',
                                    'pago_em' => (clone $inicioCarbon)->subHours(3),
                                    'tesoureiro_id' => $tesoureiroUserId,
                                    'metodo_pagamento' => 'pix',
                                    'comprovante_ref' => 'PIX-' . strtoupper(Str::random(10)),
                                    'created_at' => (clone $inicioCarbon)->subDays(5),
                                    'updated_at' => $inicioCarbon,
                                ]
                            );
                        } else {
                            $statusPresenca = 'recusado';
                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => $statusPresenca,
                                    'atrasado_prelecao_t35' => false,
                                    'chegou_vestiario_em' => null,
                                    'respondido_em' => (clone $inicioCarbon)->subDays(2),
                                    'created_at' => (clone $inicioCarbon)->subDays(5),
                                    'updated_at' => now(),
                                ]
                            );
                        }
                    } elseif ($partidaNum === 21) {
                        if ($atletaNum <= 15) {
                            $statusPresenca = 'confirmado';
                            $pago = ($atletaNum <= 10);
                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => $statusPresenca,
                                    'atrasado_prelecao_t35' => false,
                                    'chegou_vestiario_em' => null,
                                    'respondido_em' => now()->subDay(),
                                    'created_at' => now()->subDays(3),
                                    'updated_at' => now(),
                                ]
                            );

                            DB::table('vaquinha_lancamentos')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $vaquinhaId,
                                    'valor_devido_centavos' => 2500,
                                    'status' => $pago ? 'pago' : 'pendente',
                                    'pago_em' => $pago ? now()->subHours(5) : null,
                                    'tesoureiro_id' => $pago ? $tesoureiroUserId : null,
                                    'metodo_pagamento' => 'pix',
                                    'comprovante_ref' => $pago ? 'PIX-ANT-' . strtoupper(Str::random(8)) : null,
                                    'created_at' => now()->subDays(3),
                                    'updated_at' => now(),
                                ]
                            );
                        } elseif ($atletaNum <= 17) {
                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => 'duvida',
                                    'atrasado_prelecao_t35' => false,
                                    'chegou_vestiario_em' => null,
                                    'respondido_em' => now()->subHours(6),
                                    'created_at' => now()->subDays(3),
                                    'updated_at' => now(),
                                ]
                            );
                        } elseif ($atletaNum <= 19) {
                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => 'recusado',
                                    'atrasado_prelecao_t35' => false,
                                    'chegou_vestiario_em' => null,
                                    'respondido_em' => now()->subHours(12),
                                    'created_at' => now()->subDays(3),
                                    'updated_at' => now(),
                                ]
                            );
                        } else {
                            DB::table('confirmacoes_presenca')->updateOrInsert(
                                ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                                [
                                    'id' => $presencaId,
                                    'status' => 'pendente',
                                    'atrasado_prelecao_t35' => false,
                                    'chegou_vestiario_em' => null,
                                    'respondido_em' => now()->subDays(2),
                                    'created_at' => now()->subDays(3),
                                    'updated_at' => now(),
                                ]
                            );
                        }
                    } else {
                        $statusPresenca = ($atletaNum <= 12) ? 'confirmado' : 'pendente';
                        DB::table('confirmacoes_presenca')->updateOrInsert(
                            ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                            [
                                'id' => $presencaId,
                                'status' => $statusPresenca,
                                'atrasado_prelecao_t35' => false,
                                'chegou_vestiario_em' => null,
                                'respondido_em' => now(),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        );
                    }
                }

                // ==========================================================================
                // 8.3 CONFERÊNCIA DE MALAS & RESENHA (Apenas partidas passadas)
                // ==========================================================================
                if ($isPassado) {
                    $conferenciaId = sprintf('99999999-9999-9999-0000-%012x', $partidaNum);
                    $liberadaEm = (clone $inicioCarbon)->addHours(2)->addMinutes(15);

                    DB::table('conferencias_malas')->updateOrInsert(
                        ['partida_id' => $partidaId],
                        [
                            'id' => $conferenciaId,
                            'custodiante_id' => $almoxarifeUserId,
                            'camisas_recolhidas' => 22,
                            'todas_camisas_desviradas' => true,
                            'bolas_recolhidas' => 8,
                            'kit_cones_recolhido' => true,
                            'mala_trancada_no_carro' => true,
                            'resenha_liberada' => true,
                            'liberada_em' => $liberadaEm,
                            'created_at' => $inicioCarbon,
                            'updated_at' => $liberadaEm,
                        ]
                    );
                }

                // ==========================================================================
                // 8.4 SCOUTS E MVP (Apenas partidas passadas)
                // ==========================================================================
                if ($isPassado) {
                    $mvpCandidates = [10, 8, 9, 7, 11, 1];
                    $mvpAtletaNum = $mvpCandidates[($partidaNum - 1) % count($mvpCandidates)];
                    $goleiroTitularNum = ($partidaNum % 4 == 0) ? 15 : 1;

                    for ($atletaNum = 1; $atletaNum <= 22; $atletaNum++) {
                        $atletaId = $atletaIdMap[$atletaNum];
                        $scoutId = sprintf('88888888-8888-8888-%04x-%012x', $partidaNum, $atletaNum);

                        $isMvp = ($atletaNum === $mvpAtletaNum);
                        $gols = 0;
                        $assist = 0;
                        $ca = 0;
                        $cv = 0;
                        $gs = 0;
                        $minutos = 0;

                        if ($atletaNum <= 16) {
                            $minutos = rand(45, 90);

                            if ($atletaNum === $goleiroTitularNum) {
                                $gs = ($partidaNum % 3 == 0) ? 0 : rand(1, 2);
                            }

                            if ($atletaNum === 10) {
                                $gols = $isMvp ? rand(2, 3) : rand(0, 2);
                                $assist = rand(0, 1);
                            } elseif ($atletaNum === 8) {
                                $gols = rand(0, 1);
                                $assist = $isMvp ? rand(2, 3) : rand(0, 2);
                            } elseif ($atletaNum === 9 || $atletaNum === 11) {
                                $gols = rand(0, 1);
                                $assist = rand(0, 1);
                            } elseif ($atletaNum === 7 || $atletaNum === 6) {
                                $gols = ($partidaNum % 5 == 0) ? 1 : 0;
                                $ca = ($partidaNum % 4 == 0) ? 1 : 0;
                            } elseif ($atletaNum === 2 || $atletaNum === 4) {
                                $ca = ($partidaNum % 6 == 0) ? 1 : 0;
                            }
                        }

                        DB::table('scouts_partida')->updateOrInsert(
                            ['partida_id' => $partidaId, 'atleta_id' => $atletaId],
                            [
                                'id' => $scoutId,
                                'gols' => $gols,
                                'assistencias' => $assist,
                                'cartoes_amarelos' => $ca,
                                'cartoes_vermelhos' => $cv,
                                'gols_sofridos_goleiro' => $gs,
                                'minutos_jogados' => $minutos,
                                'foi_mvp' => $isMvp,
                                'created_at' => (clone $inicioCarbon)->addHours(2),
                                'updated_at' => (clone $inicioCarbon)->addHours(2),
                            ]
                        );
                    }
                }

                // ==========================================================================
                // 8.5 FLUXO DE CAIXA POR PARTIDA (Apenas partidas passadas)
                // ==========================================================================
                if ($isPassado) {
                    $dataMov = (clone $inicioCarbon)->format('Y-m-d H:i:s');

                    // 1. Entrada: Arrecadação da Vaquinha
                    $arrecadacaoCentavos = 42500; // 17 atletas x R$ 25,00 = R$ 425,00
                    $movEntradaId = sprintf('aaaaaaaa-aaaa-aaaa-%04x-%012x', $partidaNum, 1);
                    DB::table('caixa_movimentacoes')->updateOrInsert(
                        ['id' => $movEntradaId],
                        [
                            'time_id' => $timeId,
                            'partida_id' => $partidaId,
                            'tipo' => 'entrada',
                            'valor_centavos' => $arrecadacaoCentavos,
                            'descricao' => "Arrecadação da vaquinha — Jogo #{$partidaNum} vs {$advData['nome']}",
                            'responsavel_id' => $tesoureiroUserId,
                            'data_movimentacao' => $dataMov,
                            'created_at' => $inicioCarbon,
                            'updated_at' => $inicioCarbon,
                        ]
                    );

                    // 2. Saída: Aluguel da Quadra / Campo
                    $custoCampoCentavos = 30000; // R$ 300,00
                    $movCampoId = sprintf('aaaaaaaa-aaaa-aaaa-%04x-%012x', $partidaNum, 2);
                    DB::table('caixa_movimentacoes')->updateOrInsert(
                        ['id' => $movCampoId],
                        [
                            'time_id' => $timeId,
                            'partida_id' => $partidaId,
                            'tipo' => 'saida',
                            'valor_centavos' => $custoCampoCentavos,
                            'descricao' => "Pagamento de locação do campo — {$locData['nome']} (Jogo #{$partidaNum})",
                            'responsavel_id' => $tesoureiroUserId,
                            'data_movimentacao' => $dataMov,
                            'created_at' => $inicioCarbon,
                            'updated_at' => $inicioCarbon,
                        ]
                    );

                    // 3. Saída: Taxa de Arbitragem
                    $custoArbitragemCentavos = 8000; // R$ 80,00
                    $movArbitragemId = sprintf('aaaaaaaa-aaaa-aaaa-%04x-%012x', $partidaNum, 3);
                    DB::table('caixa_movimentacoes')->updateOrInsert(
                        ['id' => $movArbitragemId],
                        [
                            'time_id' => $timeId,
                            'partida_id' => $partidaId,
                            'tipo' => 'saida',
                            'valor_centavos' => $custoArbitragemCentavos,
                            'descricao' => "Taxa de arbitragem oficial (Jogo #{$partidaNum} vs {$advData['nome']})",
                            'responsavel_id' => $tesoureiroUserId,
                            'data_movimentacao' => $dataMov,
                            'created_at' => $inicioCarbon,
                            'updated_at' => $inicioCarbon,
                        ]
                    );

                    // 4. Saída: Gelo e Bebidas para Hidratação
                    $custoBebidasCentavos = 4500; // R$ 45,00
                    $movBebidasId = sprintf('aaaaaaaa-aaaa-aaaa-%04x-%012x', $partidaNum, 4);
                    DB::table('caixa_movimentacoes')->updateOrInsert(
                        ['id' => $movBebidasId],
                        [
                            'time_id' => $timeId,
                            'partida_id' => $partidaId,
                            'tipo' => 'saida',
                            'valor_centavos' => $custoBebidasCentavos,
                            'descricao' => "Compra de pacotes de gelo e isotônicos — Jogo #{$partidaNum}",
                            'responsavel_id' => $tesoureiroUserId,
                            'data_movimentacao' => $dataMov,
                            'created_at' => $inicioCarbon,
                            'updated_at' => $inicioCarbon,
                        ]
                    );
                }
            }

            // Movimentações avulsas de caixa institucional (Aporte inicial de temporada e Patrocínio)
            $movAporteId = 'aaaaaaaa-aaaa-aaaa-ffff-000000000001';
            DB::table('caixa_movimentacoes')->updateOrInsert(
                ['id' => $movAporteId],
                [
                    'time_id' => $timeId,
                    'partida_id' => null,
                    'tipo' => 'entrada',
                    'valor_centavos' => 150000, // R$ 1.500,00
                    'descricao' => 'Aporte financeiro inicial da diretoria para fundo de reserva e materiais da temporada',
                    'responsavel_id' => $tesoureiroUserId,
                    'data_movimentacao' => Carbon::parse('2026-05-01 10:00:00'),
                    'created_at' => Carbon::parse('2026-05-01 10:00:00'),
                    'updated_at' => Carbon::parse('2026-05-01 10:00:00'),
                ]
            );

            $movPatrocinioId = 'aaaaaaaa-aaaa-aaaa-ffff-000000000002';
            DB::table('caixa_movimentacoes')->updateOrInsert(
                ['id' => $movPatrocinioId],
                [
                    'time_id' => $timeId,
                    'partida_id' => null,
                    'tipo' => 'entrada',
                    'valor_centavos' => 60000, // R$ 600,00
                    'descricao' => 'Cota de patrocínio semestral — Espaço Bar & Distribuidora',
                    'responsavel_id' => $tesoureiroUserId,
                    'data_movimentacao' => Carbon::parse('2026-06-01 14:00:00'),
                    'created_at' => Carbon::parse('2026-06-01 14:00:00'),
                    'updated_at' => Carbon::parse('2026-06-01 14:00:00'),
                ]
            );

            // ==============================================================================
            // 9. INVESTIDORES E LEADS DE PATROCÍNIO
            // ==============================================================================
            $investorLeads = [
                [
                    'nome' => 'Cervejaria Artesanal Canabis',
                    'email' => 'comercial@cervejariacanabis.com.br',
                    'telefone' => '11988881234',
                    'tipo_investidor' => 'outro',
                    'ticket_estimado' => 'ate_50k',
                    'mensagem' => 'Interesse em patrocínio master de peito nas camisas e chopp oficial na resenha.',
                    'status' => 'reuniao_agendada',
                ],
                [
                    'nome' => 'SportTech Ventures Brasil',
                    'email' => 'investments@sporttechvc.com',
                    'telefone' => '11977772345',
                    'tipo_investidor' => 'fundo_vc',
                    'ticket_estimado' => '200k_1m',
                    'mensagem' => 'Avaliando rodada Seed para plataforma digital de gestão de times e ligas amadoras.',
                    'status' => 'em_contato',
                ],
                [
                    'nome' => 'Arena Soccer Ville Complexo Esportivo',
                    'email' => 'diretoria@arenasoccerville.com.br',
                    'telefone' => '11966663456',
                    'tipo_investidor' => 'arena_liga',
                    'ticket_estimado' => 'parceria_comercial',
                    'mensagem' => 'Proposta de desconto exclusivo de 30% em horários nobres de fins de semana.',
                    'status' => 'em_contato',
                ],
                [
                    'nome' => 'Dr. Rodrigo Medeiros Fisioterapia & Ortopedia',
                    'email' => 'clinica@drrodrigomedeiros.com.br',
                    'telefone' => '11955554567',
                    'tipo_investidor' => 'anjo',
                    'ticket_estimado' => '50k_200k',
                    'mensagem' => 'Apoio médico para os atletas do time em troca de exibição da marca nas mangas.',
                    'status' => 'novo',
                ],
                [
                    'nome' => 'Distribuidora de Bebidas da Mooca',
                    'email' => 'vendas@bebidasmooca.com.br',
                    'telefone' => '11944445678',
                    'tipo_investidor' => 'outro',
                    'ticket_estimado' => 'ate_50k',
                    'mensagem' => 'Fornecimento consignado semanal de gelo, água mineral e carvão para o churrasco.',
                    'status' => 'novo',
                ],
            ];

            foreach ($investorLeads as $lead) {
                DB::table('investor_leads')->updateOrInsert(
                    ['email' => $lead['email']],
                    [
                        'nome' => $lead['nome'],
                        'telefone' => $lead['telefone'],
                        'tipo_investidor' => $lead['tipo_investidor'],
                        'ticket_estimado' => $lead['ticket_estimado'],
                        'mensagem' => $lead['mensagem'],
                        'origem' => 'landing_page',
                        'status' => $lead['status'],
                        'created_at' => now()->subDays(rand(1, 20)),
                        'updated_at' => now(),
                    ]
                );
            }
        });
    }
}
