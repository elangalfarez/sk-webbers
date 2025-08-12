# Face Detection Models

This directory should contain the face-api.js model files for face detection functionality.

Required model files:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_recognition_model-weights_manifest.json  
- face_recognition_model-shard1
- face_recognition_model-shard2
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1

To add the actual models:

1. Download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Copy the required model files to this directory
3. The application will automatically load them on initialization

Note: Model files are not included in this repository due to their size (~5MB total).
Face detection will be disabled if models are not available.