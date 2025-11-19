'use client';
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  const handleNav = () => {
    router.push('/details');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-black to-red-600 animate-gradient"></div>
      
      {/* Animated Flag Colors Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-emerald-600 animate-wave"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white animate-wave-delayed"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-black animate-wave-more-delayed"></div>
      </div>

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-16 py-32">
        <div className="flex flex-col items-center justify-center text-center bg-white bg-opacity-95 px-16 py-24 rounded-3xl shadow-2xl max-w-2xl">
          {/* UAE Flag */}
          <div className="relative w-40 h-40 mb-8 animate-pulse">
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
              {/* Flag stripes */}
              <div className="w-full h-1/3 bg-emerald-600"></div>
              <div className="w-full h-1/3 bg-white"></div>
              <div className="w-full h-1/3 bg-black"></div>
              {/* Red vertical bar */}
              <div className="absolute top-0 left-0 w-1/3 h-full bg-red-600"></div>
            </div>
            {/* Optional flag emoji overlay for texture */}
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-0 hover:opacity-100 transition-opacity">
              🇦🇪
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold text-emerald-600 mb-4">
            UAE National Anthem
          </h1>
          <h2 className="text-5xl font-bold text-emerald-600 mb-10">
            AI Experience
          </h2>

          {/* Subtitle */}
          <p className="text-2xl text-gray-800 mb-12 leading-relaxed">
            Record your voice and receive a personalized anthem video delivered
            directly to your WhatsApp!
          </p>

          {/* Primary Button */}
          <button 
            onClick={handleNav} 
            className="px-16 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-2xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-emerald-600/60"
          >
            Start Experience
          </button>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(0%) skewX(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(5%) skewX(2deg);
            opacity: 0.5;
          }
        }

        @keyframes wave-delayed {
          0%, 100% {
            transform: translateX(0%) skewX(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(-5%) skewX(-2deg);
            opacity: 0.5;
          }
        }

        @keyframes wave-more-delayed {
          0%, 100% {
            transform: translateX(0%) skewX(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(3%) skewX(1deg);
            opacity: 0.5;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .animate-wave {
          animation: wave 6s ease-in-out infinite;
        }

        .animate-wave-delayed {
          animation: wave-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-wave-more-delayed {
          animation: wave-more-delayed 6s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}