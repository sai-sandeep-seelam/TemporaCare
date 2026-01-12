import { Link } from 'react-router-dom'
import { FiCalendar, FiPackage, FiBell, FiArrowRight, FiCheck, FiShield, FiZap, FiUsers, FiClock, FiHeart } from 'react-icons/fi'
import { useState, useEffect } from 'react'

/**
 * Landing Page
 * Modern, engaging homepage with improved UI/UX
 */
const Landing = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    setUser(currentUser)
  }, [])
  const features = [
    {
      icon: FiCalendar,
      title: 'Smart Scheduling',
      description: 'Effortlessly book and manage appointments with an intuitive calendar interface.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiPackage,
      title: 'Medication Tracking',
      description: 'Never miss a dose with intelligent reminders and comprehensive tracking.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FiBell,
      title: 'Instant Notifications',
      description: 'Stay informed with real-time alerts for appointments and medications.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant platform ensuring your health data stays protected.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Access your health information instantly, anytime, anywhere.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: FiUsers,
      title: 'Family Friendly',
      description: 'Manage health for your entire family from a single account.',
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '4.9★', label: 'Rating' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-secondary-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/temporacare.png" alt="TemporaCare Logo" className="h-11 w-11 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TemporaCare
              </span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <span>View Dashboard</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium mb-8 animate-fade-in">
              <FiZap className="h-4 w-4" />
              <span>Your Health, Your Way</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-secondary-900 mb-6 leading-tight animate-fade-in">
              Health Management
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Take complete control of your health journey with our intelligent platform. 
              Track appointments, manage medications, and never miss a beat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                to="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white border-2 border-secondary-300 text-secondary-700 rounded-xl font-semibold text-lg hover:border-primary-500 hover:text-primary-600 transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-secondary-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Comprehensive tools designed to make health management effortless and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary-200 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-16 w-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <FiClock className="h-16 w-16 text-white/90 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Health?
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                Join thousands of users who have taken control of their health journey. 
                Start managing your appointments and medications today.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-xl"
              >
                <span>Start Your Journey</span>
                <FiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold">TemporaCare</span>
            </div>
            <p className="text-secondary-400 mb-4">
              © 2026 TemporaCare. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
