
// server.js
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT: Webhook route MUST come BEFORE body parsers to get raw body
app.post('/api/stripe-webhook', express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  type: 'application/json'
}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log('✅ Webhook received:', event.type); // Debug: Confirm event type
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;
      const customerEmail = session.metadata.customerEmail;

      console.log('Processing session:', { bookingId, customerEmail }); // Debug: Confirm metadata

      if (bookingId) {
        const updateResult = await db.collection('bookings').updateOne(
          { _id: new ObjectId(bookingId) },
          { 
            $set: { 
              status: 'deposit_paid',
              depositPaid: true,
              stripeSessionId: session.id,
              updatedAt: new Date()
            } 
          }
        );
        console.log('DB Update Result:', updateResult); // Debug: Should show matchedCount: 1 if successful

        if (updateResult.matchedCount === 0) {
          console.error('❌ No booking found for ID:', bookingId); // Debug: If update fails
        }

        const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });
        console.log('Fetched Booking:', booking ? 'Found' : 'Not Found'); // Debug: Confirm booking fetch

        // Send payment confirmation email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: customerEmail,
          cc: process.env.ADMIN_EMAIL,
          subject: 'Deposit Payment Confirmed - SmartyArt',
          html: `
            <h2>Payment Confirmed! 🎉</h2>
            <p>Thank you for your $20 deposit payment for booking #${bookingId}!</p>
            
            <h3>Your Booking Details:</h3>
            <ul>
              <li><strong>Booking ID:</strong> ${bookingId}</li>
              <li><strong>Customer:</strong> ${booking.customerName}</li>
              <li><strong>Art Type:</strong> ${booking.artType}</li>
              <li><strong>Project:</strong> ${booking.projectDescription.substring(0, 100)}...</li>
              <li><strong>Deposit Paid:</strong> $20.00</li>
              <li><strong>Status:</strong> Deposit Received - In Queue</li>
            </ul>
            
            <p>I'll start working on your artwork within the next 24-48 hours.</p>
            <p>You'll receive updates as I progress through your commission.</p>
            
            <p>Thank you for choosing SmartyArt!<br>Rohit Bharti</p>
          `
        });
        console.log('✅ Confirmation email sent to:', customerEmail); // Debug

        // Notify admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `Deposit Paid - Booking #${bookingId}`,
          html: `
            <h2>Deposit Payment Received!</h2>
            <p>A customer has completed their deposit payment:</p>
            <ul>
              <li><strong>Booking ID:</strong> ${bookingId}</li>
              <li><strong>Customer:</strong> ${booking.customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
              <li><strong>Amount:</strong> $20.00</li>
              <li><strong>Stripe Session:</strong> ${session.id}</li>
            </ul>
            <p><a href="${process.env.FRONTEND_URL}/admin">View in Admin Dashboard</a></p>
          `
        });
        console.log('✅ Admin notification sent'); // Debug
      } else {
        console.error('❌ Missing bookingId in metadata');
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const bookingId = invoice.metadata.bookingId;

      if (bookingId) {
        const updateResult = await db.collection('bookings').updateOne(
          { _id: new ObjectId(bookingId) },
          { 
            $set: { 
              status: 'payment_completed',
              fullPaymentReceived: true,
              stripeInvoiceId: invoice.id,
              updatedAt: new Date()
            } 
          }
        );
        console.log('DB Update Result for Invoice:', updateResult);

        const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: booking.customerEmail,
          cc: process.env.ADMIN_EMAIL,
          subject: 'Final Payment Received - Artwork Ready!',
          html: `
            <h2>🎨 Artwork Complete & Payment Received!</h2>
            <p>Congratulations! Your final payment for booking #${bookingId} has been received.</p>
            
            <h3>What's Next:</h3>
            <p>I'll send you the high-resolution artwork files within the next 24 hours.</p>
            <p>You'll receive them via email with download links.</p>
            
            <h3>Booking Summary:</h3>
            <ul>
              <li><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</li>
              <li><strong>Deposit:</strong> $20.00 ✅</li>
              <li><strong>Final Payment:</strong> $${(booking.totalAmount - 20).toFixed(2)} ✅</li>
              <li><strong>Status:</strong> Completed</li>
            </ul>
            
            <p>Thank you for your business! I hope you love your artwork.</p>
            <p>If you have any questions or need revisions, please reply to this email.</p>
            
            <p>Warm regards,<br>Rohit Bharti<br>SmartyArt</p>
          `
        });
        console.log('✅ Final payment email sent');
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true }));


// Cors and body parsers
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Database connection
let db;
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartyart');
    await client.connect();
    db = client.db('smartyart');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

await connectDB();

// Email transporter - Confirmed for Hostinger SMTP with provided settings
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // admin@xdevverse.com
    pass: process.env.EMAIL_PASS, // Smarty@6452
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email config error:', error);
  } else {
    console.log('✅ Email config is ready');
  }
});

// Validation Schemas
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).optional(),
  isAdmin: Joi.boolean().default(false)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const bookingSchema = Joi.object({
  customerName: Joi.string().min(2).max(100).required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().optional(),
  projectDescription: Joi.string().min(10).max(1000).required(),
  artType: Joi.string().min(1).required(),
  artSize: Joi.string().optional(),
  deadline: Joi.string().optional(),
  paymentMethod: Joi.string().valid('stripe', 'etransfer').default('stripe')
});

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth Routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, fullName } = req.body;
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user (make admin if your email)
    const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
    const user = {
      email: email.toLowerCase(),
      fullName: fullName || email.split('@')[0],
      password: hashedPassword,
      isAdmin,
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    
    // Generate token
    const token = jwt.sign(
      { 
        id: result.insertedId.toString(), 
        email: user.email, 
        isAdmin: user.isAdmin 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SmartyArt!',
      html: `
        <h2>Welcome to SmartyArt, ${user.fullName}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now start booking custom art commissions.</p>
        <p>Best regards,<br>Rohit Bharti</p>
      `
    });

    res.status(201).json({ 
      token, 
      user: { 
        id: result.insertedId.toString(),
        email: user.email, 
        fullName: user.fullName,
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
  
    // Find user
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        isAdmin: user.isAdmin 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id.toString(),
        email: user.email, 
        fullName: user.fullName,
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token
app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      user: { 
        id: user._id.toString(),
        email: user.email, 
        fullName: user.fullName,
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find user
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If email exists, reset link sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id.toString() }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Store reset token in DB (with expiry)
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        } 
      }
    );

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - SmartyArt',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your SmartyArt account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background: #8B0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Rohit Bharti<br>SmartyArt</p>
      `
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword, email } = req.body;
    
    if (!token || !newPassword || !email) {
      return res.status(400).json({ message: 'Token, password, and email required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check reset token
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase(), 
      _id: new ObjectId(decoded.id),
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetTokenExpiry: '' }
      }
    );

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful - SmartyArt',
      html: `
        <h2>Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p>You can now log in with your new password.</p>
        <p>Best regards,<br>Rohit Bharti<br>SmartyArt</p>
      `
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Booking Routes

// Create booking
app.post('/api/bookings', authMiddleware, upload.array('files', 5), async (req, res) => {
  try {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(`uploads/${file.filename}`)) {
            fs.unlinkSync(`uploads/${file.filename}`);
          }
        });
      }
      return res.status(400).json({ message: error.details[0].message });
    }

    const files = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const paymentMethod = req.body.paymentMethod || 'stripe';
    
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      referenceFiles: files,  // Changed to referenceFiles for consistency
      depositAmount: 20.00,
      totalAmount: null, // Will be set later
      status: paymentMethod === 'stripe' ? 'pending' : 'pending_deposit',
      depositPaid: false,
      paymentMethod,
      createdAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(bookingData);
    const bookingId = result.insertedId.toString();

    let session = null;
    let stripeUrl = null;

    if (paymentMethod === 'stripe') {
      // Create Stripe checkout session
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Deposit for Booking #${bookingId}`,
              description: `Deposit for ${req.body.artType}`
            },
            unit_amount: 2000, // $20.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
        metadata: {
          bookingId: bookingId,
          customerEmail: req.body.customerEmail
        }
      });
      stripeUrl = session.url;
    }

    // Send booking confirmation email
    let paymentInstructions = '';
    if (paymentMethod === 'stripe') {
      paymentInstructions = `
        <p><strong>Next Step:</strong> Please complete your $20 deposit payment to secure your booking.</p>
        <a href="${stripeUrl}" style="background: #8B0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay $20 Deposit Now</a>
      `;
    } else {
      paymentInstructions = `
        <p><strong>Next Step:</strong> Please send $20 deposit via Interac e-Transfer to admin@xdevverse.com.</p>
        <p>Include booking ID #${bookingId} in the message.</p>
        <p>For more info or questions, contact me directly:</p>
        <p>Phone: 742-999-0414</p>
        <a href="https://wa.me/17429990414" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Chat on WhatsApp</a>
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.customerEmail,
      cc: process.env.ADMIN_EMAIL,
      subject: `Booking Created - #${bookingId} - SmartyArt`,
      html: `
        <h2>New Art Commission Booking</h2>
        <p>Thank you for booking with SmartyArt!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Customer:</strong> ${req.body.customerName}</li>
          <li><strong>Art Type:</strong> ${req.body.artType}</li>
          <li><strong>Project:</strong> ${req.body.projectDescription.substring(0, 100)}...</li>
          <li><strong>Files Uploaded:</strong> ${files.length}</li>
        </ul>
        ${paymentInstructions}
        <p>This booking is reserved for you. Once deposit is received, I'll start working on your project.</p>
        <p>Best regards,<br>Rohit Bharti</p>
      `
    });

    // Notify admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking #${bookingId} - SmartyArt`,
      html: `
        <h2>New Art Commission Received</h2>
        <p>A new booking has been created:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Customer:</strong> ${req.body.customerName}</li>
          <li><strong>Email:</strong> ${req.body.customerEmail}</li>
          <li><strong>Phone:</strong> ${req.body.customerPhone || 'Not provided'}</li>
          <li><strong>Art Type:</strong> ${req.body.artType}</li>
          <li><strong>Description:</strong> ${req.body.projectDescription}</li>
          <li><strong>Files:</strong> ${files.length} reference images uploaded</li>
          <li><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</li>
        </ul>
        <p><a href="${process.env.FRONTEND_URL}/admin">View in Admin Dashboard</a></p>
        <p>${paymentMethod === 'stripe' ? 'Customer needs to complete $20 deposit payment.' : 'Waiting for e-Transfer deposit.'}</p>
      `
    });

    res.json({ 
      message: 'Booking created successfully',
      bookingId,
      stripeUrl 
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    
    // Clean up files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(`uploads/${file.filename}`)) {
          fs.unlinkSync(`uploads/${file.filename}`);
        }
      });
    }
    
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get user bookings
app.get('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await db.collection('bookings')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectId to string for frontend
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: booking._id.toString(),
      _id: undefined // Remove MongoDB _id field
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Admin Routes

// Get all bookings (admin only)
app.get('/api/admin/bookings', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }

    const bookings = await db.collection('bookings')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: booking._id.toString(),
      _id: undefined
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Admin get bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch admin bookings' });
  }
});

// Update booking status (admin only)
app.patch('/api/admin/bookings/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'pending_deposit', 'deposit_paid', 'in_progress', 'completed', 'cancelled', 'payment_completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { 
      status,
      updatedAt: new Date()
    };
    if (notes) {
      updateData.notes = notes;
    }

    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Get updated booking for email
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });

    // Send status update email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.customerEmail,
      cc: process.env.ADMIN_EMAIL,
      subject: `Booking Update #${id} - SmartyArt`,
      html: `
        <h2>Booking Status Update</h2>
        <p>Your booking #${id} has been updated:</p>
        <ul>
          <li><strong>New Status:</strong> ${status.replace('_', ' ').toUpperCase()}</li>
          <li><strong>Art Type:</strong> ${booking.artType}</li>
          <li><strong>Project:</strong> ${booking.projectDescription.substring(0, 100)}...</li>
        </ul>
        ${status === 'completed' ? `
          <p>Your artwork is ready! I'll send you the final files soon.</p>
          <p>Please complete the remaining payment to receive your artwork.</p>
        ` : status === 'in_progress' ? `
          <p>Great news! I've started working on your artwork.</p>
          <p>I'll keep you updated on the progress.</p>
        ` : status === 'cancelled' ? `
          <p>Your booking has been cancelled. The deposit will be refunded within 5-7 business days.</p>
          <p>If you have any questions, please contact me.</p>
        ` : ''}
        <p>Best regards,<br>Rohit Bharti<br>SmartyArt</p>
      `
    });

    res.json({ 
      message: 'Booking status updated successfully',
      booking: {
        id: booking._id.toString(),
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

// Send invoice for remaining payment (admin only)
app.post('/api/admin/invoices/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Invoice can only be sent for completed bookings' });
    }

    if (booking.totalAmount === null) {
      return res.status(400).json({ message: 'Total amount not set for this booking' });
    }

    const remainingAmount = booking.totalAmount - 20; // Subtract deposit

    // Create Stripe invoice
    const invoice = await stripe.invoices.create({
      customer_email: booking.customerEmail,
      collection_method: 'send_invoice',
      days_until_due: 7,
      description: `Remaining payment for Booking #${id}`,
      metadata: {
        bookingId: id
      }
    });

    // Add line item for remaining amount
    await stripe.invoiceItems.create({
      invoice: invoice.id,
      amount: remainingAmount * 100, // Convert to cents
      currency: 'usd',
      description: `Remaining balance for ${booking.artType}`,
    });

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);

    // Send email with invoice link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.customerEmail,
      cc: process.env.ADMIN_EMAIL,
      subject: `Invoice for Booking #${id} - SmartyArt`,
      html: `
        <h2>Invoice - Final Payment Required</h2>
        <p>Your artwork for booking #${id} is complete!</p>
        <p>Please complete the remaining payment to receive your final artwork files.</p>
        
        <h3>Invoice Details:</h3>
        <ul>
          <li><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</li>
          <li><strong>Deposit Paid:</strong> $20.00</li>
          <li><strong>Remaining Balance:</strong> $${remainingAmount.toFixed(2)}</li>
          <li><strong>Due Date:</strong> 7 days from today</li>
        </ul>
        
        <p>Click the button below to pay your invoice:</p>
        <a href="${sentInvoice.hosted_invoice_url}" style="background: #8B0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay Invoice Now</a>
        
        <p>Once payment is received, I'll send you the high-resolution files immediately.</p>
        <p>Thank you for choosing SmartyArt!<br>Rohit Bharti</p>
      `
    });

    res.json({ 
      message: 'Invoice sent successfully',
      invoiceUrl: sentInvoice.hosted_invoice_url,
      amountDue: remainingAmount
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ message: 'Failed to send invoice' });
  }
});

// Update total amount (admin only)
app.patch('/api/admin/bookings/:id/total', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount < 20) {
      return res.status(400).json({ message: 'Total amount must be at least $20' });
    }

    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          totalAmount: parseFloat(totalAmount),
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Total amount updated successfully', totalAmount });
  } catch (error) {
    console.error('Update total error:', error);
    res.status(500).json({ message: 'Failed to update total amount' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map(user => ({
      ...user,
      id: user._id.toString(),
      _id: undefined
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Toggle user admin status (admin only)
app.patch('/api/admin/users/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newIsAdmin = !user.isAdmin;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isAdmin: newIsAdmin } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User admin status updated', isAdmin: newIsAdmin });
  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ message: 'File upload error' });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }
  
  res.status(500).json({ message: 'Something went wrong' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 SmartyArt Backend running on port ${port}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
