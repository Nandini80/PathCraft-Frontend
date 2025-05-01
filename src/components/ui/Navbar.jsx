"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, MapPin, Compass, PlusCircle, User, BarChart2 } from "lucide-react"
import "../../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <span className="logo-icon">🧭</span>
            <span className="logo-text">PathCraft</span>
          </Link>
        </div>

        <nav className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navbar-links">
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeMenu}>
                <MapPin size={18} />
                <span>Itineraries</span>
              </Link>
            </li>
            <li>
              <Link to="/recommendations" className={isActive("/recommendations") ? "active" : ""} onClick={closeMenu}>
                <Compass size={18} />
                <span>Recommendations</span>
              </Link>
            </li>
            <li>
              <Link
                to="/create-itinerary"
                className={isActive("/create-itinerary") ? "active" : ""}
                onClick={closeMenu}
              >
                <PlusCircle size={18} />
                <span>Create Itinerary</span>
              </Link>
            </li>
            <li>
              <Link to="/stats" className={isActive("/stats") ? "active" : ""} onClick={closeMenu}>
                <BarChart2 size={18} />
                <span>Statistics</span>
              </Link>
            </li>
          </ul>
          {/* <div className="navbar-auth">
            <button className="btn btn-secondary">
              <User size={18} />
              <span>Sign In</span>
            </button>
          </div> */}
        </nav>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

export default Navbar
