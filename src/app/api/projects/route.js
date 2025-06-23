import { NextResponse } from 'next/server';
import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function GET() {
  const r3 = new R3SpaceEngine('localhost', 9009);
  await r3.connect();

  const projects = await r3.getProjects(); // returns string[]

  return NextResponse.json({ projects });
}
