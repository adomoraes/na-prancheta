import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Iniciando verificação de conformidade PWA - Na Prancheta...');
let errors = 0;
let passes = 0;

function check(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passes++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    errors++;
  }
}

// 1. Verificar arquivos de ícones obrigatórios em public/
const requiredIcons = [
  'public/icon.svg',
  'public/favicon.svg',
  'public/pwa-192x192.png',
  'public/pwa-512x512.png',
  'public/pwa-maskable-192x192.png',
  'public/pwa-maskable-512x512.png',
  'public/apple-touch-icon.png'
];

console.log('\n1. Verificando assets de ícones PWA:');
for (const iconPath of requiredIcons) {
  const fullPath = path.join(rootDir, iconPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  check(exists && size > 0, `Ícone ${iconPath} presente e não-vazio (${size} bytes)`);
}

// 2. Verificar meta tags PWA no index.html
console.log('\n2. Verificando meta tags no index.html:');
const indexPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

check(indexHtml.includes('name="theme-color" content="#09090b"'), 'Meta theme-color configurada (#09090b)');
check(indexHtml.includes('name="apple-mobile-web-app-capable" content="yes"'), 'Meta apple-mobile-web-app-capable presente');
check(indexHtml.includes('name="apple-mobile-web-app-title" content="Na Prancheta"'), 'Meta apple-mobile-web-app-title presente');
check(indexHtml.includes('apple-touch-icon.png'), 'Link apple-touch-icon presente');

// 3. Verificar configuração do VitePWA no vite.config.ts
console.log('\n3. Verificando configuração no vite.config.ts:');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');
const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');

check(viteConfig.includes('VitePWA') || viteConfig.includes('vite-plugin-pwa'), 'Plugin VitePWA importado/declarado');
check(viteConfig.includes("registerType: 'prompt'"), "registerType configurado como 'prompt' (atualização controlada via Toast)");
check(viteConfig.includes('Na Prancheta'), 'Nome do aplicativo declarado no manifesto do Vite');
check(viteConfig.includes('theme_color: "#09090b"') || viteConfig.includes("theme_color: '#09090b'"), 'theme_color do manifesto em conformidade com o tema escuro');

console.log(`\n📊 Resultado da Verificação: ${passes} aprovados, ${errors} falhas.`);
if (errors > 0) {
  console.log('⚠️ Ajuste os itens acima para concluir a conformidade.');
  process.exit(1);
} else {
  console.log('🎉 Todos os critérios de conformidade PWA foram atendidos!');
  process.exit(0);
}
