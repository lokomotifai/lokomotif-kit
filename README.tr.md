<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-lokomotif-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-lokomotif.svg">
    <img src="./assets/logo-lokomotif.svg" alt="Lokomotif" width="220">
  </picture>
</p>

<p align="center">
  <strong>Corporate AI Adoption metodolojisinin açık kaynak çekirdeği.</strong><br>
  RTCSG ve Üç-Ufuk Adaptasyon Yolculuğu, kod olarak.<br>
  Apache 2.0. Model-bağımsız. Runtime-bağımsız.
</p>

<p align="center">
  <a href="#hizli-baslangic"><strong>Hızlı Başlangıç</strong></a> ·
  <a href="https://kit.lokomotif.ai"><strong>Dökümantasyon</strong></a> ·
  <a href="./README.md"><strong>English</strong></a> ·
  <a href="./ROADMAP.md"><strong>Yol Haritası</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>Katkı</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lokomotif/cli"><img src="https://img.shields.io/npm/v/@lokomotif/cli?label=%40lokomotif%2Fcli" alt="npm @lokomotif/cli"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache 2.0"></a>
  <a href="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/ci.yml"><img src="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/lokomotifai/lokomotif-kit"><img src="https://api.scorecard.dev/projects/github.com/lokomotifai/lokomotif-kit/badge" alt="OpenSSF Scorecard"></a>
  <a href="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/codeql.yml"><img src="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/codeql.yml/badge.svg?branch=main" alt="CodeQL"></a>
  <a href="https://kit.lokomotif.ai"><img src="https://img.shields.io/badge/docs-kit.lokomotif.ai-7057ff" alt="Docs"></a>
</p>

---

## Lokomotif Kit nedir?

Lokomotif Kit, **RTCSG** (Role, Task, Context, Style, Guardrail — beş katmanlı prompt mimarisi) ve **Üç-Ufuk Adaptasyon Yolculuğu**'nun referans implementasyonudur. Lokomotif AI'nin her engagement'ta kullandığı metodu kod olarak yayımlar — pratisyenler, partnerler ve müşteri ekipleri doğrudan uygulayabilsin diye.

Kit editöryeldir, küratörsüz pazaryeri değil. Kalite şema, eval ve review ile kapı tutulur.

| Kit'siz                                                          | Kit ile                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ❌ Ekipler arasında copy-paste yapılan ad-hoc prompt'lar         | ✅ Şema, versiyon, owner, lisansla gelen kompoze edilebilir RTCSG modül |
| ❌ Hisle ve demo cilasıyla ölçülen kalite                        | ✅ Her modül en az bir geçen eval suite ile yayımlanır                  |
| ❌ Tek runtime'a vendor lock-in                                  | ✅ Aynı modül Anthropic SDK, Dify, n8n, LangGraph'a kompoze olur        |
| ❌ Launch sonrası eklenen compliance                             | ✅ Guardrail'ler şemada birinci sınıf modül                             |
| ❌ Tribal knowledge'ta ve sunum desteklerinde yaşayan metodoloji | ✅ Apache 2.0 — fork'la, oku, denetle, kullan                           |
| ❌ Elle bağladığın observability                                 | ✅ Her flow ve eval için OpenTelemetry semantik konvansiyonları         |

---

## Nasıl çalışır

```
   Modülü yaz                          Doğrula                          Eval çalıştır
        │                                  │                                 │
   ┌────▼─────┐                       ┌────▼─────┐                      ┌────▼────┐
   │  YAML    │ ── şema ───────────►  │  Modül   │ ── lokomotif-eval ─► │  Pass   │
   │  + eval  │                       │  geçti   │                      │  /Fail  │
   └────┬─────┘                       └──────────┘                      └─────────┘
        │
   ┌────▼─────┐  R → T → C → S → G   ┌──────────┐    Anthropic SDK
   │  Flow    │ ──────────────────►  │  Compose │ ─► Dify
   │  YAML    │   kanonik sıra       │   Hash   │ ─► n8n
   └──────────┘   dedupe + render    └──────────┘ ─► LangGraph
```

Her adım zorlanır. Şemayı geçemeyen modül merge edilemez. Eval'i geçmeyen modül yayımlanamaz. Kompozisyonlar deterministiktir — aynı modüller hangi sırada verilirse verilsin aynı 16 karakterli composition hash'i üretir.

---

## İçinde ne var

| **📐 JSON Schema**                                                                                | **🛠️ CLI**                                                                            | **📦 SDK**                                                                    |
| :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| Her RTCSG kind için Draft-07 şeması, TypeScript tipleri ve Result dönen `validate()`              | `lokomotif` binary — listele, doğrula, scaffold, kompoze et, evaluate, deploy         | Runtime-bağımsız TypeScript composition kütüphanesi, sıfır vendor SDK         |
| **🧪 Eval Harness**                                                                               | **📡 OTel Schema**                                                                    | **📚 Kanonik Modüller**                                                       |
| Python test runner (uv, pytest); JSON Pointer hedefli deterministik ve LLM-judged kontroller      | Modül, flow, compose, eval attribute'ları için OpenTelemetry semantik konvansiyonları | Üç Pass-1 modülü: KVKK uyumu, executive ses, Türkiye-aware PII guardrail      |
| **🚂 4 Runtime Blueprint**                                                                        | **📖 EN + TR Dökümantasyon**                                                          | **🔐 Sigstore Provenance**                                                    |
| Anthropic Agent SDK · Dify · n8n · LangGraph — vendor-spesifik kod burada yaşar, modüllerde değil | [kit.lokomotif.ai](https://kit.lokomotif.ai) — EN canonical, TR priority sayfaları    | Her release npm publish + Sigstore üzerinden SLSA build provenance ile imzalı |

---

## RTCSG

Her modül beş concern'den tam olarak birine ait:

| Katman | Concern              | Ne taşır                                                                      |
| :----: | -------------------- | ----------------------------------------------------------------------------- |
| **R**  | Role                 | AI kim olarak davranıyor. Göreve göre ayarlı uzmanlık, perspektif, otorite.   |
| **T**  | Task & Format        | Ne yapılmalı; çıktı nasıl yapılandırılmalı.                                   |
| **C**  | Context & Constraint | Modelin uyması gereken organizasyonel gerçeklik — veri sınırları, regülasyon. |
| **S**  | Style & Tone         | Hedef kitleye ayarlı ses ve register.                                         |
| **G**  | Guardrail            | Modelin yapmaması gereken. Sınırlar, doğruluk standartları, risk kontrolleri. |

Kompozisyon flow anında olur, modül anında değil. Role modülü guardrail gömmez; task modülü context taşımaz. Kit bunu zorlar.

Tam metod: [kit.lokomotif.ai/method](https://kit.lokomotif.ai/method).

---

## Hızlı Başlangıç {#hizli-baslangic}

### CLI'yi kullan

```bash
npx @lokomotif/cli@latest --help
```

### Projeye ekle

```bash
pnpm add @lokomotif/sdk @lokomotif/schema
# veya runtime adapter için:
pnpm add @lokomotif/blueprint-anthropic-sdk
```

### İlk flow'unu kompoze et

```ts
import { composeFlow } from '@lokomotif/sdk';

const composed = composeFlow(
  {
    name: 'kvkk-board-brief',
    modules: [
      'roles/finance/your-role', // kendi yazdığın role
      'contexts/finance/kvkk-compliance',
      'styles/cross-industry/executive-board-brief',
      'guardrails/cross-industry/pii-tr',
    ],
  },
  { modulesDir: './modules', language: 'tr' },
);

console.log(composed.text); // R → T → C → S → G sıralı prompt
console.log(composed.compositionHash); // 16 karakterli deterministik hash
```

### Kit üzerinde geliştirme yap

```bash
git clone https://github.com/lokomotifai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
cd packages/eval && uv sync
pnpm test          # tam TypeScript suite
pnpm validate:modules
```

Tam walkthrough: [kit.lokomotif.ai/tr/getting-started](https://kit.lokomotif.ai/tr/getting-started).

---

## Komutlar

| Komut                               | Ne yapar                                                        |
| ----------------------------------- | --------------------------------------------------------------- |
| `lokomotif modules list`            | RTCSG modüllerini kind, version, dillerle listele               |
| `lokomotif modules validate <glob>` | JSON Schema'ya karşı doğrula, JSON Pointer hata yollarıyla      |
| `lokomotif modules new <kind> <ad>` | Frontmatter-tam modül + eval placeholder scaffold et            |
| `lokomotif compose <flow.yaml>`     | Modülleri tek bir RTCSG-sıralı prompt'a kompoze et              |
| `lokomotif eval run`                | Python eval harness'ı çalıştır (`lokomotif-eval`'a delege eder) |
| `lokomotif deploy`                  | Runtime blueprint hedeflerini listele                           |

Her komut `--json` (machine output) ve `--root <path>` (testabilite) destekler.

Tam referans: [kit.lokomotif.ai/cli](https://kit.lokomotif.ai/cli).

---

## Paketler

| Paket                                                                      | Amaç                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`@lokomotif/schema`](./packages/schema)                                   | Her RTCSG kind için JSON Schema, TypeScript tipleri ve `validate()` |
| [`@lokomotif/cli`](./packages/cli)                                         | `lokomotif` binary                                                  |
| [`@lokomotif/sdk`](./packages/sdk)                                         | Runtime-bağımsız composition kütüphanesi                            |
| [`@lokomotif/otel-schema`](./packages/otel-schema)                         | OpenTelemetry semantik konvansiyonları                              |
| [`@lokomotif/blueprint-anthropic-sdk`](./packages/blueprint-anthropic-sdk) | Anthropic Agent SDK adapter                                         |
| [`@lokomotif/blueprint-dify`](./packages/blueprint-dify)                   | Dify YAML adapter                                                   |
| [`@lokomotif/blueprint-n8n`](./packages/blueprint-n8n)                     | n8n workflow JSON adapter                                           |
| [`@lokomotif/blueprint-langgraph`](./packages/blueprint-langgraph)         | LangGraph state machine adapter                                     |
| [`packages/eval`](./packages/eval)                                         | Python eval harness (PyPI yayını v0.2.0'da)                         |

Tüm TypeScript paketleri `@lokomotif` scope'unda Sigstore provenance ile npm'e yayımlanır.

---

## Kanonik Modüller (v0.1.0)

[RFC 0001](./docs/rfcs/0001-phase-6-partial-scope.md) gereği kamu referanslarından alınmış üç Pass-1 modülü:

| Modül                                                                                                       | Ne kapsar                                                        |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`contexts/finance/kvkk-compliance`](./modules/contexts/finance/kvkk-compliance.yaml)                       | KVKK + BDDK fintech context (TR + EN)                            |
| [`styles/cross-industry/executive-board-brief`](./modules/styles/cross-industry/executive-board-brief.yaml) | Lokomotif executive ses (TR + EN)                                |
| [`guardrails/cross-industry/pii-tr`](./modules/guardrails/cross-industry/pii-tr.yaml)                       | Türkiye-aware PII guardrail — TC kimlik, IBAN, KVKK kişisel veri |

Pass-2 modülleri (`roles/finance/aml-analyst`, `tasks/general/structured-summary`) engagement-derived artefaktlar hazır olunca v0.2.0'da yayımlanacak. O zamana kadar `lokomotif modules new` ile kendi role ve task modüllerini scaffold et.

---

## Mimari

```
lokomotif-kit/
├── packages/
│   ├── schema/                       JSON Schema + TS tipleri + Pydantic tipleri
│   ├── cli/                          lokomotif binary (clipanion v4)
│   ├── sdk/                          Runtime-bağımsız composition
│   ├── otel-schema/                  OTel semantik konvansiyonları
│   ├── eval/                         Python harness (uv, pytest, mypy strict)
│   ├── blueprint-anthropic-sdk/      Anthropic Agent SDK adapter
│   ├── blueprint-dify/               Dify YAML adapter
│   ├── blueprint-n8n/                n8n workflow JSON adapter
│   └── blueprint-langgraph/          LangGraph state machine adapter
├── modules/                          Pass-1 kanonik modüller (3 + eval'leri)
├── docs/                             Nextra v3 site (EN canonical + TR priority)
├── docs/rfcs/                        Kabul edilmiş RFC'ler
├── .changeset/                       Release yönetimi
└── .github/                          CI, güvenlik tarama, governance
```

Detaylı mimari: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

---

## Güvenlik & Provenance

- Her release npm publish üzerinden **Sigstore** provenance attestation ile imzalanır (SLSA build v1).
- **OpenSSF Scorecard** skoru `main`'e her push'ta yayımlanır.
- **CodeQL** her push, PR ve haftalık cron'da çalışır.
- `main` branch protection ile required status check'ler (CI, CodeQL, Scorecard).
- Dependabot bağımlılıkları ve GitHub Actions'ları güncel tutar; docs stack için major bump'lar RFC ile.
- Açıklama politikası: [`SECURITY.md`](./SECURITY.md).

---

## Yol Haritası

- [x] **v0.1.0** — RTCSG schema, CLI, SDK, eval harness, dört runtime blueprint, üç Pass-1 modülü
- [x] Her push'ta Sigstore provenance + OpenSSF Scorecard + CodeQL
- [x] [kit.lokomotif.ai](https://kit.lokomotif.ai) — iki dilli docs (EN canonical + TR priority sayfaları)
- [ ] **v0.2.0** — Gerçek engagement'lardan Pass-2 modülleri (`roles/finance/aml-analyst`, `tasks/general/structured-summary`)
- [ ] **v0.2.0** — İlk sektör kütüphanesi: gerçek engagement'lara dayalı 3–5 finance modülü
- [ ] **v0.2.0** — RFC ile Nextra v4 / Next.js 15+ migrasyonu
- [ ] **v0.3.0** — Eval harness'a Anthropic-backed referans `LLMJudge`
- [ ] **v0.3.0** — `@lokomotif/sdk` OTel span'ları yayar (`lokomotif.flow.compose`)
- [ ] **v0.3.0** — `lokomotif deploy` komutunda tam blueprint dispatcher

Tam yol haritası: [`ROADMAP.md`](./ROADMAP.md).

---

## Katkı

Lokomotif Kit açık kaynak; çünkü organizasyonların AI'ı nasıl benimsediği kapalı destekler değil, açık kaynak kalitesi hak ediyor. Her katkı — yeni bir modül, daha iyi bir eval, runtime blueprint — bir kurumun AI'ı daha titiz benimsemesine yardım ediyor.

```bash
git clone https://github.com/lokomotifai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
```

Katkı rehberi: [`CONTRIBUTING.md`](./CONTRIBUTING.md). Modül yazımı: [kit.lokomotif.ai/module-authoring](https://kit.lokomotif.ai/module-authoring). RFC süreci: [kit.lokomotif.ai/rfcs](https://kit.lokomotif.ai/rfcs).

Her modül en az bir geçen eval ile gelir. İstisnasız.

---

## Frontier bağlantısı

Lokomotif AI, **Anthropic Ambassador İstanbul**. Kit, agentic sistemler ve responsible AI alanında güncel frontier pratiğini yansıtır.

---

## Geliştiren

[**Lokomotif AI**](https://lokomotif.ai) — Türkiye'nin ilk Corporate AI Adoption Partner'ı. Kit, firmanın Adoption Sprint, Workflow Rewire ve Agentic Scale çalışmalarının arkasındaki metodolojiyi yayımlar. Pratisyen topluluk: [Komünite](https://komunite.lokomotif.ai).

[**Fatih Güner**](https://github.com/fatihguner) (Lokomotif AI kurucusu) tarafından sürdürülmektedir.

[𝕏 @fatihguner](https://x.com/fatihguner) · [LinkedIn](https://linkedin.com/in/fatihguner)

---

## Lisans

[Apache 2.0](./LICENSE). Atıf gereksinimleri için [`NOTICE`](./NOTICE).

---

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-lokomotif-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-lokomotif.svg">
    <img src="./assets/logo-lokomotif.svg" alt="Lokomotif" width="100">
  </picture><br><br>
  <sub>Apache 2.0 ile açık kaynak. Metod, kod olarak.</sub>
</p>
