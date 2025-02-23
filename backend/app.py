from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from rekognition import RekognitionService

import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

rekognition_service = RekognitionService()

# Routes
@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Flask API!'})

@app.route('/api/test')
def test():
    return jsonify({'status': 'API is working'})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'imageUrl' not in request.json:
        return jsonify({'error': 'No imageUrl part'}), 400
    
    imageUrl = request.json['imageUrl']
    filename = request.json['filename']
    type = request.json['type']
    bucket = request.json['bucket']
    key = request.json['key']

    response = rekognition_service.detect_labels(bucket, key)
    print(response)

    #trasnfer labels into a list
    tags = []
    for label in response['Labels']:
        tags.append(label['Name'])
    print(tags)
    return jsonify({'tags': tags})

if __name__ == '__main__':
    app.run(debug=True) 