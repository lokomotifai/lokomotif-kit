import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 600 }}>Lokomotif Kit</span>,
  project: {
    link: 'https://github.com/lokomotif-ai/lokomotif-kit',
  },
  docsRepositoryBase: 'https://github.com/lokomotif-ai/lokomotif-kit/tree/main/docs',
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
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
};

export default config;
