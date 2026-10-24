// 01 - Node.js temelleri
// Çalıştır: npm run ornek:1

// --- 1) ESM modülleri ---
// Node'un kendi modülleri "node:" önekiyle import edilir.
import { readFile } from 'node:fs/promises';

// --- 2) Event loop: kod yazıldığı sırayla mı çalışır? ---
console.log('1. Senkron kod başladı');

setTimeout(() => {
  console.log('4. setTimeout (0 ms) — event loop sırası gelince çalıştı');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise — mevcut işlem bitince hemen çalıştı');
});

console.log('2. Senkron kod bitti');

// --- 3) async/await: beklerken thread bloklanmaz ---
// Python'daki asyncio veya C#'taki async/await ile aynı fikir.
const bekle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function veriGetir(isim, ms) {
  await bekle(ms); // ör. veritabanı veya ağ isteği
  return `${isim} hazır (${ms} ms)`;
}

async function main() {
  console.time('sirali');
  await veriGetir('Kullanıcı', 500);
  await veriGetir('Siparişler', 500);
  console.timeEnd('sirali'); // ~1000 ms

  console.time('paralel');
  const sonuclar = await Promise.all([
    veriGetir('Kullanıcı', 500),
    veriGetir('Siparişler', 500),
  ]);
  console.timeEnd('paralel'); // ~500 ms
  console.log(sonuclar);

  // --- 4) Gerçek bir I/O örneği: dosya okuma ---
  const paket = JSON.parse(await readFile('package.json', 'utf8'));
  console.log('Proje adı:', paket.name);
}

main();
