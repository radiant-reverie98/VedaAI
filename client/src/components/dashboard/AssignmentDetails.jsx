import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, Calendar, HelpCircle, Award, Copy, Check, FileText, 
  AlertCircle, RefreshCw, Loader2, Cpu, ChevronLeft, Download, Clock 
} from 'lucide-react';

// --- API Instance Layer ---
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true,
});

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  // App Operational Core States
  const [assignment, setAssignment] = useState(null);
  const [uiState, setUiState] = useState('loading'); // loading | generating | completed | failed
  const [apiError, setApiError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const pollingRef = useRef(null);

  // --- Helper: Clear Active Polling Intervals Cleanly ---
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // --- API Sync A: Fetch Core Payload Record ---
  const fetchAssignmentData = async (showGlobalLoader = false) => {
    if (showGlobalLoader) setUiState('loading');
    try {
      const response = await API.get(`/assignment/${assignmentId}`);
      const data = response.data?.assignment || response.data;
      setAssignment(data);
      setApiError(null);

      // Evaluate application status matrix
      if (data.status === 'pending') {
        triggerAiGeneration();
      } else if (data.status === 'generating') {
        setUiState('generating');
        startPollingPipeline();
      } else if (data.status === 'completed') {
        setUiState('completed');
        stopPolling();
      } else if (data.status === 'failed') {
        setUiState('failed');
        setApiError(data.generationError || 'AI assignment processing lifecycle aborted.');
        stopPolling();
      }
    } catch (err) {
      console.error('Fetch assignment sync boundary failure:', err);
      setUiState('failed');
      setApiError(err.response?.data?.message || 'Failed to establish connection to assignment gateway.');
      stopPolling();
    }
  };

  // --- API Sync B: Dispatch AI Generation Request (WITH RACE CONDITION PATCH) ---
  const triggerAiGeneration = async () => {
    setUiState('generating');
    try {
      await API.post(`/assignment/generate/${assignmentId}`);
      startPollingPipeline();
    } catch (err) {
      console.error('AI trigger boundary condition fault:', err);
      
      const errorMessage = err.response?.data?.message || '';
      
      // FIX: If the immediate post fails due to rapid redirection collisions, 
      // do NOT show the failure intercept layout. Fall back to polling immediately.
      if (
        err.response?.status === 429 || 
        err.response?.status === 409 || 
        errorMessage.includes('generating') ||
        errorMessage.includes('busy')
      ) {
        startPollingPipeline();
      } else {
        setUiState('failed');
        setApiError(err.response?.data?.message || 'Failed to dispatch cloud processing generation clusters.');
      }
    }
  };

  // --- Workflow Management: Synchronous Telemetry Polling ---
  const startPollingPipeline = () => {
    if (pollingRef.current) return; // Enforce single thread lifecycle locks
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await API.get(`/assignment/${assignmentId}`);
        const data = response.data?.assignment || response.data;
        setAssignment(data);

        if (data.status === 'completed') {
          setUiState('completed');
          stopPolling();
        } else if (data.status === 'failed') {
          setUiState('failed');
          setApiError(data.generationError || 'AI platform dynamic token verification error.');
          stopPolling();
        }
      } catch (err) {
        console.error('Background health validation sequence dropped:', err);
      }
    }, 3000);
  };

  // --- Component Lifecycle Controller ---
  useEffect(() => {
    fetchAssignmentData(true);
    return () => stopPolling();
  }, [assignmentId]);

  // --- Utility Action: Copy Question Text to Clipboard ---
  const handleCopyQuestion = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Utility Action: Manual Crash Re-execution Trigger ---
  const handleRetryFlow = async () => {
    setIsRetrying(true);
    setApiError(null);
    try {
      await API.post(`/assignment/generate/${assignmentId}`);
      setUiState('generating');
      startPollingPipeline();
    } catch (err) {
      console.error('Manual generation retry fault tracking boundary:', err);
      setUiState('failed');
      setApiError(err.response?.data?.message || 'Failed to re-initialize model runtime lanes.');
    } finally {
      setIsRetrying(false);
    }
  };

  const calculateTotalMarks = () => {
    if (!assignment?.generatedQuestions) return 0;
    return assignment.generatedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  };

  // ==========================================
  // LIGHT-THEME UI DISPLAY RENDERING LAYOUTS
  // ==========================================

  // STATE 1: LOADING RENDERING CONTAINER
  if (uiState === 'loading') {
    return (
      <div className="min-h-screen bg-[#F4F4F4] text-gray-800 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex flex-col gap-3">
            <div className="h-10 w-2/3 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-5 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white border border-gray-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-white border border-gray-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STATE 2: ACTIVE GENERATING RENDERING CONTAINER
  if (uiState === 'generating') {
    return (
      <div className="min-h-screen bg-[#F4F4F4] text-gray-800 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-white border border-gray-200/80 rounded-3xl p-8 text-center flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
          
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center shadow-md relative animate-bounce duration-1000">
              <Cpu size={36} className="text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-gray-900/5 blur-xl animate-pulse -z-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Generating Assessment...</h2>
          <p className="text-sm text-gray-400 font-medium max-w-sm mb-8">
            VedaAI is parsing text frameworks, generating dynamic keys, and validating optimal scoring patterns.
          </p>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full w-4/5 rounded-full animate-infinite-loading origin-left" />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">
            <Clock size={12} className="animate-spin" />
            <span>Estimated Wait: 30 - 45 Seconds</span>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: FAILURE WARNING INTERCEPT CONTAINER
  if (uiState === 'failed') {
    return (
      <div className="min-h-screen bg-[#F4F4F4] text-gray-800 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 text-center flex flex-col items-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Generation Failure Encountered</h2>
          <p className="text-sm text-red-600 font-medium bg-red-5/50 border border-red-100 px-4 py-3 rounded-xl w-full text-left break-words mb-6 max-h-40 overflow-y-auto font-mono text-xs">
            {apiError || 'An internal platform operational layer architecture fault dropped processing pipelines.'}
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => navigate(-1)} 
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
            >
              Go Back
            </button>
            <button 
              onClick={()=>window.location.reload()} 
              disabled={isRetrying}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#111111] hover:bg-black rounded-xl transition-all disabled:opacity-50 active:scale-98 shadow-sm"
            >
              {isRetrying ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span>{isRetrying ? 'Retrying...' : 'Retry Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 4: RAW SYNCED ASSESSMENT STRUCTURAL CARD DISPLAY
  return (
    <div className="min-h-screen bg-[#F4F4F4] text-gray-800 font-sans pb-24">
      
      {/* STICKY INTERACTIVE METADATA BAR PANEL */}
      <header className="w-full sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-50 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <div className="truncate">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-0.5">{assignment?.subject}</span>
              <h1 className="text-lg font-extrabold text-gray-900 tracking-tight truncate">{assignment?.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-5 border border-green-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Sync Completed
            </span>
            <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-white border border-gray-200 hover:border-gray-400 rounded-xl transition-all text-gray-700 shadow-xs active:scale-98">
              <Download size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
        
        {/* STRUCTURAL DASHBOARD MATRIX NUMERICAL DATA BLOCKS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-blue-5 text-blue-600 rounded-xl"><BookOpen size={18} /></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Subject</span>
              <span className="text-sm font-bold text-gray-800 truncate max-w-[140px] block">{assignment?.subject}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-purple-5 text-purple-600 rounded-xl"><Calendar size={18} /></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Due Target</span>
              <span className="text-sm font-bold text-gray-800 block">
                {assignment?.dueDate 
                  ? (() => {
                      const [year, month, day] = assignment.dueDate.split('T')[0].split('-');
                      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      });
                    })()
                  : 'No Date Set'
                }
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-pink-5 text-pink-600 rounded-xl"><HelpCircle size={18} /></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Questions</span>
              <span className="text-sm font-bold text-gray-800 block">{assignment?.generatedQuestions?.length || 0} Items</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-amber-5 text-amber-600 rounded-xl"><Award size={18} /></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Cap</span>
              <span className="text-sm font-bold text-gray-800 block">{calculateTotalMarks()} Marks</span>
            </div>
          </div>
        </section>

        {/* PRIMARY ITERATOR VIEW ENGINE SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              <span>Generated Assessment Material</span>
            </h3>
          </div>

          {!assignment?.generatedQuestions || assignment.generatedQuestions.length === 0 ? (
            <div className="w-full bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl mb-3"><HelpCircle size={24} /></div>
              <p className="text-sm font-bold text-gray-800">No structured assessment questions verified</p>
              <p className="text-xs text-gray-400 mt-0.5">Please check input payloads or trigger manual iteration layers.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {assignment.generatedQuestions.map((q, idx) => {
                // FIXED: Explicit length check array evaluation to resolve the false true MCQ tag bug
                const isMcq = q.type?.toLowerCase() === 'mcq' || (Array.isArray(q.options) && q.options.length > 0);
                
                return (
                  <div 
                    key={idx} 
                    className="w-full bg-white border border-gray-200/80 hover:border-gray-300 rounded-3xl p-5 sm:p-7 transition-all group relative flex flex-col shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold px-2.5 py-1 bg-blue-5 text-blue-600 border border-blue-100 rounded-lg uppercase tracking-wider">
                          Q{idx + 1}.
                        </span>
                        {/* Dynamic multi-type badge mapping layout */}
                        <span className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg uppercase tracking-wider">
                          {(() => {
                            switch(q.type?.toLowerCase()) {
                              case 'mcq': return 'Multiple Choice';
                              case 'short': return 'Short Question';
                              case 'long': return 'Long Essay';
                              case 'numerical': return 'Numerical Problem';
                              default: return isMcq ? 'Multiple Choice' : 'Structured Essay';
                            }
                          })()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-amber-600 bg-amber-5 border border-amber-100 px-2.5 py-1 rounded-lg">
                          {q.marks} Marks
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleCopyQuestion(q.question, idx)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Copy Question Text"
                        >
                          {copiedId === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 tracking-tight leading-relaxed mb-4">
                      {q.question}
                    </h4>

                    {isMcq ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {q.options.map((opt, oIdx) => {
                          const optionPrefix = String.fromCharCode(65 + oIdx); 
                          return (
                            <div 
                              key={oIdx} 
                              className="flex items-center gap-3 bg-gray-50/40 border border-gray-200/70 px-4 py-3 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                              <span className="w-6 h-6 flex items-center justify-center bg-gray-800 text-white font-extrabold text-xs rounded-md shrink-0">
                                {optionPrefix}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {q.answer && (
                      <div className="mt-2 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Correct Answer Key:</span>
                        <span className="text-xs font-extrabold text-green-600 bg-green-5 border border-green-100 px-3 py-1 rounded-lg font-mono">
                          {q.answer}
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}