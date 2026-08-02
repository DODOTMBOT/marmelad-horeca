'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea } from '../components/AdminForm';
import { saveContacts } from '../actions';
import type { ContactsContent } from '@/lib/content-types';

export default function ContactsEditor({ initial }: { initial: ContactsContent }) {
  const [d, setD] = useState<ContactsContent>(initial);
  const set = <K extends keyof ContactsContent>(k: K, v: ContactsContent[K]) =>
    setD((p) => ({ ...p, [k]: v }));

  return (
    <AdminForm title="Контакты" sectionHref="/#contacts" onSave={() => saveContacts(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => set('sectionLabel', e.target.value)} />
        <Input label="Текст кнопки Telegram" value={d.telegramLabel} onChange={(e) => set('telegramLabel', e.target.value)} />
      </div>
      <TextArea label="Заголовок секции" hint="\\n для переноса" rows={2} value={d.title} onChange={(e) => set('title', e.target.value)} />
      <Input label="Заголовок после отправки формы" value={d.successTitle} onChange={(e) => set('successTitle', e.target.value)} />
      <TextArea label="Текст после отправки" rows={2} value={d.successText} onChange={(e) => set('successText', e.target.value)} />
    </AdminForm>
  );
}
