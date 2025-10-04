import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Search, Droplets, CloudRain, TrendingUp, AlertTriangle, Volume2, Navigation } from 'lucide-react';
import './WaterLevelModal.css';

const WaterLevelModal = ({ onClose }) => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waterData, setWaterData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    loadLeafletResources().then(() => {
      initializeMap();
    });

    return () => {
      if (map) {
        map.remove();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const loadLeafletResources = () => {
    return new Promise((resolve) => {
      if (window.L) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  };

  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;

    const defaultCenter = [28.6139, 77.2090]; // New Delhi
    const mapInstance = window.L.map(mapRef.current).setView(defaultCenter, 5);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(mapInstance);

    mapInstance.on('click', async (e) => {
      const clickedCoords = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      
      setCoordinates(clickedCoords);
      const address = await reverseGeocode(clickedCoords.lat, clickedCoords.lng);
      setLocation(address);

      updateMarker(mapInstance, clickedCoords, address);
    });

    setMap(mapInstance);
  };

  const updateMarker = (mapInstance, coords, address) => {
    if (marker) {
      mapInstance.removeLayer(marker);
    }
    
    const newMarker = window.L.marker([coords.lat, coords.lng])
      .addTo(mapInstance)
      .bindPopup(`Selected: ${address}`)
      .openPopup();
    
    setMarker(newMarker);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      const address = data.address;
      
      let displayName = address.village || address.town || address.city || address.county || data.display_name.split(',')[0];
      if (address.state) displayName += `, ${address.state}`;
      
      return displayName;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
  };

  const searchLocation = async () => {
    if (!location.trim() || !window.L) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      
      if (!response.ok) throw new Error('Location search failed');
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const coords = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
        
        setCoordinates(coords);
        
        if (map) {
          map.setView([coords.lat, coords.lng], 12);
          updateMarker(map, coords, result.display_name);
        }
      }
    } catch (error) {
      console.error('Location search error:', error);
      alert('Unable to find the location. Please try a different search term.');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCoordinates(currentLocation);
          const address = await reverseGeocode(currentLocation.lat, currentLocation.lng);
          setLocation(address);
          
          if (map) {
            map.setView([currentLocation.lat, currentLocation.lng], 15);
            updateMarker(map, currentLocation, address);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please allow location access or search manually.');
        }
      );
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim() || !coordinates) {
      alert('Please select a location by searching or clicking on the map.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/water-level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          language: selectedLanguage
        })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      setWaterData(result.data);
    } catch (error) {
      console.error('Error fetching water data:', error);
      alert('Unable to fetch water data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = async () => {
    if (!waterData) return;
    
    try {
      setIsSpeaking(true);
      
      // Generate audio using our backend
      const response = await fetch('http://localhost:8000/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: waterData.farmerMessage,
          language: selectedLanguage
        })
      });

      if (response.ok) {
        const audioResult = await response.json();
        const audio = new Audio(`http://localhost:8000/api/audio/${audioResult.audio_id}`);
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        
        await audio.play();
      } else {
        throw new Error('Audio generation failed');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(waterData.farmerMessage);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'pa-IN';
      utterance.rate = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Green': return 'var(--status-success)';
      case 'Yellow': return 'var(--status-warning)';
      case 'Red': return 'var(--status-error)';
      default: return 'var(--neutral-500)';
    }
  };

  const resetForm = () => {
    setWaterData(null);
    setLocation('');
    setCoordinates(null);
    if (marker && map) {
      map.removeLayer(marker);
      setMarker(null);
      map.setView([28.6139, 77.2090], 5);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="water-level-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="water-level-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">
              <MapPin className="modal-title-icon" />
              Know Your Water Level
            </h2>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            {!waterData ? (
              // Location Input Form with Map
              <form onSubmit={handleLocationSubmit} className="location-form">
                {/* Language Toggle */}
                <div className="language-toggle">
                  <label>Response Language:</label>
                  <div className="language-buttons">
                    <button
                      type="button"
                      className={`lang-btn ${selectedLanguage === 'hi' ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage('hi')}
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      className={`lang-btn ${selectedLanguage === 'pa' ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage('pa')}
                    >
                      ਪੰਜਾਬੀ
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Search for your village, block, or district
                  </label>
                  <div className="location-input-container">
                    <Search className="location-input-icon" />
                    <input
                      ref={searchInputRef}
                      id="location-input"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Rajapur block, Alwar district"
                      className="location-input"
                      disabled={isLoading}
                    />
                    <div className="location-input-actions">
                      <button 
                        type="button"
                        className="search-btn"
                        onClick={searchLocation}
                        disabled={!location.trim()}
                        title="Search location"
                      >
                        <Search size={16} />
                      </button>
                      <button 
                        type="button"
                        className="current-location-btn"
                        onClick={getCurrentLocation}
                        title="Use current location"
                      >
                        <Navigation size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="input-hint">
                    Or click directly on the map to select your location
                  </p>
                </div>

                {/* Leaflet Map */}
                <div className="map-container">
                  <div ref={mapRef} className="map" id="water-level-map"></div>
                  <div className="map-overlay-instruction">
                    <MapPin size={20} />
                    <span>Click on map to select location</span>
                  </div>
                </div>

                {coordinates && (
                  <div className="coordinates-display">
                    <span><strong>Selected Location:</strong> {location}</span>
                    <span><strong>Coordinates:</strong> Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={!location.trim() || !coordinates || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Analyzing Water Level...
                    </>
                  ) : (
                    'Check Water Level'
                  )}
                </button>
              </form>
            ) : (
              // Water Level Results
              <div className="water-results">
                {/* Language Toggle */}
                <div className="language-toggle">
                  <label>Response Language:</label>
                  <div className="language-buttons">
                    <button
                      type="button"
                      className={`lang-btn ${selectedLanguage === 'hi' ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage('hi')}
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      className={`lang-btn ${selectedLanguage === 'pa' ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage('pa')}
                    >
                      ਪੰਜਾਬੀ
                    </button>
                  </div>
                </div>

                {/* Location Header */}
                <div className="location-header">
                  <MapPin size={20} />
                  <div>
                    <h3 className="location-title">{waterData.location}</h3>
                    {waterData.blockName && (
                      <p className="location-subtitle">
                        {waterData.blockName}, {waterData.district}
                      </p>
                    )}
                  </div>
                </div>

                {/* Risk Banner */}
                <div 
                  className="risk-banner"
                  style={{ borderLeftColor: getRiskColor(waterData.riskLevel) }}
                >
                  <div className="risk-indicator">
                    <span className="risk-level">{waterData.riskLevel} Risk</span>
                  </div>
                  <p className="risk-message">{waterData.farmerMessage}</p>
                  <button 
                    className="speak-btn"
                    onClick={speakMessage}
                    disabled={isSpeaking}
                  >
                    <Volume2 size={16} />
                    {isSpeaking ? 'Speaking...' : `Listen in ${selectedLanguage === 'hi' ? 'Hindi' : 'Punjabi'}`}
                  </button>
                </div>

                {/* Action Card */}
                <div className="action-card">
                  <AlertTriangle className="action-icon" />
                  <div className="action-content">
                    <h3 className="action-title">Recommended Action</h3>
                    <p className="action-text">{waterData.action}</p>
                  </div>
                </div>

                {/* Water Data Grid */}
                <div className="water-data-grid">
                  <div className="data-card">
                    <CloudRain className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Rainfall (mm)</span>
                      <span className="data-value">{waterData.rainfall?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <Droplets className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Ground Water Recharge (ham)</span>
                      <span className="data-value">{waterData.groundwaterRecharge?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <Droplets className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Natural Discharges (ham)</span>
                      <span className="data-value">{waterData.naturalDischarges?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <Droplets className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Annual Extractable (ham)</span>
                      <span className="data-value">{waterData.annualExtractable?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <Droplets className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Ground Water Extraction (ham)</span>
                      <span className="data-value">{waterData.groundwaterExtraction?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <TrendingUp className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Stage of Extraction (%)</span>
                      <span className="data-value">{waterData.stageOfExtraction}%</span>
                    </div>
                  </div>

                  <div className="data-card">
                    <Droplets className="data-icon" />
                    <div className="data-content">
                      <span className="data-label">Depth to Water (m.bgl)</span>
                      <span className="data-value">{waterData.depthToWater}m</span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="explanation-card">
                  <h3 className="explanation-title">Why this matters?</h3>
                  <p className="explanation-text">{waterData.explanation}</p>
                  {waterData.lastUpdated && (
                    <p className="last-updated">
                      Last updated: {waterData.lastUpdated}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="btn-secondary" onClick={resetForm}>
                    Check Another Location
                  </button>
                  <button className="btn-primary">
                    Download Detailed Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaterLevelModal;