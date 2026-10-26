
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Donation = require('./models/Donation')

const app = express()
const PORT = process.env.PORT || 5000
const uploadFolder = path.join(__dirname, 'uploads')

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from server/.env')
}

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadFolder))

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Please log in to continue.'
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded.id || !['Donor', 'Recipient'].includes(decoded.role)) {
            return res.status(401).json({
                message: 'Invalid login token.'
            })
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        }

        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please log in again.'
        })
    }
}

function requireDonor(req, res, next) {
    if (req.user.role !== 'Donor') {
        return res.status(403).json({
            message: 'Only Donors can perform this action.'
        })
    }

    next()
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully')
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message)
    })

// Basic routes
app.get('/', (req, res) => {
    res.send('FoodShare backend is running')
})

app.get('/api/health', (req, res) => {
    res.json({
        message: 'FoodShare API is running',
        database: mongoose.connection.readyState === 1
            ? 'Connected'
            : 'Disconnected'
    })
})

// Get donations
// Donors see only their own donations.
// Recipients see all donations.
app.get('/api/donations', authenticateToken, async (req, res) => {
    try {
        let donations

        if (req.user.role === 'Donor') {
            donations = await Donation.find({
                donorId: req.user.id
            }).sort({ createdAt: -1 })
        } else {
            donations = await Donation.find().sort({ createdAt: -1 })
        }

        res.json(donations)
    } catch (error) {
        console.error('Fetch donations error:', error)
        res.status(500).json({
            message: 'Failed to fetch donations.'
        })
    }
})

// Add donation: Donors only
app.post(
    '/api/donations',
    authenticateToken,
    requireDonor,
    async (req, res) => {
        try {
            const {
                organizationName,
                contactNumber,
                foodName,
                foodType,
                foodImage,
                quantity,
                unit,
                location,
                expiryTime
            } = req.body

            const donation = await Donation.create({
                organizationName,
                contactNumber,
                foodName,
                foodType,
                foodImage,
                quantity,
                unit,
                location,
                expiryTime,
                donorId: req.user.id
            })

            res.status(201).json(donation)
        } catch (error) {
            console.error('Add donation error:', error)
            res.status(400).json({
                message: 'Failed to add donation.',
                error: error.message
            })
        }
    }
)

// Update a donation: its owner only
app.put(
    '/api/donations/:id',
    authenticateToken,
    requireDonor,
    async (req, res) => {
        try {
            const {
                organizationName,
                foodName,
                foodType,
                foodImage,
                quantity,
                unit,
                location,
                expiryTime
            } = req.body

            const updates = {}

            if (organizationName !== undefined) updates.organizationName = organizationName
            if (foodName !== undefined) updates.foodName = foodName
            if (foodType !== undefined) updates.foodType = foodType
            if (foodImage !== undefined) updates.foodImage = foodImage
            if (quantity !== undefined) updates.quantity = quantity
            if (unit !== undefined) updates.unit = unit
            if (location !== undefined) updates.location = location
            if (expiryTime !== undefined) updates.expiryTime = expiryTime

            const donation = await Donation.findOneAndUpdate(
                {
                    _id: req.params.id,
                    donorId: req.user.id
                },
                updates,
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!donation) {
                return res.status(404).json({
                    message: 'Donation not found or you do not own it.'
                })
            }

            res.json(donation)
        } catch (error) {
            console.error('Update donation error:', error)
            res.status(400).json({
                message: 'Failed to update donation.',
                error: error.message
            })
        }
    }
)

// Delete a donation: its owner only
app.delete(
    '/api/donations/:id',
    authenticateToken,
    requireDonor,
    async (req, res) => {
        try {
            const donation = await Donation.findOneAndDelete({
                _id: req.params.id,
                donorId: req.user.id
            })

            if (!donation) {
                return res.status(404).json({
                    message: 'Donation not found or you do not own it.'
                })
            }

            res.json({
                message: 'Donation deleted successfully.'
            })
        } catch (error) {
            console.error('Delete donation error:', error)
            res.status(400).json({
                message: 'Failed to delete donation.',
                error: error.message
            })
        }
    }
)

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' +
            Math.round(Math.random() * 1e9)

        cb(
            null,
            uniqueName +
            path.extname(file.originalname).toLowerCase()
        )
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed.'))
        }
    }
})

app.post('/api/upload', authenticateToken, requireDonor, (req, res) => {
    upload.single('foodImage')(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                message: error.message || 'Image upload failed.'
            })
        }

        if (!req.file) {
            return res.status(400).json({
                message: 'Please select an image.'
            })
        }

        res.status(201).json({
            imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
        })
    })
})

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (
            !name?.trim() ||
            !email?.trim() ||
            !password ||
            !['Donor', 'Recipient'].includes(role)
        ) {
            return res.status(400).json({
                message: 'Please provide valid name, email, password, and role.'
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters.'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        })

        res.status(201).json({
            message: 'Account created successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An account with this email already exists.'
            })
        }

        console.error('Signup error:', error)
        res.status(500).json({
            message: 'Could not create account.'
        })
    }
})

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email?.trim() || !password) {
            return res.status(400).json({
                message: 'Please enter your email and password.'
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        })

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            message: 'Could not log in.'
        })
    }
})

// Handle unexpected errors
app.use((error, req, res, next) => {
    console.error('Server error:', error)

    if (res.headersSent) {
        return next(error)
    }

    res.status(500).json({
        message: 'An unexpected server error occurred.'
    })
})

app.listen(PORT, () => {
    console.log(`FoodShare server running on port ${PORT}`)
})
