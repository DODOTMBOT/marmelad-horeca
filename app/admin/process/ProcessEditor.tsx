'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, Card } from '../components/AdminForm';
import { saveProcess } from '../actions';
import type { ProcessContent, ProcessStep } from '@/lib/content-types';

export default function ProcessEditor({ initial }: { initial: ProcessContent }) {
  const [d, setD] = useState<ProcessContent>(initial);

  function setStep(i: number, patch: Partial<ProcessStep>) {
    setD((p) => ({ ...p, steps: p.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }
  function addStep() {
    const n = String(d.steps.length + 1).padStart(2, '0');
    setD((p) => ({ ...p, steps: [...p.steps, { n, title: '', text: '' }] }));
  }

  return (
    <AdminForm title="Как работаем" sectionHref="/#process" onSave={() => saveProcess(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))} />
        <Input label="Заголовок" value={d.title} onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Шаги ({d.steps.length})</p>
        <button type="button" onClick={addStep} className="text-sm text-teal hover:text-terracotta">
          + Добавить шаг
        </button>
      </div>

      {d.steps.map((step, i) => (
        <Card key={i} title={`${step.n} — ${step.title || '…'}`} onRemove={() => setD((p) => ({ ...p, steps: p.steps.filter((_, j) => j !== i) }))}>
          <div className="grid grid-cols-4 gap-3">
            <Input label="Номер" value={step.n} onChange={(e) => setStep(i, { n: e.target.value })} />
            <div className="col-span-3">
              <Input label="Название шага" value={step.title} onChange={(e) => setStep(i, { title: e.target.value })} />
            </div>
          </div>
          <TextArea label="Описание" rows={2} value={step.text} onChange={(e) => setStep(i, { text: e.target.value })} />
        </Card>
      ))}
    </AdminForm>
  );
}
