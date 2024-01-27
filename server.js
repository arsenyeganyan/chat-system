const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const { deleteUsers } = require('./utils/deleteUsers');

//socket utils
const { messageSent } = require('./utils/chat');
const { getAllChats } = require('./utils/getAllChats');

//middleware import
const isAuthenticated = require('./middleware/protected');
const isLogged = require('./middleware/isLogged');

//config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//middleware
app.use(session({
    secret: 'xoxogoat',
    resave: true,
    saveUninitialized: true,
}));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
}));

//routes
const userRoute = require('./routes/authRoutes');
const editRoute = require('./routes/edit');

app.use('/api/auth', userRoute);
app.use('/api/edit', isLogged, editRoute);

//user deletion
setInterval(() => deleteUsers(), 60 * 60 * 60 * 1000);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
})

app.get('/protected', isAuthenticated, (req, res) => {
    res.json({ msg: 'This route is protected!' });
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
})

io.on('connection', (socket) => {
    console.log('Socket connection set..');

    //message being saved
    socket.on('message sent', (sender, receiver, msg) => {
        messageSent(sender, receiver, msg);
    });

    //display chats
    socket.emit('chats', getAllChats());
});

//Run when client connects
// io.on('connection', (socket) => {
//     socket.on('joinRoom', ({ username, room }) => {
//         const user = userJoin(socket.id, username, room);
        
//         socket.join(user.room);

//         //welcome message
//         socket.emit('message', formatMessage(botName, 'Welcome to ChatChord!'));
    
//         //user joined
//         socket.broadcast
//             .to(user.room)
//             .emit(
//                 'message', 
//                 formatMessage(botName, `${user.username} joined chat!`)
//             );

//         //get room users
//         io.to(user.room).emit('roomUsers', {
//             room: user.room,
//             users: getRoomUsers(user.room)
//         })
//     })

//     //listen for chat message
//     socket.on('chatMessage', (msg) => {
//         const user = getCurrentUser(socket.id);

//         io.to(user.room).emit('message', formatMessage(user.username, msg));
//     })

//     //disconnect
//     socket.on('disconnect', () => {
//         const user = userLeave(socket.id);
        
//         if(user) {
//             io.to(user.room).emit(
//                 'message', 
//                 formatMessage(botName, `${user.username} user left the chat`)
//             );

//             //get room users
//             io.to(user.room).emit('roomUsers', {
//                 room: user.room,
//                 users: getRoomUsers(user.room)
//             })
//         }
//     });
// });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch((err) => {
        console.error('Error connecting to the database: ', err);
    })

const PORT = process.env.PORT || 4400;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

module.exports = app;