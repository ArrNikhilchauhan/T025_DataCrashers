import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Users, BarChart3, AlertTriangle, Phone, Download } from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <Droplets size={32} />,
      title: "Real-time Water Advisory",
      description: "Get instant voice-based guidance in local languages about groundwater conditions"
    },
    {
      icon: <AlertTriangle size={32} />,
      title: "Early Warning System",
      description: "Receive alerts about falling water tables and drought conditions"
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytical Dashboard",
      description: "Deep insights with historical trends and forecast models"
    },
    {
      icon: <Users size={32} />,
      title: "Multi-user Support",
      description: "Tailored interfaces for farmers, field officers, and policymakers"
    }
  ];

  const userTypes = [
    {
      role: "Farmer",
      description: "Voice-first advisory in local language",
      icon: <Phone size={24} />,
      gradient: "user-card--farmer"
    },
    {
      role: "Field Officer",
      description: "Village-level alerts and interventions",
      icon: <Users size={24} />,
      gradient: "user-card--officer"
    },
    {
      role: "Analyst",
      description: "Comprehensive reports and exports",
      icon: <Download size={24} />,
      gradient: "user-card--analyst"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="hero-title">
              Smart Water
              <span className="hero-title--accent"> Advisory</span>
            </h1>
            <p className="hero-subtitle">
              AI-powered groundwater management system delivering actionable insights 
              to farmers, field officers, and policymakers
            </p>
            <div className="hero-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn--primary"
              >
                Get Water Advisory
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn--secondary"
              >
                View Dashboard
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Solving Water Management Challenges</h2>
            <p className="section-subtitle">
              Addressing the seven critical pain points in groundwater management through AI and real-time data
            </p>
          </motion.div>

          <div className="features-grid grid grid-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Journey Section */}
      <section className="users-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Designed for Every Stakeholder</h2>
            <p className="section-subtitle">
              Tailored experiences based on your role and needs
            </p>
          </motion.div>

          <div className="users-grid grid grid-3">
            {userTypes.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className={`user-card ${user.gradient}`}
              >
                <div className="user-header">
                  {user.icon}
                  <h3 className="user-role">
                    {user.role}
                  </h3>
                </div>
                <p className="user-description">
                  {user.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn--white"
                >
                  Access Portal
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid grid grid-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="stat-item"
            >
              <div className="stat-number">1000+</div>
              <div className="stat-label">Blocks Covered</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="stat-item"
            >
              <div className="stat-number">5</div>
              <div className="stat-label">Local Languages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="stat-item"
            >
              <div className="stat-number">24/7</div>
              <div className="stat-label">Real-time Monitoring</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="stat-item"
            >
              <div className="stat-number">&lt;3s</div>
              <div className="stat-label">Response Time</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;