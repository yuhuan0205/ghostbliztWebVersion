from flask_socketio import join_room, leave_room  # 加上這行
import json
import random
import time
from pathlib import Path


class GameService:
    
    def __init__(self, app, socketio):
        
        self.app = app
        self.sk = socketio
        self.quizSet = self.readQuizSet()
        self.idDic = {}
        self.roomDic = {}
        self.emptyRoomList = list(range(1000,10000))

    def readQuizSet(self):
        filePath = (Path(__file__).parent / "../static/quiz.json")
        with filePath.open() as f:
            quizSet = json.load(f)
        return quizSet

    def login(self, msg):
        self.idDic[msg["uid"]] = {"uid" : msg["uid"] , "score":0, "isHost":True, "room":"0"}

    def hostCheck(self, msg):
        self.sk.emit("isHost", {"uid":msg['uid'],"isHost":self.idDic[msg['uid']]["isHost"]})
        
    def discon(self, msg):
        #player do not login.
        if self.idDic == {}:
            return
        #player has logined.
        else:
            uid = msg['uid']
            room = self.idDic[uid]["room"]
            #player is not in any room.
            if room == "0":
                pass
            #player is the room host .
            elif self.idDic[uid]["isHost"]:
                #If there are other members in the room, then change the host.
                if len(self.roomDic[room]["id"])!=1:
                    #Set next member to be a host.
                    self.roomDic[room]["id"][1]["isHost"] = 1
                    self.sk.emit("updateChat", {"uid": uid, "msg":"has disconnected."}, to = room)
                    self.sk.emit("updateChat", {"uid": self.roomDic[room]["id"][1]["uid"], "msg": "is the new host."}, to = room)
                    self.sk.emit("isHost", {"uid": self.roomDic[room]["id"][1]["uid"], "isHost": 1}, to = room)
                    self.roomDic[room]["id"].remove(self.idDic[uid])
                    self.sk.emit("updateScore", {"data":self.roomDic[room]["id"]}, to = room)
                #There is only a player in the room.
                else:
                    self.roomDic.pop(room,None)
                    self.emptyRoomList.append(room)
            #Player who is not a host disconnect.
            else:
                self.sk.emit("updateChat", {"uid":uid, "msg":"has disconnected."}, to = room)
                self.sk.emit("updateScore", {"data":self.roomDic[room]["id"]}, to = room)
                self.roomDic[room]["id"].remove(self.idDic[uid])
                self.sk.emit("updateScore", {"data":self.roomDic[room]["id"]}, to = room)
            self.idDic.pop(uid,None)
        
    def update(self, msg):
        uid = msg["uid"]
        room = self.idDic[uid]["room"]

        x = msg["q"][4:msg["q"].find(".")]
        
        if self.quizSet["q"+x]["ans"] == msg["ans"] and (not self.roomDic[room]["answerFlag"]):
            self.roomDic[room]["answerFlag"] = True
            self.idDic[uid]["score"]+=1
            self.sk.emit("updateChat", {"uid": uid, "msg": "is right."}, to = room)
            #update score
            self.sk.emit("updateScore", {"data": self.roomDic[room]["id"]}, to = room)
        elif self.roomDic[room]["answerFlag"]:
            self.sk.emit("updateChat", {"uid": uid, "msg": "is too late."}, to = room)
        else:
            self.sk.emit("updateChat", {"uid": uid, "msg": "is wrong."}, to = room)

    def sendMsg(self, msg):
        uid = msg["uid"]
        room = self.idDic[uid]["room"]
        self.sk.emit("updateChat", {"uid": uid, "msg": " : " + msg["msg"]}, to = room)

    def sendQuiz(self, msg):
        uid = msg["uid"]
        if self.idDic[uid]["isHost"] == 1:
            room = self.idDic[uid]["room"]
            self.sk.emit("init", to = room)
            #Pick a quiz randomly.
            n = random.randint(1,30)
            n = "q" + str(n)
            self.sk.emit("updateCountDown", {"msg": "Ready"}, to = room )
            time.sleep(1)
            for i in range(3):
                self.sk.emit("updateCountDown", {"msg": str(3-i)}, to = room )
                time.sleep(1)
                
            self.sk.emit("getQuiz", {"uid": uid, "quiz" : self.quizSet[n]}, to = room)
            self.sk.emit("updateCountDown", {"msg": "Answer"}, to = room )
            self.roomDic[room]["answerFlag"] = False

    def createRoom(self, msg):
        uid = msg["uid"]
        #TO DO : Adding a checking mechanism prevent same room number occuring.
        room = self.emptyRoomList.pop(random.randint(0,len(self.emptyRoomList)-1))
        room = str(room)
        self.idDic[uid]["isHost"] = 1
        self.idDic[uid]["room"] = room
        #put info which in idDic into roomDic
        self.roomDic[room] = {"id":[self.idDic[uid]],"answerFlag":True}
        join_room(room)
        self.sk.emit("roomInfo",{"msg": room },to = room)
        self.sk.emit("isHost", {"uid": uid, "isHost": self.idDic[uid]["isHost"]},to = room)
        self.sk.emit("updateScore", {"data": self.roomDic[room]["id"]}, to = room)

    def joinRoom(self, msg):
        uid = msg["uid"]
        room = msg["room"]
        self.roomDic[room]["id"].append(self.idDic[uid])
        self.idDic[uid]["room"] = room
        self.idDic[uid]["isHost"] = False
        join_room(room)
        self.sk.emit("isHost", {"uid": uid, "isHost": self.idDic[uid]["isHost"]},to = room)
        self.sk.emit("roomInfo",{"msg": room },to = room)
        self.sk.emit("updateScore", {"data": self.roomDic[room]["id"]}, to = room)
        
    def getRoomList(self, msg):
        uid = msg["uid"]
        self.sk.emit("roomList", {"uid": uid,"data": list(self.roomDic)})

    def getRoom(self):
        return {"data": list(self.roomDic)}
        