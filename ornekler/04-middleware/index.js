// 04 - Middleware: istek ile route arasındaki ara katmanlar
// Çalıştır: npm run ornek:4  →  http://localhost:3000
//
// İstek → [logger] → [express.json] → [istekId] → [route] → Yanıt
//                                                  ↓ hata
//                                          [hata middleware'i]

import express from 'express';

const app = express();

// 1) Kendi middleware'imiz: her isteği logla
function logger(req, res, next) {
  const baslangic = Date.now();
  // Yanıt gönderildiğinde süreyi yaz
  res.on('finish', () => {
    const sure = Date.now() - baslangic;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${sure} ms)`);
  });
  next(); // Sıradakine geç — çağırmazsak istek burada asılı kalır!
}

app.use(logger);

// 2) Hazır middleware: JSON body'yi parse edip req.body'ye koyar
app.use(express.json());

// 3) req'e bilgi ekleyen middleware — sonraki tüm middleware ve route'lar görebilir
// (Part 2'de auth middleware'i aynı şekilde req.user'ı dolduracak)
app.use((req, res, next) => {
  req.istekId = Math.random().toString(36).slice(2, 8);
  res.set('X-Istek-Id', req.istekId);
  next();
});

// 4) Sadece /api ile başlayan yollara uygulanan middleware
app.use('/api', (req, res, next) => {
  res.set('X-API-Versiyon', '1');
  next();
});

// 5) Sadece belirli bir route'a uygulanan middleware
function apiAnahtariGerekli(req, res, next) {
  if (req.get('X-API-Key') !== 'gizli123') {
    // Yanıt gönderip zinciri kesiyoruz — route hiç çalışmaz
    return res.status(401).json({ hata: 'Geçersiz API anahtarı' });
  }
  next();
}

app.get('/', (req, res) => {
  res.send('Middleware örneği');
});

app.get('/api/istek', (req, res) => {
  res.json({ istekId: req.istekId });
});

app.post('/api/echo', (req, res) => {
  res.status(201).json({ aldim: req.body });
});

app.get('/api/gizli', apiAnahtariGerekli, (req, res) => {
  res.json({ mesaj: 'Hoş geldin, yetkili kişi!' });
});

// next(err): hatayı bilerek hata middleware'ine gönder
app.get('/api/sayi/:n', (req, res, next) => {
  const n = Number(req.params.n);
  if (Number.isNaN(n)) {
    const err = new Error('n bir sayı olmalı');
    err.status = 400;
    return next(err);
  }
  res.json({ n, karesi: n * n });
});

// Express v5: async route'ta fırlatılan hata otomatik olarak
// hata middleware'ine gider (v4'te try/catch + next(err) gerekirdi)
app.get('/api/patla', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error('Bir şeyler ters gitti!');
});

// 6) 404: hiçbir route eşleşmezse buraya düşer (route'lardan SONRA)
app.use((req, res) => {
  res.status(404).json({ hata: `${req.method} ${req.originalUrl} bulunamadı` });
});

// 7) Hata middleware'i: 4 parametre alır (err ilk sırada), EN SONA yazılır
app.use((err, req, res, next) => {
  console.error(`[${req.istekId}] HATA:`, err.message);
  const status = err.status ?? 500;
  // 500'lerde iç detayı kullanıcıya göstermiyoruz
  res.status(status).json({ hata: status === 500 ? 'Sunucu hatası' : err.message });
});

app.listen(3000, () => {
  console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});
