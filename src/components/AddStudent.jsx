import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addStudent } from '../services/firestoreService';
import AuthModal from './AuthModal';

const AddStudent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);
  
  // Handle auth modal close attempts
  const handleAuthModalClose = () => {
    // If user is not logged in, don't allow closing the modal
    if (!currentUser) {
      return;
    }
    setShowAuthModal(false);
  };
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm();
  
  // Available courses - this would typically come from an API
  const availableCourses = [
    'Computer Science',
    'Data Science',
    'Artificial Intelligence',
    'Cybersecurity',
    'Web Development',
    'Network Engineering'
  ];
  
  // Handle form submission
  const onSubmit = async (data) => {
    if (!currentUser) {
      setSubmitError('You must be logged in to add a student');
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Add student to Firestore
      await addStudent({
        ...data,
        addedBy: currentUser.uid,
        addedByEmail: currentUser.email
      });
      
      // Show success message and reset form
      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding student:", error);
      setSubmitError('Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in, show login required message
  if (!currentUser) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10"
        >
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 text-center">
            <svg className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8a3 3 0 00-3-3H6.75a.75.75 0 00-.75.75v7.5c0 .414.336.75.75.75H9m3 0h3.75c.414 0 .75-.336.75-.75v-7.5a.75.75 0 00-.75-.75H12" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You need to be logged in to add new students.</p>
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10"
      >
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Student</h2>
          </div>
          
          <div className="p-6">
            {/* Success message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md">
                Student added successfully!
              </div>
            )}
            
            {/* Error message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: { 
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                      message: 'Invalid email address' 
                    } 
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              {/* Course Field */}
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  id="course"
                  className={`w-full px-4 py-2 border ${errors.course ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  {...register('course', { required: 'Course is required' })}
                >
                  <option value="">Select a course</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && (
                  <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>
                )}
              </div>
              
              {/* GPA Field */}
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GPA (0.0 - 4.0)
                </label>
                <input
                  id="gpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  className={`w-full px-4 py-2 border ${errors.gpa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  {...register('gpa', { 
                    required: 'GPA is required', 
                    min: { value: 0, message: 'GPA must be at least 0' },
                    max: { value: 4, message: 'GPA cannot exceed 4.0' },
                    valueAsNumber: true 
                  })}
                />
                {errors.gpa && (
                  <p className="mt-1 text-sm text-red-500">{errors.gpa.message}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Add Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} canSkip={false} />
    </>
  );
};

export default AddStudent; 