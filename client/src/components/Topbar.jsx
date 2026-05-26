import React from 'react';
import { ArrowLeft, LayoutGrid, Bell, ChevronDown, Menu } from 'lucide-react';

export default function Topbar({ onMenuToggle }) {
  return (
    <div className="w-full bg-white border  border-gray-200/80 rounded-3xl p-3 flex items-center justify-between shadow-md">
      
      {/* LEFT SIDE: Navigation, Mobile Burger & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Mobile Mobile Hamburger Button - Hidden on Desktop (md:) */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-gray-100 active:scale-95 text-gray-700 rounded-xl transition-all"
          aria-label="Open navigation menu"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Back Navigation Arrow */}
        <button className="p-2 hover:bg-gray-100 active:scale-95 text-gray-700 rounded-xl transition-all">
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Dashboard Section Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 font-medium select-none ml-1">
          <LayoutGrid size={18} className="text-gray-400/80 shrink-0" />
          <span className="text-base sm:text-lg font-semibold text-gray-500 tracking-tight">
            Assignment
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: System Utilities & Active Profile Card */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Notification Bell Badge Button */}
        <button className="p-2.5 hover:bg-gray-100 text-gray-700 rounded-full relative transition-colors">
          <Bell size={18} strokeWidth={2.2} />
          {/* Notification Indicator Indicator Dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5B4F] rounded-full ring-2 ring-white" />
        </button>
        
        {/* Interactive Identity Control Card */}
        <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 hover:bg-gray-100 border border-transparent hover:border-gray-100 rounded-xl cursor-pointer transition-all">
          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#FFEADA] border border-[#FFD9C0] flex items-center justify-center overflow-hidden text-lg shrink-0">
            🐵
          </div>
          {/* User Metadata Typography - Text label collapses cleanly on smaller screen viewports */}
          <span className="hidden sm:inline text-sm font-semibold text-gray-800 tracking-tight">
            John Doe
          </span>
          <ChevronDown size={14} className="text-gray-400 stroke-[2.5] shrink-0" />
        </div>

      </div>

    </div>
  );
}