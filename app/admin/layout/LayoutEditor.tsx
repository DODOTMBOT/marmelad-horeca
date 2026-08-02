'use client';

import { useState, useRef, useTransition } from 'react';
import { saveLayout } from '../actions';
import type { LayoutContent, SectionMeta } from '@/lib/content-types';

const SECTION_HREFS: Record<string, string> = {
  hero: '/',
  pains: '/#pains',
  services: '/#services',
  clients: '/#clients',
  cases: '/#cases',
  team: '/#team',
  process: '/#process',
  about: '/#about',
  contacts: '/#contacts',
};

export default function LayoutEditor({ initial }: { initial: LayoutContent }) {
  const [sections, setSections] = useState<SectionMeta[]>(initial.sections);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ── drag handlers ─────────────────────────────────────────────────────────
  function onDragStart(i: number) {
    dragIndex.current = i;
  }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    dragOverIndex.current = i;
  }
  function onDrop() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSections(next);
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  // ── field helpers ─────────────────────────────────────────────────────────
  function setLabel(i: number, label: string) {
    setSections((p) => p.map((s, j) => (j === i ? { ...s, label } : s)));
  }
  function toggleVisible(i: number) {
    setSections((p) => p.map((s, j) => (j === i ? { ...s, visible: !s.visible } : s)));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...sections];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setSections(next);
  }
  function moveDown(i: number) {
    if (i === sections.length - 1) return;
    const next = [...sections];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setSections(next);
  }

  // ── save ──────────────────────────────────────────────────────────────────
  function handleSave() {
    startTransition(async () => {
      await saveLayout({ sections });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <a href="/admin" className="text-xs text-graphite-light hover:text-graphite mb-1 block">
            ← Назад к панели
          </a>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">
            Структура страницы
          </h1>
          <p className="text-sm text-graphite-mid mt-1">
            Перетащите блоки для изменения порядка. Скройте ненужные.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={pending}
          className="shrink-0 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          {pending ? 'Сохранение…' : saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-graphite-light mb-4">
        <span className="flex items-center gap-1.5">
          <span className="text-base">⠿</span> перетащить
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border border-graphite/20 inline-block" /> скрыть/показать
        </span>
        <span>название блока можно переименовать</span>
      </div>

      {/* Section list */}
      <div className="flex flex-col gap-2">
        {sections.map((section, i) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={onDrop}
            className={`bg-white tile-shadow rounded-[16px] px-4 py-3 flex items-center gap-3 transition-opacity ${
              !section.visible ? 'opacity-40' : ''
            }`}
          >
            {/* Drag handle */}
            <span className="cursor-grab text-graphite-light text-lg select-none shrink-0" title="Перетащить">
              ⠿
            </span>

            {/* Up / Down */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="text-graphite-light hover:text-graphite disabled:opacity-20 text-xs leading-none"
                title="Выше"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === sections.length - 1}
                className="text-graphite-light hover:text-graphite disabled:opacity-20 text-xs leading-none"
                title="Ниже"
              >
                ▼
              </button>
            </div>

            {/* Position number */}
            <span className="text-xs text-graphite-light w-5 text-center shrink-0 font-mono">
              {i + 1}
            </span>

            {/* Editable label */}
            <input
              value={section.label}
              onChange={(e) => setLabel(i, e.target.value)}
              className="flex-1 text-sm font-medium text-graphite bg-transparent border-b border-transparent hover:border-graphite/20 focus:border-teal focus:outline-none py-0.5 transition-colors"
            />

            {/* Link to section on site */}
            <a
              href={SECTION_HREFS[section.id] ?? '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-graphite-light hover:text-teal transition-colors shrink-0"
              title="Посмотреть на сайте"
            >
              ↗
            </a>

            {/* Visibility toggle */}
            <button
              type="button"
              onClick={() => toggleVisible(i)}
              title={section.visible ? 'Скрыть блок' : 'Показать блок'}
              className={`shrink-0 w-10 h-5 rounded-full transition-colors relative ${
                section.visible ? 'bg-teal' : 'bg-graphite/20'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  section.visible ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-graphite-light mt-6">
        Скрытые блоки не отображаются на сайте, но их настройки сохраняются.
      </p>
    </div>
  );
}
