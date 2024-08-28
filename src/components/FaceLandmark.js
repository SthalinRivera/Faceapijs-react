import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export const FaceLandmark = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Error accessing webcam', err));
    };

    const detectFaces = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        faceapi.matchDimensions(canvasRef.current, { width: videoRef.current.width, height: videoRef.current.height });
        const resizedDetections = faceapi.resizeResults(detections, { width: videoRef.current.width, height: videoRef.current.height });
        canvasRef.current.innerHTML = '';
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      }
    };

    loadModels().then(() => {
      startVideo();
      videoRef.current.addEventListener('play', () => {
        setInterval(detectFaces, 100); // Detect faces every 100ms
      });
    });
  }, []);

  return (
    <div>
      <div className="relative bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg ">
        <h1 className='text-center text-xl font-bold text-slate-50 mb-4'>Face landmarks</h1>
        <div className="items-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      </div>
    </div>

  );
};


