'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  familyName?: string;
  mobileNumber?: string;
  otp?: string;
  emailOrMobile?: string;
}

interface SignupPayload {
  userId: string;
  name: string;
  familyName: string;
  email: string;
  password: string;
  userLevel: string;
  roleTypes: string[];
  customFields: any[];
}

interface LoginResponse {
  token: string;
  user: {
    email: string;
    name: string;
    familyName: string;
  };
  message: string;
  success: boolean;
}

interface OtpGeneratePayload {
  type: 'EMAIL' | 'MOBILE';
  email: string | null;
  mobileNumber: string | null;
}

interface OtpResponse {
  token: string | null;
  user: any | null;
  message: string;
  success: boolean;
}

interface OtpValidatePayload {
  type: 'EMAIL' | 'MOBILE';
  email: string | null;
  mobileNumber: string | null;
  otp: string;
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpType, setOtpType] = useState<'EMAIL' | 'MOBILE'>('EMAIL');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    familyName: '',
    mobileNumber: '',
    otp: '',
    emailOrMobile: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Reset function to clear all states
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      familyName: '',
      mobileNumber: '',
      otp: '',
      emailOrMobile: '',
    });
    setErrors({});
    setSuccessMessage(null);
    setOtpSent(false);
    setLoginMethod('password');
    setOtpType('EMAIL');
    setIsLoading(false);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateUserId = () => {
    // Generate a random 8-character alphanumeric string
    return Math.random().toString(36).substring(2, 10);
  };

  const handleLogin = async () => {
    const loginPayload = {
      email: formData.email,
      password: formData.password
    };

    console.log('Attempting login with payload:', loginPayload);

    try {
      // Add timestamp to URL to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:8080/api/auth/login?_=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify(loginPayload),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      console.log('Login successful:', data);
      
      if (data.success && data.token) {
        // Use the utility function to store the token
        setAuthToken(data.token);
        // Store user data if needed
        localStorage.setItem('userData', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const isValidEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const isValidMobileNumber = (value: string) => {
    return /^\d{10}$/.test(value);
  };

  const handleOtpGenerate = async () => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrors({});
      
      const inputValue = formData.emailOrMobile?.trim() || '';
      let payload: OtpGeneratePayload;

      if (isValidEmail(inputValue)) {
        payload = {
          type: 'EMAIL',
          email: inputValue,
          mobileNumber: null
        };
        setOtpType('EMAIL');
      } else if (isValidMobileNumber(inputValue)) {
        payload = {
          type: 'MOBILE',
          email: null,
          mobileNumber: inputValue
        };
        setOtpType('MOBILE');
      } else {
        throw new Error('Please enter a valid email or 10-digit mobile number');
      }

      console.log('Generating OTP with payload:', payload);

      const response = await fetch('http://localhost:8080/api/auth/otp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: OtpResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate OTP');
      }

      if (data.success) {
        setOtpSent(true);
        setSuccessMessage(data.message);
      } else {
        throw new Error(data.message || 'Failed to generate OTP');
      }
    } catch (error) {
      console.error('OTP generation error:', error);
      setErrors({
        emailOrMobile: error instanceof Error ? error.message : 'Failed to generate OTP'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpValidate = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const emailOrMobile = formData.emailOrMobile || '';
      
      const payload: OtpValidatePayload = {
        type: otpType,
        email: otpType === 'EMAIL' ? emailOrMobile : null,
        mobileNumber: otpType === 'MOBILE' ? emailOrMobile : null,
        otp: formData.otp || ''
      };

      console.log('Validating OTP with payload:', payload);

      const response = await fetch('http://localhost:8080/api/auth/otp/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP validation failed');
      }

      if (data.success && data.token) {
        // Store the token
        setAuthToken(data.token);
        onClose();
        router.push('/home');
      } else {
        throw new Error(data.message || 'OTP validation failed');
      }
    } catch (error) {
      console.error('OTP validation error:', error);
      setErrors({
        otp: error instanceof Error ? error.message : 'OTP validation failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, mode:', mode);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const signupPayload: SignupPayload = {
          userId: generateUserId(),
          name: formData.name || '',
          familyName: formData.familyName || '',
          email: formData.email,
          password: formData.password,
          userLevel: 'ADMIN',
          roleTypes: ['ROLE_USER', 'ROLE_ADMIN'],
          customFields: []
        };

        console.log('Attempting signup with payload:', signupPayload);

        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify(signupPayload),
        });

        console.log('Signup response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Signup error:', errorData);
          throw new Error(errorData.message || 'Failed to create account');
        }

        const data = await response.json();
        console.log('Signup successful:', data);
        // After successful signup, automatically log in
        await handleLogin();
        onClose();
        router.push('/home');
      } else {
        // Handle login
        if (loginMethod === 'password') {
          await handleLogin();
        } else {
          await handleOtpValidate();
        }
        onClose();
        router.push('/home');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        [loginMethod === 'password' ? 'email' : 'otp']: error instanceof Error ? error.message : 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (mode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.familyName) {
        newErrors.familyName = 'Family name is required';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email format is invalid';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (loginMethod === 'password') {
        if (!formData.email) {
          newErrors.email = 'Email is required';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        }
      } else if (loginMethod === 'otp') {
        if (!formData.emailOrMobile) {
          newErrors.emailOrMobile = 'Email or mobile number is required';
        } else {
          const value = formData.emailOrMobile.trim();
          if (!isValidEmail(value) && !isValidMobileNumber(value)) {
            newErrors.emailOrMobile = 'Please enter a valid email or 10-digit mobile number';
          }
        }
        if (otpSent && !formData.otp) {
          newErrors.otp = 'OTP is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Dialog.Title
            as="h3"
            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
          >
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'login' && (
              <div className="mb-6">
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password');
                      setOtpSent(false);
                      setErrors({});
                    }}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      loginMethod === 'password'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('otp');
                      setOtpSent(false);
                      setErrors({});
                    }}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      loginMethod === 'otp'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    OTP
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="familyName" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                    Family Name
                  </label>
                  <input
                    type="text"
                    id="familyName"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.familyName ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your family name"
                  />
                  {errors.familyName && (
                    <p className="mt-1 text-sm text-red-400">{errors.familyName}</p>
                  )}
                </div>
              </>
            )}

            {mode === 'login' && (
              <>
                {loginMethod === 'password' ? (
                  <>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.password ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="Enter your password"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group">
                      <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                        Email or Mobile Number
                      </label>
                      <input
                        type="text"
                        id="emailOrMobile"
                        name="emailOrMobile"
                        value={formData.emailOrMobile}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.emailOrMobile ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="Enter email or mobile number"
                        disabled={otpSent}
                      />
                      {errors.emailOrMobile && (
                        <p className="mt-1 text-sm text-red-400">{errors.emailOrMobile}</p>
                      )}
                    </div>

                    {successMessage && (
                      <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                        <p className="text-sm text-green-400">{successMessage}</p>
                      </div>
                    )}

                    {!otpSent ? (
                      <motion.button
                        type="button"
                        onClick={handleOtpGenerate}
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transition-all
                          bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
                          hover:from-purple-500 hover:via-pink-500 hover:to-red-500
                          disabled:opacity-50 disabled:cursor-not-allowed
                          cursor-pointer"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending OTP...
                          </span>
                        ) : (
                          'Get OTP'
                        )}
                      </motion.button>
                    ) : (
                      <>
                        <div className="group">
                          <label htmlFor="otp" className="block text-sm font-medium text-gray-300 group-focus-within:text-purple-400 transition-colors">
                            Enter OTP
                          </label>
                          <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-4 py-3 bg-gray-800/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.otp ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                            }`}
                            placeholder="Enter OTP"
                          />
                          {errors.otp && (
                            <p className="mt-1 text-sm text-red-400">{errors.otp}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setSuccessMessage(null);
                            setFormData(prev => ({ ...prev, otp: '' }));
                          }}
                          className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Change Email/Mobile Number
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || (loginMethod === 'otp' && !otpSent)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transition-all
                relative overflow-hidden group
                ${(isLoading || (loginMethod === 'otp' && !otpSent)) ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
                hover:from-purple-500 hover:via-pink-500 hover:to-red-500`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : mode === 'login' ? (loginMethod === 'password' ? 'Sign In' : 'Verify OTP') : 'Create Account'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                </svg>
                LinkedIn
              </motion.button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
