"use client"

import { useState } from "react"
import DashboardSidebar from "./dashboard-sidebar"
import DashboardContent from "./dashboard-content"

export default function PassengerDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <DashboardContent activeView={activeView} />
    </div>
  )
}
