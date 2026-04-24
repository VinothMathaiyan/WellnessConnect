/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/Common';

interface CheckInAnswers {
  mobility: number | null;
  pain: number | null;
  sleep: number | null;
  sessions: number | null;
  risk: number | null;
}

interface CheckInResultSubScreenProps {
  score: number;
  answers: CheckInAnswers;
  trainerName: string;
  onGoHome: () => void;
}

export default function CheckInResultSubScreen({ score, answers, trainerName, onGoHome }: CheckInResultSubScreenProps) {
  const getRiskFeedback = () => {
    if (answers.risk === 0) return { text: "Red flag detected — assessment team notified", color: "text-red", icon: <AlertTriangle size={18} /> };
    if (answers.risk === 2) return { text: "Yellow flag — trainer has been alerted", color: "text-amber", icon: <AlertTriangle size={18} /> };
    return { text: "No injury risk detected ✓", color: "text-primary", icon: <CheckCircle2 size={18} /> };
  };

  const risk = getRiskFeedback();

  // Score breakdown percentages for dimensions
  const dimensions = [
    { label: "Mobility", weight: 0.25, val: answers.mobility ?? 0 },
    { label: "Pain Stability", weight: 0.25, val: answers.pain ?? 0 },
    { label: "Recovery", weight: 0.20, val: answers.sleep ?? 0 },
    { label: "Attendance", weight: 0.20, val: answers.sessions ?? 0 },
    { label: "Safety", weight: 0.10, val: answers.risk ?? 0 }
  ];

  return (
    <div className="flex flex-col h-full bg-background relative px-6 py-10 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center text-primary">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="text-[20px] font-bold text-text-primary">Check-in submitted</h2>
          <p className="text-[13px] text-text-secondary leading-relaxed px-4">
            Your readiness score has been updated. {trainerName} will review it before your next session.
          </p>
        </div>

        {/* Updated Score Card */}
        <section className="w-full bg-white rounded-2xl p-6 shadow-sm border border-border-light">
          <p className="text-[11px] font-bold text-text-secondary tracking-widest label-caps mb-2">UPDATED READINESS SCORE</p>
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold text-primary leading-none">{score}</span>
            <div className={`flex items-center gap-2 mt-4 text-[12px] font-semibold ${risk.color} bg-opacity-10 px-3 py-1.5 rounded-full`}>
              {risk.icon}
              {risk.text}
            </div>
          </div>
        </section>

        {/* Score Breakdown Card */}
        <section className="w-full bg-white rounded-2xl p-6 shadow-sm border border-border-light space-y-5 text-left">
          <div className="flex justify-between items-center bg-input-bg -mx-6 -mt-6 px-6 py-3 rounded-t-2xl">
            <h3 className="text-[11px] font-bold text-text-secondary tracking-widest label-caps">SCORE BREAKDOWN</h3>
            <span className="text-[10px] text-text-secondary opacity-60">ENGINE 5.1</span>
          </div>

          <div className="space-y-4">
            {dimensions.map((dim, i) => {
              // Contribution to final score: (val * weight * 20) / score * 100
              // Actually just show val / 5 percentage bars for each dimension's performance
              const percentage = (dim.val / 5) * 100;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-medium">
                    <span className="text-text-primary">{dim.label}</span>
                    <span className="text-text-secondary opacity-80">{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-input-bg rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${percentage > 80 ? 'bg-primary' : percentage > 40 ? 'bg-amber' : 'bg-red'}`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <button 
          onClick={onGoHome}
          className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-2 group"
        >
          Back to home
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
