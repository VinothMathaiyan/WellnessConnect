/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  Moon, 
  Droplets, 
  Zap, 
  Check
} from 'lucide-react';

interface CheckInAnswers {
  pain_score: number | null;
  mobility_score: number | null;
  sleep_hours_avg: number | null;
  water_avg_litres: number | null;
  energy_score: number | null;
  mood_score: number | null;
  free_text: string;
}

interface WeeklyCheckInScreenProps {
  onBack: () => void;
  onSubmit: (score: number, answers: any) => void;
  initialStep?: number;
  isStatic?: boolean;
}

const PAIN_OPTIONS = [
  { emoji: '😌', label: 'None', score: 0, color: '#1D9E75', bg: 'rgba(29,158,117,0.10)' },
  { emoji: '😐', label: 'Mild', score: 2, color: '#84CC16', bg: 'rgba(132,204,22,0.10)' },
  { emoji: '😕', label: 'Moderate', score: 5, color: '#EF9F27', bg: 'rgba(239,159,39,0.10)' },
  { emoji: '😣', label: 'High', score: 7, color: '#F97316', bg: 'rgba(249,115,22,0.10)' },
  { emoji: '😫', label: 'Severe', score: 10, color: '#E24B4A', bg: 'rgba(226,75,74,0.10)' },
];

const ENERGY_OPTIONS = [
  { label: 'Drained', score: 2, bolts: 1, color: '#EF9F27' },
  { label: 'Low', score: 4, bolts: 2, color: '#FCD34D' },
  { label: 'Moderate', score: 6, bolts: 3, color: '#84CC16' },
  { label: 'Good', score: 8, bolts: 4, color: '#22C55E' },
  { label: 'Excellent', score: 10, bolts: 5, color: '#1D9E75' },
];

const MOOD_OPTIONS = [
  { emoji: '😞', label: 'Very low', desc: 'Feeling low', score: 1, border: '#E5E7EB', selectedBg: '#FEF2F2', selectedBorder: '#E24B4A' },
  { emoji: '😐', label: 'Low', desc: 'Below average', score: 2, border: '#E5E7EB', selectedBg: '#FEF9C3', selectedBorder: '#EF9F27' },
  { emoji: '😊', label: 'Neutral', desc: 'Getting by', score: 3, border: '#E5E7EB', selectedBg: '#F0FDF4', selectedBorder: '#84CC16' },
  { emoji: '😄', label: 'Good', desc: 'Feeling positive', score: 4, border: '#E5E7EB', selectedBg: '#E1F5EE', selectedBorder: '#1D9E75' },
  { emoji: '🤩', label: 'Great', desc: 'On top of the world', score: 5, border: '#E5E7EB', selectedBg: '#D1FAE5', selectedBorder: '#1D9E75' },
];

const MOOD_TIPS: Record<number, { emoji: string, bg: string, message: string }> = {
  1: { emoji: '💛', bg: '#FEF9C3', message: "Your trainer can see this. It's okay to have tough weeks." },
  2: { emoji: '💛', bg: '#FEF9C3', message: "Hang in there. Small steps forward still count." },
  3: { emoji: '🌿', bg: '#F0FDF4', message: "Steady and consistent — that's progress too." },
  4: { emoji: '👏', bg: '#E1F5EE', message: "Great mindset heading into next week!" },
  5: { emoji: '🎉', bg: '#D1FAE5', message: "Brilliant! Keep this energy going into next week." },
};

const SUGGESTION_CHIPS = [
  "Knee felt sore", 
  "Great energy this week", 
  "Struggled with sleep", 
  "Feeling stronger"
];

export default function WeeklyCheckInScreen({ onBack, onSubmit, initialStep = 1, isStatic = false }: WeeklyCheckInScreenProps) {
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSleepOverride, setShowSleepOverride] = useState(false);
  const [showWaterOverride, setShowWaterOverride] = useState(false);
  const [showMoodTip, setShowMoodTip] = useState(false);
  const [dismissedTip, setDismissedTip] = useState(false);

  const [answers, setAnswers] = useState<CheckInAnswers>({
    pain_score: null,
    mobility_score: 5,
    sleep_hours_avg: 6.8,
    water_avg_litres: 1.9,
    energy_score: null,
    mood_score: null,
    free_text: ''
  });

  useEffect(() => {
    if (answers.mood_score !== null) {
      const timer = setTimeout(() => setShowMoodTip(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowMoodTip(false);
    }
  }, [answers.mood_score]);

  const scoreValue = useMemo(() => {
    const { pain_score, energy_score, mobility_score, mood_score } = answers;
    let components = [];
    if (pain_score !== null) components.push((10 - pain_score) * 10);
    if (energy_score !== null) components.push(energy_score * 10);
    if (mobility_score !== null) components.push(mobility_score * 10);
    if (mood_score !== null) components.push((mood_score / 5) * 100);
    
    if (components.length === 0) return null;
    return Math.round(components.reduce((a, b) => a + b, 0) / components.length);
  }, [answers]);

  const getScoreColor = (s: number | null) => {
    if (s === null) return '#9CA3AF';
    if (s >= 70) return '#1D9E75';
    if (s >= 40) return '#EF9F27';
    return '#E24B4A';
  };

  const isStepValid = () => {
    if (step === 1) return answers.pain_score !== null && answers.mobility_score !== null;
    if (step === 2) return answers.energy_score !== null;
    if (step === 3) return answers.mood_score !== null;
    return true; 
  };

  const handleNext = () => {
    if (isStatic) return;
    if (step < 4) {
      setDirection(1);
      setStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit(scoreValue || 0, answers);
      }, 1000);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className={`flex flex-col h-full bg-white relative overflow-hidden ${isStatic ? '' : 'max-w-[390px] mx-auto shadow-2xl'}`} style={isStatic ? {} : { height: '844px', borderRadius: '40px' }}>
      {/* GLOBAL SHELL 1: Top Bar */}
      <header className="h-[52px] px-4 grid grid-cols-[40px_1fr_56px] items-center bg-white shrink-0">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="w-[44px] h-[44px] -ml-[12px] flex items-center justify-center text-[#374151] active:opacity-60"
            disabled={isStatic}
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center text-center">
          <h1 className="text-[15px] font-semibold text-[#111827] truncate">Weekly Check-in</h1>
        </div>
        <div className="flex items-center justify-end min-w-[56px] pr-1">
          <span className="text-[13px] text-[#6B7280] whitespace-nowrap text-right">{step} of 4</span>
        </div>
      </header>

      {/* GLOBAL SHELL 2: Progress Bar */}
      <div className="flex w-full h-[4px] gap-[2px] bg-white">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 h-full bg-[#E5E7EB] relative">
            {(step > s) && (
              <div className="absolute inset-0 bg-[#1D9E75]" />
            )}
            {(step === s) && (
              <div className="absolute inset-0 bg-[#1D9E75]">
                <style>{`
                  @keyframes shimmer {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                  }
                `}</style>
                <div style={{ width: '100%', height: '100%', animation: 'shimmer 1.5s infinite ease-in-out' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GLOBAL SHELL 3: Readiness Score Chip */}
      <div className="mt-[10px] px-5 flex justify-end shrink-0">
        <div className="h-[28px] rounded-[14px] px-3 border border-[#E5E7EB] bg-white flex items-center gap-1 shadow-sm shrink-0">
          <span className="text-[10px] text-[#9CA3AF]">Readiness</span>
          <span 
            className="text-[13px] font-semibold tabular-nums"
            style={{ color: getScoreColor(scoreValue) }}
          >
            {scoreValue ?? '--'}
          </span>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto px-5 pt-5 pb-[100px] no-scrollbar">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full flex flex-col"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827] mb-[4px]">How does your body feel?</h2>
                  <p className="text-[12px] text-[#6B7280]">This week's physical signals</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[13px] font-semibold text-[#111827]">Pain level this week</label>
                    <p className="text-[11px] text-[#9CA3AF] mt-[2px]">Think about any aches, soreness or discomfort</p>
                  </div>
                  <div className="flex justify-between w-full gap-[6px]">
                    {PAIN_OPTIONS.map((opt) => (
                      <div key={opt.score} className="flex-1 min-w-0 flex justify-center">
                        <button
                          onClick={() => !isStatic && setAnswers({...answers, pain_score: opt.score})}
                          className={`w-full max-w-[62px] h-[68px] rounded-[10px] flex flex-col items-center justify-center transition-all ${
                            answers.pain_score === opt.score 
                              ? `border-[1.5px]` 
                              : 'bg-white border-[0.5px] border-[#E5E7EB]'
                          }`}
                          style={{
                            backgroundColor: answers.pain_score === opt.score ? opt.bg : '#FFFFFF',
                            borderColor: answers.pain_score === opt.score ? opt.color : '#E5E7EB'
                          }}
                        >
                          <motion.span 
                            animate={{ scale: answers.pain_score === opt.score ? 1.15 : 1 }}
                            className="text-[28px] leading-none mb-[6px]"
                          >
                            {opt.emoji}
                          </motion.span>
                          <span className="text-[10px] text-[#6B7280]">{opt.label}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-semibold text-[#111827]">How is your movement and flexibility?</label>
                    <p className="text-[11px] text-[#9CA3AF] mt-[2px]">Range of motion, stiffness, ease of movement</p>
                  </div>
                  
                  <div className="relative h-[60px] flex items-center">
                    {/* Floating pill above thumb */}
                    <div 
                      className="absolute top-[2px] transform -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none" 
                      style={{ left: `${(answers.mobility_score || 0) * 10}%` }}
                    >
                      <div className="bg-[#1D9E75] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[10px] shadow-sm whitespace-nowrap">
                        {answers.mobility_score}
                      </div>
                    </div>

                    <div className="relative w-full h-[6px] bg-[#E5E7EB] rounded-[3px] mt-[10px]">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#1D9E75] rounded-[3px]"
                        style={{ width: `${(answers.mobility_score || 0) * 10}%` }}
                      />
                    </div>

                    <div 
                      className="absolute top-[37px] w-[26px] h-[26px] bg-white border-2 border-[#1D9E75] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)] transform -translate-x-1/2 -translate-y-1/2" 
                      style={{ left: `${(answers.mobility_score || 0) * 10}%` }}
                    />

                    <input 
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={answers.mobility_score || 5}
                      onChange={(e) => !isStatic && setAnswers({...answers, mobility_score: parseInt(e.target.value)})}
                      className="absolute top-[37px] left-0 w-full h-[6px] opacity-0 cursor-pointer z-30 translate-y-[-13px]"
                    />

                    <div className="absolute top-[54px] w-full flex justify-between">
                      <span className="text-[10px] text-[#9CA3AF]">Very stiff</span>
                      <span className="text-[10px] text-[#9CA3AF]">Moderate</span>
                      <span className="text-[10px] text-[#9CA3AF]">Full range</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827] mb-[4px]">How did you recover?</h2>
                  <p className="text-[12px] text-[#6B7280]">Sleep and hydration pulled from your logs</p>
                </div>

                {/* Field 3 — Sleep */}
                <div className="space-y-2">
                  <div className="bg-[#F0F9FF] rounded-[12px] p-[14px_16px] flex flex-row items-center gap-[12px] w-full">
                    <div className="w-[44px] h-[44px] shrink-0 bg-[#DBEAFE] rounded-[10px] flex items-center justify-center text-[22px]">
                      🌙
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#6B7280]">Avg sleep this week</p>
                      <h4 className="text-[18px] font-semibold text-[#111827] mt-[2px] truncate whitespace-nowrap">6.8 hrs</h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-[2px]">Based on your daily logs</p>
                    </div>
                    <div className="shrink-0 px-[10px] py-[4px] bg-[#D1FAE5] rounded-full">
                      <span className="text-[11px] font-semibold text-[#065F46]">✓ Synced</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => !isStatic && setShowSleepOverride(!showSleepOverride)}
                    className="text-[11px] font-semibold text-[#1D9E75] mt-2 block"
                  >
                    Adjust manually →
                  </button>
                  <AnimatePresence>
                    {showSleepOverride && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center justify-center gap-8 py-3 overflow-hidden"
                      >
                        <button 
                          onClick={() => setAnswers({...answers, sleep_hours_avg: Math.max(0, (answers.sleep_hours_avg || 0) - 0.25)})}
                          className="w-[32px] h-[32px] rounded-full border border-[#E5E7EB] flex items-center justify-center active:bg-gray-50"
                        >
                          <span className="text-[14px]">−</span>
                        </button>
                        <span className="text-[14px] font-semibold text-[#111827]">{answers.sleep_hours_avg} hrs</span>
                        <button 
                          onClick={() => setAnswers({...answers, sleep_hours_avg: Math.min(24, (answers.sleep_hours_avg || 0) + 0.25)})}
                          className="w-[32px] h-[32px] rounded-full border border-[#E5E7EB] flex items-center justify-center active:bg-gray-50"
                        >
                          <span className="text-[14px]">+</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Field 4 — Water */}
                <div className="space-y-2">
                  <div className="bg-[#F0F9FF] rounded-[12px] p-[14px_16px] flex flex-row items-center gap-[12px] w-full">
                    <div className="w-[44px] h-[44px] shrink-0 bg-[#DBEAFE] rounded-[10px] flex items-center justify-center text-[22px]">
                      💧
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#6B7280]">Avg daily water this week</p>
                      <h4 className="text-[18px] font-semibold text-[#111827] mt-[2px] truncate whitespace-nowrap">1.9 L / day</h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-[2px]">Based on your daily logs</p>
                    </div>
                    <div className="shrink-0 px-[10px] py-[4px] bg-[#D1FAE5] rounded-full">
                      <span className="text-[11px] font-semibold text-[#065F46]">✓ Synced</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => !isStatic && setShowWaterOverride(!showWaterOverride)}
                    className="text-[11px] font-semibold text-[#1D9E75] mt-2 block"
                  >
                    Adjust manually →
                  </button>
                  <AnimatePresence>
                    {showWaterOverride && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center justify-center gap-8 py-3 overflow-hidden"
                      >
                        <button 
                           onClick={() => setAnswers({...answers, water_avg_litres: Math.max(0, (answers.water_avg_litres || 0) - 0.25)})}
                          className="w-[32px] h-[32px] rounded-full border border-[#E5E7EB] flex items-center justify-center active:bg-gray-50"
                        >
                          <span className="text-[14px]">−</span>
                        </button>
                        <span className="text-[14px] font-semibold text-[#111827]">{answers.water_avg_litres} L</span>
                        <button 
                          onClick={() => setAnswers({...answers, water_avg_litres: Math.min(5, (answers.water_avg_litres || 0) + 0.25)})}
                          className="w-[32px] h-[32px] rounded-full border border-[#E5E7EB] flex items-center justify-center active:bg-gray-50"
                        >
                          <span className="text-[14px]">+</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Field 5 — Energy Level */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[13px] font-semibold text-[#111827]">How is your energy and recovery feeling?</label>
                    <p className="text-[11px] text-[#9CA3AF] mt-[2px]">Your subjective sense of how recovered you feel</p>
                  </div>
                  <div className="flex justify-between w-full gap-[6px]">
                    {ENERGY_OPTIONS.map((opt) => (
                      <div key={opt.score} className="flex-1 min-w-0 flex justify-center">
                        <button
                          onClick={() => !isStatic && setAnswers({...answers, energy_score: opt.score})}
                          className={`w-full max-w-[62px] h-[68px] rounded-[10px] flex flex-col items-center justify-center transition-all ${
                            answers.energy_score === opt.score 
                              ? `border-[1.5px]` 
                              : 'bg-white border-[0.5px] border-[#E5E7EB]'
                          }`}
                          style={{
                            backgroundColor: answers.energy_score === opt.score ? `${opt.color}1A` : '#FFFFFF',
                            borderColor: answers.energy_score === opt.score ? opt.color : '#E5E7EB'
                          }}
                        >
                          <div className="flex gap-[1px] mb-[6px]">
                            {[...Array(opt.bolts)].map((_, i) => (
                              <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={answers.energy_score === opt.score ? opt.color : '#D1D5DB'}>
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                              </svg>
                            ))}
                          </div>
                          <span 
                            className="text-[10px] text-[#6B7280]"
                          >
                            {opt.label}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827] mb-[4px]">How is your mood?</h2>
                  <p className="text-[12px] text-[#6B7280]">Your mental and emotional state this week</p>
                </div>

                <div className="flex flex-col gap-2">
                  {MOOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.score}
                      onClick={() => !isStatic && setAnswers({...answers, mood_score: opt.score})}
                      className={`min-h-[52px] w-full px-[14px] rounded-[10px] flex flex-row items-center transition-all ${
                        answers.mood_score === opt.score ? 'border-[1.5px]' : 'border-[0.5px] border-[#E5E7EB]'
                      }`}
                      style={{
                        backgroundColor: answers.mood_score === opt.score ? opt.selectedBg : '#FFFFFF',
                        borderColor: answers.mood_score === opt.score ? opt.selectedBorder : '#E5E7EB'
                      }}
                    >
                      <span className="text-[24px] mr-[12px]">{opt.emoji}</span>
                      <div className="flex-1 text-left flex items-center overflow-hidden">
                        <span className="text-[13px] font-semibold text-[#111827] whitespace-nowrap">{opt.label}</span>
                        <span className="text-[11px] text-[#9CA3AF] mx-1">·</span>
                        <span className="text-[11px] text-[#6B7280] truncate">{opt.desc}</span>
                      </div>
                      {answers.mood_score === opt.score && (
                        <Check size={16} className="text-[#1D9E75] ml-2 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showMoodTip && answers.mood_score !== null && !dismissedTip && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-[12px_14px] rounded-[10px] mt-[12px] relative flex items-start gap-2"
                      style={{ backgroundColor: MOOD_TIPS[answers.mood_score].bg }}
                    >
                      <button 
                        onClick={() => setDismissedTip(true)}
                        className="absolute right-[10px] top-[10px] text-[#9CA3AF]"
                      >
                         <X size={14} />
                      </button>
                      <span className="text-sm shrink-0">{MOOD_TIPS[answers.mood_score].emoji}</span>
                      <p className="text-[12px] text-[#374151] pr-4 leading-normal">
                        {MOOD_TIPS[answers.mood_score].message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827] mb-[4px]">Anything to tell your trainer?</h2>
                  <p className="text-[12px] text-[#6B7280]">Optional — they'll read this before your next session</p>
                </div>

                <div className="space-y-3">
                  <div className="relative border border-[#D1D5DB] rounded-[10px] bg-white overflow-hidden transition-all duration-300">
                    <textarea 
                      placeholder="Any wins, concerns, pain, or things you want to focus on…"
                      className="w-full p-[12px_14px] text-[14px] placeholder:italic placeholder:text-[#9CA3AF] outline-none min-h-[120px] focus:min-h-[180px] transition-all duration-300"
                      value={answers.free_text}
                      onChange={(e) => !isStatic && setAnswers({...answers, free_text: e.target.value.slice(0, 1000)})}
                    />
                    <div className="absolute bottom-2 right-3 text-[11px] font-medium" style={{ color: answers.free_text.length >= 1000 ? '#E24B4A' : answers.free_text.length >= 900 ? '#EF9F27' : '#9CA3AF' }}>
                      {answers.free_text.length} / 1000
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    <style>{`
                      .no-scrollbar {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                      }
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {SUGGESTION_CHIPS.map(chip => (
                      <button
                        key={chip}
                        onClick={() => !isStatic && setAnswers({...answers, free_text: answers.free_text ? `${answers.free_text} ${chip}` : chip})}
                        className="whitespace-nowrap h-8 px-[14px] border border-[#D1D5DB] rounded-full bg-white text-[12px] text-[#374151] active:bg-gray-50 transition-colors shrink-0"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* GLOBAL SHELL 5: Bottom CTA */}
      <footer className="absolute bottom-0 left-0 right-0 p-[0_20px_24px_20px] bg-white pt-2">
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting || (isStatic && step !== 4)}
          className={`w-full h-[52px] rounded-[12px] flex items-center justify-center font-semibold text-[16px] transition-all active:scale-[0.98] ${
            !isStepValid() || isSubmitting 
              ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed' 
              : 'bg-[#1D9E75] text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-[16px] h-[16px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting…</span>
            </div>
          ) : (
            <span>{step === 4 ? 'Submit check-in' : 'Next →'}</span>
          )}
        </button>
      </footer>
    </div>
  );
}
