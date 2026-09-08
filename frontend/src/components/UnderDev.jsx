import React from 'react';
import { Wrench, School } from 'lucide-react';

const UnderDevelopmentCard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 text-center flex flex-col items-center gap-3">
          {/* Replace School icon with an <img> tag for your actual crest */}
          <div className="p-3 bg-white/10 rounded-full">
            <School className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            Achievers School Website
          </h1>
        </div>

        {/* Body Message */}
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <div className="p-4 bg-amber-50 rounded-full text-amber-600">
            <Wrench className="w-10 h-10 animate-bounce" />
          </div>
          <p className="text-gray-700 text-base leading-relaxed font-medium">
            This Feature is under development and would soon be implemented.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-center text-indigo-900 font-semibold my-2 font-poppins">
            In Case you see any data on this page, note that they are for demonstration purposes only. That is what you will see once the feature is live.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 py-4 text-center">
          <p className="text-xs text-gray-500 font-medium">
            &copy; Achievers School, 2026
          </p>
        </div>

      </div>
    </div>
  );
};

export default UnderDevelopmentCard;