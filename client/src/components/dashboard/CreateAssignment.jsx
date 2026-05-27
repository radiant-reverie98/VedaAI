import React, { useState } from 'react';
import { FileText, Calendar, Plus, X, Mic, ArrowLeft, ArrowRight, ChevronDown, Heading, BookOpen, Loader2 } from 'lucide-react';
import api from '../../api.js'; 
import { useNavigate } from 'react-router-dom';

// Strict dictionary mapping to handle your Mongoose schema enum requirements
const TYPE_MAPPING = {
  'mcq': 'Multiple Choice Questions',
  'short': 'Short Questions',
  'long': 'Long Essay Questions',
  'numerical': 'Numerical Problems'
};

const REVERSE_TYPE_MAPPING = {
  'Multiple Choice Questions': 'mcq',
  'Short Questions': 'short',
  'Long Essay Questions': 'long',
  'Numerical Problems': 'numerical'
};

export default function CreateAssignment() {
  const navigate = useNavigate();

  // Dynamic state tracks - Synchronized strictly with your Mongoose Schema enum fields
  const [questionRows, setQuestionRows] = useState([
    { id: 1, type: 'mcq', count: 4, marks: 1 },
    { id: 2, type: 'short', count: 3, marks: 2 },
    { id: 3, type: 'numerical', count: 5, marks: 5 },
    { id: 4, type: 'long', count: 5, marks: 5 },
  ]);

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Appends a new item initializing to a standard 'short' validation state string
  const addNewRow = () => {
    const newId = questionRows.length > 0 ? Math.max(...questionRows.map(r => r.id)) + 1 : 1;
    setQuestionRows([...questionRows, { id: newId, type: 'short', count: 1, marks: 1 }]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid PDF document.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 

    if (isSubmitting) return;

    // Filter out rows where the count is 0 to stay compliant with Mongoose's min: 1 schema rule
    const validActiveRows = questionRows.filter(row => Number(row.count) > 0);

    // Structural validations
    if (!assignmentTitle.trim()) return alert("Assignment title is required");
    if (!subjectName.trim()) return alert("Subject name is required");
    if (!dueDate) return alert("Due date is required");
    if (!selectedFile) return alert("Please upload PDF file");
    if (validActiveRows.length === 0) {
      return alert("Please add at least one question row with a count of 1 or higher.");
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", assignmentTitle);
      formData.append("subject", subjectName);
      formData.append("description", additionalInfo);
      formData.append("dueDate", dueDate);

      // Map identifiers directly into the reverse conversion layer to guarantee clean enums
      const formattedConfig = validActiveRows.map(({ type, count, marks }) => ({
        type: REVERSE_TYPE_MAPPING[type] || type, 
        count: Number(count),
        marks: Number(marks)
      }));
      
      formData.append("questionConfig", JSON.stringify(formattedConfig));
      formData.append("pdf", selectedFile);

      const response = await api.post(
        "/assignment/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const createdAssignment = response.data?.assignment || response.data;

      if (createdAssignment?._id) {
        navigate(`/dashboard/assignment/${createdAssignment._id}`);
      } else {
        alert("Assignment created but server failed to redirect with valid index ID.");
      }
    } catch (error) {
      console.error("Create Assignment Error:", error);
      alert(error?.response?.data?.message || "Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
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
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Assignment Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Basic information about your assignment</p>
        </div>

        {/* METADATA CONTAINER PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800 tracking-tight">Assignment Title</label>
            <div className="w-full relative flex items-center">
              <input 
                type="text" 
                placeholder="e.g., Mid-Term Question Paper"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-400 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all placeholder-gray-400/80"
              />
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <Heading size={18} strokeWidth={2.2} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800 tracking-tight">Subject Name</label>
            <div className="w-full relative flex items-center">
              <input 
                type="text" 
                placeholder="e.g., Database Management Systems"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-400 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all placeholder-gray-400/80"
              />
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <BookOpen size={18} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>

        {/* DRAG & DROP DASHBOARD AREA */}
        <label className="w-full bg-white md:bg-[#FAFAFA]/50 border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all group cursor-pointer relative">
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 mb-3 group-hover:scale-105 transition-transform">
            <FileText size={20} />
          </div>
          
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <p className="text-sm font-bold text-gray-800 tracking-tight max-w-xs truncate">{selectedFile.name}</p>
              <span className="text-[11px] font-medium text-green-500 mt-0.5">Ready to process</span>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800 tracking-tight">Choose a file or drag & drop it here</p>
              <span className="text-[11px] font-medium text-gray-400 mt-1">PDF Documents only, up to 10MB</span>
            </>
          )}

          <div className="mt-4 px-5 py-2 text-xs font-semibold bg-white border border-gray-200 group-hover:bg-gray-100 text-gray-700 rounded-xl transition-all shadow-xs">
            {selectedFile ? 'Change File' : 'Browse Files'}
          </div>
        </label>
        <p className="text-center text-xs font-medium text-gray-400 -mt-2">Upload the PDF document of your preferred study material</p>

        {/* DUE DATE INPUT SELECTION PICKER */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800 tracking-tight">Due Date</label>
          <div className="w-full relative flex items-center">
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all text-gray-700 cursor-pointer [color-scheme:light]"
            />
            <div className="absolute right-4 text-gray-400 pointer-events-none">
              <Calendar size={18} />
            </div>
          </div>
        </div>

        {/* QUESTION CONFIGURATION INTERFACE PANEL */}
        <div className="flex flex-col gap-3">
          
          <div className="hidden md:grid grid-cols-[1fr_auto_130px_130px] gap-4 items-center px-2 text-xs font-bold text-gray-400 select-none">
            <div>Question Type</div>
            <div className="w-6" /> 
            <div className="text-center">No. of Questions</div>
            <div className="text-center">Marks</div>
          </div>

          {/* QUESTION LIST ROW LAYOUT REPEATER */}
          <div className="flex flex-col gap-4 md:gap-2.5">
            {questionRows.map((row) => (
              <div 
                key={row.id} 
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_130px_130px] gap-3 md:gap-4 items-center bg-white border border-gray-200/80 md:border-transparent p-4 md:p-0 rounded-2xl md:rounded-none relative"
              >
                <div className="w-full relative flex items-center">
                  <select 
                    value={TYPE_MAPPING[row.type] || row.type}
                    onChange={(e) => {
                      const updated = [...questionRows];
                      const internalValue = REVERSE_TYPE_MAPPING[e.target.value] || e.target.value.toLowerCase();
                      updated.find(r => r.id === row.id).type = internalValue;
                      setQuestionRows(updated);
                    }}
                    className="w-full bg-[#FAFAFA]/40 md:bg-[#FAFAFA] border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-800 appearance-none outline-none cursor-pointer"
                  >
                    <option>Multiple Choice Questions</option>
                    <option>Short Questions</option>
                    <option>Long Essay Questions</option>
                    <option>Numerical Problems</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none stroke-[2.5]" />
                </div>

                <button 
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  className="absolute right-3 top-3 md:static p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                <div className="grid grid-cols-2 gap-3 md:contents bg-gray-50/50 md:bg-transparent p-3 md:p-0 rounded-xl">
                  <div className="flex flex-col md:items-center gap-1.5">
                    <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">No. of Questions</span>
                    <div className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-1 flex items-center justify-between gap-1 max-w-[130px]">
                      <button type="button" onClick={() => updateRowState(row.id, 'count', 'sub')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">-</button>
                      <span className="text-sm font-bold text-gray-800">{row.count}</span>
                      <button type="button" onClick={() => updateRowState(row.id, 'count', 'add')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-center gap-1.5">
                    <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Marks per Item</span>
                    <div className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-1 flex items-center justify-between gap-1 max-w-[130px]">
                      <button type="button" onClick={() => updateRowState(row.id, 'marks', 'sub')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">-</button>
                      <span className="text-sm font-bold text-gray-800">{row.marks}</span>
                      <button type="button" onClick={() => updateRowState(row.id, 'marks', 'add')} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-500 font-bold active:scale-90 transition-transform">+</button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={addNewRow}
            className="w-fit flex items-center gap-2 mt-2 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-xl transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center">
              <Plus size={12} strokeWidth={3} />
            </div>
            <span>Add Question Type</span>
          </button>
        </div>

        {/* SUMMARY CALCULATION LABELS */}
        <div className="w-full flex flex-col items-end gap-1 border-t border-gray-100 pt-4 mt-2 pr-2 text-right select-none">
          <div className="text-sm font-semibold text-gray-500">Total Questions : <span className="text-gray-800 font-bold ml-1">{totalQuestions}</span></div>
          <div className="text-sm font-semibold text-gray-500">Total Marks : <span className="text-gray-800 font-bold ml-1">{totalMarks}</span></div>
        </div>

        {/* ADDITIONAL METADATA WORKSPACE PROMPT NOTES */}
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
            <button type="button" className="absolute right-3.5 bottom-3.5 p-2 bg-white border border-gray-100 text-gray-500 hover:text-gray-800 rounded-xl shadow-xs transition-colors">
              <Mic size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. FOOTER ACTIONS BAR PANEL */}
      <div className="w-full flex items-center justify-between px-1 mt-2">
        <button 
          type="button" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:hover:bg-white rounded-full transition-all active:scale-97 shadow-xs"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>Previous</span>
        </button>
        
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#111111] hover:bg-black disabled:bg-gray-400 rounded-full transition-all min-w-[160px] justify-center active:scale-97 shadow-md shadow-black/5"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Create & Generate</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}