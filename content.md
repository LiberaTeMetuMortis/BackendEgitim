# Backend'e Giriş — Part 1: Eğitim İçeriği

Bu doküman workshop'ta anlatılan her şeyin kısa bir özetidir. Ders sonrası tekrar ve başvuru için kullanılabilir.

**Hedef kitle:** Başka bir programlama dili bilen, backend ve Node.js'e yeni başlayanlar.
**Süre:** 1,5-2 saat · **Araçlar:** Node.js 22+, Express v5, JavaScript (ESM)

---

## 1. Web ve HTTP

### İstemci ve sunucu
- **İstemci (client):** İsteği gönderen taraf. Tarayıcı, mobil uygulama ya da `curl` olabilir.
- **Sunucu (server):** İsteği karşılayıp yanıt veren taraf. Backend burada çalışır.
- **Backend'in görevi:** Veriyi saklamak, iş kurallarını uygulamak ve kimin neye erişebileceğine karar vermek. Frontend'e asla güvenilmez; kurallar backend'de uygulanır.

### HTTP isteği
Bir istek dört parçadan oluşur:
- **Metot:** Ne yapılacağı (`GET`, `POST` ...)
- **Yol (path):** Hangi kaynak üzerinde işlem yapılacağı (`/api/todos`)
- **Header'lar:** Ek bilgiler, örneğin `Content-Type` ve `Authorization`
- **Body:** Gönderilen veri. `GET` isteklerinde genelde olmaz.

### HTTP yanıtı
Bir yanıt **durum kodu**, **header'lar** ve **body**'den oluşur.

HTTP **durumsuzdur (stateless):** Her istek kendi başına bir bütündür ve sunucu önceki isteği hatırlamaz.

### Metotlar
| Metot | Anlamı |
|-------|--------|
| `GET` | Oku. Hiçbir şeyi değiştirmemeli. |
| `POST` | Yeni kayıt oluştur |
| `PUT` | Kaydı tamamen değiştir |
| `PATCH` | Kaydı kısmen güncelle |
| `DELETE` | Sil |

**Idempotent:** Aynı isteği iki kez göndermek, bir kez göndermekle aynı sonucu verir. `GET`, `PUT` ve `DELETE` idempotent'tir; `POST` değildir.

### Durum kodları
| Aralık | Anlamı | Örnekler |
|--------|--------|----------|
| 2xx | Başarılı | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Yönlendirme | `301`, `304` |
| 4xx | İstemci hatası | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |
| 5xx | Sunucu hatası | `500 Internal Server Error` |

Kural: Hata kimdeyse kodu ona göre seçin. Eksik veri gönderildiyse 400, sunucunun kodu patladıysa 500.

### JSON
Backend'in ortak veri formatıdır. Metin tabanlıdır ve her dilde bir parser'ı vardır. JavaScript nesnesine benzer, ama anahtarlar çift tırnak içinde yazılır.

---

## 2. Node.js

### Nedir?
- JavaScript'i tarayıcı dışında çalıştıran bir **runtime**.
- Chrome'un **V8** motorunun üzerine işletim sistemi erişimini (dosya, ağ, süreç) ekler.
- **npm** Node'un paket yöneticisidir; Python'daki pip, Java'daki Maven gibi.
  - `npm init -y` bir `package.json` oluşturur. Bu dosya projenin kimlik kartıdır: bağımlılıkları ve script'leri tutar.
  - `npm install express` paketi `node_modules/` klasörüne kurar.
  - `package.json` içindeki `"type": "module"` ayarı modern `import`/`export` sözdizimini (ESM) açar.

### Tek thread ve event loop
- Klasik modelde (Java, PHP) her istek için ayrı bir thread açılır.
- Node'da tek bir thread ve bir **event loop** vardır. Bir I/O işlemi (veritabanı, ağ, disk) beklenirken Node başka isteklerle ilgilenir.
- Backend'in zamanının çoğu beklemekle geçtiği için bu model verimlidir.
- ⚠️ Ağır CPU işleri thread'i **bloklar** ve o sırada tüm istekler bekler.

### Çalışma sırası
Önce senkron kod çalışır, ardından Promise'ler, en son da `setTimeout` gibi zamanlayıcılar.

### async / await
- `await` bir işlemin bitmesini bekler ama thread'i bloklamaz.
- Birbirinden bağımsız işler `Promise.all` ile paralel çalıştırılabilir. Örnekte sıralı çalıştırma 1000 ms, paralel çalıştırma 500 ms sürüyor.

📁 Örnek: `ornekler/01-node-temelleri/index.js` · `npm run ornek:1`

---

## 3. Framework'süz sunucu (`node:http`)

Node'un dahili `http` modülüyle de bir sunucu yazılabilir, ama her şeyi elle yapmak gerekir:
- Metot ve URL kontrolünü `if` blokları ile yazmak
- Body'yi stream olarak parça parça okumak (`req.on('data')`)
- JSON'u elle parse edip `Content-Type` header'ını elle ayarlamak
- Dinamik URL'leri (`/kullanicilar/42`) ve query string'leri (`?sayfa=2`) kendimiz ayrıştırmak
- Log, yetki kontrolü gibi ortak işleri her route'ta tekrar yazmak

➡️ **Express** bu tekrarları ortadan kaldıran minimal bir framework'tür. Python'daki Flask'e benzer.

📁 Örnek: `ornekler/02-http-sunucu/server.js` · `npm run ornek:2`

---

## 4. Express

### Temel yapı
```js
import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Merhaba!'));

app.listen(3000);
```
Her route `app.METOT(yol, handler)` şeklinde tanımlanır.

### `req` (gelen istek)
- `req.params`: URL parametreleri. `/kullanicilar/:id` route'unda `req.params.id` olarak okunur. ⚠️ Her zaman **string** gelir.
- `req.query`: Query string değerleri. `?sehir=İstanbul` için `req.query.sehir`.
- `req.body`: İstek gövdesi. Okunabilmesi için `express.json()` middleware'i gerekir.
- `req.get('Header-Adi')`: Bir header'ı okur.

### `res` (gidecek yanıt)
- `res.status(kod)`: Durum kodunu ayarlar.
- `res.json(veri)`: JSON gönderir ve `Content-Type` header'ını kendisi ayarlar.
- `res.send(metin)`: Metin gönderir.
- `res.set('Header', 'deger')`: Bir header yazar.
- `res.end()`: Yanıtı gövdesiz bitirir.

### Bir isteğin `req`'e eşlenmesi
```bash
curl -X POST "localhost:3000/api/istek-incele/42?sirala=yeni" \
  -H "Content-Type: application/json" -H "X-Dil: tr" -d '{"metin":"Merhaba"}'
```
Bu istek route'a şöyle ulaşır: `req.method` → `'POST'`, `req.params.id` → `'42'`, `req.query.sirala` → `'yeni'`, `req.get('X-Dil')` → `'tr'`, `req.body.metin` → `'Merhaba'`.

### Yanıt gönderme kuralları
- `res.status()` ve `res.set()` yanıtı yalnızca hazırlar, göndermez. Bu yüzden zincirlenebilirler: `res.status(201).json(...)`.
- `res.json()`, `res.send()`, `res.end()` ve `res.redirect()` yanıtı gönderip bitirir.
- Her isteğe **tam olarak bir kez** yanıt verilir. Hiç yanıt verilmezse istemci timeout'a kadar bekler.

⚠️ Erken çıkışlarda `return res.status(404).json(...)` şeklinde `return` kullanın. Unutulursa kod devam eder ve ikinci kez yanıt göndermeye çalışır; sonuç "Cannot set headers after they are sent" hatasıdır.

📁 Örnek: `ornekler/03-express-giris/index.js` · `npm run ornek:3`

---

## 5. Middleware

İstek ile route arasında sırayla çalışan ara fonksiyonlardır:

```
İstek → [logger] → [express.json] → [yetki] → [route] → Yanıt
                                                 ↓ hata
                                       [hata middleware'i]
```

Bir benzetme: Havalimanında yolcu sırayla bilet kontrolünden, güvenlikten ve pasaport kontrolünden geçer. Her nokta yolcuyu bir sonrakine geçirebilir, geri çevirebilir ya da üzerine bir damga ekleyebilir. Diğer dillerdeki karşılıkları: Django/Flask middleware, Java Servlet Filter.

### İmza
Middleware'ler `(req, res, next)` imzasına sahiptir. `req` ve `res`, route'ta kullanılanlarla **aynı** nesnelerdir. `next()` "işim bitti, sıradakine geç" demektir. Route handler'lar da aslında zincirin son halkasıdır.

### Bir middleware 4 şeyden birini yapar
| Ne yapar? | Nasıl? | Sonuç |
|-----------|--------|-------|
| Devam ettirir | `next()` | Sıradaki middleware veya route çalışır |
| Zinciri keser | `res.status(401).json(...)` | Yanıt gider, sonraki adımlar çalışmaz |
| Hataya atlar | `next(err)` veya `throw` | Doğrudan hata middleware'ine gidilir |
| Bilgi ekler | `req.istekId = ...; next()` | Sonraki tüm adımlar bu bilgiyi görür. Part 2'deki `req.user` da böyle doldurulacak. |

⚠️ Middleware ne `next()` çağırır ne de yanıt gönderirse istek **asılı kalır** ve istemci timeout alır.

### Çalışma sırası
Middleware'ler kodda yazıldıkları sırayla çalışır. Bir route yanıt gönderdiğinde zincir biter ve sonrasında tanımlanmış middleware'ler çalışmaz. 404 middleware'inin en sonda olmasının nedeni budur: Ona yalnızca hiçbir route'un eşleşmediği istekler ulaşır.

### Kapsam
| Kapsam | Kod | Ne zaman çalışır? |
|--------|-----|-------------------|
| Tüm uygulama | `app.use(fn)` | Her istekte |
| Dizin prefixi | `app.use('/api', fn)` | Yolu `/api` ile başlayan isteklerde |
| Tek route | `app.get('/gizli', fn, handler)` | Yalnızca o route'ta |
| Birden fazla | `app.get('/x', [a, b], handler)` | Sırayla a, b, sonra handler |

### Hazır middleware'ler
- **Express içinde gelenler:** `express.json()`, `express.urlencoded()` (HTML formları), `express.static()` (dosya sunma)
- **npm paketleri:** `cors`, `helmet` (güvenlik header'ları), `morgan` (log), `express-rate-limit` (istek sınırlama)

Hepsi aynı `(req, res, next)` imzasını kullanır.

### Hata yönetimi
- `next(err)` hatayı bilerek hata middleware'ine gönderir. Hata nesnesine `err.status = 400` gibi bir durum kodu eklenebilir.
- **Express v5:** `async` route'larda fırlatılan hatalar otomatik olarak hata middleware'ine gider. v4'te bunun için `try/catch` ve `next(err)` gerekiyordu.
- **404 middleware'i** tüm route'lardan **sonra** yazılır.
- **Hata middleware'i** `(err, req, res, next)` şeklinde 4 parametre alır ve **en sona** yazılır. Express onu parametre sayısından tanıdığı için `next` kullanılmasa bile yazılmalıdır.
- 500 hatalarında iç detaylar kullanıcıya gösterilmez; yalnızca "Sunucu hatası" mesajı döner.

### Önerilen sıralama
1. Logger
2. Güvenlik / CORS
3. Body parser
4. Auth
5. Route'lar
6. 404
7. Hata middleware'i

📁 Örnek: `ornekler/04-middleware/index.js` · `npm run ornek:4`

---

## 6. REST API ve Todo uygulaması

### REST prensipleri
URL'ler **isim** (kaynak), metotlar **fiil** (işlem) olur:
- ✅ `POST /todos`, `DELETE /todos/3`
- ❌ `POST /createTodo`, `GET /deleteTodo?id=3`

### Todo API uç noktaları
| İşlem | Metot + Yol | Başarı | Hata |
|-------|-------------|--------|------|
| Listele (`?done=true` filtresiyle) | `GET /todos` | 200 | — |
| Getir | `GET /todos/:id` | 200 | 404 |
| Oluştur | `POST /todos` | 201 | 400 |
| Güncelle | `PATCH /todos/:id` | 200 | 400, 404 |
| Sil | `DELETE /todos/:id` | 204 | 404 |

### Veri
Veriler şimdilik bellekteki bir dizide (`todos`) ve artan bir sayaçta (`nextId`) tutuluyor. Sunucu yeniden başlarsa sıfırlanır. Part 2'de bunun yerini bir veritabanı alacak.

### Validation
- Kullanıcıdan gelen veriye **asla güvenmeyin**. Frontend'de kontrol olsa bile herkes `curl` ile istek gönderebilir.
- `title` boş olmayan bir string olmalı, `done` ise boolean. Kurala uymayan isteklere `400` dönülür.

📁 Başlangıç: `ornekler/05-todo-api/baslangic.js` · `npm run ornek:5`
📁 Çözüm: `ornekler/05-todo-api/bitmis.js` · `npm run ornek:5-bitmis`
📁 Hazır istekler: `istekler.http` (VS Code REST Client)

### Kalıcılık: JSON dosyası veritabanı
- **Sorun:** Değişkenler RAM'de yaşadığı için sunucu kapanınca veri silinir. Veriyi kalıcı yapmak için **diske** yazmak gerekir.
- **Çözüm:** Node'un dahili `node:fs/promises` modülüyle veri bir JSON dosyasında tutulur. Bu modül dosya işlemlerini **async** yapar, yani dosya okunurken veya yazılırken sunucu diğer isteklerle ilgilenmeye devam eder.
- **`db.js` iki fonksiyon içerir:**
  - `readTodos()` dosyayı `readFile` ile okur ve `JSON.parse` ile diziye çevirir. Dosya henüz yoksa (`ENOENT` hatası) boş bir dizi döner.
  - `writeTodos()` diziyi `JSON.stringify` ile metne çevirir ve `writeFile` ile dosyaya yazar. Klasör yoksa önce `mkdir` ile oluşturur.
- **Route'larda kalıp:** Önce **oku**, sonra **değiştir**, en son **geri yaz**.
- **Deneme:** Birkaç görev ekleyin, sunucuyu durdurup yeniden başlatın. Görevler hâlâ yerinde olacak. Veriler `ornekler/06-json-db/data/todos.json` dosyasında düz metin olarak görülebilir.
- **Neden gerçek bir veritabanı değil?**
  - Her istekte bütün dosya okunup yeniden yazılır; veri büyüdükçe yavaşlar.
  - Aynı anda gelen iki yazma isteğinden biri diğerinin değişikliğini ezebilir.
  - Yazma sırasında sunucu çökerse dosya bozulabilir.
  - Sorgulama yapılamaz; filtreleme bütün veriyi okuyup JavaScript'te yapılır.
  - Birden fazla sunucu aynı dosyayı paylaşamaz.
- Veri erişimi ayrı bir dosyada (`db.js`) olduğu için Part 2'de onun yerine gerçek bir veritabanı koymak kolay olacak; route'lar neredeyse hiç değişmeyecek. Bu ayrım, Part 2'de anlatılacak Repository katmanının ilk halidir.

📁 Örnek: `ornekler/06-json-db/` (`db.js` + `index.js`) · `npm run ornek:6`

---

## 7. Özet

- **HTTP:** İstek metot, yol, header ve body'den oluşur; yanıt durum kodu ve body taşır.
- **Node.js:** Tek thread ve bloklamayan I/O ile çalışır; asenkron kod `async/await` ile yazılır.
- **Express:** Routing, `req`/`res`, params ve query sağlar.
- **Middleware:** `(req, res, next)` zinciridir ve sırası önemlidir.
- **REST:** Kaynak odaklı URL'ler ve doğru durum kodları kullanılır.
- **Validation:** Gelen veriye güvenilmez.
- **Kalıcılık:** RAM geçicidir, disk kalıcıdır. Veriler `fs/promises` ile bir JSON dosyasına yazılabilir.

---

## 8. Sırada ne var? Part 2 kavramları

Bu bölümde kod yok, yalnızca kavramlar var. Ayrıntılı uygulaması Part 2'de yapılacak.

### Veritabanı
Veriler şu an bellekte tutulduğu için sunucu yeniden başlayınca kayboluyor. Kalıcılık için bir veritabanı gerekir.
- **SQL (ilişkisel):** PostgreSQL, MySQL, SQLite. Veri tablolarda, satır ve sütunlar halinde tutulur. Şema sabittir ve ilişkiler güçlüdür (`JOIN`, yabancı anahtar). Çoğu iş uygulaması için doğru seçimdir.
- **NoSQL (doküman):** MongoDB gibi. Veri JSON benzeri dokümanlarda tutulur ve şema esnektir.
- **İlişki örneği:** Bir kullanıcının birçok görevi olabilir. Bu, `todos` tablosuna bir `user_id` sütunu eklenerek kurulur.
- **ORM / Query Builder** (Prisma, Drizzle, Knex): Sorguların SQL yerine JavaScript ile yazılmasını sağlar.
- **Migration:** Veritabanı şemasının versiyon kontrolüdür. Şemadaki her değişiklik bir adım olarak kaydedilir.
- **SQL injection:** Kullanıcı girdisi SQL metnine asla elle eklenmemelidir. ORM'ler bu saldırıyı önler.

### Kimlik doğrulama ve yetkilendirme
- **Authentication (kimlik doğrulama):** "Sen kimsin?" sorusunun cevabıdır. Başarısız olursa `401` döner.
- **Authorization (yetkilendirme):** "Bunu yapmaya iznin var mı?" sorusunun cevabıdır. Başarısız olursa `403` döner.

### Şifre saklama
- Şifreler **asla düz metin olarak** saklanmaz. Saklanan şey şifrenin **hash**'idir. Hash tek yönlü bir dönüşümdür ve geri çevrilemez.
- Girişte kullanıcının gönderdiği şifre tekrar hash'lenir ve kayıtlı hash ile karşılaştırılır.
- **Salt** her kullanıcıya eklenen rastgele bir değerdir. Böylece aynı şifreler farklı hash'ler üretir.
- Kasıtlı olarak yavaş algoritmalar kullanılır: `bcrypt`, `argon2`. MD5 ve SHA-1 gibi hızlı algoritmalar şifre için uygun değildir.
- **Hash şifreleme değildir:** Şifrelenmiş veri anahtarla geri açılabilir, hash ise açılamaz.

### Session ve JWT
HTTP durumsuz olduğu için istemcinin her istekte giriş yapmış olduğunu kanıtlaması gerekir.
- **Session:** Oturum bilgisi sunucuda tutulur ve istemciye bir cookie ile oturum ID'si verilir. Çıkış yapmak kolaydır; klasik web sitelerine uygundur.
- **JWT:** Sunucu imzalı bir token üretir ve istemci bu token'ı her istekte `Authorization: Bearer <token>` header'ı ile gönderir. API'lere ve mobil uygulamalara uygundur. Dezavantajı, token'ı süresi dolmadan geçersiz kılmanın zor olmasıdır.
- Akış: `POST /login` ile token alınır. Sonraki isteklerde auth middleware'i token'ı doğrular ve `req.user`'ı doldurur.

### Katmanlı mimari
Uygulamanın sorumlulukları katmanlara ayrılır:
- **Route:** Hangi URL'nin hangi fonksiyona gideceğini belirler.
- **Controller:** HTTP tarafıyla ilgilenir; `req`'ten veriyi alır, `res` ile yanıt verir.
- **Service:** İş kurallarını uygular.
- **Repository:** Veritabanıyla konuşur.

Her katman yalnızca bir altındakini bilir. Service katmanı HTTP'den habersizdir; veritabanı değişirse yalnızca Repository katmanı değişir.

### Validation kütüphaneleri
Bugün yaptığımız gibi her alanı `if` ile kontrol etmek yerine bir **şema** tanımlanır, örneğin "title zorunlu bir metin ve 1-200 karakter". Kütüphane gelen veriyi şemaya göre kontrol eder ve tüm hataları tek seferde listeler. Örnekler: Zod, Joi; Fastify'da JSON Schema dahili gelir. Aynı şemadan API dokümantasyonu (OpenAPI) ve TypeScript tipleri de üretilebilir.

### Yapılandırma ve CORS
- **Ortam değişkenleri:** Port, veritabanı adresi ve gizli anahtarlar koda yazılmaz. `.env` dosyasında tutulur ve bu dosya **asla git'e eklenmez**. Böylece aynı kod geliştirme, test ve üretim ortamlarında farklı ayarlarla çalışabilir.
- **CORS:** Tarayıcı, bir sitedeki sayfanın başka bir domain'deki API'ye istek atmasını varsayılan olarak engeller. Sunucu, izin verdiği domain'leri header'larla belirtir. Bu bir tarayıcı kuralıdır; `curl` ve Postman'i etkilemez.

### Test
- **Test piramidi:** Tabanda çok sayıda birim (unit) testi, ortada entegrasyon (API) testleri, tepede az sayıda uçtan uca (E2E) test bulunur.
- **Birim testi:** Tek bir fonksiyonu kontrol eder. Örneğin title doğrulaması boş metni reddediyor mu?
- **Entegrasyon testi:** Gerçek bir istek gönderip yanıtı kontrol eder. Örneğin boş title ile `POST /todos` gönderildiğinde `400` dönüyor mu?
- Araçlar: `node:test`, Vitest, Jest, Supertest.

---

## Proje yapısı

```
Egitim/
├── README.md          # Kurulum ve çalıştırma
├── content.md         # Bu doküman
├── package.json       # Bağımlılıklar ve npm script'leri
├── istekler.http      # Hazır HTTP istekleri
├── slides/part1.md    # Marp sunumu (npm run slaytlar)
└── ornekler/
    ├── 01-node-temelleri/
    ├── 02-http-sunucu/
    ├── 03-express-giris/
    ├── 04-middleware/
    ├── 05-todo-api/   # baslangic.js + bitmis.js
    └── 06-json-db/    # db.js (fs/promises) + index.js
```
