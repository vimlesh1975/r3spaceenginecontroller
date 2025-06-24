"use client"

import React, { useEffect, useState } from "react"

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)
  const [exportValues, setExportValues] = useState({})

  useEffect(() => {
    setIsClient(true) // avoid hydration mismatch
    fetch("/api/fullstructure")
      .then((res) => res.json())
      .then((data) => setData(data.projectData))
      .catch((err) => console.error("Failed to fetch structure", err))
  }, [])


  useEffect(() => {
    console.log("Hydration check", {
      isClient,
      hasData: data.length > 0,
      selectedProject,
      selectedScene
    });
  }, [])

  const handleExportChange = (key, value) => {
    setExportValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSend = () => {
    fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exportValues)
    })
      .then((res) => res.json())
      .then((data) => console.log("Updated scene:", data))
      .catch((err) => console.error("Update failed", err))
  }


  if (!isClient) return null;
  if (data.length === 0) return null; // or just skip rendering parts below



  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Project → Scene → Exports</h1>

      {/* Project Dropdown */}
      <label>Project:</label>
      <select
        value={selectedProject || ""}
        onChange={(e) => {
          setSelectedProject(e.target.value)
          setSelectedScene(null)
          setExportValues({})
        }}
      >
        <option value="" disabled>Select a project</option>
        {data.map((project) => (
          <option key={project.name} value={project.name}>{project.name}</option>
        ))}
      </select>

      {/* Scene Dropdown */}
      {selectedProject && (
        <>
          <label style={{ marginTop: 10 }}>Scene:</label>
          <select
            value={selectedScene || ""}
            onChange={(e) => {
              const sceneName = e.target.value
              setSelectedScene(sceneName)
              const projectObj = data.find(p => p.name === selectedProject)
              const sceneObj = projectObj.scenes.find(s => s.name === sceneName)
              const initial = {}
              sceneObj.exports.forEach(exp => {
                initial[exp.name] = exp.value || ""
              });
              setExportValues(initial)
            }}
          >
            <option value="" disabled>Select a scene</option>
            {data.find(p => p.name === selectedProject)?.scenes.map((scene) => {
              const cleanName = scene.name.includes("/") ? scene.name.split("/")[1] : scene.name;
              return (
                <option key={scene.name} value={scene.name}>
                  {cleanName}
                </option>
              );
            })}

          </select>
        </>
      )}

      {/* Editable Export Inputs */}
      {selectedScene && (
        <div style={{ marginTop: 20 }}>
          <h3>Exports</h3>
          {Object.entries(exportValues).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label>{key}:</label>
              <input
                value={value}
                onChange={(e) => handleExportChange(key, e.target.value)}
                style={{ marginLeft: 10, padding: 4 }}
              />
            </div>
          ))}
          <button onClick={handleSend} style={{ padding: 8, background: "green", color: "white", border: "none", borderRadius: 4 }}>
            Send Exports
          </button>
        </div>
      )}

      {/* Play In / Out */}
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
            }).then((res) => res.json()).then(console.log)
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
            }).then((res) => res.json()).then(console.log)
          }
          style={{ padding: "6px 12px", background: "gray", color: "white", border: "none", borderRadius: 4 }}
        >
          ⏹ Play Out
        </button>
      </div>


      {/* Expandable Tree View */}
      {isClient && data.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Tree View</h2>
          {data.map((project) => (
            <div key={project.name} style={{ marginBottom: 10 }}>
              <strong>{project.name}</strong>
              <ul style={{ marginLeft: 20 }}>
                {project.scenes.map((scene) => (
                  <li key={scene.name}>
                    {scene.name}
                    <ul style={{ marginLeft: 20 }}>
                      {scene.exports.map((ex) => (
                        <li key={ex.name}>
                          {ex.name} <small style={{ color: '#999' }}>({ex.type})</small>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
