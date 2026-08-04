'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { actionUpsertService } from '../actions';
import type {
  ServiceV2,
  ServiceModifier,
  PerUnitModifier,
  CheckboxModifier,
  SelectModifier,
} from '@/lib/content-types';

// ── helpers ────────────────────────────────────────────────────────────────────

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function emptyMod(type: 'per_unit' | 'checkbox' | 'select'): ServiceModifier {
  const id = uid();
  if (type === 'per_unit')
    return { id, type, label: '', pricePerUnit: 0, unitLabel: 'ед.', min: 1, max: 1000, step: 1, defaultValue: 1 };
  if (type === 'checkbox')
    return { id, type, label: '', addedPrice: 0, defaultChecked: false };
  const optId = uid();
  return { id, type, label: '', options: [{ id: optId, label: '', addedPrice: 0 }], defaultOptionId: optId };
}

// ── tiny shared UI ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full border border-graphite/20 rounded-xl px-3 py-2 text-sm text-graphite bg-white focus:outline-none focus:border-teal transition-colors';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-graphite-light block mb-1">{label}</span>
      {hint && <p className="text-xs text-graphite-light/70 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function ListEditor({
  label,
  hint,
  items,
  placeholder,
  onChange,
}: {
  label: string;
  hint?: string;
  items: string[];
  placeholder?: string;
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState('');

  function add() {
    const v = input.trim();
    if (v) { onChange([...items, v]); setInput(''); }
  }

  function update(i: number, v: string) {
    onChange(items.map((item, j) => (j === i ? v : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 border border-graphite/20 rounded-xl px-3 py-2 text-sm text-graphite bg-white focus:outline-none focus:border-teal"
              value={item}
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-graphite-light hover:text-red-500 transition-colors text-xl leading-none shrink-0 px-1"
            >
              ×
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            className="flex-1 border border-graphite/20 rounded-xl px-3 py-2 text-sm text-graphite bg-white focus:outline-none focus:border-teal"
            placeholder={placeholder ?? 'Добавить строку…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
          <button
            type="button"
            onClick={add}
            className="text-sm text-teal hover:text-terracotta transition-colors font-medium px-3 shrink-0"
          >
            + Добавить
          </button>
        </div>
      </div>
    </Field>
  );
}

// ── modifier card ──────────────────────────────────────────────────────────────

function ModifierCard({
  mod,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  mod: ServiceModifier;
  onUpdate: (m: ServiceModifier) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
}) {
  const TYPE_META = {
    per_unit: { label: 'За единицу', color: 'text-teal border-teal/30' },
    checkbox: { label: 'Галочка', color: 'text-terracotta border-terracotta/30' },
    select: { label: 'Выбор варианта', color: 'text-rose border-rose/30' },
  };
  const meta = TYPE_META[mod.type];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="bg-[#F8F6F2] rounded-[16px] p-4 border border-graphite/8"
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-4">
        <span className="cursor-grab text-graphite-light select-none text-lg">⠿</span>
        <span className={`text-xs border rounded-full px-2 py-0.5 ${meta.color}`}>{meta.label}</span>
        <button
          type="button"
          onClick={onDelete}
          className="ml-auto text-graphite-light hover:text-red-500 transition-colors text-xl leading-none"
          title="Удалить модификатор"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Common: label */}
        <Field label="Название модификатора">
          <input
            className={inputCls}
            placeholder="Например: Срочность"
            value={mod.label}
            onChange={(e) => onUpdate({ ...mod, label: e.target.value })}
          />
        </Field>

        {/* per_unit fields */}
        {mod.type === 'per_unit' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Цена за единицу, ₽">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={mod.pricePerUnit}
                  onChange={(e) => onUpdate({ ...mod, pricePerUnit: Number(e.target.value) })}
                />
              </Field>
              <Field label="Единица измерения">
                <input
                  className={inputCls}
                  placeholder="позиция"
                  value={mod.unitLabel}
                  onChange={(e) => onUpdate({ ...mod, unitLabel: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Минимум">
                <input
                  className={inputCls}
                  type="number"
                  value={mod.min}
                  onChange={(e) => onUpdate({ ...mod, min: Number(e.target.value) })}
                />
              </Field>
              <Field label="Максимум">
                <input
                  className={inputCls}
                  type="number"
                  value={mod.max}
                  onChange={(e) => onUpdate({ ...mod, max: Number(e.target.value) })}
                />
              </Field>
              <Field label="Шаг">
                <input
                  className={inputCls}
                  type="number"
                  value={mod.step}
                  onChange={(e) => onUpdate({ ...mod, step: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Значение по умолчанию">
              <input
                className={inputCls}
                type="number"
                value={mod.defaultValue}
                onChange={(e) => onUpdate({ ...mod, defaultValue: Number(e.target.value) })}
              />
            </Field>
          </>
        )}

        {/* checkbox fields */}
        {mod.type === 'checkbox' && (
          <>
            <Field label="Надбавка, ₽">
              <input
                className={inputCls}
                type="number"
                min={0}
                value={mod.addedPrice}
                onChange={(e) => onUpdate({ ...mod, addedPrice: Number(e.target.value) })}
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mod.defaultChecked}
                onChange={(e) => onUpdate({ ...mod, defaultChecked: e.target.checked })}
                className="w-4 h-4 accent-teal"
              />
              <span className="text-sm text-graphite-mid">Отмечен по умолчанию</span>
            </label>
          </>
        )}

        {/* select fields */}
        {mod.type === 'select' && (
          <>
            <div>
              <span className="text-xs text-graphite-light block mb-2">Варианты</span>
              <div className="flex flex-col gap-2">
                {mod.options.map((opt, oi) => (
                  <div key={opt.id} className="flex gap-2 items-center">
                    <input
                      className="flex-1 border border-graphite/20 rounded-xl px-3 py-1.5 text-sm text-graphite focus:outline-none focus:border-teal bg-white"
                      placeholder="Название варианта"
                      value={opt.label}
                      onChange={(e) =>
                        onUpdate({
                          ...mod,
                          options: mod.options.map((o, i) =>
                            i === oi ? { ...o, label: e.target.value } : o
                          ),
                        })
                      }
                    />
                    <input
                      className="w-28 border border-graphite/20 rounded-xl px-3 py-1.5 text-sm text-graphite focus:outline-none focus:border-teal bg-white"
                      type="number"
                      placeholder="+ ₽"
                      value={opt.addedPrice}
                      onChange={(e) =>
                        onUpdate({
                          ...mod,
                          options: mod.options.map((o, i) =>
                            i === oi ? { ...o, addedPrice: Number(e.target.value) } : o
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOpts = mod.options.filter((_, i) => i !== oi);
                        const newDefault =
                          mod.defaultOptionId === opt.id
                            ? (newOpts[0]?.id ?? '')
                            : mod.defaultOptionId;
                        onUpdate({ ...mod, options: newOpts, defaultOptionId: newDefault });
                      }}
                      className="text-graphite-light hover:text-red-500 transition-colors text-xl leading-none shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const newOpt = { id: uid(), label: '', addedPrice: 0 };
                  onUpdate({
                    ...mod,
                    options: [...mod.options, newOpt],
                    defaultOptionId: mod.defaultOptionId || newOpt.id,
                  });
                }}
                className="mt-2 text-sm text-teal hover:text-teal-dark transition-colors"
              >
                + Добавить вариант
              </button>
            </div>

            {mod.options.length > 0 && (
              <Field label="Вариант по умолчанию">
                <select
                  className={inputCls}
                  value={mod.defaultOptionId}
                  onChange={(e) => onUpdate({ ...mod, defaultOptionId: e.target.value })}
                >
                  {mod.options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label || '(без названия)'}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── main editor ────────────────────────────────────────────────────────────────

export default function ServiceEditor({
  initial,
  isNew,
}: {
  initial: ServiceV2;
  isNew: boolean;
}) {
  const router = useRouter();
  const [svc, setSvc] = useState<ServiceV2>(initial);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, openUp: false });
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ── field helpers ────────────────────────────────────────────────────────────
  function set<K extends keyof ServiceV2>(k: K, v: ServiceV2[K]) {
    setSvc((s) => ({ ...s, [k]: v }));
  }
  function updMod(idx: number, mod: ServiceModifier) {
    setSvc((s) => ({ ...s, modifiers: s.modifiers.map((m, i) => (i === idx ? mod : m)) }));
  }
  function delMod(idx: number) {
    setSvc((s) => ({ ...s, modifiers: s.modifiers.filter((_, i) => i !== idx) }));
  }
  function addMod(type: 'per_unit' | 'checkbox' | 'select') {
    setSvc((s) => ({ ...s, modifiers: [...s.modifiers, emptyMod(type)] }));
    setAddOpen(false);
  }

  // ── drag ────────────────────────────────────────────────────────────────────
  function onDragStart(i: number) { dragIndex.current = i; }
  function onDragOver(e: React.DragEvent, i: number) { e.preventDefault(); dragOverIndex.current = i; }
  function onDrop() {
    const from = dragIndex.current, to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;
    const next = [...svc.modifiers];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSvc((s) => ({ ...s, modifiers: next }));
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  // ── save ─────────────────────────────────────────────────────────────────────
  function handleSave() {
    const id = svc.id || uid();
    startTransition(async () => {
      await actionUpsertService({ ...svc, id });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (isNew) router.replace(`/admin/services/${id}`);
    });
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <a href="/admin/services" className="text-xs text-graphite-light hover:text-graphite mb-1 block">
            ← К списку услуг
          </a>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">
            {isNew ? 'Новая услуга' : 'Редактирование услуги'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={pending}
          className="shrink-0 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          {pending ? 'Сохранение…' : saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Basic fields */}
        <Field label="Заголовок услуги">
          <input
            className={inputCls}
            placeholder="Операционная диагностика"
            value={svc.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </Field>

        <Field label="Краткое описание (для карточки)">
          <textarea
            className={inputCls + ' resize-none'}
            rows={2}
            placeholder="Одно-два предложения о сути услуги"
            value={svc.shortDescription}
            onChange={(e) => set('shortDescription', e.target.value)}
          />
        </Field>

        <Field label="Полное описание">
          <textarea
            className={inputCls + ' resize-none'}
            rows={4}
            placeholder="Подробное описание — что входит, как проходит, что получает клиент"
            value={svc.fullDescription}
            onChange={(e) => set('fullDescription', e.target.value)}
          />
        </Field>

        <Field label="Теги (через запятую)">
          <input
            className={inputCls}
            placeholder="Диагностика, Аудит"
            value={svc.tags.join(', ')}
            onChange={(e) =>
              set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
            }
          />
        </Field>

        <Field label="Базовая цена, ₽ (всегда добавляется к итогу)">
          <input
            className={inputCls}
            type="number"
            min={0}
            value={svc.basePrice}
            onChange={(e) => set('basePrice', Number(e.target.value))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Срок" hint="Напр. «3–5 рабочих дней»">
            <input
              className={inputCls}
              placeholder="3–5 рабочих дней"
              value={svc.timeline ?? ''}
              onChange={(e) => set('timeline', e.target.value)}
            />
          </Field>
          <Field label="Правки" hint="Напр. «2 раунда правок»">
            <input
              className={inputCls}
              placeholder="2 раунда правок"
              value={svc.revisions ?? ''}
              onChange={(e) => set('revisions', e.target.value)}
            />
          </Field>
        </div>

        <ListEditor
          label="Что вы получите"
          hint="Каждая строка — отдельный пункт списка"
          items={svc.deliverables ?? []}
          placeholder="Например: Детальный отчёт с рекомендациями"
          onChange={(v) => set('deliverables', v)}
        />

        <ListEditor
          label="Не входит"
          hint="Что явно не включено в эту услугу"
          items={svc.excludes ?? []}
          placeholder="Например: Обучение персонала"
          onChange={(v) => set('excludes', v)}
        />

        {/* Modifiers section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-sm uppercase tracking-tight text-graphite">
              Модификаторы цены
            </h2>
            <span className="text-xs text-graphite-light">{svc.modifiers.length} шт.</span>
          </div>

          {svc.modifiers.length > 0 && (
            <div className="flex flex-col gap-3 mb-3">
              {svc.modifiers.map((mod, idx) => (
                <ModifierCard
                  key={mod.id}
                  mod={mod}
                  onUpdate={(m) => updMod(idx, m)}
                  onDelete={() => delMod(idx)}
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDrop={onDrop}
                />
              ))}
            </div>
          )}

          {/* Add modifier */}
          <div className="relative">
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => {
                const rect = addBtnRef.current?.getBoundingClientRect();
                if (rect) {
                  const dropdownHeight = 160;
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const openUp = spaceBelow < dropdownHeight;
                  setDropdownPos({
                    top: openUp ? rect.top - dropdownHeight - 6 : rect.bottom + 6,
                    left: rect.left,
                    openUp,
                  });
                }
                setAddOpen((v) => !v);
              }}
              className="text-sm font-medium text-teal hover:text-terracotta transition-colors border border-teal/30 hover:border-terracotta/30 rounded-full px-4 py-2"
            >
              + Добавить модификатор
            </button>

            {addOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAddOpen(false)} />
                <div
                  className="fixed bg-white tile-shadow rounded-[16px] py-2 z-50 min-w-64"
                  style={{ top: dropdownPos.top, left: dropdownPos.left, maxHeight: '80vh', overflowY: 'auto' }}
                >
                  {(
                    [
                      ['per_unit', 'За единицу', 'Клиент вводит количество, цена × кол-во'],
                      ['checkbox', 'Галочка (фиксированная надбавка)', 'Клиент отмечает — добавляется фикс-сумма'],
                      ['select', 'Выбор варианта', 'Клиент выбирает один из вариантов с разной ценой'],
                    ] as const
                  ).map(([type, label, hint]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addMod(type)}
                      className="block w-full text-left px-4 py-2.5 hover:bg-cream transition-colors"
                    >
                      <div className="text-sm text-graphite font-medium">{label}</div>
                      <div className="text-xs text-graphite-light mt-0.5">{hint}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Help text */}
        <p className="text-xs text-graphite-light pt-2 border-t border-graphite/8">
          Итоговая цена = базовая + сумма активных модификаторов. Калькулятор на сайте строится
          автоматически из этой конфигурации.
        </p>
      </div>
    </div>
  );
}
