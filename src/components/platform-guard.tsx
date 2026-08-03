'use client';

import { useEffect } from 'react';

/**
 * 平台后台手册守卫
 * 挂载时检查登录 cookie（docs_auth=1），无则跳转登录页。
 * 拦截 SPA 侧边栏切换（客户端路由不经过 Worker）。
 */
export function PlatformGuard() {
  useEffect(() => {
    const authed = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith('docs_auth=1'));

    if (!authed) {
      const next = window.location.pathname;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
    }
  }, []);

  return null;
}
