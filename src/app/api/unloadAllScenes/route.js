import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function POST(req) {
    const r3 = new R3SpaceEngine('localhost', 9010)
    await r3.connect();
    r3.unloadAllScenes();
    return new Response(JSON.stringify({ status: "All scenes unloaded" }), { status: 200 })
}
