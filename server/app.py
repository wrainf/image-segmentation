import cv2
import numpy as np
from flask import Flask, send_file, request
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
@app.route("/process", methods=['POST'])
def getImage():
    print(request)
    img = cv2.imdecode(np.fromstring(request.files['file'].read(), np.uint8), cv2.IMREAD_UNCHANGED)
    pixels = img.reshape(-1, 3)

    K = int(request.form['K'])

    centroids = pixels[np.random.choice(pixels.shape[0], K, replace=False)]

    while True:
        distances = np.linalg.norm(pixels[: , np.newaxis, :] - centroids, axis = 2)
        labels = np.argmin(distances, axis=1)
        new_centroids = np.array([pixels[labels == i].mean(axis=0) for i in range(K)])

        if np.allclose(new_centroids, centroids):
            break
        centroids = new_centroids

    labels = np.argmin(np.linalg.norm(pixels[: , np.newaxis, :] - centroids, axis = 2), axis=1)
    labels = labels.reshape(img.shape[:2])

    for i in range(K):
      img[labels == i] = centroids[i]

    content_type = "image/jpeg"
    _, buffer = cv2.imencode('.jpg', img)
    file_obj = BytesIO(buffer.tobytes())
    return send_file(file_obj, mimetype=content_type)

  