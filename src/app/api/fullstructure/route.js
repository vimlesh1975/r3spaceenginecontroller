import { NextResponse } from 'next/server'
import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function GET() {
  const r3 = new R3SpaceEngine('localhost', 9010)
  await r3.connect();

  const projects = await r3.getProjects()
  const projectData = []

  for (const project of projects) {
    const scenes = await r3.getScenes(project)
    const sceneData = scenes.map((sceneFullName) => {
      // Strip "Project/" prefix if present
      const cleanName = sceneFullName.includes('/')
        ? sceneFullName.split('/')[1]
        : sceneFullName
      return { name: cleanName }
    })

    projectData.push({
      name: project,
      scenes: sceneData
    })
  }

  return NextResponse.json({ projectData })
}
