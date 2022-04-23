# Ghost Blizt Web Game

![img](https://img.shields.io/badge/Python-3.7-blue)
![img](https://img.shields.io/badge/Flask-2.1.1-blue)
![img](https://img.shields.io/badge/React-17.0.2-green)
![img](https://img.shields.io/badge/WebSocket-yellow)
![img](https://img.shields.io/badge/FullStack-yellow)

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
#### 安裝所需Python套件
``$pip install -r requirements.txt``
#### 運行Flask Server
``$flask run``
#### 在瀏覽器輸入
``http://localhost:5000``  
即可進入遊戲頁面

# Run on GCP (Google Cloud Platform)
#### 建立運算個體
1. 進入GCP 主頁，並申請GCP帳號。
2. 左側選單點擊 ``Compute Engine`` 
3. 上方點擊 ``建立執行個體``
4. 名稱、伺服器所在區域、硬體及作業系統皆可自訂（OS推薦使用ubuntu 20）
5. ``網路標記``加入先前自訂之個體名稱
6. 防火牆設定中，務必勾選``允許 https 流量`` ``允許 http 流量``
7. 建立完成
#### 防火牆設定
1. 左側選單點擊 ``虛擬私有雲網路``
2. 進入 ``防火牆``
3. 建立 ``防火牆規則``
4. 名稱自訂
5. ``目標標記`` 輸入前面設定之個體名稱
6. ``IP 範圍設定`` 輸入 0.0.0.0/0 允許所有 IP
7. 設定開啟的 Port，選取TCP 輸入 ``3000, 5000``(本專案使用到的port 為 5000, 3000)
8. 建立完成
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
#從 github 上 clone project
```
$git clone https://github.com/yuhuan0205/ghostbliztWebVersion
$cd ghostbliztWebVersion
```
#安裝需要的python 套件
```
$pip install -r requirements.txt
```
#用 gunicorn 作為反向代理伺服器開啟flask app
```
$gunicorn -b 0.0.0.0:5000 -k flask_sockets.worker yourApp:app
```
