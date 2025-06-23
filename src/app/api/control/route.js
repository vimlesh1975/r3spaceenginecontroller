import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function POST(req) {
  const body = await req.json();
  const r3 = new R3SpaceEngine('localhost', 9009);
  await r3.connect();

  const scene = await r3.loadScene('TestShow', 'LowerThird1');
  await scene.setExport('vName', body.vName);
  await scene.setExport('vFunction', body.vFunction);
  await scene.playTimeline('In');

  return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}
