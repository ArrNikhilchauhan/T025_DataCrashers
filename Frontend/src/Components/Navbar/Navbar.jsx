import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, MapPin, BarChart3, Users, Phone, Menu, X } from 'lucide-react';
import './Navbar.css';
import WaterLevelModal from '../WaterLevelModal/WaterLevelModal'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWaterLevelModalOpen, setIsWaterLevelModalOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openWaterLevelModal = () => {
    setIsWaterLevelModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeWaterLevelModal = () => {
    setIsWaterLevelModalOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Droplets size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/advisory', label: 'Advisory', icon: <Users size={20} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={20} /> },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Droplets className="navbar-logo-icon" />
            <span className="navbar-logo-text">WaterAdvisory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${location.pathname === item.path ? 'navbar-link--active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button 
              className="navbar-water-level-btn"
              onClick={openWaterLevelModal}
            >
              <MapPin size={20} />
              <span>Know Your Water Level</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="navbar-mobile-toggle"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-mobile-link ${location.pathname === item.path ? 'navbar-mobile-link--active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button 
              className="navbar-mobile-water-level-btn"
              onClick={openWaterLevelModal}
            >
              <MapPin size={20} />
              <span>Know Your Water Level</span>
            </button>
          </div>
        )}
      </nav>

      {/* Water Level Modal */}
      {isWaterLevelModalOpen && (
        <WaterLevelModal onClose={closeWaterLevelModal} />
      )}
    </>
  );
};

export default Navbar;