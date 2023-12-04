import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

function App() {

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [department, setDepartment] = useState('');
  const [time, setTime] = useState('');
  const [imageData, setImageData] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Capture the image when the form is submitted
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const capturedImageData = canvas.toDataURL('image/png');
    
    // Set the captured image data in the state
    setImageData(capturedImageData);

    // Prepare the data to send to the server (name, id, department, time, and imageData)
    const formData = {
      name,
      id,
      department,
      time,
      image: capturedImageData,
    };

    // Send the formData to the server
    axios.post('http://localhost:5000/new-employee', formData)
      .then((response) => {
        // Handle the server response here
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const capturedImageData = canvas.toDataURL('image/png');
    
    setImageData(capturedImageData);
    setPhotoCaptured(true);
  };

  const downloadPhoto = () => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'captured_photo.png';
    link.click();
  };

  const clearForm = (e) => {
    e.preventDefault();
    setName('');
    setId('');
    setDepartment('');
    setTime('');
    setImageData('');
    setPhotoCaptured(false);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        const video = videoRef.current;
        video.srcObject = stream;
        const playPromise = video.play();
    
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
            }).catch(error => {
                console.error("Playback failed: ", error);
            });
        }
      });
    }
  }, []);

  return (
    <Container>
      <div>
        <h2>Registration Form</h2>
        <form onSubmit={handleSubmit} id="myForm">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div className="camera-container">
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            <div>
              <canvas ref={canvasRef} width="640" height="480" className="mt-3"></canvas>
              <button onClick={capturePhoto} className="btn btn-primary mt-3">
                Capture Photo
              </button>
            </div>
            {photoCaptured && (
              <div>
                <button onClick={downloadPhoto} className="btn btn-primary mt-3">
                  Download Photo
                </button>
              </div>
            )}
            <p className="mt-3 text-center">{statusMessage}</p>
          </div>
          <button type="submit" className="btn btn-primary">
          Register
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="submit" className="btn btn-primary" onClick={clearForm}>
            Clear
          </button>
        </form>
      </div>
    </Container>
  );
}

export default App;


// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { Container } from 'react-bootstrap';

// function App() {
//   const [name, setName] = useState('');
//   const [id, setId] = useState('');
//   const [department, setDepartment] = useState('');
//   const [time, setTime] = useState('');
//   const [imageData, setImageData] = useState('');
//   const [photoCaptured, setPhotoCaptured] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, 640, 480);
//     const capturedImageData = canvas.toDataURL('image/png');
    
//     setImageData(capturedImageData);
//     setPhotoCaptured(true);

//     const formData = {
//       name,
//       id,
//       department,
//       time,
//       image: capturedImageData,
//     };

//     axios.post('http://localhost:5000/new-employee', formData)
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   };

//   const handleClick = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, 640, 480);

//     const capturedImageData = canvas.toDataURL('image/png');
//     setImageData(capturedImageData);
//     setPhotoCaptured(true);
//   };

//   const downloadPhoto = () => {
//     const link = document.createElement('a');
//     link.href = imageData;
//     link.download = 'captured_photo.png';
//     link.click();
//   };

//   const clearForm = (e) => {
//     e.preventDefault();
//     setName('');
//     setId('');
//     setDepartment('');
//     setTime('');
//     setImageData('');
//     setPhotoCaptured(false);
//   };

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
//         const video = videoRef.current;
//         video.srcObject = stream;
//         const playPromise = video.play();
    
//         if (playPromise !== undefined) {
//             playPromise.then(_ => {
//                 // Automatic playback started!
//             }).catch(error => {
//                 console.error("Playback failed: ", error);
//             });
//         }
//       });
//     }
//   }, []);

//   return (
//     <Container>
//       <div>
//         <h2>Registration Form</h2>
//         <form onSubmit={handleSubmit} id="myForm">
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>ID</label>
//             <input
//               type="text"
//               className="form-control"
//               value={id}
//               onChange={(e) => setId(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Department</label>
//             <input
//               type="text"
//               className="form-control"
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               required
//             />
//           </div>
//           <div className="camera-container">
//             <video ref={videoRef} width="640" height="480" autoPlay></video>
//             {photoCaptured && (
//               <div>
//                 <canvas ref={canvasRef} width="640" height="480" className="mt-3"></canvas>
//                 <button onClick={downloadPhoto} className="btn btn-primary mt-3">
//                   Download Photo
//                 </button>
//               </div>
//             )}
//             <p className="mt-3 text-center">{statusMessage}</p>
//           </div>
//           <button type="submit" className="btn btn-primary">
//             Register
//           </button>
//           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//           <button type="submit" onClick={clearForm} className="btn btn-primary">
//             Clear
//           </button>
//         </form>
//       </div>
//     </Container>
//   );
// }

// export default App;
