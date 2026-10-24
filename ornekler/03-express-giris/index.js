// 03 - Express'e giriş: routing, req, res, params, query
// Çalıştır: npm run ornek:3  →  http://localhost:3000

import express from 'express';

const app = express();

// Örnek veri
const kullanicilar = [
  { id: 1, ad: 'Ayşe', sehir: 'İstanbul' },
  { id: 2, ad: 'Mehmet', sehir: 'Ankara' },
  { id: 3, ad: 'Zeynep', sehir: 'İstanbul' },
];

// En basit route
app.get('/', (req, res) => {
  res.send('Merhaba Express!');
});

// res.json: Content-Type ve JSON.stringify'ı bizim yerimize yapar
app.get('/api/saat', (req, res) => {
  res.json({ saat: new Date().toISOString() });
});

// Query string: /api/kullanicilar?sehir=İstanbul
app.get('/api/kullanicilar', (req, res) => {
  const { sehir } = req.query;
  const sonuc = sehir
    ? kullanicilar.filter((k) => k.sehir === sehir)
    : kullanicilar;
  res.json(sonuc);
});

// Route parametresi: /api/kullanicilar/2
app.get('/api/kullanicilar/:id', (req, res) => {
  const id = Number(req.params.id); // params her zaman string gelir!
  const kullanici = kullanicilar.find((k) => k.id === id);

  if (!kullanici) {
    return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
  }
  res.json(kullanici);
});

// Header okuma ve yazma
app.get('/api/kimim', (req, res) => {
  res.set('X-Workshop', 'Part 1');
  res.json({ tarayici: req.get('User-Agent') });
});

// req'in tüm parçalarını geri döndürür — istek nereye düşüyor görmek için
// Dene: POST /api/istek-incele/42?sirala=yeni  (body: {"metin":"Merhaba"})
app.post('/api/istek-incele/:id', express.json(), (req, res) => {
  res.status(201).json({
    method: req.method,
    path: req.path,
    params: req.params, // { id: '42' } — string!
    query: req.query, // { sirala: 'yeni' } — o da string
    dil: req.get('X-Dil'), // header yoksa undefined
    body: req.body, // express.json() sayesinde dolu
  });
});

// res ile farklı yanıt türleri
app.get('/api/yanit/:tur', (req, res) => {
  switch (req.params.tur) {
    case 'json':
      return res.json({ mesaj: 'JSON yanıt' });
    case 'metin':
      return res.send('Düz metin yanıt');
    case 'bos':
      return res.status(204).end();
    case 'yonlendir':
      return res.redirect('/api/saat');
    default:
      return res.sendStatus(404);
  }
});

app.listen(3000, () => {
  console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});
