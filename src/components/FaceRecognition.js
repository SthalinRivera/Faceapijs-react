import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

export const FaceRecognition = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('Cargando modelos...');
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                console.log("Cargando modelos...");
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                ]);
                setLoadingMessage('Modelos cargados, cargando descriptores...');
                console.log("Modelos cargados correctamente.");
            } catch (err) {
                console.error('Error al cargar los modelos:', err);
            }
        };

        const startWebcam = () => {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    setLoadingMessage('Webcam cargada, estamos listos!');
                })
                .catch(err => console.error('Error al acceder a la webcam:', err));
        };

        const loadLabeledFaces = async () => {
            setLoadingMessage('Cargando descriptores faciales...');
            const labels = ['73625197', '73625198', '73625199', '73625190'];
            const descriptors = [];
            for (const label of labels) {
                const descriptions = [];
                for (let i = 1; i <= 2; i++) {
                    try {
                        const img = await faceapi.fetchImage(`/labels/${label}/${i}.png`);
                        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                        if (detection) {
                            descriptions.push(detection.descriptor);
                        } else {
                            console.error(`No se pudo detectar una cara en ${label}/${i}.png.`);
                        }
                    } catch (error) {
                        console.error(`Error al procesar ${label}/${i}.png`, error);
                    }
                }
                if (descriptions.length > 0) {
                    descriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions));
                    console.log(`Descriptores para ${label} cargados.`);
                } else {
                    console.log(`No se encontraron descriptores válidos para ${label}.`);
                }
            }
            setLabeledFaceDescriptors(descriptors);
            setLoadingMessage('¡Todo listo! ¡Gooo!');
        };

        const handlePlay = async () => {
            console.log("Comenzando detección facial...");
            if (labeledFaceDescriptors.length === 0) {
                console.error('No hay descriptores de caras etiquetadas disponibles');
                return;
            }
            const video = videoRef.current;
            if (!video) return;

            if (video.readyState < 3) {
                console.log("Esperando a que el video esté listo...");
                return;
            }

            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

            if (canvasRef.current.childElementCount === 0) {
                const canvas = faceapi.createCanvasFromMedia(video);
                canvasRef.current.appendChild(canvas);
                console.log("Canvas agregado.");
            }

            const canvas = canvasRef.current.firstChild;
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            const id = setInterval(async () => {
                console.log("Detectando caras...");
                const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawOptions = {
                        label: result.toString(),
                        boxColor: result.label === 'unknown' ? 'red' : 'green'
                    };
                    new faceapi.draw.DrawBox(box, drawOptions).draw(canvas);

                    console.log(`Detectado: ${result.label}`);
                });
            }, 100);

            setIntervalId(id);
        };

        const init = async () => {
            await loadModels();
            await loadLabeledFaces();
            startWebcam();
        };

        init();

        videoRef.current && videoRef.current.addEventListener('play', handlePlay);

        return () => {
            console.log("Limpiando recursos...");
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                // tracks.forEach(track => track.stop());
                // console.log("Webcam detenida.");
            }
            if (canvasRef.current) {
                canvasRef.current.innerHTML = '';
                console.log("Canvas limpiado.");
            }
            if (intervalId) {
                clearInterval(intervalId);
                console.log("Intervalo detenido.");
            }
        };
    }, [labeledFaceDescriptors]);

    return (
        <div className="relative bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg">
            <h1 className='text-center text-xl font-bold text-slate-50 mb-4'>Reconocimiento Facial con React</h1>
            <div className="relative">
                {!videoRef.current || labeledFaceDescriptors.length === 0 ? (
                    <div className="flex justify-center items-center w-full h-full text-white">
                        <span className="text-2xl">{loadingMessage}</span>
                    </div>
                ) : null}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="640"
                    height="480"
                    className="rounded-lg object-cover"
                />
                <div
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
            </div>
        </div>
    );
};


