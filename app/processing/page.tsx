'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/app/store/kioskStore';

export default function Processing() {
  const router = useRouter();
  const { setProcessingStatus, userName, mobile } = useKioskStore();
  
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Processing your face...');
  const [messageIndex, setMessageIndex] = useState(0);

  const processingMessages = [
    'Processing your face...',
    'Analyzing your voice...',
    'Generating your personalized anthem video...',
    'Adding final touches...',
    'Almost ready...',
  ];

  useEffect(() => {
    setProcessingStatus('processing');

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 800);

    // Update messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < processingMessages.length) {
          setCurrentMessage(processingMessages[nextIndex]);
          return nextIndex;
        }
        clearInterval(messageInterval);
        return prev;
      });
    }, 2000);

    // Navigate to completion when done
    const completionTimer = setTimeout(() => {
      setProgress(100);
      setProcessingStatus('completed');
      setTimeout(() => {
        router.push('/completion');
      }, 1000);
    }, 10000); // Simulate 10 seconds of processing

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(completionTimer);
    };
  }, [router, setProcessingStatus]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-600 via-black to-red-600 font-sans px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-lg">
        {/* Processing Container */}
        <div className="bg-white bg-opacity-95 px-16 py-20 rounded-3xl shadow-2xl text-center w-full">
          {/* Spinner */}
          <div className="flex justify-center mb-8">
            <div
              className="w-40 h-40 border-8 border-gray-300 border-t-emerald-600 border-r-red-600 rounded-full animate-spin"
              style={{
                borderTop: '8px solid #00732F',
                borderRight: '8px solid #FF0000',
                borderBottom: '8px solid #f3f3f3',
                borderLeft: '8px solid #f3f3f3',
              }}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-emerald-600 mb-6">
            Creating Your Video
          </h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-red-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Progress Text */}
          <p className="text-2xl font-bold text-gray-800 mb-4">
            {Math.floor(Math.min(progress, 100))}%
          </p>

          {/* Processing Message */}
          <p className="text-lg text-gray-700 min-h-12">
            {currentMessage}
          </p>

          {/* Processing Steps */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="space-y-3 text-left">
              {/* Step 1 */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all ${
                    messageIndex >= 0
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {messageIndex >= 0 ? '✓' : '1'}
                </div>
                <span
                  className={`text-base font-semibold ${
                    messageIndex >= 0 ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  Processing your face
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all ${
                    messageIndex >= 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {messageIndex >= 1 ? '✓' : '2'}
                </div>
                <span
                  className={`text-base font-semibold ${
                    messageIndex >= 1 ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  Analyzing your voice
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all ${
                    messageIndex >= 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {messageIndex >= 2 ? '✓' : '3'}
                </div>
                <span
                  className={`text-base font-semibold ${
                    messageIndex >= 2 ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  Generating video
                </span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all ${
                    messageIndex >= 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {messageIndex >= 3 ? '✓' : '4'}
                </div>
                <span
                  className={`text-base font-semibold ${
                    messageIndex >= 3 ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  Adding final touches
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-600">Name:</span> {userName}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold text-emerald-600">WhatsApp:</span> {mobile}
            </p>
          </div>
        </div>

        {/* Processing Note */}
        <div className="mt-8 text-center text-white max-w-lg">
          <p className="text-sm opacity-90">
            Your personalized video is being created and will be sent to your WhatsApp shortly.
          </p>
        </div>
      </div>
    </div>
  );
}