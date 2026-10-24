// 05 - Todo API (tamamlanmış hali)
// Çalıştır: npm run ornek:5-bitmis  →  http://localhost:3000

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

// Yardımcı: id'ye göre bul
function findTodo(id) {
  return todos.find((t) => t.id === Number(id));
}

// Yardımcı: basit validation (Part 2'de bir kütüphane kullanacağız)
function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

// GET /todos — liste (?done=true / ?done=false ile filtre)
app.get('/todos', (req, res) => {
  const { done } = req.query;
  if (done === undefined) {
    return res.json(todos);
  }
  res.json(todos.filter((t) => t.done === (done === 'true')));
});

// GET /todos/:id — tek görev
app.get('/todos/:id', (req, res) => {
  const todo = findTodo(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }
  res.json(todo);
});

// POST /todos — yeni görev
app.post('/todos', (req, res) => {
  const { title } = req.body ?? {};
  if (!validateTitle(title)) {
    return res.status(400).json({ error: 'title zorunlu ve boş olmayan bir metin olmalı' });
  }

  const todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH /todos/:id — kısmi güncelleme
app.patch('/todos/:id', (req, res) => {
  const todo = findTodo(req.params.id);
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
  res.json(todo);
});

// DELETE /todos/:id — silme
app.delete('/todos/:id', (req, res) => {
  const todo = findTodo(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }

  todos = todos.filter((t) => t.id !== todo.id);
  res.status(204).end(); // 204: başarılı, gövde yok
});

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
