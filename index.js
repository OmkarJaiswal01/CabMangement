const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://omkarjaiswal799184:caSNfR2ksgS5P5ND@cluster0.lqbfx.mongodb.net/Carrer")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Routes
const Admin_Routers = require("./Router/AdminRouters");
app.use("/", Admin_Routers);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const emitRiderUpdates = async () => {
  try {
    const activeRiders = await Rider.find({ status: 'active' });
    const expiredRiders = await Rider.find({ status: 'expired' });

    io.emit('updateRiders', { activeRiders, expiredRiders });
  } catch (error) {
    console.error('Error emitting rider updates:', error);
  }
};

// Example: Call this after updating riders
app.post('/startRide', async (req, res) => {
  try {
    const { riderId } = req.body;
    await Rider.findByIdAndUpdate(riderId, { status: 'active' });
    await emitRiderUpdates(); // Emit updates
    res.status(200).send('Ride started');
  } catch (err) {
    res.status(500).send('Error starting ride');
  }
});

// Export `io` for use in controllers
module.exports = { io };

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
