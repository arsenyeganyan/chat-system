const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//routes
const userRoute = require('./routes/authRoutes');
const peopleRoute = require('./routes/people');

//middleware
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', peopleRoute);
app.use('/api/auth', userRoute);

//Run when client connects
io.on('connection', (socket) => {
    socket.emit('message', 'Welcome to ChatCord!');

    socket.broadcast.emit('message', 'A user joined a chat!');

    socket.on('disconnect', () => {
        io.emit('message', 'A user left the chat');
    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })
})

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch((err) => {
        console.error('Error connecting to the database: ', err);
    })

const PORT = process.env.PORT || 4400;
server.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
})