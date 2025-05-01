"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, Link, useNavigate } from "react-router-dom"
import { MapPin, Calendar, Clock, DollarSign, Tag, Award } from "lucide-react"
import "../../styles/ItineraryDetail.css"

const ItineraryDetail = () => {
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://pathcraft-backend.onrender.com/api/itineraries/${id}`)
        setItinerary(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching itinerary details:", err)
        setError("Failed to load itinerary details. Please try again later.")
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [id])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading itinerary details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Back to Itineraries
        </Link>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="error-container">
        <h3>Itinerary Not Found</h3>
        <p>The itinerary you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">
          Back to Itineraries
        </Link>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="itinerary-detail-container">
      <div className="itinerary-header">
        <div className="header-content">
          <h2>{itinerary.name}</h2>
          <div className="itinerary-meta">
            <div className="meta-item">
              <MapPin size={18} />
              <span>{itinerary.region}</span>
            </div>
            <div className="meta-item">
              <Calendar size={18} />
              <span>{itinerary.nights} nights</span>
            </div>
            <div className="meta-item">
              <DollarSign size={18} />
              <span>${itinerary.price_estimate} USD</span>
            </div>
          </div>
          {itinerary.is_recommended && (
            <div className="recommended-badge">
              <Award size={16} />
              <span>Recommended</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          {/* <button className="btn btn-primary">Book This Trip</button> */}
          <Link to={`/edit-itinerary/${itinerary.id}`} className="btn btn-secondary">
            Edit Itinerary
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this itinerary?")) {
                axios
                  .delete(`https://pathcraft-backend.onrender.com/api/itineraries/${id}`)
                  .then(() => {
                    alert("Itinerary deleted successfully!")
                    navigate("/")
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

      <div className="itinerary-description">
        <p>{itinerary.description}</p>
      </div>

      <div className="itinerary-highlights">
        <h3>Highlights</h3>
        <ul className="highlights-list">
          {itinerary.highlights.map((highlight, index) => (
            <li key={index} className="highlight-item">
              <span className="highlight-icon">✦</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {itinerary.tags && itinerary.tags.length > 0 && (
        <div className="itinerary-tags">
          <h3>
            <Tag size={18} />
            <span>Tags</span>
          </h3>
          <div className="tags-list">
            {itinerary.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="itinerary-days">
        <h3>Daily Schedule</h3>
        {itinerary.days.map((day) => (
          <div key={day.id || day.day_number} className="day-card">
            <div className="day-header">
              <h4>Day {day.day_number}</h4>
              <span className="day-date">{formatDate(day.date)}</span>
            </div>

            {day.accommodations && day.accommodations.length > 0 && (
              <div className="day-section">
                <h5>Accommodation</h5>
                {day.accommodations.map((acc, index) => (
                  <div key={index} className="accommodation-item">
                    <div className="accommodation-name">{acc.hotel_name}</div>
                    <div className="accommodation-time">
                      <Clock size={14} />
                      <span>Check-in: {acc.check_in_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {day.transfers && day.transfers.length > 0 && (
              <div className="day-section">
                <h5>Transfers</h5>
                {day.transfers.map((transfer, index) => (
                  <div key={index} className="transfer-item">
                    <div className="transfer-route">
                      <span>{transfer.from_location}</span>
                      <span className="transfer-arrow">→</span>
                      <span>{transfer.to_location}</span>
                    </div>
                    <div className="transfer-time">
                      <Clock size={14} />
                      <span>Departure: {transfer.departure_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {day.activities && day.activities.length > 0 && (
              <div className="day-section">
                <h5>Activities</h5>
                {day.activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <h6>{activity.activity_name}</h6>
                      <div className="activity-time">
                        <Clock size={14} />
                        <span>
                          {activity.start_time} - {activity.end_time}
                        </span>
                      </div>
                    </div>
                    {activity.description && <p className="activity-description">{activity.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="itinerary-actions">
        <Link to="/" className="btn btn-secondary">
          Back to Itineraries
        </Link>
        {/* <button className="btn btn-primary">Book This Trip</button> */}
      </div>
    </div>
  )
}

export default ItineraryDetail
