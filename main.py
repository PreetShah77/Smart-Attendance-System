import cv2
import requests
import base64
from facenet_pytorch import MTCNN
import torch
import time

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
            # Commenting out the line that draws the rectangle
            # x, y, w, h = map(int, box)
            # cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

            # If a new face is detected, save the entire frame locally
            if not new_face_detected:
                # Set the flag to indicate a new face is detected
                new_face_detected = True
                status= 'Entry'
                # Convert the image to a bit array
                _, img_encoded = cv2.imencode('.png', frame)
                bit_array = base64.b64encode(img_encoded).decode('utf-8')
                url = 'http://localhost:5000/run-face-check'
                payload = {'image': bit_array,
                           'status': status
                           }
                headers = {'Content-Type': 'application/json'}
                response = requests.post(url, json=payload, headers=headers)

                # Print the server response
                print(response.text)

                # # Write the bit array to a file
                # with open('bit_array.txt', 'a') as f:
                #     f.write(bit_array + '\n')

                # print(f"Bit Array saved to bit_array.txt: {bit_array}")
                time.sleep(2)
                # Additional processing or sending to the server can be done here

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
