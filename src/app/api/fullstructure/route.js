import { NextResponse } from 'next/server';
import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function GET() {
  const r3 = new R3SpaceEngine('localhost', 9009);
  await r3.connect();

  const projects = await r3.getProjects();
  const projectData = [];

  for (const project of projects) {
    const scenes = await r3.getScenes(project);
    const sceneData = [];

    for (const sceneName of scenes) {
      try {
        const scene = await r3.loadScene(project, sceneName);
        const exportList = await scene.getExports(); // returns { status, response }
        const exportNames = exportList.response.map((item) => ({
          name: item.Name,
          type: item.Type,
          value: item.Value
        }));
        sceneData.push({
          name: sceneName,
          exports: exportNames
        });
      } catch (err) {
        sceneData.push({
          name: sceneName,
          error: `Could not load scene`,
          exports: []
        });
        console.error(`❌ Scene "${sceneName}" in project "${project}" failed:`, err);
      }
    }

    projectData.push({
      name: project,
      scenes: sceneData
    });
  }
  console.log(JSON.stringify(projectData));
  return NextResponse.json({ projectData });
}
