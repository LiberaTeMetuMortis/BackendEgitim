// 06 - Kalıcı Todo API: veriler JSON dosyasında
// Çalıştır: npm run ornek:6  →  http://localhost:3000
//
// Deneme: birkaç görev ekle → sunucuyu durdur (Ctrl+C) → tekrar başlat →
// görevler hâlâ orada! Dosyayı da aç: ornekler/06-json-db/data/todos.json

import express from 'express';
import { readTodos, writeTodos } from './db.js';

const app = express();
app.use(express.json());

function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

// Yeni id: mevcut en büyük id + 1
function nextId(todos) {
  return Math.max(0, ...todos.map((t) => t.id)) + 1;
}

app.get('/todos', async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

app.get('/todos/:id', async (req, res) => {
  const todos = await readTodos();
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }
  res.json(todo);
});

app.post('/todos', async (req, res) => {
  const { title } = req.body ?? {};
  if (!validateTitle(title)) {
    return res.status(400).json({ error: 'title zorunlu ve boş olmayan bir metin olmalı' });
  }

  const todos = await readTodos(); // 1) oku
  const todo = { id: nextId(todos), title: title.trim(), done: false };
  todos.push(todo); // 2) değiştir
  await writeTodos(todos); // 3) geri yaz
  res.status(201).json(todo);
});

app.patch('/todos/:id', async (req, res) => {
  const todos = await readTodos();
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }

  const { title, done } = req.body ?? {};
  if (title !== undefined && !validateTitle(title)) {
    return res.status(400).json({ error: 'title boş olmayan bir metin olmalı' });
  }
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done true veya false olmalı' });
  }

  if (title !== undefined) todo.title = title.trim();
  if (done !== undefined) todo.done = done;
  await writeTodos(todos);
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const todos = await readTodos();
  const kalanlar = todos.filter((t) => t.id !== Number(req.params.id));
  if (kalanlar.length === todos.length) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }

  await writeTodos(kalanlar);
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Bulunamadı' });
});

// Dosya okunamazsa / JSON bozuksa async hata buraya düşer (Express v5)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(3000, () => {
  console.log('Kalıcı Todo API http://localhost:3000 adresinde çalışıyor');
});
