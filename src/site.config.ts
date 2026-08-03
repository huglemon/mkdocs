export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'InWind Docs',
  description:
    'InWind CMS 文档中心 — 客户使用指南、模板开发规范与开发者 API。',
  url:
    import.meta.env.PUBLIC_SITE_URL ??
    'https://docs.inwindoverseas.com',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  ogImage: '/og.png',
  twitterHandle: '',
  homeLabel: '官网',
  homeUrl: 'https://inwind.cn',
  githubUrl: 'https://github.com/huglemon/inwind-cms-saas',
  git: {
    user: 'huglemon',
    repo: 'mkdocs',
    branch: 'inwind-docs',
  },
};
