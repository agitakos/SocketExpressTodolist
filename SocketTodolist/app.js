var express     = require('express'),
    http        = require('http'),
    ent         = require('ent'),
    app = express(),
    server      = http.createServer(app),
    io    = require('socket.io').listen(server);
 
var todolist=[],
    index;         
 
// On utilise Express et son système de routes
app.get('/todo', function(req, res)
{
    res.render('todo.ejs');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
app.use(function (req, res, next) {
    res.redirect('/todo');
})

/* On utilise Socket */
io.sockets.on('connection', function (socket) {

    // A la connexion, on envoie la Todolist
    socket.emit('todolist', todolist);

    socket.on('newtodo', function (newtodo) {

        newtodo = ent.encode(newtodo);
        todolist.push(newtodo); // on met à jour la todolist du serveur
        index = todolist.length -1; // On oublie pas l'index
        socket.broadcast.emit('newtodo', {
            index: index, 
            newtodo: newtodo
            }); // on envoie l'objets avec nos données aux utilisateurs connectés
    });

    socket.on('deltodo', function(index) {
        todolist.splice(index, 1);
        io.sockets.emit('todolist', todolist); // à tout le monde
    });

});

server.listen(8080);   