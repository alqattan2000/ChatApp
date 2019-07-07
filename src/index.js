const server = require('../src/app')
const socketIO = require('socket.io')
const port = process.env.PORT

const io = socketIO(server)
let count = 0
io.on('connection',(socket)=> {
    console.log('New WebSocket Connection !!')
    socket.emit('countUpdated',count)
    socket.on('increment', ()=>{
        count++
        //socket.emit('countUpdated', count)
        io.emit('countUpdated',count)
    })
})

server.listen(port , () => {
    console.log('Server is up on port: ' + port)
})
