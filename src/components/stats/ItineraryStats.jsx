"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import "../../styles/ItineraryStats.css"

const ItineraryStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#64748b"]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://pathcraft-backend.onrender.com/api/recommendations/stats")
        setStats(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Failed to load statistics. Please try again later.")
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
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

  if (!stats) {
    return (
      <div className="error-container">
        <h3>No Data Available</h3>
        <p>There are no statistics available at this time.</p>
      </div>
    )
  }

  return (
    <div className="stats-container">
      <div className="page-header">
        <h2>Itinerary Statistics</h2>
        <p>Insights and analytics about our travel itineraries</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Itineraries</h3>
          <div className="stat-value">{stats.totalItineraries}</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-container">
          <h3>Itineraries by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byRegion} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Itineraries by Duration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byDuration} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nights" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Region Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byRegion}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="region"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.byRegion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ItineraryStats
