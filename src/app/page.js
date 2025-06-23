'use client'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [projects, setProjects] = useState([])
  const [exports, setexports] = useState([])

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        console.log("Projects:", data.projects)
        setProjects(data.projects)
      })
      .catch((err) => {
        console.error("Failed to fetch projects", err)
      })
  }, [])

  const playProject = (project) => {
    fetch("/api/playproject", {
      method: "POST",
      body: JSON.stringify({ project }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((err) => {
        console.error("Failed to play project", err);
      });
  };

  const stopProject = (project) => {
    fetch("/api/stopProject", {
      method: "POST",
      body: JSON.stringify({ project }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((err) => {
        console.error("Failed to play project", err);
      });
  };
  const getExports = (project) => {
    fetch("/api/getExports", {
      method: "POST",
      body: JSON.stringify({ project }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data.exports.response);
        setexports(data.exports.response);
      })
      .catch((err) => {
        console.error("Failed to play project", err);
      });
  };



  return (
    <div >
      <h1 >Available Projects</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Project</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{project}</td>
              <td style={{ padding: '8px' }}>
                <button
                  onClick={() => getExports(project)}
                  style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#003500', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  getExports
                </button>
                <button
                  onClick={() => playProject(project)}
                  style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Play
                </button>
                <button
                  onClick={() => stopProject(project)}
                  style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Stop
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {exports.map((val, i) => {
          return (
            <p key={i}>
              <strong>{val.Name}:</strong> {val.Value}
            </p>
          )
        })}
      </div>

    </div>
  )
}

export default Page
