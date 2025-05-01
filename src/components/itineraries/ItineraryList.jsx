"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { MapPin, Calendar, Search, Filter, RefreshCw } from "lucide-react"
import "../../styles/ItineraryList.css"

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    region: "all",
    nights: "all",
    searchTerm: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [hideImages, setHideImages] = useState(false)

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true)
        const params = {}

        if (filters.region !== "all") {
          params.region = filters.region
        }

        if (filters.nights !== "all") {
          params.nights = filters.nights
        }

        if (filters.searchTerm) {
          params.search = filters.searchTerm
        }

        const response = await axios.get("https://pathcraft-backend.onrender.com/api/itineraries", {
          params,
        })

        setItineraries(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching itineraries:", err)
        setError("Failed to load itineraries. Please try again later.")
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // The search is already triggered by the useEffect when filters change
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const resetFilters = () => {
    setFilters({
      region: "all",
      nights: "all",
      searchTerm: "",
    })
  }

  if (loading && itineraries.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading itineraries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="itinerary-list-container">
      <div className="page-header">
        <h2>Explore Itineraries</h2>
        <p>Discover and plan your perfect trip with our curated travel itineraries</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search itineraries..."
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="filter-controls">
          <button className="filter-toggle" onClick={toggleFilters}>
            <Filter size={18} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          {filters.region !== "all" || filters.nights !== "all" ? (
            <button className="filter-reset" onClick={resetFilters}>
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
          ) : null}
        </div>
        {/* <div className="display-controls">
          <button className="display-toggle" onClick={() => setHideImages(!hideImages)}>
            {hideImages ? "Show Images" : "Hide Images"}
          </button>
        </div> */}
      </div>

      {showFilters && (
        <div className="filters-form">
          <div className="filter-group">
            <label htmlFor="region">Region</label>
            <select id="region" name="region" value={filters.region} onChange={handleFilterChange}>
              <option value="all">All Regions</option>
              <option value="Phuket">Phuket</option>
              <option value="Krabi">Krabi</option>
              <option value="Bangkok">Bangkok</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="nights">Duration</label>
            <select id="nights" name="nights" value={filters.nights} onChange={handleFilterChange}>
              <option value="all">Any Duration</option>
              <option value="2">2 Nights</option>
              <option value="3">3 Nights</option>
              <option value="5">5 Nights</option>
              <option value="7">7 Nights</option>
              <option value="10">10+ Nights</option>
            </select>
          </div>
        </div>
      )}

      {itineraries.length === 0 ? (
        <div className="no-results">
          <h3>No itineraries found</h3>
          <p>Try adjusting your filters or search terms to see more options.</p>
          <button className="btn btn-secondary" onClick={resetFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="itineraries-grid">
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="itinerary-card">
              {/* {!hideImages && (
                <div className="itinerary-card-image">
                  <img
                    src={`https://source.unsplash.com/random/300x200/?${itinerary.region.toLowerCase()},travel&sig=${itinerary.id}`}
                    alt={itinerary.name}
                  />
                </div>
              )} */}
              <div className="itinerary-card-content">
                <h3>{itinerary.name}</h3>
                <div className="itinerary-card-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{itinerary.region}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{itinerary.nights} nights</span>
                  </div>
                </div>
                <p className="itinerary-card-description">
                  {itinerary.description && itinerary.description.length > 100
                    ? `${itinerary.description.substring(0, 100)}...`
                    : itinerary.description}
                </p>
                <div className="itinerary-card-actions">
                  <Link to={`/itinerary/${itinerary.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  <div className="card-action-buttons">
                    <Link to={`/edit-itinerary/${itinerary.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (window.confirm("Are you sure you want to delete this itinerary?")) {
                          axios
                            .delete(`https://pathcraft-backend.onrender.com/api/itineraries/${itinerary.id}`)
                            .then(() => {
                              // Refresh the list
                              const updatedItineraries = itineraries.filter((item) => item.id !== itinerary.id)
                              setItineraries(updatedItineraries)
                              alert("Itinerary deleted successfully!")
                            })
                            .catch((err) => {
                              console.error("Error deleting itinerary:", err)
                              alert("Failed to delete itinerary. Please try again.")
                            })
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="create-itinerary-cta">
        <h3>Can't find what you're looking for?</h3>
        <p>Create your own custom itinerary tailored to your preferences.</p>
        <Link to="/create-itinerary" className="btn btn-primary">
          Create New Itinerary
        </Link>
      </div>
    </div>
  )
}

export default ItineraryList
