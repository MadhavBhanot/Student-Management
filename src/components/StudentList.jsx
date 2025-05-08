import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { getAllStudents, getStudentsByCourse, getAvailableCourses } from '../services/firestoreService';
import AuthModal from './AuthModal';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState(['All']);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();

  // Show auth modal if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);

  // Fetch students on component mount
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (currentUser) {
      const fetchStudents = async () => {
        try {
          setLoading(true);
          
          let data;
          if (selectedCourse === 'All') {
            data = await getAllStudents();
          } else {
            data = await getStudentsByCourse(selectedCourse);
          }
          
          setStudents(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching students:', err);
          setError('Failed to fetch students');
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [selectedCourse, currentUser]);

  // Fetch available courses
  useEffect(() => {
    // Only fetch courses if user is authenticated
    if (currentUser) {
      const fetchCourses = async () => {
        try {
          const availableCourses = await getAvailableCourses();
          setCourses(availableCourses);
        } catch (err) {
          console.error('Error fetching courses:', err);
        }
      };

      fetchCourses();
    }
  }, [currentUser]);

  // Handle course filter change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Handle view details click
  const handleViewDetails = (student) => {
    if (!currentUser) {
      // Show login required message
      setShowAuthModal(true);
    } else {
      // Here you would typically navigate to a details page
      alert(`Viewing details for ${student.name}`);
    }
  };

  // Handle modal close attempts
  const handleAuthModalClose = () => {
    // If user is not logged in, don't allow closing the modal
    if (!currentUser) {
      return;
    }
    setShowAuthModal(false);
  };

  // If user is not logged in, show login required screen
  if (!currentUser) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to view student data
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Log In
            </button>
          </div>
        </motion.div>
        <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} canSkip={false} />
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg font-medium">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student Directory</h2>
            
            {/* Course Filter */}
            <div className="flex items-center space-x-3">
              <label htmlFor="course-filter" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Filter by Course:
              </label>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrollment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">GPA</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {students.length > 0 ? (
                  students.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.enrollmentDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.gpa}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No students found. Try changing the filter or add new students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} canSkip={false} />
    </>
  );
};

export default StudentList; 