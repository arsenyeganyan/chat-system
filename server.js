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

const csrf = require('csurf');
const cookieParser = require('cookie-parser');

//socket utils
// const { messageSent } = require('./utils/chat');
// const { getAllChats } = require('./utils/getAllChats');

//middleware import
const isAuthenticated = require('./middleware/protected');
const isLogged = require('./middleware/isLogged');

//config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//middleware
app.set('view engine', 'ejs');

//session config
app.use(session({
    secret: 'xoxogoat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

//other configs
app.use('/', express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//cors config
app.use(cors({
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
}));

//csrf + protection config
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

//express routes
const userRoute = require('./routes/authRoutes');
const editRoute = require('./routes/edit');

app.use('/api/auth', userRoute);
app.use('/api/edit', isLogged, editRoute);

//unverified user deletion
setInterval(() => deleteUsers(), 60 * 60 * 60 * 1000);

//rendering
app.get('/', isAuthenticated, (req, res) => {
    res.render('home', { csrfToken: req.csrfToken() });
})

app.get('/login', (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
})

app.get('/signup', (req, res) => {
    res.render('register', { csrfToken: req.csrfToken() });
})

//sockets

//my approach
// io.on('connection', (socket) => {
//     console.log('Socket connection set..');

//     //message being saved
//     socket.on('message sent', (sender, receiver, msg) => {
//         messageSent(sender, receiver, msg);
//     });

//     //display chats
//     socket.emit('chats', getAllChats());
// });

//course
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

//connecting to the database
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