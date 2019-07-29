const server = require('../src/app')
const socketIO = require('socket.io')
const port = process.env.PORT
const Filter= require('bad-words')
const { generateMessage } = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const io = socketIO(server)
let count = 0
io.on('connection',(socket)=> {
  
    // socket.emit('message', generateMessage('Welcome!'))
    // socket.broadcast.emit('message', generateMessage('A New User Has Join'))
    // console.log('New WebSocket Connection !!')
    // socket.emit('countUpdated',count)
    // socket.on('increment', ()=>{
    //     count++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated',count)
    // })
    socket.on('sendLocation',({latitude,longitude},callback)=>{
        const user = getUser(socket.id)

            //socket.broadcast.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
            io.to(user.room).emit('url', generateMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
            callback('Location Shared !!!')
    })
    socket.on('join', (options,callback)=>{
        const {error, user} = addUser({ id: socket.id , ...options})
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('SendMessage', ( message, callback)=>{
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)){
            socket.emit('')
            return callback(generateMessage('Admin',`Don't say bad words`))
        }
        //console.log(message)
        io.to(user.room).emit('message',generateMessage(user.username, message))
        callback()
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if (user) {
        io.to(user.room).emit('message' ,generateMessage('Admin', `${user.username} has lift !!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    }

    })
})
server.listen(port , () => {
    console.log('Server is up on port: ' + port)
})
