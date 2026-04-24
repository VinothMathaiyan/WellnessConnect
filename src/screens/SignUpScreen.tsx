/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Loader2, MapPin } from 'lucide-react';

interface SignUpScreenProps {
  onSuccess: (data: { 
    full_name: string; 
    mobile: string; 
    email: string;
    privacy_accepted: boolean;
    medical_disclaimer: boolean;
    data_consent: boolean;
  }) => void;
}

export default function SignUpScreen({ onSuccess }: SignUpScreenProps) {
  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
  const [isLocating, setIsLocating] = useState(false);

  // OTP State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validation Logic
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'full_name':
        if (!value) return "Please enter your full name";
        if (value.length < 2) return "Min 2 characters required";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Letters and spaces only";
        return "";
      case 'mobile':
        if (!value) return "Enter a valid 10-digit Indian mobile number";
        if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit Indian mobile number";
        return "";
      case 'email':
        if (!value) return ""; // Non-mandatory
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (name: string) => {
    setIsTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isTouched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const isFormValid = 
    formData.full_name && formData.mobile &&
    !Object.values(errors).some(e => e !== "");

  // Location logic
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, city: "Geolocation not supported" }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap Nominatim for reverse geocoding
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "";
          
          if (city) {
            setFormData(prev => ({ ...prev, city }));
            setErrors(prev => ({ ...prev, city: "" }));
          } else {
            setErrors(prev => ({ ...prev, city: "Could not detect city" }));
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setErrors(prev => ({ ...prev, city: "Error detecting location" }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrors(prev => ({ ...prev, city: "Location permission denied" }));
        setIsLocating(false);
      }
    );
  };

  // OTP Handlers
  const handleSendOtp = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsOtpSent(true);
    setTimer(30);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Check completion
    if (newOtp.every(digit => digit !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };


  const verifyOtp = async (inputOtp: string) => {
    setIsLoading(true);
    setOtpError('');
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (inputOtp === '123456') { // Mock success OTP
      setIsSuccess(true);
      const consentData = {
        ...formData,
        consentTimestamp: new Date().toISOString(),
        privacy_accepted: true,
        medical_disclaimer: true,
        data_consent: true,
        ipLogged: true
      };
      setTimeout(() => onSuccess(consentData as any), 1000);
    } else {
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      if (newAttempts >= 3) {
        setOtpError("Too many attempts. Please request a new OTP.");
      } else {
        setOtpError("Incorrect OTP. Please try again.");
      }
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      {/* Wordmark */}
      <div className="py-6 flex justify-center">
        <h1 className="text-primary font-bold text-xl tracking-tight">WellnessConnect</h1>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-border-light">
        <div className="h-full bg-primary w-1/4 transition-all duration-500" />
      </div>
      <p className="px-6 py-2 text-[12px] text-text-secondary">Step 1 of 4</p>

      {/* Form Section */}
      <div className="flex-1 px-6 pt-4 pb-24 overflow-y-auto space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full name"
            className={`input-field ${errors.full_name ? 'border-red ring-1 ring-red/20' : ''}`}
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            onBlur={() => handleBlur('full_name')}
            disabled={isOtpSent}
          />
          {errors.full_name && <p className="text-red text-[11px] mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            className={`input-field ${errors.mobile ? 'border-red ring-1 ring-red/20' : ''}`}
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            onBlur={() => handleBlur('mobile')}
            disabled={isOtpSent}
          />
          {errors.mobile && <p className="text-red text-[11px] mt-1">{errors.mobile}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            className={`input-field ${errors.email ? 'border-red ring-1 ring-red/20' : ''}`}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isOtpSent}
          />
          {errors.email && <p className="text-red text-[11px] mt-1">{errors.email}</p>}
        </div>

        {/* Consent Block */}
        <div className="pt-2">
          <p className="text-[11px] text-text-secondary leading-relaxed">
            By continuing you agree to our{' '}
            <button className="text-primary font-medium hover:underline">Privacy Policy</button> and{' '}
            <button className="text-primary font-medium hover:underline">Medical Disclaimer</button>.{' '}
            Your consent will be recorded with a timestamp.
          </p>
        </div>

        {/* OTP Entry UI */}
        <AnimatePresence>
          {isOtpSent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-green-light/30 p-4 rounded-xl space-y-4"
            >
              <p className="text-[12px] text-text-primary text-center">Enter 6-digit OTP sent to your mobile</p>
              <div className="flex justify-between gap-2 px-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-10 h-12 text-center bg-white border border-border rounded-lg text-lg font-semibold focus:border-primary outline-none"
                    disabled={isLoading || otpAttempts >= 3}
                  />
                ))}
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-xs text-text-secondary">Resend OTP in 0:{timer < 10 ? `0${timer}` : timer}</p>
                ) : (
                  <button 
                    onClick={handleSendOtp}
                    className="text-primary text-xs font-semibold hover:underline"
                    disabled={isLoading || otpAttempts >= 3}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {otpError && (
                <div className="flex items-center justify-center gap-1.5 text-red">
                  <AlertTriangle size={14} />
                  <p className="text-[11px]">{otpError}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-0 w-full p-6 bg-white border-t border-border-light z-10">
        <button
          onClick={handleSendOtp}
          disabled={!isFormValid || isOtpSent || isLoading}
          className={`btn-primary flex items-center justify-center gap-2 ${
            (!isFormValid || isOtpSent || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : isSuccess ? (
            <CheckCircle2 color="white" size={18} />
          ) : (
            "Send OTP & continue"
          )}
        </button>
      </div>
    </div>
  );
}
