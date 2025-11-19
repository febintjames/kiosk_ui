'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/app/store/kioskStore';

export default function VoiceRecorder() {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { setUploadedVoice, setProcessingStatus } = useKioskStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(5).fill(20));
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'completed'>('idle');

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCountdown = async () => {
    setCountdown(3);
    let count = 3;

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        setCountdown(null);
        clearInterval(countdownInterval);
        actuallyStartRecording();
      }
    }, 1000);
  };

  const actuallyStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });

      streamRef.current = stream;
      
      // Setup audio context for visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setUploadedVoice(audioUrl);
        setRecordingState('completed');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingState('recording');
      setRecordingTime(0);

      // Start visualizer
      updateVisualizer();

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 30000);

    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
      console.error('Microphone error:', err);
    }
  };

  const updateVisualizer = () => {
    if (!analyserRef.current || !isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const levels = Array.from({ length: 5 }, (_, i) => {
      const index = Math.floor((i / 5) * dataArray.length);
      return (dataArray[index] / 255) * 60 + 20;
    });
    
    setAudioLevel(levels);

    if (isRecording) {
      requestAnimationFrame(updateVisualizer);
    }
  };

  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 30) {
          stopRecording();
          return prev;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleStartRecording = () => {
    setError('');
    startCountdown();
  };

  const handleNext = () => {
    setProcessingStatus('processing');
    router.push('/processing');
  };

  const handleBack = () => {
    stopRecording();
    router.back();
  };

  const handleRetry = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioLevel(Array(5).fill(20));
    setError('');
  };

  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-600 via-black to-red-600 font-sans px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Record Your Voice
        </h1>

        {/* Error State */}
        {error && (
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg mb-8 text-center w-full">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Recording Container */}
        {!error && (
          <div className="bg-white bg-opacity-95 px-16 py-24 rounded-3xl shadow-2xl text-center w-full">
            {/* Mic Icon */}
            <div
              className={`w-48 h-48 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl font-bold transition-all ${
                isRecording
                  ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
              }`}
            >
              🎤
            </div>

            {/* Countdown */}
            {countdown !== null && (
              <div className="text-6xl font-bold text-red-600 mb-8 animate-pulse">
                {countdown}
              </div>
            )}

            {/* Recording Timer */}
            {isRecording && (
              <div className="text-5xl font-bold text-red-600 mb-8">
                {formatTime(recordingTime)}
              </div>
            )}

            {/* Visualizer */}
            {isRecording && (
              <div className="flex justify-center gap-2 mb-12 h-20">
                {audioLevel.map((level, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-full bg-gradient-to-t from-emerald-600 to-red-600 transition-all duration-75"
                    style={{ height: `${level}px` }}
                  />
                ))}
              </div>
            )}

            {/* Recording Status Text */}
            {recordingState === 'idle' && !countdown && (
              <p className="text-2xl text-gray-800 mb-12">
                Press start to begin recording
              </p>
            )}

            {isRecording && (
              <p className="text-2xl text-gray-800 mb-12">
                Recording... Sing along! 🎵
              </p>
            )}

            {recordingState === 'completed' && (
              <p className="text-2xl text-emerald-600 mb-12 font-semibold">
                Recording Complete! ✓
              </p>
            )}

            {/* Primary Button */}
            {recordingState === 'idle' && !countdown && (
              <button
                onClick={handleStartRecording}
                className="w-full px-8 py-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-2xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Start Recording
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="w-full px-8 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-2xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Stop Recording
              </button>
            )}

            {recordingState === 'completed' && (
              <button
                onClick={handleRetry}
                className="w-full px-8 py-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Record Again
              </button>
            )}
          </div>
        )}

        {/* Bottom Button Group */}
        {recordingState === 'completed' && !error && (
          <div className="flex gap-4 w-full mt-8">
            <button
              onClick={handleBack}
              className="flex-1 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-bold rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-emerald-600/60"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}