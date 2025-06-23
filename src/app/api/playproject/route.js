import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function POST(req) {
    const body = await req.json();
    const project = body.project;
    const r3 = new R3SpaceEngine('localhost', 9009);
    await r3.connect();

    const scene = await r3.loadScene(project, project);
    // await scene.setExport('vName', body.vName);
    scene.takeOnline()
    await scene.playTimeline('In');


    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}
