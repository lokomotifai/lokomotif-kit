import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  staticImage: true,
});

export default withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
  },
  // The site is the category-construction surface; treat redirects and
  // rewrites with care. Keep them in this file so they're versioned.
  async redirects() {
    return [];
  },
});
