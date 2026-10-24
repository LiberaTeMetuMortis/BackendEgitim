// 02 - Framework'süz HTTP sunucusu
// Çalıştır: npm run ornek:2  →  http://localhost:3000

import http from 'node:http';

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  // Routing'i elle yapmak zorundayız: metot + URL kontrolü
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Merhaba! Bu sunucu framework kullanmıyor.');
    return;
  }

  if (req.method === 'GET' && req.url === '/api/saat') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ saat: new Date().toISOString() }));
    return;
  }

  // Body okumak bile elle: veri parça parça (stream) gelir
  if (req.method === 'POST' && req.url === '/api/echo') {
    let body = '';
    req.on('data', (parca) => (body += parca));
    req.on('end', () => {
      try {
        const veri = JSON.parse(body);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ aldim: veri }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ hata: 'Geçersiz JSON' }));
      }
    });
    return;
  }

  // Hiçbiri eşleşmediyse
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ hata: 'Bulunamadı' }));
});

server.listen(3000, () => {
  console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});

// Sorular:
// - /api/kullanicilar/42 gibi dinamik URL'leri nasıl yakalardık?
// - ?sayfa=2 gibi query string'leri?
// - Her route'ta log, auth kontrolü tekrar mı yazılacak?
// → Express tam olarak bunları çözüyor.
