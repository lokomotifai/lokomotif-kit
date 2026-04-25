import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  staticImage: true,
});

export default withNextra({
  reactStrictMode: true,
  // i18n is not enabled at the Next.js level — Turkish content lives
  // under pages/tr/ as a normal sub-route. The theme's language
  // switcher in theme.config.tsx still works for navigation between
  // English (/) and Turkish (/tr).
  async redirects() {
    return [];
  },
});
