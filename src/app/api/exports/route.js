import { getR3Client } from '../../lib/r3client.js'

import fs from 'fs'

export async function POST(req) {
    const { project, scene } = await req.json()

    const r3 = await getR3Client();
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

    const filePath = `C:/Users/Administrator/Documents/R3.Space.Projects/projects/${project}/${scene}/thumb.png`
    const fileData = fs.readFileSync(filePath)
    const thumbnail = `data:image/png;base64,${fileData.toString('base64')}`

    return new Response(JSON.stringify({ status: "OK", exports: response, thumbnail }))
}

