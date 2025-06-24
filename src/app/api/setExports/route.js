import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function POST(req) {
    const { project, scene, updates } = await req.json()

    const r3 = new R3SpaceEngine('localhost', 9010)
    await r3.connect()
    const sceneObj = await r3.loadScene(project, scene);

    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not loaded" }), { status: 404 })
    }

    for (const { name, value } of updates) {
        await sceneObj.setExport(name, value)
    }

    return new Response(JSON.stringify({ status: "Exports updated", updated: updates }))
}
