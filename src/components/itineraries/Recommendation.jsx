"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { MapPin, Calendar, DollarSign, Award, Filter } from 'lucide-react'
import "../../styles/Recommendation.css"

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    nights: 3,
    region: "Phuket",
    interests: "beach,culture",
    budget: "any",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [hideImages, setHideImages] = useState(false)
  const [popularRecommendations, setPopularRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://pathcraft-backend.onrender.com/api/recommendations", {
          params: {
            nights: filters.nights,
            region: filters.region,
            interests: filters.interests,
            budget: filters.budget !== "any" ? filters.budget : undefined,
          },
        })
        setRecommendations(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations. Please try again later.")
        setLoading(false)
      }

      // Fetch popular recommendations
      axios.get("https://pathcraft-backend.onrender.com/api/recommendations/popular")
        .then(response => setPopularRecommendations(response.data.data))
        .catch(error => console.error("Error fetching popular recommendations:", error));
    }

    fetchRecommendations()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  if (loading && recommendations.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Finding perfect itineraries for you...</p>
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
    <div className="recommendations-container">
      <div className="page-header">
        <h2>Recommended Itineraries</h2>
        <p>Discover our handpicked travel experiences tailored to your preferences</p>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <button className="filter-toggle" onClick={toggleFilters}>
            <Filter size={18} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
          <div className="active-filters">
            <span className="filter-pill">
              <MapPin size={14} />
              {filters.region}
            </span>
            <span className="filter-pill">
              <Calendar size={14} />
              {filters.nights} nights
            </span>
          </div>
        </div>

        <div className="display-controls">
          <button className="display-toggle" onClick={() => setHideImages(!hideImages)}>
            {hideImages ? "Show Images" : "Hide Images"}
          </button>
        </div>

        {showFilters && (
          <div className="filters-form">
            <div className="filter-group">
              <label htmlFor="region">Destination</label>
              <select id="region" name="region" value={filters.region} onChange={handleFilterChange}>
                <option value="Phuket">Phuket</option>
                <option value="Krabi">Krabi</option>
                <option value="Bangkok">Bangkok</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="nights">Duration</label>
              <select id="nights" name="nights" value={filters.nights} onChange={handleFilterChange}>
                <option value={2}>2 Nights</option>
                <option value={3}>3 Nights</option>
                <option value={5}>5 Nights</option>
                <option value={7}>7 Nights</option>
                <option value={10}>10 Nights</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="interests">Interests</label>
              <select id="interests" name="interests" value={filters.interests} onChange={handleFilterChange}>
                <option value="beach,culture">Beach & Culture</option>
                <option value="adventure">Adventure</option>
                <option value="food">Food & Cuisine</option>
                <option value="wellness">Wellness & Spa</option>
                <option value="family">Family Friendly</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="budget">Budget</label>
              <select id="budget" name="budget" value={filters.budget} onChange={handleFilterChange}>
                <option value="any">Any Budget</option>
                <option value="budget">Budget (Under $500)</option>
                <option value="mid">Mid-range ($500-$1000)</option>
                <option value="luxury">Luxury ($1000+)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="no-results">
          <h3>No itineraries found</h3>
          <p>Try adjusting your filters to see more options.</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((itinerary) => (
            <div key={itinerary.id} className="itinerary-card">
              {!hideImages && (
                <div className="itinerary-card-image">
                  <img
                    src={`https://source.unsplash.com/random/300x200/?${itinerary.region.toLowerCase()},travel&sig=${itinerary.id}`}
                    alt={itinerary.name}
                  />
                  {itinerary.is_recommended && (
                    <div className="recommended-badge">
                      <Award size={14} />
                      <span>Recommended</span>
                    </div>
                  )}
                </div>
              )}
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
                  <div className="meta-item">
                    <DollarSign size={16} />
                    <span>${itinerary.price_estimate}</span>
                  </div>
                </div>
                <p className="itinerary-card-description">
                  {itinerary.description.length > 120
                    ? `${itinerary.description.substring(0, 120)}...`
                    : itinerary.description}
                </p>
                {itinerary.tags && itinerary.tags.length > 0 && (
                  <div className="itinerary-card-tags">
                    {itinerary.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="itinerary-card-actions">
                  <Link to={`/itinerary/${itinerary.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {popularRecommendations.length > 0 && (
        <div className="popular-recommendations-section">
          <h3>Popular Recommendations</h3>
          <div className="recommendations-grid">
            {popularRecommendations.map((itinerary) => (
              <div key={`popular-${itinerary.id}`} className="itinerary-card">
                {!hideImages && (
                  <div className="itinerary-card-image">
                    <img
                      src={`https://source.unsplash.com/random/300x200/?${itinerary.region.toLowerCase()},travel&sig=${itinerary.id}-popular`}
                      alt={itinerary.name}
                    />
                    <div className="popular-badge">
                      <Award size={14} />
                      <span>Popular</span>
                    </div>
                  </div>
                )}
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
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span>${itinerary.price_estimate}</span>
                    </div>
                  </div>
                  <p className="itinerary-card-description">
                    {itinerary.description.length > 120
                      ? `${itinerary.description.substring(0, 120)}...`
                      : itinerary.description}
                  </p>
                  {itinerary.tags && itinerary.tags.length > 0 && (
                    <div className="itinerary-card-tags">
                      {itinerary.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="itinerary-card-actions">
                    <Link to={`/itinerary/${itinerary.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendation
