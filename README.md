# Ghost Blizt Web Game

![img](https://img.shields.io/badge/Python-3.7-blue)
![img](https://img.shields.io/badge/Flask-2.1.1-blue)
![img](https://img.shields.io/badge/React-17.0.2-green)
![img](https://img.shields.io/badge/WebSocket-yellow)
![img](https://img.shields.io/badge/FullStack-yellow)

# Online Demo
http://ghostblizt.yuhuan.site/
# Preview
![](https://github.com/yuhuan0205/ghostbliztWebVersion/blob/master/imgForMD/gamePlay1.png)
![](https://github.com/yuhuan0205/ghostbliztWebVersion/blob/master/imgForMD/gamePlay2.png)
# Quick start
>環境需求：
>Python 3.7   
>不知道怎麼使用 Git 的朋友，可以參考下方連結安裝Git。  
>https://git-scm.com/book/zh-tw/v2/%E9%96%8B%E5%A7%8B-Git-%E5%AE%89%E8%A3%9D%E6%95%99%E5%AD%B8  

#### 下載原始碼
``$git clone https://github.com/yuhuan0205/ghostbliztWebVersion ``  
#### 進入專案資料夾
``$cd ghostbliztWebVersion``   
#### 進入後端專案資料夾
``$cd BE`` 
#### 安裝所需Python套件
``$pip install -r requirements.txt``
#### 運行Flask Server
``$flask run``
#### 在瀏覽器輸入
``http://localhost:5000``  
即可進入遊戲頁面

# Modify project 
## Directory Structure
```
ghostbliztWebVersion
│   README.md 
|   
└───BE (Back-end project folder)
│   |   requirements.txt (Python requirements package)
│   |   app.py (back-end server program entry point)
|   |
|   |───routes (manage routes)
|   |   |─── __init__.py
|   |   └─── route.py
|   |
|   |───service (manage service)
|   |   |─── __init__.py
|   |   └─── service.py
│   |
|   └───static (store static file)
|       └─── quiz.json
|   
└───FE (Front-end project folder)
    |   .env (React environment variable)
    |
    |───build (Builded front-end project)
    |   |
    |   ...
    └───src
        │   App.js (main React code)
        │   index.js (rendering App.js)
        |   index.html
        |   style.css
        |
        └───static (contain static img)
        |    |
        |    ...
        └───components (React components) 
            |  Login.js
            |  Game.js
            ...
```
## Back End
直接修改app.py即可
## Front End
### 安裝node.js 以及 npm
#### Windows
參考 https://nodejs.org/en/  
安裝完後開啟CMD 並輸入 ``$npm -v``  
#### Linux
``$sudo apt-get install nodejs``  
``$sudo apt-get install npm``
### 安裝JavaScript套件
``$cd ghostbliztWebVersion``  
``$cd FE`` 
``$npm install``
``$npm start``
開啟瀏覽器 url輸入``http://localhost:3000`` 即可進入前端頁面(此時Flask Server尚未開啟，開啟方法同Quick start)  
修改style.css 、App.js 或其他 React components 便可以改動前端頁面  
修改完成後``$npm run build``打包React project

# Run on GCP (Google Cloud Platform)
#### 建立運算個體
1. 進入GCP 主頁，並申請GCP帳號。
2. 左側選單點擊 ``Compute Engine`` 
3. 上方點擊 ``建立執行個體``
4. 名稱、伺服器所在區域、硬體及作業系統皆可自訂（OS推薦使用ubuntu 20）
5. ``網路標記``加入先前自訂之個體名稱
6. 防火牆設定中，務必勾選``允許 https 流量`` ``允許 http 流量``
7. 建立完成
8. 執行個體右側 SSH 點擊後即可進入執行個體的終端
#### 防火牆設定
1. 左側選單點擊 ``虛擬私有雲網路``
2. 進入 ``防火牆``
3. 建立 ``防火牆規則``
4. 名稱自訂
5. ``目標標記`` 輸入前面設定之個體名稱
6. ``IP 範圍設定`` 輸入 0.0.0.0/0 允許所有 IP
7. 設定開啟的 Port，選取TCP 輸入 ``3000, 5000``(本專案使用到的port 為 5000, 3000)
8. 建立完成
#### 保留靜態IP位置
1. 左側選單點擊 ``虛擬私有雲網路``
2. 進入 ``外部IP位置``
3. 保留靜態位置
4. 名稱設定與執行個體名稱一致
5. 設定完成
6. 此時運行執行個體的外部IP位置就會是固定的IP
#### 執行個體環境設定
升級apt
```
$sudo apt-get update
$sudo apt-get upgrade
```
安裝pip3
```
$sudo apt-get install python3-pip
```
從 github 上 clone project
```
$git clone https://github.com/yuhuan0205/ghostbliztWebVersion
$cd ghostbliztWebVersion
```
安裝需要的python 套件
```
$pip install -r requirements.txt
```
>此時安裝node.js 及 npm，同上方Linux安裝方法  
>將 .env 檔案中的``REACT_APP_GCP_URL=http://ip_address:5000`` ip_address 改成GCP執行個體上的外部IP
``$npm run build``

用 gunicorn 作為反向代理伺服器開啟flask app
```
$gunicorn -b 0.0.0.0:5000 -k flask_sockets.worker yourApp:app
```
開啟瀏覽器 url輸入``http:/your_GCP_IP:5000`` 即可進入遊戲頁面
