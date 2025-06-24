import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function POST(req) {
    const { project, scene, timeline } = await req.json()
    console.log(project, scene, timeline)

    const r3 = new R3SpaceEngine('localhost', 9010)
    await r3.connect()

    const sceneObj = await r3.loadScene(project, scene);

    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not loaded" }), { status: 404 })
    }
    sceneObj.takeOnline()
    await sceneObj.playTimeline(timeline) // timeline = "In" or "Out"
    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
