import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, School, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', schoolName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const {setUser} = useAuth();
  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      const response = await api.post('/auth/register',formData);
      if(response.data.success){
        alert("Registeration successful")
        setUser(response.data.data.name)
      }
    }catch(error){
      console.log(`Error: ${error}`)
    }
    
    navigate('/dashboard/home');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4 font-sans select-none">
      
      {/* AUTH CARD CORE CONTAINER */}
      <div className="w-full max-w-md bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-10 shadow-sm animate-fade-in">
        
        {/* BRANDING LOGO & SUB-TITLE CAPTION */}
        <div className="text-center mb-8">
          <div className="text-3xl font-extrabold text-gray-900 tracking-wide mb-1">
            VedaAI
          </div>
          <p className="text-sm text-gray-400 font-medium">Get started by creating your account workspace</p>
        </div>

        {/* INPUT DATA FORM INTERFACE CONTAINER */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* A. FULL NAME INPUT FIELD CHANNEL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="w-full relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <User size={18} strokeWidth={2.2} />
              </div>
              <input 
                type="text" 
                required
                placeholder="Professor John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-gray-400 focus:bg-white text-sm font-semibold text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder-gray-400/80"
              />
            </div>
          </div>

          {/* B. EMAIL INPUT FIELD CHANNEL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="w-full relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <Mail size={18} strokeWidth={2.2} />
              </div>
              <input 
                type="email" 
                required
                placeholder="name@institution.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-gray-400 focus:bg-white text-sm font-semibold text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder-gray-400/80"
              />
            </div>
          </div>

          {/* NEW: C. SCHOOL / INSTITUTION NAME INPUT FIELD CHANNEL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">School / Institution</label>
            <div className="w-full relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <School size={18} strokeWidth={2.2} />
              </div>
              <input 
                type="text" 
                required
                placeholder="M.B.M. University"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-gray-400 focus:bg-white text-sm font-semibold text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder-gray-400/80"
              />
            </div>
          </div>

          {/* D. PASSWORD INPUT FIELD CHANNEL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="w-full relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <Lock size={18} strokeWidth={2.2} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-gray-400 focus:bg-white text-sm font-semibold text-gray-800 rounded-xl pl-12 pr-12 py-3.5 outline-none transition-all placeholder-gray-400/80"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2.2} /> : <Eye size={18} strokeWidth={2.2} />}
              </button>
            </div>
          </div>

          {/* SUBMIT TRIGGER CTA ACTION BUTTON */}
          <button 
            type="submit"
            className="w-full bg-[#111111] hover:bg-black text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.99] shadow-md shadow-black/5"
          >
            <span>Register Account</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </form>

        {/* BOTTOM REDIRECTION ROUTE LINK */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/" className="text-black font-bold hover:underline ml-0.5">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}