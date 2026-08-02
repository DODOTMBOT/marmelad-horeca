'use client';

import { useState } from 'react';
import { AdminForm, Input, Card } from '../components/AdminForm';
import { saveClients } from '../actions';
import type { ClientsContent, ClientItem } from '@/lib/content-types';

export default function ClientsEditor({ initial }: { initial: ClientsContent }) {
  const [d, setD] = useState<ClientsContent>(initial);

  function setClient(i: number, patch: Partial<ClientItem>) {
    setD((p) => ({ ...p, clients: p.clients.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
  }
  function addClient() {
    setD((p) => ({ ...p, clients: [...p.clients, { name: '' }] }));
  }
  function removeClient(i: number) {
    setD((p) => ({ ...p, clients: p.clients.filter((_, j) => j !== i) }));
  }

  return (
    <AdminForm title="Клиенты" sectionHref="/#clients" onSave={() => saveClients(d)}>
      <Input
        label="Метка секции"
        value={d.sectionLabel}
        onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Клиенты ({d.clients.length})</p>
        <button type="button" onClick={addClient} className="text-sm text-teal hover:text-terracotta">
          + Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {d.clients.map((c, i) => (
          <Card key={i} title={`Клиент ${i + 1}`} onRemove={() => removeClient(i)}>
            <Input
              label="Название"
              value={c.name}
              onChange={(e) => setClient(i, { name: e.target.value })}
            />
            <Input
              label="Путь к логотипу (в /public/)"
              hint="Напр. /logos/dodo.svg"
              value={c.logoPath ?? ''}
              onChange={(e) => setClient(i, { logoPath: e.target.value })}
            />
          </Card>
        ))}
      </div>
    </AdminForm>
  );
}
