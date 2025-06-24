import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function POST(req) {
    const { project, scene } = await req.json()

    const r3 = new R3SpaceEngine('localhost', 9010)
    await r3.connect()
    const sceneObj = await r3.getScene(project, scene, true);

    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not found" }), { status: 404 })
    }

    const exportList = await sceneObj.getExports()
    const response = exportList.response.map(item => ({
        name: item.Name,
        type: item.Type,
        value: item.Value
    }))

    return new Response(JSON.stringify({ status: "OK", exports: response }))
}

