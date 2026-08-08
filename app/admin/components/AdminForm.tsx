'use client';

import { useState, useTransition, useRef, useEffect } from 'react';

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

// ─── Free hex color picker (used for both tiles and cases) ───────────────────
const COLOR_PRESETS = [
  { hex: '#E2F8EF', label: 'Мятный' },
  { hex: '#FDF0E3', label: 'Персик' },
  { hex: '#F5E8EF', label: 'Роза' },
  { hex: '#E1F5F3', label: 'Бирюза' },
  { hex: '#F5F2ED', label: 'Кремовый' },
  { hex: '#E27D60', label: 'Терракота' },
  { hex: '#2C2A27', label: 'Графит' },
  { hex: '#C0392B', label: 'Красный' },
  { hex: '#1B3A6B', label: 'Синий' },
  { hex: '#1A5276', label: 'Тёмно-синий' },
  { hex: '#145A32', label: 'Зелёный' },
  { hex: '#6C3483', label: 'Фиолет' },
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function FreeColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [input, setInput] = useState(value);
  useEffect(() => setInput(value), [value]);

  const safeHex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#F5F2ED';

  return (
    <Field label={label}>
      <div className="flex items-center gap-3 mb-3">
        <label className="relative cursor-pointer shrink-0" title="Открыть палитру">
          <div
            className="w-10 h-10 rounded-xl border-2 border-graphite/20"
            style={{ backgroundColor: safeHex }}
          />
          <input
            type="color"
            value={safeHex}
            onChange={(e) => { onChange(e.target.value); setInput(e.target.value); }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => { if (/^#[0-9a-fA-F]{6}$/.test(input)) onChange(input); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && /^#[0-9a-fA-F]{6}$/.test(input)) onChange(input); }}
          placeholder="#000000"
          className="w-28 border border-graphite/20 rounded-xl px-3 py-2 text-sm text-graphite bg-white focus:outline-none focus:border-teal font-mono"
        />
        <span className="text-xs text-graphite-light">или выберите из пресетов ↓</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.label}
            onClick={() => { onChange(c.hex); setInput(c.hex); }}
            className="w-7 h-7 rounded-full border-2 transition-all"
            style={{
              backgroundColor: c.hex,
              borderColor: value === c.hex ? '#2C2A27' : 'transparent',
              boxShadow: value === c.hex ? '0 0 0 1px #2C2A27' : 'none',
            }}
          />
        ))}
      </div>
    </Field>
  );
}

export function ColorPicker(props: ColorPickerProps) { return <FreeColorPicker {...props} />; }

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

interface HexColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}
export function HexColorPicker(props: HexColorPickerProps) { return <FreeColorPicker {...props} />; }

// ─── Logo upload ──────────────────────────────────────────────────────────────
interface LogoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}
export function LogoUpload({ label, value, onChange, folder = 'uploads' }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const { url } = await res.json();
    onChange(url);
    setUploading(false);
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="w-24 h-12 bg-graphite/5 rounded-xl border border-graphite/10 flex items-center justify-center p-2">
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="w-24 h-12 bg-graphite/5 rounded-xl border border-dashed border-graphite/20 flex items-center justify-center">
            <span className="text-xs text-graphite-light">нет</span>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-teal hover:text-terracotta transition-colors font-medium disabled:opacity-50"
          >
            {uploading ? 'Загрузка…' : value ? 'Заменить' : 'Загрузить PNG'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-graphite-light hover:text-terracotta transition-colors">
              Удалить лого
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
