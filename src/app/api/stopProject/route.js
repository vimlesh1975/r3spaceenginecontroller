import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function POST(req) {
    const body = await req.json();
    const project = body.project;
    const r3 = new R3SpaceEngine('localhost', 9009);
    await r3.connect();

    const scene = await r3.loadScene(project, project);
    await scene.playTimeline('Out');
    // scene.takeOffline()

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}
