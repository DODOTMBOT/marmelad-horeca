'use client';

import { useState, useTransition } from 'react';

// ─── Shared wrapper ───────────────────────────────────────────────────────────
interface AdminFormProps {
  title: string;
  sectionHref?: string;
  onSave: () => Promise<void>;
  children: React.ReactNode;
}

export function AdminForm({ title, sectionHref, onSave, children }: AdminFormProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <a href="/admin" className="text-xs text-graphite-light hover:text-graphite mb-1 block">
            ← Назад к панели
          </a>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">
            {title}
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          {sectionHref && (
            <a
              href={sectionHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal hover:underline"
            >
              Посмотреть на сайте →
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={pending}
            className="bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            {pending ? 'Сохранение…' : saved ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

// ─── Field primitives ─────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-graphite-mid mb-1.5">{label}</label>
      {hint && <p className="text-xs text-graphite-light mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}
export function Input({ label, hint, ...props }: InputProps) {
  return (
    <Field label={label} hint={hint}>
      <input
        {...props}
        className="w-full border border-graphite/20 rounded-xl px-4 py-2.5 text-sm text-graphite bg-white focus:outline-none focus:border-teal"
      />
    </Field>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}
export function TextArea({ label, hint, rows = 3, ...props }: TextAreaProps) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        {...props}
        rows={rows}
        className="w-full border border-graphite/20 rounded-xl px-4 py-2.5 text-sm text-graphite bg-white focus:outline-none focus:border-teal resize-none"
      />
    </Field>
  );
}

// ─── Color swatch picker ──────────────────────────────────────────────────────
const PALETTE: { id: string; label: string; hex: string }[] = [
  { id: 'tile-mint',   label: 'Мятный',      hex: '#E2F8EF' },
  { id: 'tile-peach',  label: 'Персиковый',  hex: '#FDF0E3' },
  { id: 'tile-rose',   label: 'Розовый',     hex: '#F5E8EF' },
  { id: 'tile-teal',   label: 'Бирюзовый',   hex: '#E1F5F3' },
  { id: 'tile-cream',  label: 'Кремовый',    hex: '#F5F2ED' },
  { id: 'terracotta',  label: 'Терракота',   hex: '#E27D60' },
  { id: 'graphite',    label: 'Графит',      hex: '#2C2A27' },
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}
export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            onClick={() => onChange(c.id)}
            className="w-8 h-8 rounded-full border-2 transition-all"
            style={{
              backgroundColor: c.hex,
              borderColor: value === c.id ? '#2C2A27' : 'transparent',
              boxShadow: value === c.id ? '0 0 0 1px #2C2A27' : 'none',
            }}
          />
        ))}
        <span className="text-xs text-graphite-light self-center ml-1">
          {PALETTE.find((c) => c.id === value)?.label ?? value}
        </span>
      </div>
    </Field>
  );
}

// ─── Tag list editor ──────────────────────────────────────────────────────────
interface TagEditorProps {
  label: string;
  hint?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}
export function TagEditor({ label, hint, tags, onChange }: TagEditorProps) {
  const [input, setInput] = useState('');
  function add() {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); }
    setInput('');
  }
  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-tile-cream border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="text-graphite-light hover:text-terracotta">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Введите тег и нажмите Enter"
          className="flex-1 border border-graphite/20 rounded-xl px-4 py-2 text-sm text-graphite bg-white focus:outline-none focus:border-teal"
        />
        <button type="button" onClick={add} className="text-sm text-teal font-medium px-3">+ Добавить</button>
      </div>
    </Field>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
export function Card({ title, children, onRemove }: { title: string; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="bg-white rounded-[20px] p-6 tile-shadow flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm uppercase tracking-tight text-graphite">{title}</h3>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-graphite-light hover:text-terracotta transition-colors">
            Удалить
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
