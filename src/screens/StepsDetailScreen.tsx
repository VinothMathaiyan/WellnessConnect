/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Settings, 
  RefreshCcw, 
  Flame, 
  TrendingUp,
  Activity,
  Check,
  Smartphone,
  Watch,
  X
} from 'lucide-react';
import { Badge } from '../components/Common';

// --- Types & Mock Data ---

interface DailySteps {
  day: string;
  count: number;
  isToday?: boolean;
}

const WEEKLY_DATA: DailySteps[] = [
  { day: 'Mon', count: 8200 },
  { day: 'Tue', count: 10500 },
  { day: 'Wed', count: 9100 },
  { day: 'Thu', count: 7430, isToday: true },
  { day: 'Fri', count: 0 },
  { day: 'Sat', count: 0 },
  { day: 'Sun', count: 0 },
];

const HOURLY_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  active: i >= 7 && i <= 9 ? Math.random() * 100 : i >= 17 && i <= 19 ? Math.random() * 80 : Math.random() * 20
}));

// --- Sub-components ---

const ProgressRing = ({ value, target }: { value: number; target: number }) => {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percentage = Math.min(100, (value / target) * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#F3F4F6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#185FA5"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[32px] font-black text-text-primary leading-none">{value.toLocaleString()}</span>
        <span className="text-[12px] font-medium text-text-secondary mt-1">steps</span>
        <span className="text-[14px] font-bold text-[#185FA5] mt-1">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, unit }: { label: string; value: string; unit: string }) => (
  <div className="flex-1 bg-white border-[0.5px] border-border-light rounded-2xl py-3 px-2 text-center shadow-sm">
    <p className="text-[14px] font-bold text-text-primary leading-none">{value}<span className="text-[10px] ml-0.5">{unit}</span></p>
    <p className="text-[10px] font-medium text-text-secondary mt-1 uppercase tracking-wider opacity-60">{label}</p>
  </div>
);

// --- Main Component ---

export default function StepsDetailScreen({ onBack }: { onBack: () => void }) {
  const [showSyncSheet, setShowSyncSheet] = useState(false);
  const stepGoal = 10000;
  const currentSteps = 7430;
  const stepsLeft = stepGoal - currentSteps;
  const isGoalMet = currentSteps >= stepGoal;

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden flex-1">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b-[0.5px] border-border-light bg-white sticky top-0 z-20">
        <button onClick={onBack} className="p-1 -ml-1 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[17px] font-bold text-text-primary">Steps Tracker</h1>
        <button onClick={() => setShowSyncSheet(true)} className="p-1 -mr-1 active:scale-95 transition-transform opacity-60">
          <Settings size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 py-6 space-y-8 pb-32">
          
          {/* Today's Progress Hero */}
          <section className="flex flex-col items-center space-y-6">
            <ProgressRing value={currentSteps} target={stepGoal} />
            
            <div className="text-center space-y-1">
              {isGoalMet ? (
                <p className="text-[15px] font-bold text-[#185FA5] flex items-center justify-center gap-1.5">
                  Goal reached! Great work today 🎉
                </p>
              ) : (
                <p className="text-[15px] font-bold text-amber">
                  {stepsLeft.toLocaleString()} steps to your daily goal
                </p>
              )}
            </div>

            <div className="w-full bg-white border-[0.5px] border-border-light rounded-2xl p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mb-3 text-center">Today's Breakdown</h3>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-medium text-text-secondary uppercase">Active</span>
                    <span className="text-[12px] font-bold text-text-primary">5,420</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#185FA5] rounded-full" style={{ width: '73%' }} />
                   </div>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-medium text-text-secondary uppercase">Rest</span>
                    <span className="text-[12px] font-bold text-text-primary">2,010</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: '27%' }} />
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <StatPill label="Distance" value="5.4" unit="km" />
              <StatPill label="Calories" value="312" unit="kcal" />
              <StatPill label="Avg Pace" value="12'14" unit="/km" />
            </div>

            <div className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4">
               <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-text-primary">Daily Step Goal</h3>
                  <span className="text-[14px] font-bold text-[#185FA5]">{stepGoal.toLocaleString()}</span>
               </div>
               <input 
                 type="range" min="2000" max="25000" step="500"
                 className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#185FA5]"
                 value={stepGoal}
                 onChange={() => {}} // Just for UI in this mock
               />
               <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-text-secondary">2k</span>
                  <span className="text-[10px] text-text-secondary">Set a stretching goal?</span>
                  <span className="text-[10px] text-text-secondary">25k</span>
               </div>
            </div>

            <button 
              onClick={() => setShowSyncSheet(true)}
              className="flex items-center gap-2 py-1 px-3 rounded-full hover:bg-input-bg transition-colors group"
            >
              <span className="text-[11px] font-medium text-text-secondary opacity-60">
                Data source: <span className="font-bold">Apple Health</span>
              </span>
              <RefreshCcw size={12} className="text-text-secondary opacity-40 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </section>

          {/* Weekly Activity */}
          <section className="space-y-4">
            <div className="flex items-end justify-between px-1">
              <h3 className="text-[16px] font-bold text-text-primary">This week</h3>
              <p className="text-[12px] font-medium text-text-secondary opacity-60 font-mono italic">Avg 6,840 steps/day</p>
            </div>

            <div className="bg-white border-[0.5px] border-border-light rounded-2xl p-5 shadow-sm relative overflow-hidden">
              {/* Goal Line */}
              <div className="absolute left-0 right-0 top-[40%] border-t border-dashed border-border-light z-0 opacity-40">
                <span className="absolute right-2 -top-2.5 text-[8px] font-black text-text-secondary opacity-20 uppercase tracking-widest bg-white px-1">Goal</span>
              </div>

              <div className="flex items-end justify-between h-32 relative z-10 pt-4">
                {WEEKLY_DATA.map((data, i) => {
                  const isFuture = data.count === 0 && !data.isToday;
                  const ratio = data.count / stepGoal;
                  const reachedGoal = data.count >= stepGoal;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 group">
                      <span className="text-[8px] font-bold text-text-secondary opacity-40 mb-1 group-hover:opacity-100 transition-opacity">
                        {data.count > 0 ? (data.count / 1000).toFixed(1) + 'k' : ''}
                      </span>
                      <div className="relative w-8 flex flex-col items-center">
                        {reachedGoal && (
                          <div className="absolute -top-3 w-2 h-2 bg-[#185FA5] rounded-full flex items-center justify-center">
                             <Check size={6} className="text-white" strokeWidth={4} />
                          </div>
                        )}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: isFuture ? 4 : Math.max(4, Math.min(100, ratio * 100)) }}
                          className={`w-full rounded-t-sm transition-colors ${
                            data.isToday ? 'bg-[#185FA5] shadow-[0_-4px_12px_rgba(24,95,165,0.3)]' : 
                            isFuture ? 'bg-input-bg' : 'bg-[#A8DFD0]'
                          }`}
                        />
                      </div>
                      <p className={`text-[10px] font-bold ${data.isToday ? 'text-[#185FA5]' : 'text-text-secondary opacity-40'}`}>
                        {data.day}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Activity Pattern */}
          <section className="space-y-3">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-40">Activity Pattern</h3>
                <span className="text-[11px] font-bold text-[#185FA5]">Most active: 7–8am</span>
             </div>
             <div className="bg-white border-[0.5px] border-border-light rounded-xl p-4 shadow-sm">
                <div className="flex items-end justify-between h-12 gap-0.5">
                   {HOURLY_DATA.map((d, i) => (
                     <div 
                        key={i} 
                        className="flex-1 rounded-t-[1px]" 
                        style={{ 
                          height: `${Math.max(10, d.active)}%`,
                          backgroundColor: d.active < 10 ? '#F3F4F6' : d.active < 40 ? '#D1FAE5' : d.active < 70 ? '#6EE7B7' : '#185FA5' 
                        }}
                     />
                   ))}
                </div>
                <div className="flex justify-between mt-2 px-0.5 opacity-30">
                  <span className="text-[8px] font-bold uppercase">12am</span>
                  <span className="text-[8px] font-bold uppercase">12pm</span>
                  <span className="text-[8px] font-bold uppercase">11pm</span>
                </div>
             </div>
          </section>

          {/* Streak & Insights card */}
          <section className="space-y-4">
            <div className="bg-white border-[0.5px] border-border-light rounded-2xl p-5 shadow-sm space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-amber">
                    <Flame size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-text-primary leading-tight">🔥 4-day streak — keep it going!</h4>
                    <p className="text-[12px] text-text-secondary mt-0.5">Your personal best is a 12-day streak.</p>
                  </div>
               </div>
               <div className="h-[0.5px] bg-border-light w-full" />
               <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#185FA5]">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary leading-relaxed">
                      You walk <span className="font-bold text-[#185FA5]">23% more</span> on weekdays than weekends.
                    </p>
                  </div>
               </div>
            </div>
          </section>

        </div>
      </div>

      {/* Sync Management Bottom Sheet */}
      <AnimatePresence>
        {showSyncSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
              onClick={() => setShowSyncSheet(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[110] px-6 pt-2 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border-light rounded-full mx-auto my-4 opacity-50" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[20px] font-black text-text-primary">Sync Settings</h2>
                <button 
                  onClick={() => setShowSyncSheet(false)}
                  className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center text-text-secondary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[13px] text-text-secondary font-medium px-1">Connect your wearable or health app to sync steps automatically.</p>
                
                <div className="space-y-2">
                  {[
                    { name: 'Apple Health', icon: <Smartphone size={18} />, connected: true },
                    { name: 'Google Fit', icon: <Activity size={18} />, connected: false },
                    { name: 'Fitbit', icon: <Watch size={18} />, connected: false },
                    { name: 'Garmin Connect', icon: <Activity size={18} />, connected: false },
                  ].map((source, i) => (
                    <button 
                      key={source.name}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-[1px] transition-all active:scale-[0.98] ${
                        source.connected ? 'border-primary bg-green-50/30' : 'border-border-light bg-background shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${source.connected ? 'bg-[#185FA5] text-white' : 'bg-white border-[1px] border-border-light text-text-secondary opacity-60'}`}>
                           {source.icon}
                         </div>
                         <span className={`text-[15px] font-bold ${source.connected ? 'text-text-primary' : 'text-text-secondary'}`}>
                           {source.name}
                         </span>
                      </div>
                      {source.connected ? (
                        <div className="flex items-center gap-1.5 text-[#185FA5]">
                          <Check size={16} strokeWidth={3} />
                          <span className="text-[12px] font-black uppercase tracking-wider">Syncing</span>
                        </div>
                      ) : (
                        <span className="text-[12px] font-bold text-text-secondary opacity-40">Connect</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 px-1">
                  <p className="text-[11px] text-text-secondary opacity-40 leading-relaxed italic text-center">
                    Note: Only one data source can be active at a time to prevent duplicate step counts.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
