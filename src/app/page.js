'use client'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [projects, setProjects] = useState([])

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

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Available Projects</h1>
      <ul className="list-disc pl-6">
        {projects.map((project, index) => (
          <div key={index} className="text-lg">{project}
            <button onClick={() => playProject(project)}> Play</button>
            <button onClick={() => stopProject(project)}> Stop</button>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Page
