
import { useState, useEffect } from 'react'
import './index.css'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AddDonation from './components/AddDonation'
import AvailableFood from './components/AvailableFood'
import EditDonation from './components/EditDonation'

function App() {
  const [page, setPage] = useState('Home')
  const [donations, setDonations] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [authToken, setAuthToken] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [editingDonation, setEditingDonation] = useState(null)
  const [location, setLocation] = useState('')
  const [searchText, setSearchText] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [foodTypeFilter, setFoodTypeFilter] = useState('All')

  useEffect(() => {
    async function fetchDonations() {
      if (!authToken) {
        setDonations([])
        return
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/donations',
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch donations.')
        }

        setDonations(
          data.map((donation) => ({
            ...donation,
            id: donation._id
          }))
        )
      } catch (error) {
        console.error('Error loading donations:', error)
        setDonations([])
      }
    }

    fetchDonations()
  }, [authToken])

  function getExpiryStatus(expiryTime) {
    if (!expiryTime) return 'Expiry not set'

    const expiryDate = new Date(expiryTime)
    const remainingTime = expiryDate - new Date()

    if (remainingTime <= 0) return 'Expired'

    if (remainingTime <= 24 * 60 * 60 * 1000) {
      return 'Expiring Soon'
    }

    return 'Fresh'
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthMessage('')

    const form = event.target
    const isSignup = authMode === 'signup'

    const body = {
      email: form.email.value.trim(),
      password: form.password.value
    }

    if (isSignup) {
      body.name = form.name.value.trim()
      body.role = form.role.value
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${isSignup ? 'signup' : 'login'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      if (isSignup) {
        setAuthMode('login')
        setAuthMessage('Account created! Please log in.')
        return
      }

      setAuthToken(data.token)
      setCurrentUser(data.user)
      setAuthMessage('')
      setPage('Dashboard')
    } catch (error) {
      setAuthMessage(error.message || 'Something went wrong.')
    }
  }

  function handleLogout() {
    setAuthToken('')
    setCurrentUser(null)
    setDonations([])
    setEditingDonation(null)
    setAuthMessage('')
    setPage('Home')
    setSearchText('')
    setLocationFilter('')
    setFoodTypeFilter('All')
    setLocation('')
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )

          if (!response.ok) {
            throw new Error('Unable to fetch address')
          }

          const data = await response.json()
          setLocation(data.display_name || `${latitude}, ${longitude}`)
        } catch {
          setLocation(`${latitude}, ${longitude}`)
          alert('Address could not be found. Coordinates were added instead.')
        }
      },
      () => {
        alert('Location access denied. Please allow location permission.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!currentUser || currentUser.role !== 'Donor') {
      alert('Only donors can add donations.')
      return
    }

    const form = event.target
    const organizationName = form.organizationName.value.trim()
    const contactNumber = form.contactNumber.value.trim()
    const foodName = form.foodName.value.trim()
    const foodLocation = location.trim()
    const expiryTime = form.expiryTime.value
    const imageFile = form.foodImage.files[0]

    if (expiryTime) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const selectedDate = new Date(`${expiryTime}T00:00:00`)

      if (selectedDate < today) {
        alert('Expiry date cannot be in the past.')
        return
      }
    }

    if (!organizationName || !foodName || !foodLocation) {
      alert('Please complete the organization, food, and location fields.')
      return
    }

    let foodImageUrl = ''

    try {
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('foodImage', imageFile)

        const uploadResponse = await fetch(
          'http://localhost:5000/api/upload',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`
            },
            body: imageFormData
          }
        )

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Image upload failed.')
        }

        foodImageUrl = uploadData.imageUrl
      }

      const newDonation = {
        organizationName,
        contactNumber,
        foodName,
        foodType: form.foodType.value,
        foodImage: foodImageUrl,
        quantity: Number(form.quantity.value),
        unit: form.unit.value,
        location: foodLocation,
        expiryTime: expiryTime || null
      }

      const response = await fetch(
        'http://localhost:5000/api/donations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(newDonation)
        }
      )

      const savedDonation = await response.json()

      if (!response.ok) {
        throw new Error(
          savedDonation.message || 'Failed to add donation.'
        )
      }

      setDonations((previous) => [
        { ...savedDonation, id: savedDonation._id },
        ...previous
      ])

      setPage('Available Food')
      alert('Donation added successfully!')
    } catch (error) {
      alert(error.message || 'Could not save donation.')
    }
  }

  async function handleDelete(id) {
    if (!currentUser || currentUser.role !== 'Donor') {
      alert('Only donors can delete donations.')
      return
    }

    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/donations/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete donation.')
      }

      setDonations((previous) =>
        previous.filter((donation) => donation.id !== id)
      )

      alert('Donation deleted successfully!')
    } catch (error) {
      alert(error.message || 'Could not delete donation.')
    }
  }

  function handleEdit(id) {
    if (!currentUser || currentUser.role !== 'Donor') {
      alert('Only donors can edit donations.')
      return
    }

    const donation = donations.find((item) => item.id === id)

    if (donation) {
      setEditingDonation(donation)
    }
  }

  async function handleUpdateDonation(event) {
    event.preventDefault()

    const form = event.target

    const updatedDonation = {
      quantity: Number(form.elements.quantity.value),
      unit: form.elements.unit.value,
      location: form.elements.location.value,
      expiryTime: form.elements.expiryTime.value || null
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/donations/${editingDonation.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(updatedDonation)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update donation.')
      }

      setDonations((previous) =>
        previous.map((item) =>
          item.id === editingDonation.id
            ? { ...data, id: data._id }
            : item
        )
      )

      setEditingDonation(null)
      alert('Donation updated successfully!')
    } catch (error) {
      alert(error.message || 'Could not update donation.')
    }
  }

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        setPage={setPage}
        setAuthMode={setAuthMode}
        setAuthMessage={setAuthMessage}
        handleLogout={handleLogout}
      />

      <main>
        {page === 'Home' && <Home />}

        {page === 'Login' && (
          <Login
            authMode={authMode}
            setAuthMode={setAuthMode}
            authMessage={authMessage}
            setAuthMessage={setAuthMessage}
            handleAuthSubmit={handleAuthSubmit}
          />
        )}

        {page === 'Dashboard' && currentUser && (
          <Dashboard
            currentUser={currentUser}
            donations={donations}
            getExpiryStatus={getExpiryStatus}
          />
        )}

        {page === 'Available Food' && currentUser && (
          <AvailableFood
            donations={donations}
            currentUser={currentUser}
            searchText={searchText}
            setSearchText={setSearchText}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            foodTypeFilter={foodTypeFilter}
            setFoodTypeFilter={setFoodTypeFilter}
            getExpiryStatus={getExpiryStatus}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {page === 'Add Donation' && currentUser?.role === 'Donor' && (
          <AddDonation
            handleSubmit={handleSubmit}
            location={location}
            setLocation={setLocation}
            getCurrentLocation={getCurrentLocation}
          />
        )}
      </main>

      {editingDonation && currentUser?.role === 'Donor' && (
        <EditDonation
          editingDonation={editingDonation}
          handleUpdateDonation={handleUpdateDonation}
          setEditingDonation={setEditingDonation}
        />
      )}
    </div>
  )
}

export default App
