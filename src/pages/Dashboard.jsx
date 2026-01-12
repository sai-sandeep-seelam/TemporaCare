import { useState, useEffect } from 'react'
import { FiCalendar, FiPackage, FiBell, FiActivity, FiTrendingUp, FiClock } from 'react-icons/fi'
import Card from '../components/common/Card'
import { Link } from 'react-router-dom'

/**
 * Dashboard Page
 * Enhanced dashboard with modern UI/UX
 */
const Dashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [todayMedications, setTodayMedications] = useState([])

  // Load data from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments')
    const savedMedications = localStorage.getItem('medications')
    
    if (savedAppointments) {
      const allAppointments = JSON.parse(savedAppointments)
      // Filter upcoming appointments (pending or confirmed)
      const upcoming = allAppointments.filter(
        apt => apt.status === 'pending' || apt.status === 'confirmed'
      )
      setUpcomingAppointments(upcoming)
    }
    
    if (savedMedications) {
      const allMedications = JSON.parse(savedMedications)
      // Filter active medications
      const active = allMedications.filter(med => med.isActive)
      setTodayMedications(active)
    }
  }, [])

  const stats = [
    { 
      label: 'Upcoming Appointments', 
      value: upcomingAppointments.length, 
      change: upcomingAppointments.length > 0 ? `${upcomingAppointments.length} scheduled` : 'None scheduled',
      icon: FiCalendar, 
      color: 'text-blue-600', 
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Active Medications', 
      value: todayMedications.length, 
      change: todayMedications.length > 0 ? `${todayMedications.filter(m => !m.taken).length} due today` : 'None active',
      icon: FiPackage, 
      color: 'text-green-600', 
      bg: 'bg-gradient-to-br from-green-500 to-emerald-500' 
    },
    { 
      label: 'Notifications', 
      value: '0', 
      change: 'All clear',
      icon: FiBell, 
      color: 'text-yellow-600', 
      bg: 'bg-gradient-to-br from-yellow-500 to-orange-500' 
    },
    { 
      label: 'Health Score', 
      value: '100%', 
      change: 'Perfect health',
      icon: FiActivity, 
      color: 'text-purple-600', 
      bg: 'bg-gradient-to-br from-purple-500 to-pink-500' 
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-primary-100 text-lg">Here's your health overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:-translate-y-1 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-xs text-secondary-500 mt-1 flex items-center gap-1">
                  <FiTrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </div>
              <div className={`h-14 w-14 ${stat.bg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-100 overflow-hidden">
          <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary-900">Upcoming Appointments</h3>
              <p className="text-sm text-secondary-600 mt-1">Your next scheduled visits</p>
            </div>
            <Link
              to="/appointments"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <FiTrendingUp className="h-4 w-4 rotate-45" />
            </Link>
          </div>
          <div className="divide-y divide-secondary-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-6 hover:bg-secondary-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-secondary-900">{apt.doctor}</h4>
                      <p className="text-sm text-secondary-600">{apt.specialty}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary-600 mt-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      {apt.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FiCalendar className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                <h4 className="font-semibold text-secondary-900 mb-2">No Upcoming Appointments</h4>
                <p className="text-secondary-600 mb-4">Book your first appointment to get started.</p>
                <Link to="/appointments" className="text-primary-600 hover:text-primary-700 font-medium">
                  Book appointment →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Today's Medications */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-100 overflow-hidden">
          <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary-900">Today's Medications</h3>
              <p className="text-sm text-secondary-600 mt-1">Track your daily medication schedule</p>
            </div>
            <Link
              to="/medications"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <FiTrendingUp className="h-4 w-4 rotate-45" />
            </Link>
          </div>
          <div className="divide-y divide-secondary-100">
            {todayMedications.length > 0 ? (
              todayMedications.map((med) => (
                <div key={med.id} className="p-6 hover:bg-secondary-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        med.taken ? 'bg-green-100' : 'bg-secondary-100'
                      }`}>
                        <FiPackage className={`h-5 w-5 ${med.taken ? 'text-green-600' : 'text-secondary-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">{med.name}</h4>
                        <p className="text-sm text-secondary-600">{med.dosage} • {med.time}</p>
                      </div>
                    </div>
                    {med.taken ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Taken ✓
                      </span>
                    ) : (
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                        Mark Taken
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FiPackage className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                <h4 className="font-semibold text-secondary-900 mb-2">No Medications Today</h4>
                <p className="text-secondary-600 mb-4">Start tracking your medications to stay healthy.</p>
                <Link to="/medications" className="text-primary-600 hover:text-primary-700 font-medium">
                  Add medication →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
