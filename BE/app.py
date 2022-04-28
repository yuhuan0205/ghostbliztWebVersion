from flask import Flask
from flask_socketio import SocketIO # 加上這行
from flask_cors import CORS
import routes
import service

#To set the static_folder, template_folder path rigth
app = Flask(__name__, static_url_path='', static_folder='../FE/build/', template_folder='../FE/build/')
#http CORS setting
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#WebSocket cors_allowed_origins='*'
socketio = SocketIO(app, cors_allowed_origins='*')  # 加上這行
gs = service.GameService(app, socketio)
routes.initRoute(app, socketio, gs)


if __name__ == "__main__":
    
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)