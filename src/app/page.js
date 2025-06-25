'use client'

import React, { useEffect, useState } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)
  const [exports, setExports] = useState([])
  const [exportValues, setExportValues] = useState({})
  const [thumbnail, setThumbnail] = useState(null)
  const [command, setCommand] = useState(`engine createscene "ProjectName/SceneName"`)
  const [commandResponse, setCommandResponse] = useState(``)
  const [listloadedscenes, setListloadedscenes] = useState([])

  useEffect(() => {
    setIsClient(true)
    fetch("/api/fullstructure")
      .then((res) => res.json())
      .then((data) => {
        setData(data.projectData)
        setSelectedProject(data.projectData[0]?.name || null)
      })
      .catch((err) => console.error("Failed to fetch structure", err))
  }, [])

  useEffect(() => {
    fetch("/api/sendCommand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: `engine listloadedscenes` })
    })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.responce?.response || ""
        const match = raw.match(/\[(.*?)\]/)
        const list = match?.[1]?.split(',').map(s => s.trim()) || []
        if (list.length > 0 && list[0] !== '') {
          setListloadedscenes(list)
        }
      })
      .catch((err) => console.error("Failed to fetch scenes", err))
  }, [])

  if (!isClient || data.length === 0) return null

  return (<div>
    <div style={{ backgroundColor: 'rgb(0, 123, 255)', height: 50, color: 'white' }}>
      <h2 >R³ Scene Controller</h2>
    </div>

    <div style={{ display: 'flex' }}>

      <div style={{ border: '1px solid red', width: 250, }}>
        <h2>Project:</h2>
        <select
          value={selectedProject || ""}
          onChange={(e) => {
            setSelectedProject(e.target.value)
            setSelectedScene(null)
            setExports([])
            setExportValues({})
            setThumbnail(null)
          }}
        >
          <option value="" disabled>Select</option>
          {data.map((project) => (
            <option key={project.name} value={project.name}>{project.name}</option>
          ))}
        </select>

        {selectedProject && (
          <>
            <h2>Scene:</h2>
            <div style={{ maxHeight: 700, overflow: 'scroll' }}>
              {data.find(p => p.name === selectedProject)?.scenes.map(scene => (
                <div
                  key={scene.name}
                  onClick={async () => {
                    setSelectedScene(scene.name)

                    const res = await fetch("/api/exports", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ project: selectedProject, scene: scene.name })
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
                  style={{
                    padding: '6px 12px',
                    marginBottom: '6px',
                    backgroundColor: selectedScene === scene.name ? '#007bff' : '#eee',
                    color: selectedScene === scene.name ? 'white' : '#000',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    userSelect: 'none'
                  }}
                >
                  {scene.name}
                </div>
              ))}
            </div>

          </>
        )}
      </div>
      <div style={{ border: '1px solid red', width: 950 }}>

        <div>
          <h3>Variables</h3>
          {exports.length > 0 && (
            <div style={{ height: 850, overflow: 'auto' }}>

              <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Value</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {exports.map((exp) => (
                    <tr key={exp.name}>
                      <td>{exp.name}</td>
                      <td>
                        {exp.type === "String" ? (
                          <textarea
                            style={{ width: 720, height: 60, resize: 'vertical' }}
                            value={exportValues[exp.name] || ""}
                            onChange={(e) =>
                              setExportValues((prev) => ({ ...prev, [exp.name]: e.target.value }))
                            }
                          />
                        ) : (
                          <input
                            style={{ width: 300 }}
                            value={exportValues[exp.name] || ""}
                            onChange={(e) =>
                              setExportValues((prev) => ({ ...prev, [exp.name]: e.target.value }))
                            }
                          />
                        )}
                      </td>
                      <td>{exp.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <div style={{ border: '1px solid red', width: 300 }}>
        <h2>Thumbnail</h2>
        <div style={{ border: ' 2px solid green' }}>

          <img src={thumbnail} alt="thumb" width={290} height={200} />
        </div>
        <h2>Actions</h2>
        {selectedScene && (
          <div>
            <button
              onClick={() =>
                fetch("/api/timeline", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: "In" })
                })
                  .then((res) => res.json())
                  .then(() => {
                    const sceneId = `${selectedProject}/${selectedScene}`
                    if (!listloadedscenes.includes(sceneId)) {
                      setListloadedscenes((prev) => [...prev, sceneId])
                    }
                  })
              }
            >
              ▶️ Play with default values
            </button>

            <button
              onClick={() =>
                fetch("/api/timeline", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: "Out" })
                })
                  .then((res) => res.json())
                  .then(() => {
                    const sceneId = `${selectedProject}/${selectedScene}`
                    setListloadedscenes((prev) => prev.filter((item) => item !== sceneId))
                  })
              }
            >
              ⏹ Out
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
                  .then(() => {
                    const sceneId = `${selectedProject}/${selectedScene}`
                    if (!listloadedscenes.includes(sceneId)) {
                      setListloadedscenes((prev) => [...prev, sceneId])
                    }
                  })
              }
            >
              ▶️ Play With New Values
            </button>

            <button
              onClick={() => {
                fetch("/api/unloadAllScenes", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                })
                  .then((res) => res.json())
                  .then(() => setListloadedscenes([]))
              }}
            >
              🧹 Unload All Scenes
            </button>

            <button
              onClick={async () => {
                const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                const res = await fetch("/api/setExports", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ project: selectedProject, scene: selectedScene, updates })
                })
                const result = await res.json()
                console.log("Export update:", result)
              }}
            >
              Update values
            </button>
            <div></div>

            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command here"
            />
            <button
              onClick={async () => {
                const res = await fetch("/api/sendCommand", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ command })
                })
                const result = await res.json()
                setCommandResponse(JSON.stringify(result))
              }}
            >
              Send Command
            </button>
            <label>{commandResponse}</label>
          </div>
        )}
      </div>




      <div style={{ border: '1px solid red', width: 400 }}>
        <h2>Loaded Scenes</h2>
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Loaded Scene</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listloadedscenes.map((scene, index) => (
              <tr key={index}>
                <td>{scene}</td>
                <td>
                  <button
                    onClick={() =>
                      fetch("/api/timeline", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          project: scene.split('/')[0],
                          scene: scene.split('/')[1],
                          timeline: "Out"
                        })
                      }).then(() =>
                        setListloadedscenes((prev) => prev.filter((s) => s !== scene))
                      )
                    }
                  >
                    ⏹ Out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  </div>)
}
