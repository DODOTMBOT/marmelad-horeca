import Link from 'next/link';

const SECTIONS = [
  { href: '/admin/hero', label: 'Hero', desc: 'Заголовок, бейдж, теги, цвет плитки' },
  { href: '/admin/pains', label: 'Боли', desc: 'Список «Это для вас, если…»' },
  { href: '/admin/services', label: 'Услуги', desc: 'Каталог услуг, цены, калькулятор' },
  { href: '/admin/clients', label: 'Клиенты', desc: 'Логотипы и названия' },
  { href: '/admin/cases', label: 'Кейсы', desc: 'Кейсы с результатами' },
  { href: '/admin/team', label: 'Команда', desc: 'Участники, роли, биографии' },
  { href: '/admin/process', label: 'Процесс', desc: 'Шаги сотрудничества' },
  { href: '/admin/about', label: 'О нас', desc: 'Текст, принципы, CTA' },
  { href: '/admin/contacts', label: 'Контакты', desc: 'Заголовок формы, тексты' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight text-graphite mb-2">
        Редактор сайта
      </h1>
      <p className="text-graphite-mid text-sm mb-10">
        Выберите блок для редактирования. После сохранения главная страница обновляется автоматически.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-[20px] p-6 tile-shadow hover:shadow-md transition-shadow flex flex-col gap-2 group"
          >
            <h2 className="font-display font-bold text-base uppercase tracking-tight text-graphite group-hover:text-terracotta transition-colors">
              {s.label}
            </h2>
            <p className="text-sm text-graphite-mid leading-relaxed">{s.desc}</p>
            <span className="text-xs text-teal mt-auto">Редактировать →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
