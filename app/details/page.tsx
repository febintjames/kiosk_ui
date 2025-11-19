'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Details() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must agree to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Store form data in session/context if needed
      localStorage.setItem('userDetails', JSON.stringify(formData));
      router.push('/camera');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-600 via-black to-red-600 font-sans px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white bg-opacity-95 px-12 py-16 rounded-3xl shadow-2xl max-w-xl w-full">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-emerald-600 text-center mb-12">
            Your Details
          </h1>

          {/* Full Name Field */}
          <div className="mb-8">
            <label htmlFor="fullName" className="block text-lg font-semibold text-gray-800 mb-3">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 text-lg border-2 rounded-lg transition-colors focus:outline-none ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-emerald-600'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* WhatsApp Number Field */}
          <div className="mb-8">
            <label htmlFor="whatsappNumber" className="block text-lg font-semibold text-gray-800 mb-3">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="+971 XX XXX XXXX"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 text-lg border-2 rounded-lg transition-colors focus:outline-none ${
                errors.whatsappNumber
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-emerald-600'
              }`}
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm mt-2">{errors.whatsappNumber}</p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-4 mb-10 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className={`w-6 h-6 mt-1 cursor-pointer accent-emerald-600 ${
                errors.consent ? 'border-red-500' : ''
              }`}
            />
            <label htmlFor="consent" className="text-base text-gray-700 leading-relaxed cursor-pointer">
              I agree that my video will be processed using AI for this event experience and may be used for promotional purposes.
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-sm mb-6">{errors.consent}</p>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xl font-bold rounded-full uppercase tracking-wider hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-emerald-600/60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}