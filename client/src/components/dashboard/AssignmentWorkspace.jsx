import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Search, MoreVertical, Eye, Trash2 } from 'lucide-react';

export default function AssignmentWorkspace() {
  // Mock array matching your exact UI items schema
  const staticAssignments = [
    { id: 1, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
    { id: 2, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
    { id: 3, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
    { id: 4, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
    { id: 5, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
    { id: 6, title: 'Quiz on Electricity', assigned: '20-06-2025', due: '21-06-2025' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="w-full flex flex-col gap-5 font-sans animate-fade-in color-gray">
      
      {/* 1. VIEW HEADER */}
      <div className="flex items-start gap-3 px-1">
        {/* Decorative Green Dot Indicator */}
        <div className="w-3.5 h-3.5 bg-[#4ADE80] rounded-full mt-2 shrink-0 shadow-sm shadow-green-200" />
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Assignments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and create assignments for your classes.</p>
        </div>
      </div>

      {/* 2. FILTER & UTILITY BAR */}
      <div className="w-full bg-white border border-gray-200/70 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Filter Dropdown/Button */}
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl transition-all font-medium text-sm">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <span>Filter By</span>
        </button>

        {/* Search Field Box Container */}
        <div className="w-full sm:w-80 relative flex items-center">
          <div className="absolute left-3.5 text-gray-400 pointer-events-none">
            <Search size={18} strokeWidth={2.2} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Assignment"
            className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-gray-400 focus:bg-white text-gray-800 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* 3. RESPONSIVE TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {staticAssignments
          .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((assignment) => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              isMenuOpen={activeMenuId === assignment.id}
              onToggleMenu={() => setActiveMenuId(activeMenuId === assignment.id ? null : assignment.id)}
              onCloseMenu={() => setActiveMenuId(null)}
            />
          ))}
      </div>

    </div>
  );
}

// ================= ISOLATED SUB-COMPONENT CARD CONTAINER =================
function AssignmentCard({ assignment, isMenuOpen, onToggleMenu, onCloseMenu }) {
  const menuRef = useRef(null);

  // Close context dropdowns automatically if clicking outside the component viewport
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onCloseMenu();
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, onCloseMenu]);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 relative flex flex-col justify-between min-h-[160px] shadow-xs hover:shadow-md/5 transition-all group">
      
      {/* Upper Content Strip */}
      <div className="flex items-start justify-between gap-4 w-full">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">
          {assignment.title}
        </h3>
        
        {/* Menu Context Box Trigger */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={onToggleMenu}
            className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all ${isMenuOpen ? 'bg-gray-100 text-gray-700' : ''}`}
          >
            <MoreVertical size={20} strokeWidth={2.5} />
          </button>

          {/* Interactive Context Popover Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200/90 rounded-xl shadow-xl z-30 p-1 flex flex-col gap-0.5 animate-scale-up origin-top-right">
              <button 
                onClick={() => { alert('Viewing...'); onCloseMenu(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg text-left transition-colors"
              >
                <Eye size={16} className="text-gray-400" />
                <span>View Assignment</span>
              </button>
              <button 
                onClick={() => { alert('Deleting...'); onCloseMenu(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors"
              >
                <Trash2 size={16} className="text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Meta Data Labels Row */}
      <div className="flex items-center justify-between w-full text-[13px] border-t border-gray-50 pt-4 mt-4 select-none">
        <div className="text-gray-500 font-medium">
          Assigned on : <span className="text-gray-400 font-semibold ml-0.5">{assignment.assigned}</span>
        </div>
        <div className="text-gray-800 font-bold">
          Due : <span className="text-gray-400 font-semibold ml-0.5">{assignment.due}</span>
        </div>
      </div>

    </div>
  );
}