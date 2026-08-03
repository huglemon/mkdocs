import { defineDocs } from "fumadocs-mdx/config";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";

// 双部署：PUBLIC_SITE=website 只含客户指南（公开站），否则含开发+平台+登录（主站）
const isWebsite = process.env.PUBLIC_SITE === "website";

export const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
    files: isWebsite
      ? ["index.mdx", "customer/**/*.{mdx,md}"]
      : ["index.mdx", "login.mdx", "developer/**/*.{mdx,md}", "platform/**/*.{mdx,md}"],
  },
  meta: {
    schema: metaSchema,
    files: isWebsite
      ? ["customer/**/meta.json"]
      : ["developer/**/meta.json", "platform/**/meta.json"],
  },
});
