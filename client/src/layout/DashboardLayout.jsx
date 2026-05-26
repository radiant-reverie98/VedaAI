import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex relative overflow-x-hidden font-sans">
      
      {/* 1. SIDEBAR CONTAINER FRAME (Responsive Adaptive Layering) */}
      <div className={`
        /* Desktop Default Rules */
        md:static md:block md:translate-x-0 shrink-0 z-40
        
        /* Mobile Overlay Layer Drawer Engine */
        fixed top-0 left-0 h-full transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar />
      </div>

      {/* 2. BACKDROP OVERLAY SHIELD (Closes menu when tapping blank workspace regions on mobile devices) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity duration-300"
        />
      )}

      {/* 3. PRIMARY CONTENT INJECTION CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 gap-6">
        
        {/* Pass down the state trigger action to the topbar header menu item */}
        <Topbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* App Router Page Context Destination Mount point (e.g., Assignment, Home) */}
        <main >
          <Outlet />
        </main>
        
      </div>

    </div>
  );
}