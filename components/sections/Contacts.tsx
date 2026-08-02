'use client';

import { useState } from 'react';
import { CONTACTS } from '@/config/constants';
import type { ContactsContent } from '@/lib/content-types';

export default function Contacts({ content }: { content: ContactsContent }) {
  const { sectionLabel, title, telegramLabel, successTitle, successText } = content;
  const [form, setForm] = useState({ name: '', contact: '', task: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: подключить отправку
    setSent(true);
  }

  return (
    <section id="contacts" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite whitespace-pre-line">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-tile-mint tile-shadow rounded-[24px] p-8">
          {sent ? (
            <div className="flex flex-col gap-4 py-8">
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">{successTitle}</h3>
              <p className="text-graphite-mid leading-relaxed">{successText}</p>
              <button onClick={() => { setSent(false); setForm({ name: '', contact: '', task: '' }); }} className="text-sm text-teal underline underline-offset-4 self-start">
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-graphite-mid mb-1.5" htmlFor="name">Как вас зовут</label>
                <input id="name" name="name" type="text" required placeholder="Имя или компания" value={form.name} onChange={handleChange} className="w-full border border-graphite/20 rounded-xl px-4 py-3 text-sm text-graphite bg-white/70 placeholder:text-graphite-light focus:outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs text-graphite-mid mb-1.5" htmlFor="contact">Телеграм или телефон</label>
                <input id="contact" name="contact" type="text" required placeholder="@username или +7..." value={form.contact} onChange={handleChange} className="w-full border border-graphite/20 rounded-xl px-4 py-3 text-sm text-graphite bg-white/70 placeholder:text-graphite-light focus:outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs text-graphite-mid mb-1.5" htmlFor="task">Коротко о задаче</label>
                <textarea id="task" name="task" required rows={4} placeholder="Что происходит и что хотите изменить" value={form.task} onChange={handleChange} className="w-full border border-graphite/20 rounded-xl px-4 py-3 text-sm text-graphite bg-white/70 placeholder:text-graphite-light focus:outline-none focus:border-teal resize-none" />
              </div>
              <button type="submit" className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3.5 rounded-full transition-colors text-sm">
                Обсудить проект
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-terracotta tile-shadow rounded-[24px] p-8 flex flex-col gap-4 flex-1">
            <p className="text-white/60 text-sm">Напрямую в телеграм — быстрее всего</p>
            <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-2xl text-white uppercase tracking-tight hover:text-white/80 transition-colors">
              {telegramLabel}
            </a>
          </div>
          <div className="bg-tile-cream tile-shadow rounded-[24px] p-8 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-graphite-light font-medium">Контакты</p>
            <a href={`tel:${CONTACTS.phone.replace(/\D/g, '')}`} className="text-graphite font-medium hover:text-terracotta transition-colors">{CONTACTS.phone}</a>
            <a href={`mailto:${CONTACTS.email}`} className="text-graphite-mid text-sm hover:text-graphite transition-colors">{CONTACTS.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
