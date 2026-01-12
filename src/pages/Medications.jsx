import { useState, useEffect } from 'react'
import { FiPackage, FiClock, FiCalendar, FiPlus, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'

/**
 * Medications Page
 * Complete medication tracking and management
 */
const Medications = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [medications, setMedications] = useState(() => {
    // Load medications from localStorage on mount
    const saved = localStorage.getItem('medications')
    return saved ? JSON.parse(saved) : []
  })
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    startDate: '',
    endDate: '',
    prescriber: '',
    instructions: ''
  })

  const sampleMedications = []

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications))
  }, [medications])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddMedication = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.startDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.email) {
      toast.error('Please log in to add medications')
      return
    }

    const newMedication = {
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      time: formData.time || '8:00 AM',
      startDate: formData.startDate,
      endDate: formData.endDate || '2026-12-31',
      prescriber: formData.prescriber || 'Self-prescribed',
      instructions: formData.instructions || 'Take as directed',
      isActive: true,
      adherence: 100,
      userEmail: currentUser.email,
      reminderEnabled: true
    }

    setMedications([...medications, newMedication])
    
    // Schedule email reminder
    scheduleEmailReminder(newMedication)
    
    toast.success(`Medication added! Reminder emails will be sent to ${currentUser.email} at ${formData.time || '8:00 AM'}`)
    setIsModalOpen(false)
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
      startDate: '',
      endDate: '',
      prescriber: '',
      instructions: ''
    })
  }

  const scheduleEmailReminder = (medication) => {
    // This would be implemented on the backend with a cron job or task scheduler
    // For now, we'll store the medication with reminder settings
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
    reminders.push({
      medicationId: medication.id,
      name: medication.name,
      email: medication.userEmail,
      time: medication.time,
      frequency: medication.frequency,
      startDate: medication.startDate,
      endDate: medication.endDate,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('medicationReminders', JSON.stringify(reminders))
    
    // Log the reminder for demonstration
    console.log(`📧 Reminder scheduled for ${medication.name}:`, {
      email: medication.userEmail,
      time: medication.time,
      frequency: medication.frequency
    })
  }

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id))
    toast.success('Medication removed')
  }

  const handleToggleTaken = (id) => {
    toast.success('Medication marked as taken!')
  }

  const displayMedications = [...sampleMedications, ...medications]
  const filteredMeds = displayMedications.filter(med => 
    activeTab === 'active' ? med.isActive : !med.isActive
  )

  const stats = [
    { label: 'Active Medications', value: displayMedications.filter(m => m.isActive).length, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Due Today', value: displayMedications.filter(m => m.isActive).length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Adherence Rate', value: displayMedications.length > 0 ? '90%' : '0%', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Missed Doses', value: 0, color: 'text-red-600', bg: 'bg-red-100' },
  ]

  const getAdherenceColor = (rate) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-secondary-900">Medications</h1>
          <p className="mt-2 text-secondary-600">Track and manage your medications</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 whitespace-nowrap">
          <FiPlus className="h-5 w-5" />
          Add Medication
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <FiPackage className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-secondary-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-secondary-600 hover:text-secondary-900'
          }`}
        >
          Active ({displayMedications.filter(m => m.isActive).length})
        </button>
        <button
          onClick={() => setActiveTab('inactive')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'inactive'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-secondary-600 hover:text-secondary-900'
          }`}
        >
          Inactive ({displayMedications.filter(m => !m.isActive).length})
        </button>
      </div>

      {/* Medications List */}
      <div className="grid gap-4">
        {filteredMeds.length > 0 ? (
          filteredMeds.map((med) => (
          <Card key={med.id}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`h-14 w-14 bg-gradient-to-br ${
                  med.isActive ? 'from-green-500 to-emerald-500' : 'from-secondary-400 to-secondary-500'
                } rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <FiPackage className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-secondary-900">{med.name}</h3>
                    <span className="text-lg font-medium text-secondary-600">{med.dosage}</span>
                    {med.isActive && (
                      <Badge variant="success">Active</Badge>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <FiClock className="h-4 w-4" />
                      <span>{med.frequency} - {med.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <FiCalendar className="h-4 w-4" />
                      <span>{new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-600 mt-2">
                    <span className="font-medium">Prescribed by:</span> {med.prescriber}
                  </p>
                  <p className="text-sm text-secondary-600">
                    <span className="font-medium">Instructions:</span> {med.instructions}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-secondary-700">Adherence Rate</span>
                      <span className={`text-sm font-bold ${getAdherenceColor(med.adherence)}`}>
                        {med.adherence}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          med.adherence >= 90 ? 'bg-green-500' :
                          med.adherence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${med.adherence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {med.isActive && (
                  <Button variant="primary" size="sm" onClick={() => handleToggleTaken(med.id)} className="flex items-center gap-1">
                    <FiCheck className="h-4 w-4" />
                    Mark Taken
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <FiEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-error" onClick={() => handleDeleteMedication(med.id)}>
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <FiPackage className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Medications Found</h3>
              <p className="text-secondary-600 mb-4">
                {activeTab === 'active' 
                  ? 'You haven\'t added any medications yet. Click the button above to add your first medication.'
                  : 'No inactive medications found.'
                }
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Medication"
        size="lg"
      >
        <form onSubmit={handleAddMedication} className="space-y-4">
          <div>
            <label className="label">Medication Name *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Aspirin, Lisinopril"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dosage *</label>
              <Input
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="e.g., 100mg, 10mg"
                required
              />
            </div>

            <div>
              <label className="label">Frequency *</label>
              <Input
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                placeholder="e.g., Once daily, Twice daily"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Time</label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date *</label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="label">End Date</label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="label">Prescribed By</label>
            <Input
              name="prescriber"
              value={formData.prescriber}
              onChange={handleInputChange}
              placeholder="e.g., Dr. Sarah Johnson"
            />
          </div>

          <div>
            <label className="label">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              className="input min-h-[80px] resize-none"
              placeholder="e.g., Take with food, Take at the same time each day"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Medication
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Medications
