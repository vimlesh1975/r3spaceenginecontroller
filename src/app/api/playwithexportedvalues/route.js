import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function POST(req) {
    const { project, scene, timeline, exportedvalues } = await req.json()
    console.log(project, scene, timeline)

    const r3 = new R3SpaceEngine('localhost', 9010)
    r3.setDebug(true)
    await r3.connect()

    const sceneObj = await r3.loadScene(project, scene)

    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not loaded" }), { status: 404 })
    }

    if (timeline === "In") {
        for (const { name, value } of exportedvalues) {
            await sceneObj.setExport(name, value)
        }
        await sceneObj.takeOnline()
        await sceneObj.playTimeline("In")




    } else if (timeline === "Out") {
        await sceneObj.playTimeline("Out")

        // Wait before taking offline
        await new Promise((resolve) => setTimeout(resolve, 2000))

        await sceneObj.takeOffline()
        await r3.disconnect()
    }

    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
