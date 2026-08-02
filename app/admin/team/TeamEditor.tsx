'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, ColorPicker, Card } from '../components/AdminForm';
import { saveTeam } from '../actions';
import type { TeamContent, TeamMember } from '@/lib/content-types';

export default function TeamEditor({ initial }: { initial: TeamContent }) {
  const [d, setD] = useState<TeamContent>(initial);

  function setMember(i: number, patch: Partial<TeamMember>) {
    setD((p) => ({ ...p, members: p.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));
  }
  function addMember() {
    setD((p) => ({ ...p, members: [...p.members, { name: '', role: '', focus: '', bio: '', bg: 'tile-cream' }] }));
  }

  return (
    <AdminForm title="Команда" sectionHref="/#team" onSave={() => saveTeam(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))} />
        <Input label="Заголовок" value={d.title} onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Участники ({d.members.length})</p>
        <button type="button" onClick={addMember} className="text-sm text-teal hover:text-terracotta">
          + Добавить
        </button>
      </div>

      {d.members.map((m, i) => (
        <Card key={i} title={m.name || `Участник ${i + 1}`} onRemove={() => setD((p) => ({ ...p, members: p.members.filter((_, j) => j !== i) }))}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Имя и фамилия" value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} />
            <Input label="Роль" value={m.role} onChange={(e) => setMember(i, { role: e.target.value })} />
          </div>
          <Input label="Специализация (тег)" value={m.focus} onChange={(e) => setMember(i, { focus: e.target.value })} />
          <TextArea label="Биография" rows={3} value={m.bio} onChange={(e) => setMember(i, { bio: e.target.value })} />
          <Input label="Путь к фото (в /public/)" hint="Напр. /team/anna.jpg" value={m.photoPath ?? ''} onChange={(e) => setMember(i, { photoPath: e.target.value })} />
          <ColorPicker label="Цвет плитки" value={m.bg} onChange={(v) => setMember(i, { bg: v })} />
        </Card>
      ))}
    </AdminForm>
  );
}
