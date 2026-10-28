# Backend'e Giriş — Part 1 (Node.js + Express v5)

Başka bir programlama dili bilen ama backend'e yeni olanlar için 1,5-2 saatlik workshop.

Bu dosya, hiçbir şey kurulu olmayan bir bilgisayardan başlayıp tüm örnekleri çalıştırana kadar gereken her adımı anlatır.

---

## İçindekiler

1. [Gereksinimler](#1-gereksinimler)
2. [Node.js kurulumu](#2-nodejs-kurulumu)
3. [Projeyi indirme](#3-projeyi-i̇ndirme)
4. [Bağımlılıkları kurma](#4-bağımlılıkları-kurma)
5. [Örnekleri çalıştırma](#5-örnekleri-çalıştırma)
6. [Sunucuya istek atma](#6-sunucuya-istek-atma)
7. [Slaytlar](#7-slaytlar)
8. [Sık karşılaşılan sorunlar](#8-sık-karşılaşılan-sorunlar)

---

## 1. Gereksinimler

| Araç | Neden | Zorunlu mu? |
|------|-------|-------------|
| [Node.js](https://nodejs.org) **22 veya üzeri** | Örnekleri çalıştırmak için | Evet |
| npm | Node.js ile birlikte otomatik gelir | Evet |
| Bir terminal | Komutları çalıştırmak için (Windows: PowerShell, macOS/Linux: Terminal) | Evet |
| [VS Code](https://code.visualstudio.com) | Kod düzenleme | Önerilir |
| VS Code eklentisi **REST Client** | `istekler.http` dosyasından istek atmak için | Önerilir |
| VS Code eklentisi **Marp for VS Code** | Slaytları önizlemek için | İsteğe bağlı |
| [Git](https://git-scm.com) | Projeyi klonlamak için | İsteğe bağlı (ZIP de indirebilirsiniz) |

---

## 2. Node.js kurulumu

Önce zaten kurulu olup olmadığına bakın. Terminali açıp şunu yazın:

```bash
node --version
npm --version
```

`v22.x.x` veya daha yüksek bir sürüm görüyorsanız bu adımı atlayabilirsiniz. `command not found` / `tanınmıyor` hatası alıyorsanız ya da sürüm 22'den küçükse aşağıdan işletim sisteminize uygun yöntemi seçin.

> **Hangi sürüm?** nodejs.org'da her zaman **LTS** (Long Term Support — uzun süreli destek) etiketli sürümü seçin. Daha kararlıdır.

### Windows

**Yöntem A — Yükleyici (en kolayı):**

1. <https://nodejs.org> adresine gidin ve **LTS** sürümünün Windows yükleyicisini (`.msi`) indirin.
2. Dosyayı çalıştırın, tüm adımlarda varsayılan seçenekleri bırakıp **Next** diyerek ilerleyin.
3. Kurulum bitince **açık olan tüm terminalleri kapatıp yeniden açın** (PATH ayarının yüklenmesi için gerekli).
4. PowerShell'de `node --version` ile kontrol edin.

**Yöntem B — winget (komut satırı):**

```powershell
winget install OpenJS.NodeJS.LTS
```

> PowerShell'de `npm` çalıştırırken *"running scripts is disabled on this system"* hatası alırsanız PowerShell'i açıp bir kez şunu çalıştırın:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

### macOS

**Yöntem A — Yükleyici:** <https://nodejs.org> adresinden **LTS** sürümünün macOS yükleyicisini (`.pkg`) indirip çalıştırın.

**Yöntem B — Homebrew** (kuruluysa):

```bash
brew install node@22
```

### Linux

Dağıtımın kendi paket deposundaki Node.js sürümü genellikle eskidir. Bu yüzden aşağıdaki sürüm yöneticisi yöntemini öneriyoruz.

### Tüm sistemler için önerilen: sürüm yöneticisi (nvm)

Sürüm yöneticisi, birden fazla Node.js sürümünü yan yana kurmanızı ve aralarında geçiş yapmanızı sağlar; `sudo` gerektirmez.

**macOS / Linux — [nvm](https://github.com/nvm-sh/nvm):**

```bash
# 1) nvm'i kur (güncel komut için github.com/nvm-sh/nvm adresine bakın)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2) Terminali kapatıp yeniden açın, ardından:
nvm install --lts     # en güncel LTS sürümünü kurar
nvm use --lts         # o sürümü kullanmaya başlar

# 3) Kontrol
node --version
```

**Windows — [nvm-windows](https://github.com/coreybutler/nvm-windows):** sayfadaki *Releases* bölümünden `nvm-setup.exe` dosyasını indirip kurun, sonra yeni bir terminalde:

```powershell
nvm install lts
nvm use lts
```

---

## 3. Projeyi indirme

**Git ile:**

```bash
git clone <depo-adresi> backend-workshop
cd backend-workshop
```

**Git olmadan:** depo sayfasından **Code → Download ZIP** ile indirin, bir klasöre çıkarın ve terminalde o klasöre gidin:

```bash
cd yol/klasor/backend-workshop
```

> **Önemli:** Bundan sonraki tüm komutlar projenin **ana klasöründe** (içinde `package.json` olan klasör) çalıştırılmalıdır. Emin olmak için `ls` (Windows: `dir`) yazıp `package.json` dosyasını görüp görmediğinize bakın.

VS Code ile açmak için: `code .` (ya da VS Code'da **File → Open Folder**).

---

## 4. Bağımlılıkları kurma

```bash
npm install
```

Bu komut `package.json` dosyasındaki bağımlılıkları (bu projede yalnızca **Express**) indirip `node_modules/` klasörüne koyar. Yalnızca bir kez çalıştırmanız yeterli.

Başarılı olduğunda `added XX packages` benzeri bir çıktı görürsünüz.

---

## 5. Örnekleri çalıştırma

Her örnek `package.json` içinde bir `npm run` komutu olarak tanımlıdır:

| # | Konu | Süre | Komut | Dosya |
|---|------|------|-------|-------|
| 1 | Web ve HTTP | 15 dk | — | — |
| 2 | Node.js temelleri | 10 dk | `npm run ornek:1` | `ornekler/01-node-temelleri/index.js` |
| 3 | Framework'süz sunucu | 10 dk | `npm run ornek:2` | `ornekler/02-http-sunucu/server.js` |
| 4 | Express'e giriş | 20 dk | `npm run ornek:3` | `ornekler/03-express-giris/index.js` |
| 5 | Middleware | 20 dk | `npm run ornek:4` | `ornekler/04-middleware/index.js` |
| 6 | Canlı kodlama: Todo API | 25 dk | `npm run ornek:5` (çözüm: `npm run ornek:5-bitmis`) | `ornekler/05-todo-api/` |
| 6b | Kalıcılık: JSON dosyası veritabanı | 10 dk | `npm run ornek:6` | `ornekler/06-json-db/` |
| 7 | Part 2 kavramlarına bakış (kodsuz) | 10 dk | — | — |
| 8 | Sorular | 5 dk | — | — |

### Genel kurallar

- **Örnek 1** bir sunucu değildir: çıktısını terminale yazar ve kendiliğinden biter.
- **Örnek 2–6** birer web sunucusudur ve `http://localhost:3000` adresinde çalışır. Terminalde `... http://localhost:3000 adresinde çalışıyor` yazısını görünce hazırdır.
- Sunucu çalıştığı sürece terminal "takılı" görünür — bu normaldir, sunucu istek bekliyordur. **Durdurmak için `Ctrl+C`**.
- Aynı anda yalnızca **bir** sunucu çalıştırın; hepsi 3000 portunu kullanır. Yeni örneğe geçmeden önce eskisini `Ctrl+C` ile durdurun.
- Örnek 2–5 `node --watch` ile çalışır: dosyayı kaydettiğinizde sunucu otomatik yeniden başlar.

### Örnek 1 — Node.js temelleri

```bash
npm run ornek:1
```

ESM `import`, event loop sırası, `async/await`, sıralı ve paralel bekleme (`Promise.all`) ve dosya okuma gösterilir. Çıktıdaki numaraların (1, 2, 3, 4) hangi sırayla yazıldığına ve `sirali` (~1000 ms) ile `paralel` (~500 ms) sürelerinin farkına dikkat edin.

### Örnek 2 — Framework'süz HTTP sunucusu

```bash
npm run ornek:2
```

Tarayıcıda açın: <http://localhost:3000> ve <http://localhost:3000/api/saat>. Routing'in ve body okumanın elle yapıldığını görün; `POST /api/echo` isteğini [6. bölümdeki](#6-sunucuya-istek-atma) yöntemlerle atabilirsiniz.

### Örnek 3 — Express'e giriş

```bash
npm run ornek:3
```

Denemek için:

- <http://localhost:3000/api/kullanicilar>
- <http://localhost:3000/api/kullanicilar?sehir=İstanbul> (query string)
- <http://localhost:3000/api/kullanicilar/2> (route parametresi)
- <http://localhost:3000/api/kullanicilar/99> (404)
- <http://localhost:3000/api/yanit/json> — `json` yerine `metin`, `bos`, `yonlendir` deneyin

### Örnek 4 — Middleware

```bash
npm run ornek:4
```

Her istekte terminalde logger çıktısını (`GET /api/istek → 200 (1 ms)`) görürsünüz. `istekler.http` dosyasındaki 04 bölümündeki istekleri deneyin: `X-Istek-Id` header'ı, `X-API-Key: gizli123` ile korunan `/api/gizli`, `/api/sayi/abc` ile 400 hatası ve `/api/patla` ile hata middleware'i.

### Örnek 5 — Todo API (canlı kodlama)

```bash
npm run ornek:5          # boş başlangıç dosyası (baslangic.js)
npm run ornek:5-bitmis   # tamamlanmış hali (bitmis.js)
```

`baslangic.js` dosyasındaki `TODO 1`–`TODO 5` yorumlarını sırayla doldurun. Dosyayı her kaydettiğinizde sunucu yeniden başlar; değişikliği hemen deneyebilirsiniz. Takıldığınızda `bitmis.js` dosyasına bakın.

> Veriler bellekte tutulur: sunucu yeniden başlayınca (dosyayı kaydetmek dahil) başlangıçtaki iki göreve geri döner.

### Örnek 6 — JSON dosyası ile kalıcılık

```bash
npm run ornek:6
```

Örnek 5 ile aynı API, ama veriler `ornekler/06-json-db/data/todos.json` dosyasına yazılır. Bu örnek bilerek `--watch` **olmadan** çalışır. Deneme:

1. `POST /todos` ile birkaç görev ekleyin.
2. Sunucuyu `Ctrl+C` ile durdurun ve `npm run ornek:6` ile tekrar başlatın.
3. `GET /todos` — görevler hâlâ orada!
4. `ornekler/06-json-db/data/todos.json` dosyasını açıp içeriğine bakın.

Sıfırdan başlamak için `data/` klasörünü silmeniz yeterli; ilk istekte yeniden oluşturulur.

---

## 6. Sunucuya istek atma

Tarayıcı yalnızca `GET` isteği atar. `POST`, `PATCH`, `DELETE` için aşağıdaki yöntemlerden birini kullanın.

### Yöntem A — VS Code REST Client (önerilen)

1. VS Code'da **Extensions** (`Ctrl+Shift+X`) bölümünden **REST Client** (yazarı: Huachao Mao) eklentisini kurun.
2. `istekler.http` dosyasını açın.
3. Her isteğin üstünde beliren **Send Request** yazısına tıklayın; yanıt sağ tarafta açılır.

Dosya örneklere göre bölümlere ayrılmıştır (`--- 02 / 03 / 04 ---`, `--- 05 Todo API ---` ...). Hangi sunucu çalışıyorsa onun bölümündeki istekleri kullanın.

### Yöntem B — curl

macOS, Linux ve Windows 10+ üzerinde `curl` hazır gelir. Örnek 5 veya 6 çalışırken:

```bash
curl http://localhost:3000/todos
curl http://localhost:3000/todos/1
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Süt al"}'
curl -X PATCH http://localhost:3000/todos/2 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE http://localhost:3000/todos/1 -i
```

> **Windows PowerShell kullanıcıları:** PowerShell'de `curl`, `Invoke-WebRequest` komutunun takma adıdır ve yukarıdaki sözdizimini anlamaz. Bunun yerine `curl.exe` yazın ve JSON'daki tırnakları kaçırın:
> ```powershell
> curl.exe -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{\"title\":\"Süt al\"}'
> ```
> Ya da Git Bash kullanın; ya da en kolayı, REST Client'ı tercih edin.

---

## 7. Slaytlar

`slides/part1.md` bir [Marp](https://marp.app) sunumudur. Hazır çıktılar `slides/part1.html` ve `slides/part1.pdf` olarak depoda bulunur.

Yeniden üretmek için (ilk çalıştırmada Marp CLI `npx` ile otomatik indirilir, internet gerekir):

```bash
npm run slaytlar        # tarayıcıda önizleme
npm run slaytlar:html   # slides/part1.html üret
npm run slaytlar:pdf    # slides/part1.pdf üret (Chrome/Chromium/Edge gerekir)
```

Ya da VS Code'da **Marp for VS Code** eklentisiyle dosyayı açıp önizleyin.

---

## 8. Sık karşılaşılan sorunlar

| Belirti | Sebep / Çözüm |
|---------|---------------|
| `node: command not found` / `'node' is not recognized` | Node.js kurulu değil ya da terminal kurulumdan önce açılmış. Terminali kapatıp yeniden açın; olmazsa [2. bölüme](#2-nodejs-kurulumu) dönün. |
| `Cannot find package 'express'` | `npm install` çalıştırılmamış. Proje ana klasöründe `npm install` yazın. |
| `npm error enoent Could not read package.json` | Yanlış klasördesiniz. `cd` ile içinde `package.json` olan klasöre gidin. |
| `Error: listen EADDRINUSE: address already in use :::3000` | 3000 portunu başka bir sunucu (genelde önceki örnek) kullanıyor. O terminalde `Ctrl+C` yapın. Bulamıyorsanız: macOS/Linux `lsof -i :3000`, Windows `netstat -ano \| findstr :3000` ile süreci bulup kapatın. |
| `SyntaxError: Cannot use import statement outside a module` veya `--watch` tanınmıyor | Node.js sürümünüz çok eski. `node --version` ile kontrol edip 22+ kurun. |
| `ENOENT ... package.json` (Örnek 1'de) | Örnek 1 `package.json`'ı bulunduğunuz klasörden okur. Komutu proje ana klasöründen `npm run ornek:1` ile çalıştırın. |
| Tarayıcıda "Bu siteye ulaşılamıyor" | Sunucu çalışmıyor. Terminalde hata var mı bakın ve adresin `http://localhost:3000` olduğundan emin olun. |
| `POST` isteği 400 dönüyor | Body geçerli JSON değil ya da `Content-Type: application/json` header'ı eksik. |
| PowerShell: *running scripts is disabled* | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` çalıştırın. |
