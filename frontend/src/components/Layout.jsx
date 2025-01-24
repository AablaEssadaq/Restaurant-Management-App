import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.jsx"

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#FFF1E4]"> { /*fix the height of the layout to the screen height*/} 
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">  { /* overflow auto makes the content scrollable inside the area, while keeping the screen height fixed*/} 
        <Outlet /> {/* This is where child components will be rendered */}
      </main>
    </div>
  )
}

export default Layout

