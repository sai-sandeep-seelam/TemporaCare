import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiUser, FiPlus, FiFilter, FiSearch } from 'react-icons/fi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'

/**
 * Appointments Page
 * Complete appointment management interface
 */
const Appointments = () => {
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [appointments, setAppointments] = useState(() => {
    // Load appointments from localStorage on mount
    const saved = localStorage.getItem('appointments')
    return saved ? JSON.parse(saved) : []
  })
  const [formData, setFormData] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    reason: ''
  })

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments))
  }, [appointments])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddAppointment = (e) => {
    e.preventDefault()
    
    if (!formData.doctor || !formData.specialty || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    const newAppointment = {
      id: Date.now(),
      doctor: formData.doctor,
      specialty: formData.specialty,
      date: formData.date,
      time: formData.time,
      location: formData.location || 'To be confirmed',
      status: 'pending',
      reason: formData.reason || 'General consultation'
    }

    setAppointments([...appointments, newAppointment])
    toast.success('Appointment added successfully!')
    setIsModalOpen(false)
    setFormData({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      reason: ''
    })
  }

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id))
    toast.success('Appointment cancelled')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'completed':
        return 'default'
      default:
        return 'default'
    }
  }

  const displayAppointments = appointments
  const filteredAppointments = filter === 'all' 
    ? displayAppointments 
    : displayAppointments.filter(a => a.status === filter)

  const stats = [
    { label: 'Total Appointments', value: displayAppointments.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Upcoming', value: displayAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: displayAppointments.filter(a => a.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', value: displayAppointments.filter(a => a.status === 'completed').length, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-secondary-900">Appointments</h1>
          <p className="mt-2 text-secondary-600">Manage your healthcare appointments</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 whitespace-nowrap">
          <FiPlus className="h-5 w-5" />
          Book Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <FiCalendar className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'confirmed' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
          <Card key={appointment.id}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiUser className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-secondary-900">{appointment.doctor}</h3>
                    <Badge variant={getStatusBadge(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-secondary-600 mb-2">{appointment.specialty}</p>
                  <p className="text-sm text-secondary-500">{appointment.reason}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-secondary-600">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      {appointment.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" />
                      {appointment.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Reschedule</Button>
                {appointment.status !== 'completed' && (
                  <Button variant="ghost" size="sm" className="text-error" onClick={() => handleDeleteAppointment(appointment.id)}>Cancel</Button>
                )}
              </div>
            </div>
          </Card>
        ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <FiCalendar className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Appointments Found</h3>
              <p className="text-secondary-600 mb-4">
                {filter === 'all' 
                  ? 'You haven\'t booked any appointments yet. Click the button above to book your first appointment.'
                  : `No ${filter} appointments found. Try changing the filter.`
                }
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book New Appointment"
        size="lg"
      >
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div>
            <label className="label">Doctor Name *</label>
            <Input
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              placeholder="e.g., Dr. John Smith"
              required
            />
          </div>

          <div>
            <label className="label">Specialty *</label>
            <Input
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              placeholder="e.g., Cardiology, General Physician"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="label">Time *</label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Main Hospital, Room 302"
            />
          </div>

          <div>
            <label className="label">Reason for Visit</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="input min-h-[100px] resize-none"
              placeholder="Describe the reason for your appointment..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Book Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Appointments
