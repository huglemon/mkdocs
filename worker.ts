/**
 * InWind Docs Worker 入口
 * 双站点模式（SITE_MODE）：
 * - internal（docs.inwindoverseas.com）：全站需登录（除 /login、/api/*）
 * - public（docs-website.inwindoverseas.com）：全站公开
 * 密码从环境变量 PLATFORM_DOCS_PASSWORD 读取（不硬编码进仓库）。
 */

interface Env {
	ASSETS: Fetcher;
	PLATFORM_DOCS_PASSWORD?: string;
	SITE_MODE?: "internal" | "public";
}

const AUTH_COOKIE = "docs_auth";
const COOKIE_TTL = 60 * 60 * 24 * 7; // 7 天

function setAuthCookie(): string {
	return `${AUTH_COOKIE}=1; Path=/; Max-Age=${COOKIE_TTL}; HttpOnly; SameSite=Lax; Secure`;
}

function clearAuthCookie(): string {
	return `${AUTH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

function hasValidCookie(request: Request): boolean {
	const cookieHeader = request.headers.get("Cookie") ?? "";
	return cookieHeader.includes(`${AUTH_COOKIE}=1`);
}

function redirectToLogin(url: URL): Response {
	const target = `${url.origin}/login?next=${encodeURIComponent(url.pathname)}`;
	return Response.redirect(target, 302);
}

function redirectBack(url: URL, cookie?: string): Response {
	const next = url.searchParams.get("next") ?? "/";
	return new Response(null, {
		status: 302,
		headers: {
			Location: next,
			...(cookie ? { "Set-Cookie": cookie } : {}),
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const password = env.PLATFORM_DOCS_PASSWORD ?? "";

		// 登录接口：POST /api/auth
		if (url.pathname === "/api/auth" && request.method === "POST") {
			const body = (await request.json().catch(() => null)) as { password?: string } | null;
			const pass = body?.password;
			if (pass && pass === password) {
				return redirectBack(url, setAuthCookie());
			}
			return new Response(JSON.stringify({ ok: false, error: "密码错误" }), {
				status: 401,
				headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
			});
		}

		// 登出：GET /api/logout
		if (url.pathname === "/api/logout") {
			return redirectBack(url, clearAuthCookie());
		}

		// 公开站点：直接静态资源
		if (env.SITE_MODE !== "internal") {
			return env.ASSETS.fetch(request);
		}

		// internal：登录页和 API 放行，其余全站需登录
		if (url.pathname.startsWith("/login") || url.pathname.startsWith("/api/")) {
			return env.ASSETS.fetch(request);
		}

		if (!password || !hasValidCookie(request)) {
			return redirectToLogin(url);
		}

		return env.ASSETS.fetch(request);
	},
};
