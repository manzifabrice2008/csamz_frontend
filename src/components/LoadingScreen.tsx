import { GraduationCap } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-900 to-sky-300 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          
          {/* Spinning Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>

        {/* School Name */}
        <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
          CSAM Zaccaria
        </h2>
        <p className="text-white/80 text-lg mb-6">TVET Excellence in Rwanda</p>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/60 text-sm mt-6 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

