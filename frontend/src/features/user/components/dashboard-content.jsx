"use client"
import DashboardOverview from "./dashboard-overview"
import TripSearch from "./trip-search"
import TripHistory from "./trip-history"
import UserProfile from "./user-profile"
import MessagingInterface from "./messaging-interface"
import NotificationsPanel from "./notifications-panel"
import MyTrips from "./my-trips"

export default function DashboardContent({ activeView }) {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {activeView === "dashboard" && <DashboardOverview />}
        {activeView === "search" && <TripSearch />}
        {activeView === "trips" && <MyTrips />}
        {activeView === "history" && <TripHistory />}
        {activeView === "profile" && <UserProfile />}
        {activeView === "messages" && <MessagingInterface />}
        {activeView === "notifications" && <NotificationsPanel />}
      </div>
    </main>
  )
}

