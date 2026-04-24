/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScoreRevealScreenProps {
  score: number;
  userName: string;
  onViewProgress: () => void;
  onGoHome: () => void;
  answers: {
    pain_score: number | null;
    mobility_score: number | null;
    energy_score: number | null;
    sleep_hours_avg: number | null;
    water_avg_litres: number | null;
    mood_score: number | null;
    free_text?: string;
  };
}

export default function ScoreRevealScreen({ 
  score, 
  userName, 
  onViewProgress, 
  onGoHome,
  answers
}: ScoreRevealScreenProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayScore(Math.floor(progress * score));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const getStatusColor = (s: number) => {
    if (s >= 70) return '#1D9E75'; // green
    if (s >= 40) return '#EF9F27'; // amber
    return '#E24B4A'; // red
  };

  const statusColor = getStatusColor(score);

  const getMessage = (s: number) => {
    if (s >= 80) return `Excellent week, ${userName}! 🎉 You're ready to push harder.`;
    if (s >= 60) return "Good progress this week. Keep the consistency going.";
    if (s >= 40) return "Moderate week — rest and recovery will help.";
    return "Your body needs attention. Your trainer has been notified.";
  };

  const circumference = 2 * Math.PI * 55; // For 120px diameter (60 radius, minus some for stroke)
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-white z-[100] relative">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        
        {/* Animated circular progress arc */}
        <div className="relative w-[125px] h-[125px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth="10"
            />
            {/* Progress Arc */}
            <motion.circle
              cx="60"
              cy="60"
              r="55"
              fill="transparent"
              stroke={statusColor}
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center pt-1">
            <span className="text-[36px] font-bold text-[#111827] leading-none mb-1">
              {displayScore}
            </span>
            <span className="text-[12px] text-[#6B7280] font-medium tracking-tight">Readiness</span>
          </div>
        </div>

        <div className="space-y-4 max-w-[260px]">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-[16px] font-medium text-[#111827] leading-relaxed"
          >
            {getMessage(score)}
          </motion.p>

          {/* Breakdown mini-pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex items-center justify-center gap-2"
          >
            {[
              { label: 'Pain', val: answers.pain_score !== null ? (10 - answers.pain_score) : 'N/A' }, 
              { label: 'Mobility', val: answers.mobility_score ?? 'N/A' },
              { label: 'Energy', val: answers.energy_score ?? 'N/A' }
            ].map((pill, i) => (
              <div key={i} className="flex px-3 py-1.5 bg-[#F3F4F6] rounded-full text-[12px] font-medium text-[#111827]">
                <span className="text-[#6B7280] mr-1">{pill.label}:</span> {pill.val}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 space-y-4">
        <button 
          onClick={onViewProgress}
          className="w-full bg-[#1D9E75] text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#1D9E75]/20"
        >
          View full progress →
        </button>
        <button 
          onClick={onGoHome}
          className="w-full text-[#6B7280] py-2 font-medium text-[14px] hover:text-[#111827] transition-colors"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
