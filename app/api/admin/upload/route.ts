import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const name = `${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), 'public', folder);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(dir, name), buffer);
  return NextResponse.json({ url: `/${folder}/${name}` });
}
