'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/app/store/kioskStore';

export default function Completion() {
  const router = useRouter();
  const { userName, mobile, resetStore } = useKioskStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    // Generate a sample video link (in production, this would come from your API)
    const generateVideoLink = () => {
      const timestamp = Date.now();
      return `https://example.com/video/${timestamp}`;
    };

    setVideoLink(generateVideoLink());

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRestartExperience = () => {
    resetStore();
    router.push('/');
  };

  const handleShareWhatsApp = () => {
    router.push('/review');
    // const message = `Check out my personalized UAE National Anthem video! ${videoLink}`;
    // const encodedMessage = encodeURIComponent(message);
    // const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    // window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoLink);
    alert('Video link copied to clipboard!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-600 via-black to-red-600 font-sans px-4 py-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="fixed pointer-events-none animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
              }}
            >
              <span className="text-3xl">
                {['🎉', '🎊', '✨', '🌟', '🎈'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
          <style>{`
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}

      <div className="flex flex-col items-center justify-center w-full max-w-2xl">
        {/* Main Completion Container */}
        <div className="bg-white bg-opacity-95 px-16 py-24 rounded-3xl shadow-2xl text-center w-full">
          {/* Success Icon */}
          <div
            className="w-32 h-32 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl font-bold animate-bounce"
            style={{
              animation: 'successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            ✓
          </div>

          <style>{`
            @keyframes successPop {
              0% {
                transform: scale(0);
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
              }
            }
          `}</style>

          {/* Success Title */}
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">
            Success!
          </h1>

          {/* Success Message */}
          <p className="text-2xl text-gray-800 mb-8 leading-relaxed">
            Your personalized video has been created and sent to your WhatsApp!
          </p>

          {/* User Details Summary */}
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg px-6 py-4 mb-10">
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold text-emerald-600">Name:</span> {userName}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-emerald-600">WhatsApp:</span> {mobile}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {/* Share on WhatsApp Button */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-green-500/60 flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>Share on WhatsApp</span>
            </button>

            {/* Start Over Button */}
            <button
              onClick={handleRestartExperience}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-lg font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-emerald-600/60"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 text-center text-white max-w-2xl">
          <p className="text-lg opacity-90">
            Thank you for participating in the UAE National Anthem AI Experience! 🇦🇪
          </p>
          <p className="text-sm opacity-75 mt-2">
            Event ID: {Date.now()}
          </p>
        </div>
      </div>
    </div>
  );
}