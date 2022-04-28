from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room  # 加上這行
from flask_cors import CORS, cross_origin
import json
import random
import time


with open("./quiz.json") as f:
    quizSet = json.load(f)


idDic = {}
roomDic = {}


#To set the static_folder, template_folder path rigth
app = Flask(__name__, static_url_path='', static_folder='./FE/build/', template_folder='./FE/build/')
#http CORS setting
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#WebSocket cors_allowed_origins='*'
socketio = SocketIO(app, cors_allowed_origins='*')  # 加上這行


@app.route('/')
def index():
    return render_template("index.html")

@socketio.on('login')
def login(msg):
    idDic[msg["uid"]] = {"uid" : msg["uid"] , "score":0, "isHost":True, "room":"0"}

@socketio.on("hostCheck")
def hostCheck(msg):
    abd(socketio,msg)

def abd(sock,msg):
    print(123)
    sock.emit("isHost", {"uid":msg['uid'],"isHost":idDic[msg['uid']]["isHost"]})

@socketio.on("discon")
def discon(msg):
    #player do not login.
    if idDic == {}:
        return
    #player has logined.
    else:
        uid = msg['uid']
        room = idDic[uid]["room"]
        #player is not in any room.
        if room == "0":
            pass
        #player is the room host .
        elif idDic[uid]["isHost"]:
            #If there are other members in the room, then change the host.
            if len(roomDic[room]["id"])!=1:
                #Set next member to be a host.
                roomDic[room]["id"][1]["isHost"] = 1
                socketio.emit("updateChat", {"uid": uid, "msg":"has disconnected."}, to = room)
                socketio.emit("updateChat", {"uid": roomDic[room]["id"][1]["uid"], "msg": "is the new host."}, to = room)
                socketio.emit("isHost", {"uid": roomDic[room]["id"][1]["uid"], "isHost": 1}, to = room)
                roomDic[room]["id"].remove(idDic[uid])
                socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
            #There is only a player in the room.
            else:
                roomDic.pop(room,None)
        #Player who is not a host disconnect.
        else:
            socketio.emit("updateChat", {"uid":uid, "msg":"has disconnected."}, to = room)
            socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
            roomDic[room]["id"].remove(idDic[uid])
            socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
        idDic.pop(uid,None)
    

@socketio.on("sendAns")
def update(msg):
    uid = msg["uid"]
    room = idDic[uid]["room"]

    x = msg["q"][4:msg["q"].find(".")]
    
    if quizSet["q"+x]["ans"] == msg["ans"] and (not roomDic[room]["answerFlag"]):
        roomDic[room]["answerFlag"] = True
        idDic[uid]["score"]+=1
        socketio.emit("updateChat", {"uid": uid, "msg": "is right."}, to = room)
        #update score
        socketio.emit("updateScore", {"data": roomDic[room]["id"]}, to = room)
    elif roomDic[room]["answerFlag"]:
        socketio.emit("updateChat", {"uid": uid, "msg": "is too late."}, to = room)
    else:
        socketio.emit("updateChat", {"uid": uid, "msg": "is wrong."}, to = room)

@socketio.on("sendMsg")
def sendMsg(msg):
    uid = msg["uid"]
    room = idDic[uid]["room"]
    socketio.emit("updateChat", {"uid": uid, "msg": " : " + msg["msg"]}, to = room)


@socketio.on('sendQuiz')
def sendQuiz(msg):
    uid = msg["uid"]
    if idDic[uid]["isHost"] == 1:
        room = idDic[uid]["room"]
        socketio.emit("init", to = room)
        #Pick a quiz randomly.
        n = random.randint(1,30)
        n = "q" + str(n)
        socketio.emit("updateCountDown", {"msg": "Ready"}, to = room )
        time.sleep(1)
        for i in range(3):
            socketio.emit("updateCountDown", {"msg": str(3-i)}, to = room )
            time.sleep(1)
            
        socketio.emit("getQuiz", {"uid": uid, "quiz" : quizSet[n]}, to = room)
        socketio.emit("updateCountDown", {"msg": "Answer"}, to = room )
        roomDic[room]["answerFlag"] = False


@socketio.on("createRoom")
def createRoom(msg):
    uid = msg["uid"]
    #TO DO : Adding a checking mechanism prevent same room number occuring.
    room = str(random.randint(1000,9999))
    idDic[uid]["isHost"] = 1
    idDic[uid]["room"] = room
    #put info which in idDic into roomDic
    roomDic[room] = {"id":[idDic[uid]],"answerFlag":True}
    join_room(room)
    socketio.emit("roomInfo",{"msg": room },to = room)
    socketio.emit("isHost", {"uid": uid, "isHost": idDic[uid]["isHost"]},to = room)
    socketio.emit("updateScore", {"data": roomDic[room]["id"]}, to = room)

@socketio.on("joinRoom")
def joinRoom(msg):
    uid = msg["uid"]
    room = msg["room"]
    roomDic[room]["id"].append(idDic[uid])
    idDic[uid]["room"] = room
    idDic[uid]["isHost"] = False
    join_room(room)
    socketio.emit("isHost", {"uid": uid, "isHost": idDic[uid]["isHost"]},to = room)
    socketio.emit("roomInfo",{"msg": room },to = room)
    socketio.emit("updateScore", {"data": roomDic[room]["id"]}, to = room)
    
@socketio.on("getRoomList")
def getRoomList(msg):
    uid = msg["uid"]
    socketio.emit("roomList", {"uid": uid,"data": list(roomDic)})

@app.route("/getroom")
@cross_origin()
def getRoom():
    return {"data": list(roomDic)}
    

@app.route("/room")
def room():
    print(roomDic)
    return roomDic


if __name__ == "__main__":
    
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)