import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  Layers, 
  Calendar, 
  BookOpen, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Welcome');
  const [currentTime, setCurrentTime] = useState('');
  const {user} = useAuth();
  // 1. DYNAMIC SYSTEM RECOGNITION (Makes generic pages feel deeply personalized)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Format local clock presentation strings
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    setCurrentTime(new Date().toLocaleDateString('en-US', options));
  }, []);

  // Generic productivity shortcuts that route to existing operational views
  const quickActions = [
    {
      title: 'Assignment Console',
      desc: 'Review ongoing submissions, analyze grading frameworks, or create a new paper layout.',
      path: '/dashboard/assignment',
      icon: <Layers className="text-gray-800" size={20} />,
      cta: 'Open Workspace'
    },
    {
      title: "Teacher's Toolkit",
      desc: 'Deploy artificial intelligence generation assistance to construct lesson structures.',
      path: '/dashboard/ai-teacher',
      icon: <Sparkles className="text-amber-500 fill-amber-100" size={20} />,
      cta: 'Launch AI Tools'
    },
    {
      title: 'Content Library',
      desc: 'Browse through archived assets, question banks, templates, and reference documentation material.',
      path: '/dashboard/library',
      icon: <BookOpen className="text-gray-800" size={20} />,
      cta: 'View Assets'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans pb-12 select-none animate-fade-in">
      
      {/* ================= HEADER HERO BLOCK ================= */}
      <div className="w-full bg-[#111111] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Geometric Mesh Backing */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none blur-xl" />
        
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            <Calendar size={12} className="text-gray-400" />
            <span>{currentTime || "System Workspace Active"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {user?.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl font-medium leading-relaxed">
            Welcome to the VedaAI central execution environment.
          </p>
        </div>

        
      </div>

      {/* ================= DYNAMIC ACTION HUB MATRIX ================= */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Available System Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {quickActions.map((action, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between items-start min-h-[200px] shadow-xs hover:shadow-md/5 transition-all group"
            >
              <div className="flex flex-col gap-3 w-full">
                {/* Structural Icon Element Header Badge */}
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center shadow-2xs">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </div>

              {/* Navigation Action Hook */}
              <button 
                onClick={() => navigate(action.path)}
                className="mt-5 w-full text-xs font-bold text-gray-700 bg-[#FAFAFA] hover:bg-gray-900 hover:text-white border border-gray-100 rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{action.cta}</span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LOWER BROADCAST SYSTEM STRIP ================= */}
      <div className="w-full bg-white border border-gray-200/70 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
          <Clock size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-gray-800 tracking-tight">System Status Online</h4>
          <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
            Cloud database engine synchronization metrics successfully validated. No service windows pending.
          </p>
        </div>
      </div>

    </div>
  );
}