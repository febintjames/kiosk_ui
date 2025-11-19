'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/app/store/kioskStore';

export default function Camera() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { setUploadedImage } = useKioskStore();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Mirror the image
      context.scale(-1, 1);
      context.drawImage(videoRef.current, -canvasRef.current.width, 0);

      // Convert to blob and store
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const imageData = URL.createObjectURL(blob);
          setUploadedImage(imageData);
          stopCamera();
          router.push('/recording');
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Photo capture error:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  const handleBack = () => {
    stopCamera();
    router.back();
  };

  const handleRetry = () => {
    setCameraActive(false);
    setError('');
    initCamera();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-600 via-black to-red-600 font-sans px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Position Your Face
        </h1>

        {/* Error State */}
        {error && (
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg mb-8 text-center max-w-2xl">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Camera Container */}
        {!error && (
          <>
            <div className="relative w-full max-w-2xl mb-8">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto block"
                  style={{ maxHeight: '480px' }}
                />

                {/* Face Overlay Guide */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-4 border-dashed border-emerald-400 rounded-full opacity-50 pointer-events-none" />

                {/* Loading Indicator */}
                {loading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white text-lg font-semibold">
                        Initializing Camera...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Tips */}
            <div className="bg-white bg-opacity-95 px-12 py-8 rounded-3xl shadow-2xl max-w-2xl mb-8 w-full">
              <h3 className="text-2xl font-bold text-emerald-600 mb-6">
                Camera Tips
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-4 text-xl">✓</span>
                  <span className="text-lg text-gray-800">
                    Position your face in the center of the circle
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-4 text-xl">✓</span>
                  <span className="text-lg text-gray-800">
                    Ensure good lighting on your face
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-4 text-xl">✓</span>
                  <span className="text-lg text-gray-800">
                    Look directly at the camera
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-4 text-xl">✓</span>
                  <span className="text-lg text-gray-800">
                    Keep your head steady
                  </span>
                </li>
              </ul>
            </div>

            {/* Button Group */}
            <div className="flex gap-4 w-full max-w-2xl">
              <button
                onClick={handleBack}
                className="flex-1 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-bold rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg"
              >
                Back
              </button>
              <button
                onClick={capturePhoto}
                disabled={!cameraActive || loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-emerald-600/60 disabled:cursor-not-allowed"
              >
                Capture Photo
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden Canvas for Image Capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}