'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, ColorPicker, TagEditor } from '../components/AdminForm';
import { saveHero } from '../actions';
import type { HeroContent } from '@/lib/content-types';

export default function HeroEditor({ initial }: { initial: HeroContent }) {
  const [d, setD] = useState<HeroContent>(initial);
  const set = <K extends keyof HeroContent>(k: K, v: HeroContent[K]) =>
    setD((p) => ({ ...p, [k]: v }));

  return (
    <AdminForm title="Hero — главный экран" sectionHref="/#top" onSave={() => saveHero(d)}>
      <Input
        label="Приписка над заголовком"
        hint="Маленький текст над h1"
        value={d.preHeadline ?? ''}
        onChange={(e) => set('preHeadline', e.target.value)}
      />
      <TextArea
        label="Заголовок"
        hint="Используйте \\n для переноса строки"
        rows={4}
        value={d.headline}
        onChange={(e) => set('headline', e.target.value)}
      />
      <TextArea
        label="Подзаголовок"
        rows={2}
        value={d.subtitle}
        onChange={(e) => set('subtitle', e.target.value)}
      />
      <Input
        label="Текст CTA-кнопки"
        value={d.ctaLabel}
        onChange={(e) => set('ctaLabel', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Цифра в бейдже"
          value={d.badgeNumber}
          onChange={(e) => set('badgeNumber', e.target.value)}
        />
        <TextArea
          label="Подпись бейджа"
          hint="\\n для переноса"
          rows={2}
          value={d.badgeLabel}
          onChange={(e) => set('badgeLabel', e.target.value)}
        />
      </div>

      <TextArea
        label="Заголовок боковой плитки"
        hint="\\n для переноса строки"
        rows={3}
        value={d.factTitle}
        onChange={(e) => set('factTitle', e.target.value)}
      />
      <TextArea
        label="Текст боковой плитки"
        hint="Описание под заголовком"
        rows={4}
        value={d.factText ?? ''}
        onChange={(e) => set('factText', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Текст кнопки в плитке"
          value={d.factCtaLabel ?? ''}
          onChange={(e) => set('factCtaLabel', e.target.value)}
        />
        <Input
          label="Ссылка кнопки"
          hint="Напр. #services или /calculator"
          value={d.factCtaHref ?? ''}
          onChange={(e) => set('factCtaHref', e.target.value)}
        />
      </div>

      <TagEditor
        label="Теги HoReCa-форматов"
        tags={d.tags}
        onChange={(tags) => set('tags', tags)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ColorPicker
          label="Цвет главной плитки"
          value={d.mainTileBg}
          onChange={(v) => set('mainTileBg', v)}
        />
        <ColorPicker
          label="Цвет плитки-факта"
          value={d.factTileBg}
          onChange={(v) => set('factTileBg', v)}
        />
      </div>
    </AdminForm>
  );
}
