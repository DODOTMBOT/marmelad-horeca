import Image from 'next/image';
import type { TeamContent } from '@/lib/content-types';

export default function Team({ content }: { content: TeamContent }) {
  const { sectionLabel, title, members } = content;

  return (
    <section id="team" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map((m, i) => (
          <div key={i} className={`bg-${m.bg} tile-shadow rounded-[24px] p-7 flex flex-col gap-5`}>
            <div className="w-full aspect-[4/3] rounded-[16px] bg-graphite/8 flex items-center justify-center overflow-hidden">
              {m.photoPath ? (
                <Image src={m.photoPath} alt={m.name} width={400} height={300} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-graphite-light">фото</span>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className="inline-block border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full">{m.role}</span>
                  <span className="inline-block border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full">{m.focus}</span>
                </div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-graphite">{m.name}</h3>
              </div>
              <p className="text-sm text-graphite-mid leading-relaxed">{m.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
