/**
 * 文档站全局配置。
 *
 * ⚠️ 本仓一次构建只出一个站，产物由 `PUBLIC_SITE` 决定（见 package.json 的
 * `build:internal` / `build:website`）。两个域的 HTML 是**各自预生成**的，
 * Worker（worker.ts）只做 `ASSETS.fetch`，不做渲染——故 canonical / og:url / sitemap
 * 必须由**构建期**的 `PUBLIC_SITE` 决定，运行期的 SITE_MODE（internal/public，管登录墙）管不到。
 *
 * 因此：若只认 `PUBLIC_SITE_URL`（全仓无人设它），公开站会静默兜底成内部域，
 * 让公开站的 canonical / og:url / sitemap 全指向 `docs.inwindoverseas.com`（那站全站登录）。
 * 判据与 source.config.ts 同源，均读 `process.env.PUBLIC_SITE`——本模块仅服务端引用（经 press.config.tsx）。
 */
const SITE_URL_BY_MODE = {
  website: 'https://docs-website.inwindoverseas.com',
  internal: 'https://docs.inwindoverseas.com',
} as const;

// 两个 build 脚本各自设好 PUBLIC_SITE；缺省（如本地 dev）落到 internal
const siteMode =
  process.env.PUBLIC_SITE === 'website' ? 'website' : 'internal';

export const siteConfig = {
  name: process.env.PUBLIC_SITE_NAME ?? 'InWind Docs',
  description:
    'InWind CMS 文档中心 — 客户使用指南、模板开发规范与开发者 API。',
  // 兜底随模式走；PUBLIC_SITE_URL 仍可显式覆盖（预发 / 自定义域）
  url: process.env.PUBLIC_SITE_URL ?? SITE_URL_BY_MODE[siteMode],
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
