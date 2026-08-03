'use client';

import { useState } from 'react';

/**
 * 平台后台手册登录表单
 * POST /api/auth 验证密码，成功由 Worker 302 跳回原页。
 */
export function PlatformLoginForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Worker 302 到 next（原请求页），浏览器跟随
      window.location.href = res.url || '/platform/overview';
    } else {
      setError('密码错误，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">平台后台手册登录</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入访问密码"
          autoFocus
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? '验证中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
