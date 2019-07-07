const server = require('../src/app')
const socketIO = require('socket.io')
const port = process.env.PORT

const io = socketIO(server)

io.on('connection',()=> {
    console.log('New WebSocket Connection !!')
})

server.listen(port , () => {
    console.log('Server is up on port: ' + port)
})
