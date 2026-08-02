'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_NAME } from '@/config/constants';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Неверный пароль');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-display font-bold text-2xl uppercase tracking-tight text-graphite mb-8">
          {SITE_NAME} / Админка
        </p>
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 tile-shadow flex flex-col gap-4">
          <div>
            <label className="block text-xs text-graphite-mid mb-1.5" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-graphite/20 rounded-xl px-4 py-3 text-sm text-graphite bg-cream focus:outline-none focus:border-teal"
            />
          </div>
          {error && <p className="text-sm text-terracotta">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white font-medium py-3 rounded-full transition-colors text-sm"
          >
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
