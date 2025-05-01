import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ItineraryList from "./components/itineraries/ItineraryList"
import ItineraryDetail from "./components/itineraries/ItineraryDetail"
import Recommendation from "./components/itineraries/Recommendation"
import CreateItinerary from "./components/itineraries/CreateItinerary"
import Navbar from "./components/UI/Navbar"
import Footer from "./components/UI/Footer"
import "./App.css"
import EditItinerary from "./components/itineraries/EditItinerary"
import ItineraryStats from "./components/stats/ItineraryStats"

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ItineraryList />} />
            <Route path="/itinerary/:id" element={<ItineraryDetail />} />
            <Route path="/recommendations" element={<Recommendation />} />
            <Route path="/create-itinerary" element={<CreateItinerary />} />
            <Route path="/edit-itinerary/:id" element={<EditItinerary />} />
            <Route path="/stats" element={<ItineraryStats />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
