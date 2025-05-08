import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, signInWithGoogle, error } = useAuth();
  
  // Initialize form
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Handle email/password login or signup
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    const { email, password } = data;
    let success;
    
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await signup(email, password);
    }
    
    setIsLoading(false);
    
    if (success && onClose) {
      onClose();
    }
  };
  
  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const success = await signInWithGoogle();
    setIsLoading(false);
    
    if (success && onClose) {
      onClose();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden"
    >
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
        </h2>
        
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12.545 12.151L12.545 12.151L12.545 12.151C12.545 11.119 12.4391 10.4 12.2471 9.648H6.2031V12.6571H9.8951C9.73711 13.5431 9.0951 14.9211 7.5871 15.8291L7.5711 15.9351L10.8751 18.4971L11.0231 18.5121C12.5671 16.7261 13.4051 14.4461 13.4051 11.7721"
              fill="#4285F4"
            />
            <path
              d="M6.2031 19.8751C8.6611 19.8751 10.7311 18.9811 12.0231 17.5121L7.5871 14.8291C6.9111 15.2991 5.91709 15.6221 4.51709 15.6221C2.0211 15.6221 -0.103897 13.9091 -0.760897 11.5801L-0.870897 11.5881L-3.91389 14.2161L-3.88389 14.3101C-2.4589 17.6041 0.767103 19.8751 4.20309 19.8751"
              fill="#34A853"
            />
            <path
              d="M-0.76091 11.5801C-0.95791 10.8331 -1.0709 10.0421 -1.0709 9.2281C-1.0709 8.4141 -0.95791 7.6231 -0.77591 6.8761L-0.771907 6.7631L-3.8739 4.0891L-3.8839 4.1461C-4.77389 6.0561 -5.2959 8.17611 -5.2959 10.4001C-5.2959 12.6241 -4.77389 14.7441 -3.8839 16.6541L-0.76091 11.5801"
              fill="#FBBC05"
            />
            <path
              d="M4.20309 3.8351C6.1331 3.8351 7.4541 4.6771 8.2881 5.4621L12.2731 1.6121C10.7161 0.183104 8.6611 -0.750896 4.20309 -0.750896C0.767103 -0.750896 -2.4589 1.51611 -3.88389 4.8101L-0.77589 9.8841C-0.103897 7.5551 2.0211 5.8351 4.20309 5.8351"
              fill="#EB4335"
            />
          </svg>
          {isLoading ? 'Loading...' : 'Continue with Google'}
        </button>
        
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <div className="px-4 text-sm text-gray-500 dark:text-gray-400">or</div>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
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
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
              {...register('password', { 
                required: 'Password is required',
                minLength: { 
                  value: 6, 
                  message: 'Password must be at least 6 characters' 
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium focus:outline-none"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
};

export default Login; 