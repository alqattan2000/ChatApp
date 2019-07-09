const server = require('../src/app')
const socketIO = require('socket.io')
const port = process.env.PORT
const Filter= require('bad-words')

const io = socketIO(server)
let count = 0
io.on('connection',(socket)=> {
    socket.emit('message', 'Welcome!!')
    socket.broadcast.emit('message', 'A New User Has Join')
    // console.log('New WebSocket Connection !!')
    // socket.emit('countUpdated',count)
    // socket.on('increment', ()=>{
    //     count++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated',count)
    // })
    socket.on('sendLocation',({latitude,longitude},callback)=>{
            socket.broadcast.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
            callback('Location Shared !!!')
    })
    socket.on('SendMessage', (message, callback)=>{
        const filter = new Filter()
        if (filter.isProfane(message)){
            return callback('عيب يا قليل الأدب')
        }
        //console.log(message)
        io.emit('broadcast',message)
        callback()
    })
    socket.on('disconnect', ()=>{
        io.emit('message' , 'User has lift !!')
    })
})
server.listen(port , () => {
    console.log('Server is up on port: ' + port)
})
