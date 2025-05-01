import { Link } from "react-router-dom"
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react"
import "../../styles/Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🧭</span>
              <span className="logo-text">PathCraft</span>
            </Link>
            <p className="footer-tagline">Craft your perfect journey through Thailand's most beautiful destinations</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Explore</h4>
              <ul>
                <li>
                  <Link to="/">All Itineraries</Link>
                </li>
                <li>
                  <Link to="/recommendations">Recommendations</Link>
                </li>
                <li>
                  <Link to="/create-itinerary">Create Itinerary</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Destinations</h4>
              <ul>
                <li>
                  <Link to="/?region=Phuket">Phuket</Link>
                </li>
                <li>
                  <Link to="/?region=Krabi">Krabi</Link>
                </li>
                <li>
                  <Link to="/?region=Bangkok">Bangkok</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Contact Us</h4>
              <ul className="footer-contact-info">
                <li>
                  <MapPin size={16} />
                  <span>123 Travel Street, Bangkok, Thailand</span>
                </li>
                <li>
                  <Mail size={16} />
                  <a href="mailto:info@pathcraft.com">info@pathcraft.com</a>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+6612345678">+66 123 456 78</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
            </a>
          </div>
          <div className="footer-copyright">
            <p>&copy; {currentYear} PathCraft. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
