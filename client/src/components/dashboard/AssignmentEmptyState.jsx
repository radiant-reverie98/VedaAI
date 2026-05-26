import React from 'react';
import { Plus } from 'lucide-react';

export default function AssignmentEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-[#F4F4F4] rounded-2xl border border-gray-200/60 p-8 text-center select-none">
      
      {/* Dynamic Graphic Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Soft Background Glow/Circle */}
        <div className="absolute w-52 h-52 bg-white/70 rounded-full shadow-inner backdrop-blur-sm" />

        {/* Decorative Floating Sparkle (Bottom Left) */}
        <svg className="absolute bottom-8 left-6 w-6 h-6 text-[#4069E5]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
        </svg>

        {/* Decorative Floating Dot (Right) */}
        <div className="absolute right-8 top-1/2 w-2.5 h-2.5 bg-[#2B549A] rounded-full" />

        {/* Decorative Swirl Line */}
        <svg className="absolute left-4 top-16 w-16 h-16 text-gray-700" fill="none" viewBox="0 0 50 50" stroke="currentColor" strokeWidth="1.5">
          <path d="M10,40 Q15,15 30,25 T45,10" strokeLinecap="round"/>
        </svg>

        {/* The Document/File Icon Stack */}
        <div className="relative z-10 translate-x-[-10px] translate-y-[-10px]">
          <div className="w-28 h-36 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col gap-3 relative">
            {/* Document Line Placeholders */}
            <div className="w-10 h-2 bg-gray-900 rounded-full" />
            <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-20 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-14 h-1.5 bg-gray-200 rounded-full" />
            
            {/* Small floating mini-card element behind magnifying glass */}
            <div className="absolute -right-12 top-2 w-12 h-8 bg-white rounded-md shadow-sm border border-gray-50 p-1.5 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="w-5 h-2 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Magnifying Glass with Red 'X' */}
        <div className="absolute z-20 bottom-10 right-6 flex items-center justify-center">
          {/* Lens Glass Circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/90 to-gray-100/80 border-4 border-gray-300 shadow-lg flex items-center justify-center relative backdrop-blur-xs">
            {/* Red 'X' Icon */}
            <svg className="w-10 h-10 text-red-500 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          {/* Handle of Magnifying Glass */}
          <div className="absolute -bottom-4 -right-4 w-5 h-10 bg-gradient-to-b from-gray-300 to-gray-400 rounded-md rotate-[-45deg] origin-top shadow-sm border-t border-white/40" />
        </div>
      </div>

      {/* Copywriting Context Texts */}
      <h3 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight mb-2">
        No assignments yet
      </h3>
      <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8 px-4">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      {/* Action Button */}
      <button className="bg-[#111111] hover:bg-black active:scale-98 text-white font-medium text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-150 shadow-md shadow-black/5">
        <Plus size={16} strokeWidth={2.5} />
        <span>Create Your First Assignment</span>
      </button>

    </div>
  );
}