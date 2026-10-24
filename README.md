# Backend'e Giriş — Part 1 (Node.js + Express v5)

Başka bir programlama dili bilen ama backend'e yeni olanlar için 1,5-2 saatlik workshop.

## Gereksinimler

- [Node.js](https://nodejs.org) 22 veya üzeri (`node --version`)
- VS Code (önerilen eklentiler: **Marp for VS Code**, **REST Client**)

## Kurulum

```bash
npm install
```

## Akış

| # | Konu | Süre | Komut |
|---|------|------|-------|
| 1 | Web ve HTTP | 15 dk | — |
| 2 | Node.js temelleri | 10 dk | `npm run ornek:1` |
| 3 | Framework'süz sunucu | 10 dk | `npm run ornek:2` |
| 4 | Express'e giriş | 20 dk | `npm run ornek:3` |
| 5 | Middleware | 20 dk | `npm run ornek:4` |
| 6 | Canlı kodlama: Todo API | 25 dk | `npm run ornek:5` (çözüm: `npm run ornek:5-bitmis`) |
| 6b | Kalıcılık: JSON dosyası veritabanı | 10 dk | `npm run ornek:6` |
| 7 | Part 2 kavramlarına bakış (kodsuz) | 10 dk | — |
| 8 | Sorular | 5 dk | — |

Sunucular `http://localhost:3000` adresinde çalışır ve `--watch` ile dosya değiştikçe otomatik yeniden başlar (`ornek:6` hariç — kalıcılığı göstermek için sunucuyu elle durdurup başlatırız). Durdurmak için `Ctrl+C`.

## Slaytlar

`slides/part1.md` bir [Marp](https://marp.app) sunumudur.

```bash
npm run slaytlar        # tarayıcıda önizleme
npm run slaytlar:html   # slides/part1.html üret
npm run slaytlar:pdf    # slides/part1.pdf üret
```

Ya da VS Code'da Marp eklentisiyle dosyayı açıp önizleyin.

## İstek atma

`istekler.http` dosyasını VS Code REST Client ile açıp her isteğin üstündeki **Send Request**'e tıklayın. Ya da `curl` kullanın:

```bash
curl http://localhost:3000/todos
curl http://localhost:3000/todos/1
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Süt al"}'
curl -X PATCH http://localhost:3000/todos/2 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE http://localhost:3000/todos/1 -i
```
