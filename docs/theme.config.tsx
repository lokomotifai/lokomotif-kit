import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <img
        src="/logo.svg"
        alt="Lokomotif"
        width={130}
        height={22}
        className="lokomotif-logo"
        style={{ display: 'block' }}
      />
      <span
        style={{
          fontWeight: 500,
          fontSize: '0.95rem',
          opacity: 0.55,
          marginLeft: '0.25rem',
        }}
      >
        Kit
      </span>
    </span>
  ),
  project: {
    link: 'https://github.com/lokomotifai/lokomotif-kit',
  },
  docsRepositoryBase: 'https://github.com/lokomotifai/lokomotif-kit/tree/main/docs',
  footer: {
    content: 'Apache 2.0 · Lokomotif AI · kit@lokomotif.ai',
  },
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'tr', name: 'Türkçe' },
  ],
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  feedback: {
    content: 'Suggest an edit on GitHub →',
    labels: 'docs',
  },
  editLink: {
    content: 'Edit this page on GitHub',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Lokomotif Kit — open-source methodology core" />
      <meta
        property="og:description"
        content="The open-source methodology core for Corporate AI Adoption. RTCSG and the Three-Horizon Adoption Journey, in code."
      />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta name="theme-color" content="#20333C" />
    </>
  ),
};

export default config;
