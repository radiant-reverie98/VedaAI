import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, // Added icon for Assignments
  Wand2, 
  Library, 
  Settings, 
  LogOut, 
  Plus 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  // Helper function to check if a route is active to clean up JSX clutter
  const isActive = (path) => location.pathname === path;

  // Base styling for navigation links
  const linkStyles = "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors duration-150";

  return (
    <div className="w-64 m-[16px] rounded-md h-[calc(100vh-32px)] bg-white text-gray-800 flex flex-col justify-between border-r border-gray-200 p-4 font-sans">
      
      {/* Top Section */}
      <div>
        {/* Company Name */}
        <div className="text-2xl font-bold text-gray-900 tracking-wide px-2 py-3">
          VedaAI
        </div>

        {/* Create Assignment Button */}
        <div className="mt-4 mb-6">
          <Link 
            to="/dashboard/create-assignment" 
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-4xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
          >
            <Plus size={18} />
            <span>Create Assignment</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {/* Home Link */}
          <Link 
            to="/dashboard/home" 
            className={`${linkStyles} ${
              isActive('/dashboard/home') 
                ? 'bg-gray-100 text-black font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home size={20} className={isActive('/dashboard/home') ? 'text-black' : 'text-gray-500'} />
            <span>Home</span>
          </Link>
          
          {/* My Groups Link */}
          <Link 
            to="/dashboard/my-groups" 
            className={`${linkStyles} ${
              isActive('/dashboard/my-groups') 
                ? 'bg-gray-100 text-black font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={20} className={isActive('/dashboard/my-groups') ? 'text-black' : 'text-gray-500'} />
            <span>My Groups</span>
          </Link>

          {/* Assignments Link (Newly Inserted Here) */}
          <Link 
            to="/dashboard/assignment" 
            className={`${linkStyles} ${
              isActive('/dashboard/assignment') 
                ? 'bg-gray-100 text-black font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText size={20} className={isActive('/dashboard/assignment') ? 'text-black' : 'text-gray-500'} />
            <span>Assignments</span>
          </Link>
          
          {/* AI Teacher Link */}
          <Link 
            to="/dashboard/ai-teacher" 
            className={`${linkStyles} ${
              isActive('/dashboard/ai-teacher') 
                ? 'bg-gray-100 text-black font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Wand2 size={20} className={isActive('/dashboard/ai-teacher') ? 'text-black' : 'text-gray-500'} />
            <span>AI Teacher's Toolkit</span>
          </Link>
          
          {/* My Library Link */}
          <Link 
            to="/dashboard/library" 
            className={`${linkStyles} ${
              isActive('/dashboard/library') 
                ? 'bg-gray-100 text-black font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Library size={20} className={isActive('/dashboard/library') ? 'text-black' : 'text-gray-500'} />
            <span>My Library</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        {/* Settings */}
        <Link 
          to="/dashboard/settings" 
          className={`${linkStyles} ${
            isActive('/dashboard/settings') 
              ? 'bg-gray-100 text-black font-semibold' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings size={20} className={isActive('/dashboard/settings') ? 'text-black' : 'text-gray-500'} />
          <span>Settings</span>
        </Link>

        {/* User Profile Dropdown/Button */}
        <div className="relative group">
          <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-left">
            <div className="flex items-center gap-3">
              {/* Profile Avatar Placeholder */}
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">John Doe</p>
                <p className="text-xs text-gray-500 mt-1">Instructor</p>
              </div>
            </div>
          </button>

          {/* Logout Option on Hover/Click */}
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1">
            <button 
              onClick={() => console.log('Logging out...')} 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}