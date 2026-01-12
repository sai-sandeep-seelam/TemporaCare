import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiSave, FiLock, FiShield } from 'react-icons/fi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'

/**
 * Profile Page
 * User profile management
 */
const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  // Load user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (user && user.email) {
      setCurrentUser(user)
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || ''
      })
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // Update current user
    const updatedUser = {
      ...currentUser,
      ...formData
    }
    
    // Save to currentUser in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    // Also update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.email === currentUser.email)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData }
      localStorage.setItem('users', JSON.stringify(users))
    }
    
    setCurrentUser(updatedUser)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  // Calculate stats from localStorage
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
  const medications = JSON.parse(localStorage.getItem('medications') || '[]')
  const activeMedications = medications.filter(m => m.isActive)
  
  const memberSince = currentUser?.createdAt 
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2024'

  const stats = [
    { label: 'Total Appointments', value: appointments.length.toString(), icon: FiCalendar },
    { label: 'Active Medications', value: activeMedications.length.toString(), icon: FiUser },
    { label: 'Member Since', value: memberSince, icon: FiShield },
    { label: 'Health Score', value: '92%', icon: FiShield },
  ]

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="mt-2 text-secondary-600">Manage your account information</p>
        </div>
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
              <FiSave className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
              {formData.firstName && formData.lastName 
                ? `${formData.firstName[0]}${formData.lastName[0]}`
                : formData.email 
                  ? formData.email[0].toUpperCase() 
                  : 'U'
              }
            </div>
            {isEditing && (
              <Button variant="outline" size="sm">Change Photo</Button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              {formData.firstName && formData.lastName 
                ? `${formData.firstName} ${formData.lastName}`
                : formData.email || 'User'
              }
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">First Name</label>
                {isEditing ? (
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-secondary-900">{formData.firstName}</p>
                )}
              </div>

              <div>
                <label className="label">Last Name</label>
                {isEditing ? (
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-secondary-900">{formData.lastName}</p>
                )}
              </div>

              <div>
                <label className="label">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-secondary-900 flex items-center gap-2">
                    <FiMail className="h-4 w-4 text-secondary-500" />
                    {formData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Phone</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-secondary-900 flex items-center gap-2">
                    <FiPhone className="h-4 w-4 text-secondary-500" />
                    {formData.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Date of Birth</label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-secondary-900 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-secondary-500" />
                    {new Date(formData.dateOfBirth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-2">{stat.value}</p>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Address Information */}
      <Card title="Address Information">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="label">Street Address</label>
            {isEditing ? (
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900 flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-secondary-500" />
                {formData.address}
              </p>
            )}
          </div>

          <div>
            <label className="label">City</label>
            {isEditing ? (
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900">{formData.city}</p>
            )}
          </div>

          <div>
            <label className="label">State</label>
            {isEditing ? (
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900">{formData.state}</p>
            )}
          </div>

          <div>
            <label className="label">ZIP Code</label>
            {isEditing ? (
              <Input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900">{formData.zipCode}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card title="Emergency Contact">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Contact Name</label>
            {isEditing ? (
              <Input
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900">{formData.emergencyContact}</p>
            )}
          </div>

          <div>
            <label className="label">Contact Phone</label>
            {isEditing ? (
              <Input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
              />
            ) : (
              <p className="text-secondary-900 flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-secondary-500" />
                {formData.emergencyPhone}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card title="Security Settings">
        <div className="space-y-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FiLock className="h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FiShield className="h-4 w-4" />
            Two-Factor Authentication
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Profile
