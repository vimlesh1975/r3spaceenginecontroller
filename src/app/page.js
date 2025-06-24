'use client'

import React, { useEffect, useState } from 'react'

const projectPath = "C:/Users/Administrator/Documents/R3.Space.Projects/projects";

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [data, setData] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)
  const [exports, setExports] = useState([])
  const [exportValues, setExportValues] = useState({})
  const [thumbnail, setThumbnail] = useState(null)




  useEffect(() => {
    setIsClient(true)
    fetch("/api/fullstructure")
      .then((res) => res.json())
      .then((data) => {
        setData(data.projectData);
        setSelectedProject(data.projectData[0]?.name || null);
      }
      )
      .catch((err) => console.error("Failed to fetch structure", err))
  }, [])

  if (!isClient || data.length === 0) return null

  const styles = {
    container: {
      padding: 30,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: darkMode ? '#121212' : '#f0f0f0',
      color: darkMode ? '#f5f5f5' : '#000',
      minHeight: '100vh'
    },
    toggle: {
      marginBottom: 20,
      cursor: 'pointer',
      fontSize: '0.9rem',
      textAlign: 'right',
      color: darkMode ? '#aaa' : '#333'
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '16px',

    },
    label: {
      fontWeight: 'bold',
      minWidth: '60px'
    },
    select: {
      padding: '6px 10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      color: darkMode ? '#f5f5f5' : '#000'
    },
    input: {
      padding: '6px 10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      width: '200px',
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      color: darkMode ? '#f5f5f5' : '#000'
    },
    button: {
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    btnIn: { backgroundColor: '#007bff', color: 'white' },
    btnOut: { backgroundColor: '#6c757d', color: 'white' },
    btnExport: { backgroundColor: '#28a745', color: 'white' },
    btnSend: { backgroundColor: '#ffc107', color: '#222' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
        🌓 Switch to {darkMode ? 'Light' : 'Dark'} Mode
      </div>

      <h2>🎮 R³ Scene Controller</h2>
      <div>
        <img src={thumbnail} alt='thumb' />
      </div>

      {/* Project & Scene Select */}
      <div style={styles.row}>
        <label style={styles.label}>Project:</label>
        <select
          value={selectedProject || ""}
          onChange={(e) => {
            setSelectedProject(e.target.value)
            setSelectedScene(null)
            setExports([])
            setExportValues({})
            setThumbnail(null)
          }}
          style={styles.select}
        >
          <option value="" disabled>Select</option>
          {data.map((project) => (
            <option key={project.name} value={project.name}>{project.name}</option>
          ))}
        </select>

        {selectedProject && (
          <>
            <label style={styles.label}>Scene:</label>
            <select
              value={selectedScene || ""}
              onChange={async (e) => {
                const sceneName = e.target.value
                setSelectedScene(sceneName)

                const res = await fetch("/api/exports", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ project: selectedProject, scene: sceneName })
                })

                const data = await res.json()
                setExports(data.exports || [])
                setThumbnail(data.thumbnail || null)

                const initialValues = {}
                data.exports.forEach((exp) => {
                  initialValues[exp.name] = exp.value
                })
                setExportValues(initialValues)
              }}
              style={styles.select}
            >
              <option value="" disabled>Select</option>
              {data.find(p => p.name === selectedProject)?.scenes.map(scene => (
                <option key={scene.name} value={scene.name}>{scene.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Timeline Buttons */}
      {selectedScene && (
        <div style={styles.row}>
          <button
            style={{ ...styles.button, ...styles.btnIn }}
            onClick={() =>
              fetch("/api/timeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: "In" })
              }).then(res => res.json()).then(console.log)
            }
          >
            ▶️ Play with defalut values
          </button>

          <button
            style={{ ...styles.button, ...styles.btnOut }}
            onClick={() =>
              fetch("/api/timeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: "Out" })
              }).then(res => res.json()).then(console.log)
            }
          >
            ⏹ Out
          </button>

          <button
            style={{ ...styles.button, ...styles.btnExport }}
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
              }).then(res => res.json()).then(console.log)
            }
          >
            ▶️ Play With new values
          </button>
          <button style={{ ...styles.button, ...styles.btnExport }} onClick={() => {
            fetch("/api/unloadAllScenes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }).then(res => res.json()).then(console.log)
          }}>Unload All Scenes</button>
          <button
            style={{ ...styles.button, ...styles.btnSend }}
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
              console.log("Export update:", result)
            }}
          >
            Update values
          </button>

        </div>
      )}

      {/* Export Inputs */}
      {exports.length > 0 && (
        <>
          <h3>Scene Exports</h3>
          {exports.map((exp) => (
            <div key={exp.name} style={styles.row} >
              <label style={styles.label}>{exp.name}:</label>

              {exp.type === "String" ? (
                <textarea
                  style={{ ...styles.input, height: 60, width: 700, resize: 'vertical' }}
                  value={exportValues[exp.name] || ""}
                  onChange={(e) =>
                    setExportValues((prev) => ({ ...prev, [exp.name]: e.target.value }))
                  }
                />
              ) : (
                <input
                  style={styles.input}
                  value={exportValues[exp.name] || ""}
                  onChange={(e) =>
                    setExportValues((prev) => ({ ...prev, [exp.name]: e.target.value }))
                  }
                />
              )}

              <small style={{ color: darkMode ? '#bbb' : '#666' }}>({exp.type})</small>
            </div>
          ))}



        </>
      )}
    </div>
  )
}
