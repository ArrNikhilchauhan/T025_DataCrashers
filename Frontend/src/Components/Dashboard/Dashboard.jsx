import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CloudRain,
  Sprout,
  Calendar,
  MapPin,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState([]);

  // Mock data with chart data
  const mockDistricts = [
    'Alwar', 'Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'
  ];

  const mockDashboardData = {
    district: 'Alwar',
    rainfallMonsoonRecharge: 6500.25,
    otherSourcesMonsoonRecharge: 2150.75,
    rainfallNonMonsoonRecharge: 1200.50,
    otherSourcesNonMonsoonRecharge: 850.25,
    totalAnnualRecharge: 10701.75,
    totalNaturalDischarges: 1070.18,
    annualExtractableResources: 9631.57,
    irrigationExtraction: 5461.20,
    domesticIndustrialExtraction: 1250.80,
    totalExtraction: 6712.00,
    domesticAllocation2025: 1500.00,
    netFutureAvailability: 2919.57,
    stageOfExtraction: 69.67,
    riskLevel: 'Moderate',
    trend: 'decreasing',
    recommendation: 'Implement water conservation measures and consider less water-intensive crops',
    
    // Chart Data
    seasonalRechargeData: [
      { name: 'Monsoon', rainfall: 6500, otherSources: 2150, total: 8650 },
      { name: 'Non-Monsoon', rainfall: 1200, otherSources: 850, total: 2050 }
    ],
    
    extractionBreakdownData: [
      { name: 'Irrigation', value: 5461, percentage: 81.4, color: '#3b82f6' },
      { name: 'Domestic', value: 900, percentage: 13.4, color: '#10b981' },
      { name: 'Industrial', value: 351, percentage: 5.2, color: '#f59e0b' }
    ],
    
    monthlyTrendData: [
      { month: 'Jan', recharge: 450, extraction: 520 },
      { month: 'Feb', recharge: 380, extraction: 510 },
      { month: 'Mar', recharge: 320, extraction: 580 },
      { month: 'Apr', recharge: 280, extraction: 620 },
      { month: 'May', recharge: 250, extraction: 680 },
      { month: 'Jun', recharge: 180, extraction: 720 },
      { month: 'Jul', recharge: 2200, extraction: 650 },
      { month: 'Aug', recharge: 3500, extraction: 600 },
      { month: 'Sep', recharge: 2800, extraction: 580 },
      { month: 'Oct', recharge: 1200, extraction: 550 },
      { month: 'Nov', recharge: 600, extraction: 530 },
      { month: 'Dec', recharge: 500, extraction: 520 }
    ],
    
    crops: [
      { name: 'Pearl Millet (Bajra)', waterNeed: 'Low', suitability: 'High' },
      { name: 'Cluster Bean (Guar)', waterNeed: 'Low', suitability: 'High' },
      { name: 'Moong Dal', waterNeed: 'Medium', suitability: 'Medium' },
      { name: 'Mustard', waterNeed: 'Medium', suitability: 'Medium' }
    ]
  };

  useEffect(() => {
    setDistricts(mockDistricts);
    setDashboardData(mockDashboardData);
  }, []);

  const handleDistrictChange = async (district) => {
    setSelectedDistrict(district);
    setIsLoading(true);
    
    setTimeout(() => {
      setDashboardData({
        ...mockDashboardData,
        district: district,
        stageOfExtraction: Math.floor(Math.random() * 10) + 1 * 17 + 60,
        riskLevel: Math.random() > 0.5 ? 'Moderate' : 'High'
      });
      setIsLoading(false);
    }, 1000);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'var(--status-success)';
      case 'moderate': return 'var(--status-warning)';
      case 'high': return 'var(--status-error)';
      default: return 'var(--neutral-500)';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'increasing' ? 
      <TrendingUp size={20} color="var(--status-error)" /> : 
      <TrendingDown size={20} color="var(--status-success)" />;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} ham
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!dashboardData) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <Droplets className="title-icon" />
            Water Resource Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Comprehensive analysis of groundwater resources and agricultural recommendations
          </p>
        </div>
        
        <div className="district-selector">
          <MapPin size={20} />
          <select 
            value={selectedDistrict} 
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="district-dropdown"
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading {selectedDistrict} district data...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Key Metrics Row */}
          <div className="metrics-row">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="metric-card critical"
            >
              <div className="metric-header">
                <h3>Stage of Extraction</h3>
                <AlertTriangle size={24} />
              </div>
              <div className="metric-value">
                {dashboardData.stageOfExtraction}%
              </div>
              <div className="metric-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${dashboardData.stageOfExtraction}%`,
                    backgroundColor: getRiskColor(dashboardData.riskLevel)
                  }}
                ></div>
              </div>
              <div className="metric-footer">
                <span className={`risk-badge risk-${dashboardData.riskLevel.toLowerCase()}`}>
                  {dashboardData.riskLevel} Risk
                </span>
                {getTrendIcon(dashboardData.trend)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="metric-card"
            >
              <div className="metric-header">
                <h3>Total Annual Recharge</h3>
                <CloudRain size={24} />
              </div>
              <div className="metric-value">
                {formatNumber(dashboardData.totalAnnualRecharge)} ham
              </div>
              <div className="metric-comparison">
                <span className="comparison-positive">
                  +{formatNumber(dashboardData.rainfallMonsoonRecharge)} monsoon
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="metric-card"
            >
              <div className="metric-header">
                <h3>Net Future Availability</h3>
                <Droplets size={24} />
              </div>
              <div className="metric-value">
                {formatNumber(dashboardData.netFutureAvailability)} ham
              </div>
              <div className="metric-description">
                Available for future use
              </div>
            </motion.div>
          </div>

          {/* Charts and Detailed Analysis */}
          <div className="analysis-grid">
            {/* Seasonal Recharge Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="analysis-card chart-card"
            >
              <div className="chart-header">
                <BarChart3 size={20} />
                <h3>Seasonal Recharge Pattern</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.seasonalRechargeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="rainfall" name="Rainfall Recharge" fill="#3b82f6" />
                    <Bar dataKey="otherSources" name="Other Sources" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Extraction Breakdown Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="analysis-card chart-card"
            >
              <div className="chart-header">
                <PieChart size={20} />
                <h3>Water Extraction Breakdown</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={dashboardData.extractionBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.extractionBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'Extraction (ham)']} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Monthly Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="analysis-card chart-card full-width"
            >
              <div className="chart-header">
                <TrendingUp size={20} />
                <h3>Monthly Recharge vs Extraction Trend</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="recharge" 
                      name="Recharge" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="extraction" 
                      name="Extraction" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Crop Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="analysis-card crop-recommendations"
            >
              <div className="crop-header">
                <h3>
                  <Sprout size={20} />
                  Recommended Crops
                </h3>
                <span className="water-status">
                  Based on {dashboardData.stageOfExtraction}% extraction
                </span>
              </div>
              <div className="crops-grid">
                {dashboardData.crops.map((crop, index) => (
                  <div key={index} className="crop-card">
                    <div className="crop-name">{crop.name}</div>
                    <div className="crop-details">
                      <span className={`water-need ${crop.waterNeed.toLowerCase()}`}>
                        Water: {crop.waterNeed}
                      </span>
                      <span className={`suitability ${crop.suitability.toLowerCase()}`}>
                        Suitability: {crop.suitability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Water Balance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="analysis-card water-balance"
            >
              <h3>Water Balance Summary</h3>
              <div className="balance-grid">
                <div className="balance-item positive">
                  <div className="balance-label">Total Recharge</div>
                  <div className="balance-value">
                    {formatNumber(dashboardData.totalAnnualRecharge)} ham
                  </div>
                </div>
                <div className="balance-item negative">
                  <div className="balance-label">Total Extraction</div>
                  <div className="balance-value">
                    {formatNumber(dashboardData.totalExtraction)} ham
                  </div>
                </div>
                <div className="balance-item net">
                  <div className="balance-label">Net Availability</div>
                  <div className="balance-value">
                    {formatNumber(dashboardData.netFutureAvailability)} ham
                  </div>
                </div>
                <div className="balance-item usage">
                  <div className="balance-label">Stage of Extraction</div>
                  <div className="balance-value">
                    {dashboardData.stageOfExtraction}%
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="action-section"
          >
            <div className="action-card">
              <AlertTriangle size={24} className="action-icon" />
              <div className="action-content">
                <h3>Recommendations & Actions</h3>
                <p>{dashboardData.recommendation}</p>
                <div className="action-buttons">
                  <button className="btn-primary">
                    <Download size={16} />
                    Download Detailed Report
                  </button>
                  <button className="btn-secondary">
                    Get Personalized Advisory
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;