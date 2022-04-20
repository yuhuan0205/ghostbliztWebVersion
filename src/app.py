
from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room  # 加上這行
import json
import random
import time
from flask import request


# with open("./quiz.json") as f:
#     quizSet = json.load(f)

with open("./static/quiz.json") as f:
    quizSet = json.load(f)

idDic = {}
roomDic = {}
global answeredFlag
answeredFlag = False

#To set the static_folder, template_folder path rigth
# app = Flask(__name__, static_url_path='', static_folder='./ghostblizt/build/', template_folder='./ghostblizt/build/')
app = Flask(__name__, static_url_path='')

#進行跨域 cors_allowed_origins='*'
socketio = SocketIO(app, cors_allowed_origins='*')  # 加上這行




@app.route('/')
def index():
    return render_template("index.html")



@socketio.on('login')
def login(userID):
    
    # if idDic == {}:
    #     idDic[userID["uid"]] = {"uid" : userID["uid"] ,"score":0, "host":1, "room":"0"}
    #     socketio.emit("update", {"uid":userID['uid'], "msg":"has connected."})
    # else:
    idDic[userID["uid"]] = {"uid" : userID["uid"] , "score":0, "host":0, "room":"0"}
        # socketio.emit("update", {"uid":userID['uid'], "msg":"has connected."})
    #update score
    # socketio.emit("updateScore", {"data":list(idDic.values())})

@socketio.on("hostCheck")
def hostCheck(userID):
    socketio.emit("host", {"uid":userID['uid'],"host":idDic[userID['uid']]["host"]})


@socketio.on("discon")
def discon(userID):
    if idDic == {}:
        return
    elif idDic[userID['uid']]["room"] == "0":
        pass
    elif idDic[userID['uid']]["host"] == 1:
        room = idDic[userID['uid']]["room"]
        
        if len(roomDic[room]["id"])!=1:
            roomDic[room]["id"][1]["host"] = 1
            socketio.emit("update", {"uid":userID['uid'], "msg":"has disconnected."}, to = room)
            socketio.emit("update", {"uid": roomDic[room]["id"][1]["uid"], "msg":"is the new host."}, to = room)
            socketio.emit("host", {"uid":roomDic[room]["id"][1]["uid"],"host":1}, to = room)
            
            roomDic[room]["id"].remove(idDic[userID['uid']])
            socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
        else:
            roomDic.pop(room,None)
        
    else:
        room = idDic[userID['uid']]["room"]
        socketio.emit("update", {"uid":userID['uid'], "msg":"has disconnected."}, to = room)
        socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
        roomDic[room]["id"].remove(idDic[userID['uid']])
        socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
    
    idDic.pop(userID['uid'],None)
    
    #updata score
    
    

@socketio.on("sendAns")
def update(userID):
    room = idDic[userID["uid"]]["room"]

    if userID["q"] == "init":
        print(userID["q"])
        return
    x = userID["q"][4:userID["q"].find(".")]
    
    if quizSet["q"+x]["ans"] == userID["ans"] and roomDic[room]["answerFlag"]!= True :
        roomDic[room]["answerFlag"] = True
        idDic[userID['uid']]["score"]+=1
        socketio.emit("update", {"uid":userID['uid'], "msg": "is right."}, to = room)
        #update score
        socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
    elif roomDic[room]["answerFlag"] == True:
        socketio.emit("update", {"uid":userID['uid'], "msg":"is too late."}, to = room)
    else:
        socketio.emit("update", {"uid":userID['uid'], "msg":"is wrong."}, to = room)

@socketio.on("sendMsg")
def sendMsg(userID):
    room = idDic[userID["uid"]]["room"]
    socketio.emit("update", {"uid":userID['uid'], "msg":" : " + userID["msg"]}, to = room)



@socketio.on('test')
def test(userID):
    # global answeredFlag
    if idDic[userID["uid"]]["host"] == 1:
        room = idDic[userID["uid"]]["room"]
        socketio.emit("init",to = room)
        n = random.randint(1,30)
        n = "q" + str(n)
        for i in range(3):
            socketio.emit("update", {"uid":"GM", "msg":": "+str(3-i)+"."}, to = room )
            time.sleep(1)
            
        socketio.emit("test", {"uid" : userID["uid"], "quiz" : quizSet[n]}, to = room)
        
        roomDic[room]["answerFlag"] = False
    else:
        socketio.emit("update", {"uid":userID["uid"], "msg":"is not a host."}, to = room)

@socketio.on("createRoom")
def createRoom(userID):
    room = str(random.randint(1000,9999))
    idDic[userID["uid"]]["host"] = 1
    roomDic[room] = {"id":[idDic[userID["uid"]]],"answerFlag":True}
    idDic[userID["uid"]]["room"] = room
    join_room(room)
    socketio.emit("roomInfo",{"msg": room },to = room)
    socketio.emit("host", {"uid":userID['uid'],"host":idDic[userID['uid']]["host"]},to = room)
    socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)

@socketio.on("joinRoom")
def joinRoom(userID):
    room = userID["room"]
    roomDic[room]["id"].append(idDic[userID["uid"]])
    idDic[userID["uid"]]["room"] = room
    join_room(room)
    socketio.emit("roomInfo",{"msg": room },to = room)
    socketio.emit("updateScore", {"data":roomDic[room]["id"]}, to = room)
    
@socketio.on("getRoomList")
def getRoomList(userID):
    socketio.emit("roomList", {"uid":userID["uid"],"data":list(roomDic)})
    

@app.route("/room")
def room():
    print(roomDic)
    return roomDic


if __name__ == "__main__":
    
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)