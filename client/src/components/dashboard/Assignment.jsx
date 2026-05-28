import React, { useState, useEffect } from 'react';
import AssignmentEmptyState from './AssignmentEmptyState';
import AssignmentWorkspace from './AssignmentWorkspace';
import { Loader2 } from 'lucide-react';
import api from '../../utils/api';
function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch data here at the parent level
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/assignment/fetch-all');
        console.log(response)

        if (response.data.success) {
          setAssignments(response.data.assignments);
        } else {
          setError(response.data.message || 'Failed to fetch assignments.');
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('Connection to backend failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // State A: Loading Spinner
  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-2" />
        <p className="text-sm font-semibold text-gray-400">Loading workspace...</p>
      </div>
    );
  }

  // State B: Backend Error Handling
  if (error) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-500 font-bold mb-1">Error Loading Assignments</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  // State C: Conditional Render based on array length
  return (
    <div className="w-full flex-1 flex">
      {assignments.length === 0 ? (
        // No assignments? Show the empty layout screen
        <AssignmentEmptyState />
      ) : (
        // Assignments exist? Show the workspace grid and pass down the data via props
        <AssignmentWorkspace initialAssignments={assignments} />
      )}
    </div>
  );
}

export default Assignment;