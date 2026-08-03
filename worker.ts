/**
 * InWind Docs Worker 入口
 * 拦截 /platform/* 路径做 Basic Auth（平台后台手册受保护），其余路径放行静态资源。
 * 密码从环境变量 PLATFORM_DOCS_PASSWORD 读取（不硬编码进仓库）。
 */

interface Env {
	ASSETS: Fetcher;
	PLATFORM_DOCS_PASSWORD?: string;
}

// 校验 Basic Auth 头
function checkAuth(request: Request, password: string): boolean {
	const auth = request.headers.get("Authorization") ?? "";
	if (!auth.startsWith("Basic ")) return false;

	const decoded = atob(auth.slice(6));
	const [, pass] = decoded.split(":");
	return pass === password;
}

function unauthorized(): Response {
	return new Response("Authentication required", {
		status: 401,
		headers: {
			"WWW-Authenticate": 'Basic realm="InWind 平台后台手册"',
			"Cache-Control": "no-store",
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const password = env.PLATFORM_DOCS_PASSWORD ?? "";

		// 平台后台手册受密码保护
		if (url.pathname.startsWith("/platform")) {
			if (!password || !checkAuth(request, password)) {
				return unauthorized();
			}
		}

		// 其余路径走静态资源
		return env.ASSETS.fetch(request);
	},
};
