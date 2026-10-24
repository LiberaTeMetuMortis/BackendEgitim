// Çok basit bir "veritabanı": tüm veriyi tek bir JSON dosyasında tutar.
// Okurken dosyayı baştan sona okur, yazarken dosyayı baştan sona yeniden yazar.

import { readFile, writeFile, mkdir } from 'node:fs/promises';

// import.meta.url → bu dosyanın konumu. Sunucu hangi klasörden başlatılırsa
// başlatılsın veri hep ornekler/06-json-db/data/todos.json'a yazılır.
const KLASOR = new URL('./data/', import.meta.url);
const DOSYA = new URL('todos.json', KLASOR);

export async function readTodos() {
  try {
    const metin = await readFile(DOSYA, 'utf8'); // dosya → string
    return JSON.parse(metin); // string → JavaScript dizisi
  } catch (err) {
    // ENOENT = "böyle bir dosya yok" → ilk çalıştırma, boş liste ile başla
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeTodos(todos) {
  await mkdir(KLASOR, { recursive: true }); // klasör yoksa oluştur
  // null, 2 → dosya insan tarafından okunabilsin diye girintili yaz
  await writeFile(DOSYA, JSON.stringify(todos, null, 2));
}
