# Lokomotif Kit

**Corporate AI Adoption metodolojisinin açık kaynak çekirdeği.**

Lokomotif Kit, Lokomotif AI'nin geliştirdiği **RTCSG** ve **Üç-Ufuk Adaptasyon Yolculuğu** metodolojisinin referans implementasyonudur. Kit, metodu kamuya açar — pratisyenler, partnerler ve müşteri ekipleri doğrudan uygulayabilsin diye. Dahili Workbench ve opsiyonel managed Control Plane bunun üzerine oturur.

[English](./README.md) · [Dökümantasyon](https://kit.lokomotif.ai) · [Lokomotif AI](https://lokomotif.ai)

---

## Ne içeriyor

Model-agnostik ve runtime-agnostik bir kitaplık:

- **RTCSG modülleri** — prompt mimarisinin beş katmanı boyunca kompoze edilebilen birimler: Role, Task & Format, Context & Constraint, Style & Tone, Guardrail.
- **Şema** — her modül lint anında, build anında ve install anında JSON Schema doğrulamasından geçer.
- **CLI** — `lokomotif` ile flow'ları listele, doğrula, kompoze et, değerlendir, dağıt.
- **Eval harness** — Python test runner; deterministik ve judge'lı kontroller. Eval'siz modül yayımlanmaz.
- **Blueprints** — Anthropic Agent SDK, Dify, n8n ve LangGraph için runtime-spesifik referans implementasyonları. Vendor-spesifik kod burada yaşar; `modules/`'de asla.

## Ne değil

- Prompt kitaplığı değil. RTCSG modülleri yalnız string şablon değil; context, governance ve ölçüm taşır.
- Runtime gerektiren bir framework değil. Modüller runtime'lar arasında taşınabilir tasarlandı.
- Küratörsüz bir pazaryeri değil. Kit editöryeldir; modül kalitesi schema, eval ve review ile kapı tutulur.
- Engagement'ın yerine geçmez. Kit metodu yayımlar; metodun pratiği Lokomotif AI'nin Adoption Sprint, Workflow Rewire ve Agentic Scale çalışmalarıyla teslim edilir.

## RTCSG

Her modül beş concern'den tam olarak birine ait:

- **R — Role.** AI kim gibi davranıyor. Göreve ayarlı uzmanlık, perspektif, otorite.
- **T — Task & Format.** Ne yapılmalı; çıktı nasıl yapılandırılmalı.
- **C — Context & Constraint.** Modelin uyması gereken organizasyonel gerçeklik — veri sınırları, durumsal limitler, düzenleyici çerçeve.
- **S — Style & Tone.** Hedef kitleye ayarlı ses ve register.
- **G — Guardrail.** Modelin yapmaması gereken. Sınırlar, doğruluk standartları, organizasyonel risk kontrolleri.

Kompozisyon flow anında olur, modül anında değil. Role modülü guardrail gömmez; task modülü context taşımaz. Kit bunu zorlar.

## Durum

`v0.1.0` geliştirme aşamasında. Modül yüzeyi, CLI komutları ve schema ilk stabil sürümden önce değişebilir. Build sırası: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

## Stack

- **Monorepo:** pnpm workspaces + turborepo
- **TypeScript:** CLI, schema, SDK (Node 20+)
- **Python:** eval harness (`uv` + pytest, Python 3.12+)
- **YAML:** RTCSG modül tanımları
- **JSON Schema:** modül doğrulama, TypeScript tipleri ve Python dataclass'lara derlenir
- **Docs:** Nextra
- **CI:** GitHub Actions; release'lerde Sigstore provenance

## Kurulum

> Kit pre-release aşamasında. Aşağıdaki komutlar geliştirme ortamını kurar; yayımlanmış paketler, [implementasyon planının](./IMPLEMENTATION_PLAN.md) Faz 3'üyle birlikte gelir.

```bash
git clone https://github.com/lokomotif-ai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
cd packages/eval && uv sync
```

## Dökümantasyon

Dökümantasyon [kit.lokomotif.ai](https://kit.lokomotif.ai) adresinde yaşayacak. Site yayına girene dek katkı kuralları için [`Lokomotif-Kit.md`](./Lokomotif-Kit.md), build sırası için [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

## Katkıda bulunma

Geliştirme akışı, RFC süreci ve modül yazım kuralları için [`CONTRIBUTING.md`](./CONTRIBUTING.md). Her modül en az bir eval testiyle gelir. İstisnasız.

## Yönetişim

Kit, Lokomotif Core Team tarafından sürdürülür. Bkz: [`GOVERNANCE.md`](./GOVERNANCE.md).

## Güvenlik

Açıklık tespit ettiyseniz: [kit@lokomotif.ai](mailto:kit@lokomotif.ai). Lütfen güvenlik raporları için public issue açmayın. Detay: [`SECURITY.md`](./SECURITY.md).

## Frontier bağlantısı

Lokomotif AI, **Anthropic Ambassador İstanbul**. Kit, agentic sistemler ve responsible AI alanında güncel frontier pratiğini yansıtır.

## Lisans

Apache License 2.0. Bkz: [`LICENSE`](./LICENSE) ve [`NOTICE`](./NOTICE).

## Lokomotif AI hakkında

Lokomotif AI, **Türkiye'nin ilk Corporate AI Adoption Partner'ı**. Firma, kurumsal sektörler genelinde agentic transformasyon için operating model tasarlar. Pratisyen topluluk: [Komünite](https://komunite.lokomotif.ai). Daha fazlası: [lokomotif.ai](https://lokomotif.ai).
