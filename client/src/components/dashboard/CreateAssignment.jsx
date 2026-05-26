import React, { useState } from 'react';
import { UploadCloud, Calendar, Plus, X, Mic, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

export default function CreateAssignment() {
  // Dynamic state for matching row parameters
  const [questionRows, setQuestionRows] = useState([
    { id: 1, type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: 2, type: 'Short Questions', count: 3, marks: 2 },
    { id: 3, type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: 4, type: 'Numerical Problems', count: 5, marks: 5 },
  ]);

  const [dueDate, setDueDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Counters recalculation logic
  const totalQuestions = questionRows.reduce((acc, current) => acc + current.count, 0);
  const totalMarks = questionRows.reduce((acc, current) => acc + (current.count * current.marks), 0);

  const updateRowState = (id, key, operation) => {
    setQuestionRows(prev => prev.map(row => {
      if (row.id === id) {
        const value = row[key];
        const nextValue = operation === 'add' ? value + 1 : Math.max(0, value - 1);
        return { ...row, [key]: nextValue };
      }
      return row;
    }));
  };

  const deleteRow = (id) => {
    setQuestionRows(prev => prev.filter(row => row.id !== id));
  };

  const addNewRow = () => {
    const newId = questionRows.length > 0 ? Math.max(...questionRows.map(r => r.id)) + 1 : 1;
    setQuestionRows([...questionRows, { id: newId, type: 'Short Questions', count: 1, marks: 1 }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 font-sans pb-12 select-none animate-fade-in">
      
      {/* 1. TOP ROUTE DESCRIPTION HEADER */}
      <div className="flex items-start gap-3 px-1">
        <div className="w-3.5 h-3.5 bg-[#4ADE80] rounded-full mt-2 shrink-0 shadow-sm shadow-green-200" />
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Create Assignment</h1>
          <p className="text-sm text-gray-400 mt-0.5">Set up a new assignment for your students</p>
        </div>
      </div>

      {/* 2. PROGRESS SEGMENTATION TRACK BAR */}
      <div className="w-full flex items-center h-[3px] bg-gray-200 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-gray-600 rounded-full" />
        <div className="w-1/2 h-full bg-gray-200" />
      </div>

      {/* 3. MAIN FORM SHELL BLOCK CARD */}
      <div className="w-full bg-[#FAFAFA] md:bg-white border md:border-gray-200/70 rounded-3xl p-4 sm:p-8 flex flex-col gap-6 shadow-xs">
        
        {/* Module Title Label Headers */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Assignment Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Basic information about your assignment</p>
        </div>

        {/* DRAG & DROP DASHBOARD AREA */}
        <div className="w-full bg-white md:bg-[#FAFAFA]/50 border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all group cursor-pointer relative">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud size={20} />
          </div>
          <p className="text-sm font-semibold text-gray-800 tracking-tight">Choose a file or drag & drop it here</p>
          <span className="text-[11px] font-medium text-gray-400 mt-1">JPEG, PNG, upto 10MB</span>
          <button className="mt-4 px-5 py-2 text-xs font-semibold bg-[#FAFAFA] border border-gray-200 hover:bg-gray-100 active:scale-98 text-gray-700 rounded-xl transition-all shadow-xs">
            Browse Files
          </button>
        </div>
        <p className="text-center text-xs font-medium text-gray-400 -mt-2">Upload images of your preferred document/image</p>

        {/* DUE DATE SELECT PICKER INPUT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800 tracking-tight">Due Date</label>
          <div className="w-full relative flex items-center">
            <input 
              type="text" 
              placeholder="DD-MM-YYYY"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder-gray-400"
            />
            <div className="absolute right-4 text-gray-400 pointer-events-none">
              <Calendar size={18} />
            </div>
          </div>
        </div>

        {/* QUESTION PARAMETERS FORM SHEET GRID */}
        <div className="flex flex-col gap-3">
          
          {/* Column Title Anchors (Desktop Header Only - Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_auto_130px_130px] gap-4 items-center px-2 text-xs font-bold text-gray-400 select-none">
            <div>Question Type</div>
            <div className="w-6" /> {/* spacer balancing the delete cross */}
            <div className="text-center">No. of Questions</div>
            <div className="text-center">Marks</div>
          </div>

          {/* QUESTION ROW LIST REPEATER NODE */}
          <div className="flex flex-col gap-4 md:gap-2.5">
            {questionRows.map((row) => (
              <div 
                key={row.id} 
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_130px_130px] gap-3 md:gap-4 items-center bg-white border border-gray-200/80 md:border-transparent p-4 md:p-0 rounded-2xl md:rounded-none relative"
              >
                {/* A. Dropdown Selection Input Block */}
                <div className="w-full relative flex items-center">
                  <select 
                    value={row.type}
                    onChange={(e) => {
                      const updated = [...questionRows];
                      updated.find(r => r.id === row.id).type = e.target.value;
                      setQuestionRows(updated);
                    }}
                    className="w-full bg-[#FAFAFA]/40 md:bg-[#FAFAFA] border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-800 appearance-none outline-none cursor-pointer"
                  >
                    <option>Multiple Choice Questions</option>
                    <option>Short Questions</option>
                    <option>Diagram/Graph-Based Questions</option>
                    <option>Numerical Problems</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none stroke-[2.5]" />
                </div>

                {/* B. Delete Cross Button (Adaptive Positioning absolute on mobile / layout grid on desktop) */}
                <button 
                  onClick={() => deleteRow(row.id)}
                  className="absolute right-3 top-3 md:static p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {/* Mobile Flex Subcontainer Wrappers for Incrementor Blocks */}
                <div className="grid grid-cols-2 gap-3 md:contents bg-gray-50/50 md:bg-transparent p-3 md:p-0 rounded-xl">
                  
                  {/* C. Count Incrementor Module */}
                  <div className="flex flex-col md:items-center gap-1.5">
                    <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">No. of Questions</span>
                    <div className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-1 flex items-center justify-between gap-1 max-w-[130px]">
                      <button onClick={() => updateRowState(row.id, 'count', 'sub')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">-</button>
                      <span className="text-sm font-bold text-gray-800">{row.count}</span>
                      <button onClick={() => updateRowState(row.id, 'count', 'add')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">+</button>
                    </div>
                  </div>

                  {/* D. Marks Incrementor Module */}
                  <div className="flex flex-col md:items-center gap-1.5">
                    <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Marks per Item</span>
                    <div className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-1 flex items-center justify-between gap-1 max-w-[130px]">
                      <button onClick={() => updateRowState(row.id, 'marks', 'sub')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">-</button>
                      <span className="text-sm font-bold text-gray-800">{row.marks}</span>
                      <button onClick={() => updateRowState(row.id, 'marks', 'add')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">+</button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Add New Row Append CTA Element Link */}
          <button 
            onClick={addNewRow}
            className="w-fit flex items-center gap-2 mt-2 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-xl transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center">
              <Plus size={12} strokeWidth={3} />
            </div>
            <span>Add Question Type</span>
          </button>
        </div>

        {/* ACCUMULATED META DATA VALUE STRINGS SUMMARY ROW */}
        <div className="w-full flex flex-col items-end gap-1 border-t border-gray-100 pt-4 mt-2 pr-2 text-right select-none">
          <div className="text-sm font-semibold text-gray-500">Total Questions : <span className="text-gray-800 font-bold ml-1">{totalQuestions}</span></div>
          <div className="text-sm font-semibold text-gray-500">Total Marks : <span className="text-gray-800 font-bold ml-1">{totalMarks}</span></div>
        </div>

        {/* ADDITIONAL META INFORMATION TEXT AREA DESCRIPTORS BOX */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-bold text-gray-800 tracking-tight">Additional Information (For better output)</label>
          <div className="w-full relative flex items-start">
            <textarea 
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full bg-[#FAFAFA]/50 border border-gray-200/80 border-dashed focus:border-solid focus:border-gray-400 focus:bg-white rounded-2xl pl-4 pr-12 py-3.5 text-sm font-medium outline-none transition-all placeholder-gray-400 resize-none"
            />
            <button className="absolute right-3.5 bottom-3.5 p-2 bg-white border border-gray-100 text-gray-500 hover:text-gray-800 rounded-xl shadow-xs transition-colors">
              <Mic size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. FOOTER FLOW ACTION BUTTONS STRIP */}
      <div className="w-full flex items-center justify-between px-1 mt-2">
        <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all active:scale-97 shadow-xs">
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>Previous</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#111111] hover:bg-black rounded-full transition-all active:scale-97 shadow-md shadow-black/5">
          <span>Next</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}