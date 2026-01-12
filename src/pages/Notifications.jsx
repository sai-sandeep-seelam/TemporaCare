import { useState } from 'react'
import { FiBell, FiCalendar, FiPackage, FiInfo, FiAlertCircle, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'

/**
 * Notifications Page
 * Complete notification center with email reminders for medications
 */
const Notifications = () => {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: FiCalendar,
      medication: FiPackage,
      system: FiInfo,
      reminder: FiBell
    }
    return icons[type] || FiInfo
  }

  const getNotificationColor = (type) => {
    const colors = {
      appointment: 'from-blue-500 to-cyan-500',
      medication: 'from-green-500 to-emerald-500',
      system: 'from-purple-500 to-pink-500',
      reminder: 'from-yellow-500 to-orange-500'
    }
    return colors[type] || 'from-secondary-400 to-secondary-500'
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      urgent: 'error',
      high: 'warning',
      normal: 'info',
      low: 'success'
    }
    return variants[priority] || 'info'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const stats = [
    { label: 'Total Notifications', value: notifications.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Unread', value: unreadCount, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Urgent', value: notifications.filter(n => n.priority === 'urgent').length, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'This Week', value: notifications.filter(n => {
      const date = new Date(n.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length, color: 'text-green-600', bg: 'bg-green-100' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Notifications</h1>
          <p className="mt-2 text-secondary-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FiCheck className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="ghost" size="sm" className="text-error flex items-center gap-2">
            <FiTrash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <FiBell className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('appointment')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'appointment' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setFilter('medication')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'medication' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          Medications
        </button>
        <button
          onClick={() => setFilter('system')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'system' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          System
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type)
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-5 border transition-all hover:shadow-md ${
                notification.isRead ? 'border-secondary-200' : 'border-primary-200 bg-primary-50/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 bg-gradient-to-br ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-secondary-900">{notification.title}</h3>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityBadge(notification.priority)} className="text-xs">
                        {notification.priority}
                      </Badge>
                      <span className="text-sm text-secondary-500 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-600 mb-3">{notification.message}</p>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FiCheck className="h-3 w-3" />
                        Mark as Read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-error">
                      <FiTrash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <FiBell className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No notifications</h3>
          <p className="text-secondary-600">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Notifications
