import DashboardOverview from "./dashboard-overview"
import TripHistory from "./trip-history"
import UserProfile from "./user-profile"
import MyTrips from "./my-trips"

export default function DashboardContent({ activeView }) {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {activeView === "dashboard" && <DashboardOverview />}
        {activeView === "trips" && <MyTrips />}
        {activeView === "history" && <TripHistory />}
        {activeView === "profile" && <UserProfile />}
      </div>
    </main>
  )
}

