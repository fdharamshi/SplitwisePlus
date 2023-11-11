from flask import Flask, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "This app is created by Femin Dharamshi. Please visit https://www.femindharamshi.com"


@app.route("/forward-get", methods=['POST'])
def forwardGet():
    url = request.json['url']
    API_KEY = request.json['API_KEY']
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(url, headers=headers)
    return response.json()


@app.route("/forward-post", methods=['POST'])
def forwardPost():
    url = request.json['url']
    API_KEY = request.json['API_KEY']
    headers = {"Authorization": f"Bearer {API_KEY}"}
    postData = request.json['postData']
    response = requests.post(url, json=postData, headers=headers)
    return response.json()


if __name__ == "__main__":
    app.run(port=8000, debug=True)
