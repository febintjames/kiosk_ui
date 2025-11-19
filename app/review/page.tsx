'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const router = useRouter();
  
  // State management for captured media
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedAudio, setCapturedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize component and retrieve stored media from previous steps
  useEffect(() => {
    // Retrieve photo from sessionStorage (captured in camera screen)
    const photoData = sessionStorage.getItem('capturedPhoto');
    if (photoData) {
      setCapturedPhoto(photoData);
    }

    // Retrieve audio from sessionStorage (recorded in audio recording screen)
    const audioData = sessionStorage.getItem('capturedAudio');
    if (audioData) {
      setCapturedAudio(audioData);
    }

    setIsLoading(false);
  }, []);

  // Handle approve action - proceed to processing
  const handleApprove = () => {
    // Store approval status and navigate to processing screen
    sessionStorage.setItem('mediaApproved', 'true');
    router.push('/processing');
  };

  // Handle retry action - go back to capture steps
  const handleRetry = () => {
    // Clear stored media and navigate back to camera screen
    sessionStorage.removeItem('capturedPhoto');
    sessionStorage.removeItem('capturedAudio');
    router.push('/camera');
  };

  // Handle cancel action - restart experience
  const handleCancel = () => {
    // Clear all session data and return to welcome screen
    sessionStorage.clear();
    router.push('/');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      {/* Main review container with UAE themed styling */}
      <div className="review-container">
        {/* Header section */}
        <h1 className="review-title">Review Your Capture</h1>
        <p className="review-subtitle">Please verify your photo and audio before proceeding</p>

        {/* Media preview section */}
        <div className="media-preview-section">
          {/* Photo preview from camera capture step */}
          <div className="preview-box photo-preview">
            <h3>Your Photo</h3>
            {capturedPhoto ? (
              <img 
                src={capturedPhoto} 
                alt="Captured photo" 
                className="preview-image"
              />
            ) : (
              <div className="placeholder">📸 No photo captured</div>
            )}
          </div>

          {/* Audio preview from recording step */}
          <div className="preview-box audio-preview">
            <h3>Your Recording</h3>
            {capturedAudio ? (
              <div className="audio-player">
                <audio 
                  controls 
                  src={capturedAudio}
                  className="audio-control"
                />
                <p className="audio-info">Audio ready for processing</p>
              </div>
            ) : (
              <div className="placeholder">🎤 No audio captured</div>
            )}
          </div>
        </div>

        {/* Action buttons section */}
        <div className="button-group action-buttons">
          {/* Approve and proceed to video generation */}
          <button 
            className="btn btn-primary"
            onClick={handleApprove}
            disabled={!capturedPhoto || !capturedAudio}
          >
            Approve & Continue
          </button>

          {/* Retry button to recapture media */}
          <button 
            className="btn btn-secondary"
            onClick={handleRetry}
          >
            Retry Capture
          </button>

          {/* Cancel button to restart from beginning */}
          <button 
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        .screen-container {
          display: flex;
          width: 100%;
          height: 100vh;
          padding: 40px;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #00732F 0%, #000000 50%, #FF0000 100%);
          animation: fadeIn 0.5s ease-in;
        }

        .review-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 60px;
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          width: 100%;
        }

        .review-title {
          font-size: 48px;
          color: #00732F;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
        }

        .review-subtitle {
          font-size: 18px;
          color: #666;
          text-align: center;
          margin-bottom: 40px;
        }

        .media-preview-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .preview-box {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 15px;
          border: 2px solid #ddd;
          text-align: center;
        }

        .preview-box h3 {
          color: #00732F;
          margin-bottom: 15px;
          font-size: 20px;
        }

        .preview-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 10px;
          background: #e0e0e0;
        }

        .audio-player {
          padding: 20px;
        }

        .audio-control {
          width: 100%;
          margin-bottom: 15px;
        }

        .audio-info {
          font-size: 14px;
          color: #666;
        }

        .placeholder {
          padding: 40px;
          color: #999;
          font-size: 18px;
          background: #e8e8e8;
          border-radius: 10px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 15px 40px;
          font-size: 18px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00732F, #006428);
          color: white;
          box-shadow: 0 10px 30px rgba(0, 115, 47, 0.4);
          flex: 1;
          min-width: 200px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 115, 47, 0.6);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #FF9800, #F57C00);
          color: white;
          box-shadow: 0 10px 30px rgba(255, 152, 0, 0.4);
          flex: 1;
          min-width: 200px;
        }

        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 152, 0, 0.6);
        }

        .btn-cancel {
          background: #ccc;
          color: #333;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          flex: 1;
          min-width: 200px;
        }

        .btn-cancel:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .media-preview-section {
            grid-template-columns: 1fr;
          }

          .review-title {
            font-size: 36px;
          }

          .review-container {
            padding: 40px 30px;
          }
        }
      `}</style>
    </div>
  );
}