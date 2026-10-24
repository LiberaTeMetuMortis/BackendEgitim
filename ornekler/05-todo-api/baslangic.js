// 05 - Todo API (canlı kodlama başlangıç dosyası)
// Çalıştır: npm run ornek:5  →  http://localhost:3000
// Tamamlanmış hali: bitmis.js

import express from 'express';

const app = express();
app.use(express.json());

// Veri bellekte tutuluyor — sunucu yeniden başlarsa sıfırlanır.
// Part 2'de burası veritabanı olacak.
let todos = [
  { id: 1, title: 'Node.js kur', done: true },
  { id: 2, title: 'Express öğren', done: false },
];
let nextId = 3;

// TODO 1: GET /todos — tüm görevleri döndür (?done=true filtresi)

// TODO 2: GET /todos/:id — tek görev, yoksa 404

// TODO 3: POST /todos — yeni görev ekle, title zorunlu (400), başarıda 201

// TODO 4: PATCH /todos/:id — title ve/veya done güncelle

// TODO 5: DELETE /todos/:id — sil, başarıda 204

app.use((req, res) => {
  res.status(404).json({ error: 'Bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(3000, () => {
  console.log('Todo API http://localhost:3000 adresinde çalışıyor');
});
