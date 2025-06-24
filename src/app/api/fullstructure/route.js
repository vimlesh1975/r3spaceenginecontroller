import { NextResponse } from 'next/server';
import { R3SpaceEngine } from 'wtv-r3-space-engine';

export async function GET() {
  const r3 = new R3SpaceEngine('localhost', 9009);
  await r3.connect();

  const projects = await r3.getProjects();
  const projectData = [];

  for (const project of projects) {
    const scenes = await r3.getScenes(project); // scenes may be full IDs like "Bug/BugLowerThird1"
    const sceneData = [];

    for (const sceneFullName of scenes) {
      try {
        const scene = await r3.loadScene(project, sceneFullName);

        const exportList = await scene.getExports();
        const exportNames = exportList.response.map((item) => ({
          name: item.Name,
          type: item.Type,
          value: item.Value
        }));

        const cleanName = sceneFullName.includes('/')
          ? sceneFullName.split('/')[1]
          : sceneFullName;

        sceneData.push({
          name: cleanName,      // ✅ frontend will only get scene name
          exports: exportNames
        });
      } catch (err) {
        console.error(`❌ Failed to load scene ${sceneFullName} in project ${project}`, err);
        sceneData.push({
          name: sceneFullName,
          error: true,
          exports: []
        });
      }
    }

    projectData.push({
      name: project,
      scenes: sceneData
    });
  }

  return NextResponse.json({ projectData });
}
