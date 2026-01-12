import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary-900">404</h1>
        <p className="mt-4 text-xl text-secondary-600">Page not found</p>
        <Link to="/" className="btn-primary mt-6 inline-block">Go Home</Link>
      </div>
    </div>
  )
}

export default NotFound
