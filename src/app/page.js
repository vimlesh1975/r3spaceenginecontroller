'use client'

import React, { useEffect, useState } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState([]);// full project/scene list
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [exports, setExports] = useState([]);
  const [exportValues, setExportValues] = useState({});



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
            onChange={async (e) => {
              const sceneName = e.target.value
              setSelectedScene(sceneName)

              // Fetch exports
              const res = await fetch("/api/exports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project: selectedProject, scene: sceneName })
              })

              const data = await res.json()
              setExports(data.exports || [])

              const initialValues = {}
              data.exports.forEach((exp) => {
                initialValues[exp.name] = exp.value
              })
              setExportValues(initialValues)

            }}



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
              style={{ marginRight: 10, padding: "6px 12px", background: "gray", color: "white", border: "none", borderRadius: 4 }}
            >
              ⏹ Play Out
            </button>
            <button
              onClick={() =>
                fetch("/api/playwithexportedvalues", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    project: selectedProject,
                    scene: selectedScene,
                    timeline: "In",
                    exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                  })
                })
                  .then((res) => res.json())
                  .then((data) => console.log("Out:", data))
              }
              style={{ padding: "6px 12px", background: "green", color: "white", border: "none", borderRadius: 4 }}
            >
              ⏹ Play with Exports
            </button>

          </div>

          <div>
            {exports.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3>Scene Exports</h3>
                {exports.map((exp) => (
                  <div key={exp.name} style={{ marginBottom: 8 }}>
                    <label>{exp.name}:</label>
                    <input
                      style={{ marginLeft: 10, padding: 4 }}
                      value={exportValues[exp.name] || ""}
                      onChange={(e) =>
                        setExportValues((prev) => ({ ...prev, [exp.name]: e.target.value }))
                      }
                    />
                    <small style={{ marginLeft: 10, color: '#888' }}>({exp.type})</small>
                  </div>
                ))}

                <button
                  style={{ marginTop: 10, padding: "8px 12px", background: "green", color: "white", border: "none", borderRadius: 4 }}
                  onClick={async () => {
                    const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                    const res = await fetch("/api/setExports", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        project: selectedProject,
                        scene: selectedScene,
                        updates
                      })
                    })
                    const result = await res.json()
                    console.log("Update result:", result)
                  }}
                >
                  Send Exports
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>

  </div>)
}
