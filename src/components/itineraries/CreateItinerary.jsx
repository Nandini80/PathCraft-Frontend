"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../styles/CreateItinerary.css"

const CreateItinerary = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    region: "Phuket",
    nights: 3,
    description: "",
    highlights: ["", ""],
    price_estimate: 500,
    tags: ["culture", "beach"],
    is_recommended: false,
  })

  const [days, setDays] = useState([
    {
      day_number: 1,
      date: new Date().toISOString().split("T")[0],
      accommodations: [{ hotel_name: "", check_in_time: "14:00" }],
      transfers: [{ from_location: "", to_location: "", departure_time: "12:00" }],
      activities: [{ activity_name: "", start_time: "09:00", end_time: "12:00", description: "" }],
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({
      ...formData,
      highlights: newHighlights,
    })
  }

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, ""],
    })
  }

  const handleDayChange = (dayIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex][field] = value
    setDays(newDays)
  }

  const handleAccommodationChange = (dayIndex, accIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex].accommodations[accIndex][field] = value
    setDays(newDays)
  }

  const handleTransferChange = (dayIndex, transferIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex].transfers[transferIndex][field] = value
    setDays(newDays)
  }

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex].activities[activityIndex][field] = value
    setDays(newDays)
  }

  const addDay = () => {
    const newDayNumber = days.length + 1
    const lastDate = new Date(days[days.length - 1].date)
    lastDate.setDate(lastDate.getDate() + 1)

    setDays([
      ...days,
      {
        day_number: newDayNumber,
        date: lastDate.toISOString().split("T")[0],
        accommodations: [{ hotel_name: "", check_in_time: "14:00" }],
        transfers: [{ from_location: "", to_location: "", departure_time: "12:00" }],
        activities: [{ activity_name: "", start_time: "09:00", end_time: "12:00", description: "" }],
      },
    ])
  }

  const removeDay = (dayIndex) => {
    if (days.length <= 1) {
      alert("You must have at least one day in your itinerary");
      return;
    }
    
    const newDays = days.filter((_, index) => index !== dayIndex);
    
    // Renumber the days
    newDays.forEach((day, index) => {
      day.day_number = index + 1;
    });
    
    setDays(newDays);
  }

  const addActivity = (dayIndex) => {
    const newDays = [...days]
    newDays[dayIndex].activities.push({
      activity_name: "",
      start_time: "14:00",
      end_time: "17:00",
      description: "",
    })
    setDays(newDays)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newItinerary = {
        ...formData,
        days: days,
      }

      const response = await axios.post("https://pathcraft-backend.onrender.com/api/itineraries", newItinerary)

      setIsLoading(false)
      alert("Itinerary created successfully!")
      navigate(`/itinerary/${response.data.data.id}`)
    } catch (error) {
      setIsLoading(false)
      console.error("Error creating itinerary:", error)
      alert("Failed to create itinerary. Please try again.")
    }
  }

  return (
    <div className="create-itinerary-container">
      <div className="page-header">
        <h2>Create New Itinerary</h2>
        <p>Design your perfect travel experience</p>
      </div>

      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Itinerary Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Tropical Paradise Getaway"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select id="region" name="region" value={formData.region} onChange={handleInputChange} required>
                <option value="Phuket">Phuket</option>
                <option value="Krabi">Krabi</option>
                <option value="Bangkok">Bangkok</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nights">Number of Nights</label>
              <input
                type="number"
                id="nights"
                name="nights"
                min="1"
                max="14"
                value={formData.nights}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price_estimate">Price Estimate (USD)</label>
              <input
                type="number"
                id="price_estimate"
                name="price_estimate"
                min="0"
                value={formData.price_estimate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this amazing itinerary..."
              rows="4"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Highlights</h3>
          <p>What makes this itinerary special?</p>

          {formData.highlights.map((highlight, index) => (
            <div className="form-group" key={`highlight-${index}`}>
              <label htmlFor={`highlight-${index}`}>Highlight {index + 1}</label>
              <input
                type="text"
                id={`highlight-${index}`}
                value={highlight}
                onChange={(e) => handleHighlightChange(index, e.target.value)}
                placeholder="e.g., Sunset cruise along the coast"
              />
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addHighlight}>
            Add Highlight
          </button>
        </div>

        <div className="form-section">
          <h3>Daily Itinerary</h3>

          {days.map((day, dayIndex) => (
            <div className="day-section" key={`day-${dayIndex}`}>
              <div className="day-header-with-actions">
                <h4>Day {day.day_number}</h4>
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm" 
                  onClick={() => removeDay(dayIndex)}
                >
                  Remove Day
                </button>
              </div>

              <div className="form-group">
                <label htmlFor={`day-date-${dayIndex}`}>Date</label>
                <input
                  type="date"
                  id={`day-date-${dayIndex}`}
                  value={day.date}
                  onChange={(e) => handleDayChange(dayIndex, "date", e.target.value)}
                  required
                />
              </div>

              <div className="sub-section">
                <h5>Accommodation</h5>
                {day.accommodations.map((acc, accIndex) => (
                  <div className="form-row" key={`acc-${dayIndex}-${accIndex}`}>
                    <div className="form-group">
                      <label>Hotel Name</label>
                      <input
                        type="text"
                        value={acc.hotel_name}
                        onChange={(e) => handleAccommodationChange(dayIndex, accIndex, "hotel_name", e.target.value)}
                        placeholder="e.g., Beachside Resort"
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-in Time</label>
                      <input
                        type="time"
                        value={acc.check_in_time}
                        onChange={(e) => handleAccommodationChange(dayIndex, accIndex, "check_in_time", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="sub-section">
                <h5>Transfers</h5>
                {day.transfers.map((transfer, transferIndex) => (
                  <div className="form-row" key={`transfer-${dayIndex}-${transferIndex}`}>
                    <div className="form-group">
                      <label>From</label>
                      <input
                        type="text"
                        value={transfer.from_location}
                        onChange={(e) => handleTransferChange(dayIndex, transferIndex, "from_location", e.target.value)}
                        placeholder="e.g., Airport"
                      />
                    </div>
                    <div className="form-group">
                      <label>To</label>
                      <input
                        type="text"
                        value={transfer.to_location}
                        onChange={(e) => handleTransferChange(dayIndex, transferIndex, "to_location", e.target.value)}
                        placeholder="e.g., Hotel"
                      />
                    </div>
                    <div className="form-group">
                      <label>Departure Time</label>
                      <input
                        type="time"
                        value={transfer.departure_time}
                        onChange={(e) =>
                          handleTransferChange(dayIndex, transferIndex, "departure_time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="sub-section">
                <h5>Activities</h5>
                {day.activities.map((activity, activityIndex) => (
                  <div className="activity-item" key={`activity-${dayIndex}-${activityIndex}`}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Activity Name</label>
                        <input
                          type="text"
                          value={activity.activity_name}
                          onChange={(e) =>
                            handleActivityChange(dayIndex, activityIndex, "activity_name", e.target.value)
                          }
                          placeholder="e.g., Snorkeling Tour"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={activity.start_time}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, "start_time", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={activity.end_time}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, "end_time", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={activity.description}
                        onChange={(e) => handleActivityChange(dayIndex, activityIndex, "description", e.target.value)}
                        placeholder="Describe this activity..."
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => addActivity(dayIndex)}>
                  Add Activity
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addDay}>
            Add Day
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Itinerary"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateItinerary
