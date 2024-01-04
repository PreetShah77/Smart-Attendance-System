import cv2
import requests
import base64
from facenet_pytorch import MTCNN
import torch

# Initialize OpenCV camera
cap = cv2.VideoCapture(0)

# Initialize MTCNN face detection model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(keep_all=True, device=device)

# Flag to check if a new face is detected
new_face_detected = False

while cap.isOpened():
    ret, frame = cap.read()

    if not ret:
        print("Failed to capture frame")
        break

    # Perform face detection
    boxes, probs = mtcnn.detect(frame)

    if boxes is not None:
        for box in boxes:
            x, y, w, h = map(int, box)
            
            # Ensure that bounding box coordinates are within frame boundaries
            x = max(0, x)
            y = max(0, y)
            w = min(frame.shape[1] - x, w)
            h = min(frame.shape[0] - y, h)

            # Check if the detected face region is valid
            if w > 0 and h > 0:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                # If a new face is detected, save the image locally
                if not new_face_detected:
                    detected_face = frame[y:y + h, x:x + w]

                    # Save the image locally
                    image_filename = 'detected_face.png'
                    cv2.imwrite(image_filename, detected_face)
                    print(f"Image saved as {image_filename}")

                    # Set the flag to indicate a new face is detected
                    new_face_detected = True

                    # Convert the image to a bit array
                    _, img_encoded = cv2.imencode('.png', detected_face)
                    bit_array = base64.b64encode(img_encoded).decode('utf-8')

                    # Send the bit array to the REST API server
                    # url = 'http://localhost:3000/run-face-check'
                    # payload = {'image': bit_array}
                    # headers = {'Content-Type': 'application/json'}
                    # response = requests.post(url, json=payload, headers=headers)

                    # Print the server response
                    print(response.text)
            else:
                print("Invalid face detection region")
    else:
        # Reset the flag if no face is detected
        new_face_detected = False

    # Display the frame
    cv2.imshow('Face Detection', frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all windows
cap.release()
cv2.destroyAllWindows()
