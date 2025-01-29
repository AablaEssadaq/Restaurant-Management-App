import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Breadcrumbs from "./Breadcrumbs"

const Layout = () => {

  return (
    <div className="flex h-screen bg-[#FFF1E4]">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto">
          <Breadcrumbs/>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout

