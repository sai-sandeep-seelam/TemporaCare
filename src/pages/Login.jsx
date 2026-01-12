import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

const GOOGLE_CLIENT_ID = '154638445660-95f8egqg3f9gl6vberq2b1eqd8tm93s8.apps.googleusercontent.com'

/**
 * Login Page
 * Modern login interface with website login and Google OAuth
 */
const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    let pollTimer

    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignInSuccess,
          auto_select: false,
          ux_mode: 'popup',
        })

        // Render a (hidden) Google button as a reliable fallback
        const btn = document.getElementById('google-signin-button')
        if (btn) {
          window.google.accounts.id.renderButton(btn, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            width: 320,
            text: 'continue_with',
            locale: 'en',
          })
        }

        setGoogleReady(true)
        return true
      }
      return false
    }

    // Try immediately, then poll briefly until SDK loads
    if (!initializeGoogleSignIn()) {
      pollTimer = window.setInterval(() => {
        if (initializeGoogleSignIn()) {
          window.clearInterval(pollTimer)
        }
      }, 250)
    }

    return () => {
      if (pollTimer) window.clearInterval(pollTimer)
    }
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const loginUser = (user) => {
    // Store current logged-in user with all details
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      loginMethod: user.loginMethod || 'website',
    }))
    toast.success(`Welcome back, ${user.firstName}!`)
    navigate('/dashboard')
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === formData.email && u.password === formData.password)

    setTimeout(() => {
      setIsLoading(false)
      
      if (user) {
        loginUser(user)
      } else {
        toast.error('Invalid email or password. Please sign up if you don\'t have an account.')
      }
    }, 1500)
  }

  const handleGoogleSignInSuccess = (response) => {
    try {
      // Decode JWT token
      const token = response.credential
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const googleUser = JSON.parse(jsonPayload)

      // Check if user exists
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      let user = users.find(u => u.email === googleUser.email)

      // If user doesn't exist, create account automatically
      if (!user) {
        user = {
          id: Date.now(),
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'User',
          lastName: googleUser.family_name || googleUser.name?.split(' ')[1] || '',
          email: googleUser.email,
          phone: 'Not provided',
          password: `google_${googleUser.sub}`,
          loginMethod: 'google',
          picture: googleUser.picture,
          createdAt: new Date().toISOString(),
        }
        users.push(user)
        localStorage.setItem('users', JSON.stringify(users))
        toast.success('Account created with Google!')
      }

      loginUser({ ...user, loginMethod: 'google' })
    } catch (error) {
      console.error('Error processing Google login:', error)
      toast.error('Error logging in with Google. Please try again.')
    }
  }

  const handleGoogleLogin = () => {
    if (googleReady && window.google?.accounts?.id) {
      try {
        // Trigger One Tap / popup flow
        window.google.accounts.id.prompt()
      } catch (error) {
        console.error('Google Sign-In error:', error)
        toast.error('Error initializing Google Sign-In. Please try again.')
      }
    } else {
      toast.error('Google Sign-In is not ready yet. Please wait a moment and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-primary-600">H</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">HealthCare</h1>
          <p className="text-primary-100">Manage your health with ease</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-1">Welcome Back</h2>
            <p className="text-secondary-600 mb-8">Sign in to your account to continue</p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="input pl-12 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="input pl-12 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="#"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-secondary-200"></div>
              <span className="text-sm text-secondary-500 font-medium">or</span>
              <div className="flex-1 h-px bg-secondary-200"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border-2 border-secondary-200 rounded-lg font-medium text-secondary-700 hover:bg-secondary-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="bg-secondary-50 px-8 py-4 border-t border-secondary-200">
            <p className="text-secondary-600 text-center">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Hidden fallback target for Google-rendered button */}
        <div id="google-signin-button" className="hidden"></div>

        {/* Footer */}
        <p className="text-center text-primary-100 text-sm mt-8">
          © 2026 HealthCare. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
