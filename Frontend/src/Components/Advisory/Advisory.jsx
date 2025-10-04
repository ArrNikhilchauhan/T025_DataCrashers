import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Droplets, 
  CloudRain, 
  Sprout, 
  TrendingDown, 
  Clock,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Volume2,
  Download,
  Share2,
  MapPin,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Users,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const Advisory = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Alwar');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [advisoryData, setAdvisoryData] = useState(null);

  const mockAdvisoryData = {
    district: 'Alwar',
    riskLevel: 'High',
    overallStatus: 'Critical',
    lastUpdated: '2024-01-15',
    summary: 'Your region is facing severe water stress with multiple critical issues that require immediate attention.',
    
    issues: [
      {
        id: 1,
        title: 'Rapid Groundwater Depletion',
        severity: 'Critical',
        icon: <TrendingDown size={24} />,
        description: 'Water table dropping at 1.2 meters per year',
        impact: 'Wells drying up, increased pumping costs, crop failure risk',
        causes: ['Over-extraction for irrigation', 'Low rainfall', 'Inefficient water use'],
        urgency: 'Immediate action required',
        data: {
          currentDepth: 45.2,
          trend: -1.2,
          safeLevel: 25.0,
          historicalData: [
            { year: '2020', depth: 32.1 },
            { year: '2021', depth: 35.8 },
            { year: '2022', depth: 39.4 },
            { year: '2023', depth: 42.6 },
            { year: '2024', depth: 45.2 }
          ]
        }
      },
      {
        id: 2,
        title: 'Low Rainfall & Drought Conditions',
        severity: 'High',
        icon: <CloudRain size={24} />,
        description: 'Rainfall 35% below annual average',
        impact: 'Reduced recharge, crop water stress, soil moisture deficit',
        causes: ['Climate variability', 'Changing monsoon patterns', 'Regional drought'],
        urgency: 'Medium-term planning needed',
        data: {
          currentRainfall: 465,
          averageRainfall: 715,
          deficit: -35,
          monthlyData: [
            { month: 'Jan', actual: 8, average: 12 },
            { month: 'Feb', actual: 5, average: 10 },
            { month: 'Mar', actual: 12, average: 15 },
            { month: 'Apr', actual: 18, average: 25 },
            { month: 'May', actual: 25, average: 40 },
            { month: 'Jun', actual: 45, average: 80 },
            { month: 'Jul', actual: 120, average: 200 },
            { month: 'Aug', actual: 150, average: 220 },
            { month: 'Sep', actual: 80, average: 150 },
            { month: 'Oct', actual: 12, average: 25 },
            { month: 'Nov', actual: 5, average: 10 },
            { month: 'Dec', actual: 3, average: 8 }
          ]
        }
      },
      {
        id: 3,
        title: 'Inefficient Irrigation Practices',
        severity: 'High',
        icon: <Droplets size={24} />,
        description: 'Only 45% irrigation efficiency with traditional methods',
        impact: 'Water wastage, energy waste, soil degradation',
        causes: ['Flood irrigation methods', 'Old infrastructure', 'Lack of awareness'],
        urgency: 'Short-term improvements possible',
        data: {
          efficiency: 45,
          potential: 85,
          waterLoss: 55,
          comparisonData: [
            { method: 'Flood Irrigation', efficiency: 45, waterUse: 100 },
            { method: 'Sprinkler', efficiency: 65, waterUse: 70 },
            { method: 'Drip Irrigation', efficiency: 85, waterUse: 55 }
          ]
        }
      },
      {
        id: 4,
        title: 'Soil Moisture Deficit',
        severity: 'Medium',
        icon: <Sprout size={24} />,
        description: 'Soil moisture 40% below optimal levels',
        impact: 'Reduced crop yield, increased irrigation need, plant stress',
        causes: ['Low rainfall', 'High evaporation', 'Poor soil management'],
        urgency: 'Seasonal management required',
        data: {
          currentMoisture: 32,
          optimal: 55,
          deficit: -23,
          trend: 'decreasing'
        }
      }
    ],

    solutions: [
      {
        id: 1,
        title: 'Water Conservation & Efficiency',
        category: 'Immediate Action',
        priority: 'High',
        icon: <Zap size={20} />,
        actions: [
          {
            title: 'Install Drip Irrigation',
            description: 'Switch from flood to drip irrigation to save 40-60% water',
            impact: 'Saves 55% water, increases yield by 20%',
            cost: 'Medium',
            timeline: '1-2 months',
            steps: [
              'Assess farm layout and water source',
              'Get subsidy information from agriculture department',
              'Install drip system with professional help',
              'Train for operation and maintenance'
            ],
            resources: [
              { name: 'Subsidy Scheme', url: '#', type: 'Government' },
              { name: 'Installation Guide', url: '#', type: 'Manual' }
            ]
          },
          {
            title: 'Rainwater Harvesting',
            description: 'Collect and store rainwater for irrigation use',
            impact: 'Provides 30% additional water during dry spells',
            cost: 'Low-Medium',
            timeline: '2-3 months',
            steps: [
              'Identify collection area (rooftop, farm surface)',
              'Design storage structure (tank, pond)',
              'Install filtration system',
              'Connect to irrigation network'
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'Crop Management',
        category: 'Seasonal Planning',
        priority: 'High',
        icon: <Sprout size={20} />,
        actions: [
          {
            title: 'Switch to Drought-Resistant Crops',
            description: 'Replace water-intensive crops with low-water alternatives',
            impact: 'Reduces water need by 50-60%',
            cost: 'Low',
            timeline: 'Next season',
            steps: [
              'Analyze current crop pattern',
              'Select suitable drought-resistant varieties',
              'Plan crop rotation schedule',
              'Source seeds and planting material'
            ],
            cropSuggestions: [
              { name: 'Pearl Millet (Bajra)', waterNeed: 'Low', yield: 'Good' },
              { name: 'Cluster Bean (Guar)', waterNeed: 'Low', yield: 'Medium' },
              { name: 'Moong Dal', waterNeed: 'Medium', yield: 'Good' }
            ]
          },
          {
            title: 'Optimize Irrigation Schedule',
            description: 'Water crops based on actual need and weather conditions',
            impact: 'Saves 25% water, prevents over-watering',
            cost: 'Very Low',
            timeline: 'Immediate',
            steps: [
              'Monitor soil moisture regularly',
              'Water during early morning or late evening',
              'Adjust frequency based on weather forecast',
              'Use mulching to reduce evaporation'
            ]
          }
        ]
      },
      {
        id: 3,
        title: 'Technology & Monitoring',
        category: 'Long-term Investment',
        priority: 'Medium',
        icon: <BarChart3 size={20} />,
        actions: [
          {
            title: 'Install Soil Moisture Sensors',
            description: 'Real-time monitoring of soil conditions for precise irrigation',
            impact: 'Reduces water use by 20-30%',
            cost: 'Medium',
            timeline: '1 month',
            steps: [
              'Select appropriate sensor type',
              'Install at different depths and locations',
              'Connect to monitoring system',
              'Set up alert system for irrigation'
            ]
          }
        ]
      }
    ],

    governmentSchemes: [
      {
        name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        description: 'Scheme for improving water use efficiency in agriculture',
        benefits: ['Subsidy up to 90% for drip irrigation', 'Technical support', 'Training programs'],
        eligibility: 'All farmers',
        contact: 'District Agriculture Office'
      },
      {
        name: 'Atal Bhujal Yojana',
        description: 'Groundwater management scheme for water-stressed areas',
        benefits: ['Community participation', 'Water budgeting', 'Recharge projects'],
        eligibility: 'Blocks with critical groundwater levels',
        contact: 'Ground Water Department'
      }
    ],

    communityActions: [
      {
        title: 'Form Water User Association',
        description: 'Collective management of water resources',
        benefits: ['Better coordination', 'Shared resources', 'Stronger bargaining power'],
        steps: ['Identify interested farmers', 'Register association', 'Develop water sharing plan']
      },
      {
        title: 'Collective Rainwater Harvesting',
        description: 'Community-level water storage and recharge',
        benefits: ['Larger storage capacity', 'Shared costs', 'Greater impact'],
        steps: ['Identify common land', 'Design storage structure', 'Pool resources']
      }
    ]
  };

  useEffect(() => {
    setAdvisoryData(mockAdvisoryData);
  }, []);

  const speakAdvisory = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (!advisoryData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: '1.25rem', color: '#6b7280' }}>
        Loading Advisory...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)', padding: '40px 24px' }}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '1400px', margin: '0 auto 48px' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 40px rgba(14, 116, 144, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <AlertTriangle size={40} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
                  Water Crisis Advisory
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  Comprehensive analysis and actionable solutions for water management
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                  <MapPin size={18} color="#fff" />
                  <span style={{ color: '#fff', fontWeight: '500' }}>{advisoryData.district} District</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                  <Calendar size={18} color="#fff" />
                  <span style={{ color: '#fff', fontWeight: '500' }}>Updated: {advisoryData.lastUpdated}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => speakAdvisory(advisoryData.summary)}
                  disabled={isSpeaking}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: 'rgba(255,255,255,0.95)', color: '#1e40af', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.95)'}
                >
                  <Volume2 size={18} />
                  {isSpeaking ? 'Speaking...' : 'Listen'}
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: '#fff', color: '#1e40af', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                >
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Overview Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ maxWidth: '1400px', margin: '0 auto 48px' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.1)', borderLeft: '6px solid #dc2626' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', padding: '20px', borderRadius: '20px', boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)' }}>
                <AlertTriangle size={36} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  {advisoryData.riskLevel} Risk
                </h3>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>Status: {advisoryData.overallStatus}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>{advisoryData.issues.length}</div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Critical Issues</div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0891b2', marginBottom: '4px' }}>
                {advisoryData.solutions.filter(s => s.priority === 'High').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Priority Solutions</div>
            </div>
          </div>

          <p style={{ marginTop: '24px', padding: '20px', background: 'rgba(220, 38, 38, 0.05)', borderRadius: '12px', color: '#374151', lineHeight: '1.7', borderLeft: '4px solid #dc2626', margin: '24px 0 0 0' }}>
            {advisoryData.summary}
          </p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
        {/* Issues Column */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', padding: '12px', borderRadius: '12px' }}>
              <AlertCircle size={24} color="#fff" />
            </div>
            Identified Issues
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {advisoryData.issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedIssue(issue)}
                style={{ 
                  background: '#fff',
                  padding: '28px',
                  borderRadius: '20px',
                  boxShadow: selectedIssue?.id === issue.id ? '0 12px 24px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.06)',
                  border: `2px solid ${selectedIssue?.id === issue.id ? getSeverityColor(issue.severity) : 'transparent'}`,
                  borderLeft: `6px solid ${getSeverityColor(issue.severity)}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedIssue?.id === issue.id ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseOver={(e) => { if (selectedIssue?.id !== issue.id) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}}
                onMouseOut={(e) => { if (selectedIssue?.id !== issue.id) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: `${getSeverityColor(issue.severity)}15`, padding: '14px', borderRadius: '14px', color: getSeverityColor(issue.severity) }}>
                    {issue.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#111827', margin: 0 }}>{issue.title}</h3>
                      <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#fff', background: getSeverityColor(issue.severity), whiteSpace: 'nowrap' }}>
                        {issue.severity}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', margin: '0 0 12px 0', fontSize: '0.9rem' }}>{issue.description}</p>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Impact:</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6' }}>{issue.impact}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: '500' }}>{issue.urgency}</span>
                  <ChevronRight size={20} color="#9ca3af" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Solutions Column */}
        <div>
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div
                key={selectedIssue.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}
              >
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '28px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '12px', borderRadius: '12px' }}>
                    <Lightbulb size={24} color="#fff" />
                  </div>
                  Solutions
                </h2>

                {/* Data Visualization */}
                <div style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '24px', borderRadius: '16px', marginBottom: '28px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={20} color="#0891b2" />
                    Issue Analysis
                  </h4>
                  {selectedIssue.id === 1 && (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={selectedIssue.data.historicalData}>
                        <defs>
                          <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="depth" stroke="#dc2626" strokeWidth={3} fill="url(#colorDepth)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  {selectedIssue.id === 2 && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={selectedIssue.data.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                        <Bar dataKey="average" name="Average" fill="#d1d5db" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {selectedIssue.id === 3 && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={selectedIssue.data.comparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis dataKey="method" type="category" stroke="#6b7280" width={120} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                        <Bar dataKey="efficiency" name="Efficiency %" fill="#10b981" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Solutions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {advisoryData.solutions.map((solutionGroup) => (
                    <div key={solutionGroup.id} style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '24px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', padding: '10px', borderRadius: '10px' }}>
                            {solutionGroup.icon}
                          </div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>{solutionGroup.title}</h3>
                        </div>
                        <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#fff', background: getPriorityColor(solutionGroup.priority) }}>
                          {solutionGroup.priority} Priority
                        </span>
                      </div>
                      
                      {solutionGroup.actions.map((action, actionIndex) => (
                        <div key={actionIndex} style={{ background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: actionIndex < solutionGroup.actions.length - 1 ? '16px' : 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0, flex: 1 }}>{action.title}</h4>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                              <span style={{ background: '#f3f4f6', padding: '6px 12px', borderRadius: '8px', color: '#4b5563', fontWeight: '500' }}>
                                {action.cost}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', padding: '6px 12px', borderRadius: '8px', color: '#1e40af', fontWeight: '500' }}>
                                <Clock size={14} />
                                {action.timeline}
                              </span>
                            </div>
                          </div>
                          
                          <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.6' }}>{action.description}</p>
                          
                          <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #6ee7b7' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <Target size={16} color="#047857" />
                              <strong style={{ color: '#047857', fontSize: '0.9rem' }}>Expected Impact:</strong>
                            </div>
                            <div style={{ color: '#065f46', fontWeight: '500' }}>{action.impact}</div>
                          </div>
                          
                          <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '4px', height: '16px', background: '#0891b2', borderRadius: '2px' }}></div>
                              Implementation Steps:
                            </h5>
                            <ol style={{ margin: 0, paddingLeft: '24px' }}>
                              {action.steps.map((step, stepIndex) => (
                                <li key={stepIndex} style={{ marginBottom: '10px', color: '#4b5563', lineHeight: '1.6', paddingLeft: '8px' }}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          {action.cropSuggestions && (
                            <div style={{ marginBottom: '20px' }}>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Recommended Crops:</h5>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                                {action.cropSuggestions.map((crop, cropIndex) => (
                                  <div key={cropIndex} style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px', fontSize: '0.95rem' }}>{crop.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: crop.waterNeed === 'Low' ? '#10b981' : crop.waterNeed === 'Medium' ? '#f59e0b' : '#dc2626', fontWeight: '500', marginBottom: '4px' }}>
                                      Water: {crop.waterNeed}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Yield: {crop.yield}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {action.resources && (
                            <div>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Resources:</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {action.resources.map((resource, resIndex) => (
                                  <a key={resIndex} href={resource.url} style={{ color: '#0891b2', textDecoration: 'none', padding: '12px 16px', background: '#f0f9ff', borderRadius: '10px', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem', border: '1px solid #bae6fd' }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#0891b2'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.color = '#0891b2'; }}
                                  >
                                    <span>{resource.name}</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({resource.type})</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}
              >
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '12px', borderRadius: '12px' }}>
                    <Lightbulb size={24} color="#fff" />
                  </div>
                  Comprehensive Solutions
                </h2>
                
                <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #93c5fd' }}>
                  <p style={{ color: '#1e40af', margin: 0, lineHeight: '1.7', fontSize: '1.05rem', fontWeight: '500' }}>
                    👈 Select a water issue from the left to view detailed, actionable solutions tailored to your specific challenge.
                  </p>
                </div>
                
                {/* Government Schemes */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', padding: '10px', borderRadius: '10px' }}>
                      <Shield size={22} color="#fff" />
                    </div>
                    Government Support Schemes
                  </h3>
                  {advisoryData.governmentSchemes.map((scheme, index) => (
                    <div key={index} style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #e9d5ff', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.1)' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>{scheme.name}</h4>
                      <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.6' }}>{scheme.description}</p>
                      
                      <div style={{ background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
                        <strong style={{ color: '#7c3aed', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Benefits:</strong>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {scheme.benefits.map((benefit, i) => (
                            <li key={i} style={{ marginBottom: '6px', color: '#4b5563', lineHeight: '1.5' }}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          <strong>Eligibility:</strong> {scheme.eligibility}
                        </div>
                        <div style={{ background: '#7c3aed', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500' }}>
                          Contact: {scheme.contact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Community Actions */}
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px', borderRadius: '10px' }}>
                      <Users size={22} color="#fff" />
                    </div>
                    Community Initiatives
                  </h3>
                  {advisoryData.communityActions.map((action, index) => (
                    <div key={index} style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #fde68a', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>{action.title}</h4>
                      <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.6' }}>{action.description}</p>
                      
                      <div style={{ background: 'rgba(255,255,255,0.7)', padding: '14px', borderRadius: '10px' }}>
                        <strong style={{ color: '#d97706', fontSize: '0.9rem' }}>Benefits: </strong>
                        <span style={{ color: '#4b5563' }}>{action.benefits.join(' • ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ maxWidth: '1400px', margin: '48px auto 0' }}
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '12px', borderRadius: '12px' }}>
            <CheckCircle size={24} color="#fff" />
          </div>
          Success Stories & Progress
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', padding: '32px', borderRadius: '20px', border: '1px solid #6ee7b7', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#047857', marginBottom: '20px' }}>Farmer Rajesh - Drip Irrigation Success</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>45%</div>
                <div style={{ fontSize: '0.85rem', color: '#065f46' }}>Water Saved</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>22%</div>
                <div style={{ fontSize: '0.85rem', color: '#065f46' }}>Yield Increase</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>6m</div>
                <div style={{ fontSize: '0.85rem', color: '#065f46' }}>ROI Period</div>
              </div>
            </div>
            
            <p style={{ color: '#065f46', fontStyle: 'italic', lineHeight: '1.7', borderLeft: '4px solid #10b981', paddingLeft: '16px', margin: 0, background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '0 12px 12px 0' }}>
              "Switching to drip irrigation transformed my farming and saved my crops during drought."
            </p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '32px', borderRadius: '20px', border: '1px solid #93c5fd', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e40af', marginBottom: '20px' }}>Village Water Conservation Project</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>65%</div>
                <div style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>Reduced Conflicts</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>30%</div>
                <div style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>Level Improvement</div>
              </div>
            </div>
            
            <p style={{ color: '#1e3a8a', fontStyle: 'italic', lineHeight: '1.7', borderLeft: '4px solid #3b82f6', paddingLeft: '16px', margin: 0, background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '0 12px 12px 0' }}>
              "Community-led water management brought us together and saved our village from water crisis."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Advisory;