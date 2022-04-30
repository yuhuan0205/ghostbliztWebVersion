from flask import render_template
from flask_cors import cross_origin



def initRoute(app, socketio, gs):

    @app.route('/')
    def index():
        return render_template("index.html")

    @socketio.on('login')
    def login(msg):
        gs.login(msg)

    @socketio.on("hostCheck")
    def hostCheck(msg):
        gs.hostCheck(msg)

    @socketio.on("discon")
    def discon(msg):
        gs.discon(msg)
        
    @socketio.on("sendAns")
    def update(msg):
        gs.update(msg)

    @socketio.on("sendMsg")
    def sendMsg(msg):
        gs.sendMsg(msg)

    @socketio.on('sendQuiz')
    def sendQuiz(msg):
        gs.sendQuiz(msg)

    @socketio.on("createRoom")
    def createRoom(msg):
        gs.createRoom(msg)

    @socketio.on("joinRoom")
    def joinRoom(msg):
        gs.joinRoom(msg)
        
    @app.route("/getroom")
    @cross_origin()
    def getRoom():
        return gs.getRoom()
        
