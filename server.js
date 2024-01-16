const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const formatMessage = require('./utils/messages');

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
app.use(cors({
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    origin: '*',
    optionsSuccessStatus: 200
}))

app.use('/api', peopleRoute);
app.use('/api/auth', userRoute);

const botName = 'ChatChord Bot';

//Run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        
    })

    socket.emit('message', formatMessage(botName, 'Welcome to ChatChord!'));

    socket.broadcast.emit('message', formatMessage(botName, 'A user joined a chat!'));

    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user left the chat'));
    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    })
});

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