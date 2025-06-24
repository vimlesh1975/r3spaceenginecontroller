'use client'

import React, { useEffect, useState } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState([]) // full project/scene list
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)

  useEffect(() => {
    setIsClient(true)
    fetch("/api/fullstructure")
      .then((res) => res.json())
      .then((data) => setData(data.projectData))
      .catch((err) => console.error("Failed to fetch structure", err))
  }, [])

  if (!isClient || data.length === 0) return null

  return (<div>

    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>🎮 Select Project and Scene</h1>

      {/* Project Dropdown */}
      <label>Project:</label>
      <select
        value={selectedProject || ""}
        onChange={(e) => {
          setSelectedProject(e.target.value)
          setSelectedScene(null) // reset scene when project changes
        }}
        style={{ display: 'block', marginBottom: 16 }}
      >
        <option value="" disabled>Select a project</option>
        {data.map((project) => (
          <option key={project.name} value={project.name}>
            {project.name}
          </option>
        ))}
      </select>

      {/* Scene Dropdown */}
      {selectedProject && (
        <>
          <label>Scene:</label>
          <select
            value={selectedScene || ""}
            onChange={(e) => setSelectedScene(e.target.value)}
            style={{ display: 'block', marginBottom: 16 }}
          >
            <option value="" disabled>Select a scene</option>
            {data
              .find((p) => p.name === selectedProject)
              ?.scenes.map((scene) => (
                <option key={scene.name} value={scene.name}>
                  {scene.name}
                </option>
              ))}
          </select>
        </>
      )}

      {/* Debug Display */}
      {selectedProject && selectedScene && (
        <div style={{ marginTop: 20 }}>
          <strong>Selected:</strong> {selectedProject} / {selectedScene}
        </div>
      )}
    </div>
    <div>
      {selectedProject && selectedScene && (
        <div style={{ marginTop: 20 }}>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() =>
                fetch("/api/timeline", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    project: selectedProject,
                    scene: selectedScene,
                    timeline: "In"
                  })
                })
                  .then((res) => res.json())
                  .then((data) => console.log("In:", data))
              }
              style={{ marginRight: 10, padding: "6px 12px", background: "blue", color: "white", border: "none", borderRadius: 4 }}
            >
              ▶️ Play In
            </button>

            <button
              onClick={() =>
                fetch("/api/timeline", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    project: selectedProject,
                    scene: selectedScene,
                    timeline: "Out"
                  })
                })
                  .then((res) => res.json())
                  .then((data) => console.log("Out:", data))
              }
              style={{ padding: "6px 12px", background: "gray", color: "white", border: "none", borderRadius: 4 }}
            >
              ⏹ Play Out
            </button>
          </div>
        </div>
      )}

    </div>

  </div>)
}
