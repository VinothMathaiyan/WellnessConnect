/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info,
  Award,
  Calendar,
  X,
  Loader2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TrainerShortlistEntry, fetchTrainerShortlist, submitTrainerSelection } from '../services/trainerService';
import { Badge } from '../components/Common';

interface TrainerSelectionScreenProps {
  clientId: string;
  onBack: () => void;
  onSuccess: (trainerName: string) => void;
}

type ScreenState = 'LOADING' | 'READY' | 'TRAINER_DETAIL' | 'CONFIRM_MODAL' | 'SUBMITTING' | 'SUCCESS' | 'WAITING' | 'ERROR_CAPACITY';

export default function TrainerSelectionScreen({ clientId, onBack, onSuccess }: TrainerSelectionScreenProps) {
  const [state, setState] = useState<ScreenState>('LOADING');
  const [shortlist, setShortlist] = useState<TrainerShortlistEntry[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerShortlistEntry | null>(null);
  const [isWhyExpandOpen, setIsWhyExpandOpen] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    loadShortlist();
  }, [clientId]);

  async function loadShortlist() {
    setState('LOADING');
    try {
      const data = await fetchTrainerShortlist(clientId);
      if (data.length === 0) {
        setState('WAITING');
      } else {
        setShortlist(data);
        setState('READY');
      }
    } catch (error: any) {
      // Handle 404/403/409 specific errors here
      setState('WAITING');
    }
  }

  const handleConfirmSelection = async () => {
    if (!selectedTrainer) return;
    
    setState('SUBMITTING');
    try {
      await submitTrainerSelection(clientId, selectedTrainer.trainer_id);
      setState('SUCCESS');
      setTimeout(() => {
        onSuccess(selectedTrainer.full_name);
      }, 1500);
    } catch (error: any) {
      if (error.message === 'trainer_at_capacity') {
        setState('ERROR_CAPACITY');
        // Refresh list
        loadShortlist();
      } else {
        setState('READY');
        // Generic error
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#1D9E75';
    if (score >= 70) return '#EF9F27';
    return '#6B7280';
  };

  if (state === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">Matching you with trainers...</p>
          <p className="text-xs text-text-secondary leading-relaxed">Our A3 algorithm is ranking experts based on your mobility goals and city.</p>
        </div>
      </div>
    );
  }

  if (state === 'WAITING') {
    return (
      <div className="flex flex-col h-full bg-white">
        <header className="px-4 py-4 border-b border-border-light flex items-center">
          <button onClick={onBack} className="p-1 -ml-1 text-text-primary"><ChevronLeft size={24} /></button>
          <h1 className="flex-1 text-center font-semibold text-[18px] mr-6">Find a Trainer</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-light flex items-center justify-center text-amber">
            <Clock size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-text-primary">Shortlist in preparation</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our assessment team is reviewing your profile. You'll get a notification once it's ready.
            </p>
          </div>
          <button onClick={onBack} className="btn-primary w-full max-w-[240px]">Go back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative overflow-hidden">
      {/* Top Bar */}
      <header className={`px-4 py-4 flex items-center transition-colors sticky top-0 z-40 ${state === 'READY' ? 'bg-primary text-white' : 'bg-white text-text-primary border-b border-border-light'}`}>
        <button 
          onClick={() => {
            if (state === 'TRAINER_DETAIL') setState('READY');
            else onBack();
          }} 
          className="p-1 -ml-1"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-[18px] mr-6">
          {state === 'TRAINER_DETAIL' ? 'Trainer Profile' : 'Find a Trainer'}
        </h1>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {state === 'READY' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            {/* Header Chips */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 p-1 overflow-x-auto scrollbar-hide">
                <span className="bg-white border border-border-light px-3 py-1 rounded-full text-[11px] font-medium text-text-secondary flex items-center gap-1.5 whitespace-nowrap">
                  <MapPin size={12} className="text-primary" /> Chennai
                </span>
                <span className="bg-white border border-border-light px-3 py-1 rounded-full text-[11px] font-medium text-text-secondary flex items-center gap-1.5 whitespace-nowrap">
                  <Award size={12} className="text-primary" /> Strength
                </span>
                <span className="bg-white border border-border-light px-3 py-1 rounded-full text-[11px] font-medium text-text-secondary flex items-center gap-1.5 whitespace-nowrap">
                  <Loader2 size={12} className="text-primary" /> Intermediate
                </span>
              </div>
              <p className="text-[13px] font-medium px-1">{shortlist.length} trainers matched to your profile</p>
            </div>

            {/* List */}
            <div className="space-y-4">
              {shortlist.map((trainer) => (
                <button
                  key={trainer.trainer_id}
                  onClick={() => {
                    setSelectedTrainer(trainer);
                    setState('TRAINER_DETAIL');
                  }}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-border-light flex gap-4 text-left group active:scale-[0.98] transition-all"
                >
                  <img 
                    src={trainer.photo_url} 
                    alt={trainer.full_name} 
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[15px] font-bold text-text-primary leading-none truncate pr-2">{trainer.full_name}</h3>
                      <div className="flex items-center gap-1" style={{ color: getScoreColor(trainer.match_score) }}>
                        <span className="text-[13px] font-bold">{trainer.match_score}%</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-text-secondary mb-3">{trainer.specialisations?.[0]} · {trainer.city}</p>
                    <div className="flex items-center gap-4 text-[10px] text-text-secondary font-medium">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber fill-amber" />
                        <span>{trainer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{trainer.review_count} sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>{trainer.client_slots_available} slots</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {trainer.match_reasons.map((reason, i) => (
                        <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded leading-none">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Why Expandable */}
            <div className="pt-4 pb-20">
              <button 
                onClick={() => setIsWhyExpandOpen(!isWhyExpandOpen)}
                className="w-full flex items-center justify-between text-text-secondary py-2 px-1"
              >
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-primary" />
                  <span className="text-[13px] font-medium">Why these trainers?</span>
                </div>
                <motion.div animate={{ rotate: isWhyExpandOpen ? 180 : 0 }}>
                  <ChevronLeft size={16} className="-rotate-90" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isWhyExpandOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white rounded-xl p-4 mt-2 border border-border-light border-dashed">
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        Our matching engine (A3) ranks trainers based on your physical goals, 
                        city location for possible in-person sessions, and shared availability 
                        slots. We only show you experts with proven success in your required fitness category.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {state === 'TRAINER_DETAIL' && selectedTrainer && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            className="flex flex-col bg-white"
          >
            <div className="p-6 space-y-8 pb-32">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={selectedTrainer.photo_url} 
                  alt={selectedTrainer.full_name} 
                  className="w-32 h-32 rounded-3xl object-cover shadow-xl mb-6 ring-4 ring-primary/5"
                  referrerPolicy="no-referrer"
                />
                <h2 className="text-2xl font-bold text-text-primary mb-1">{selectedTrainer.full_name}</h2>
                <p className="text-primary font-semibold text-sm">{selectedTrainer.specialisations.join(' & ')}</p>
                <div className="flex items-center gap-3 mt-3 text-text-secondary text-sm">
                  <div className="flex items-center gap-1"><MapPin size={14} /> {selectedTrainer.city}</div>
                  <div className="w-[1px] h-3 bg-border" />
                  <div className="flex items-center gap-1"><Star size={14} className="text-amber fill-amber" /> {selectedTrainer.rating}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-3">Specialisations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialisations.map(s => <Badge key={s} text={s} color="blue" />)}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-3">Certifications</h3>
                  <p className="text-sm text-text-primary font-medium">{selectedTrainer.certifications.join('  ·  ')}</p>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-3">Availability</h3>
                  <div className="bg-[#F9FAFB] p-4 rounded-xl border border-border-light space-y-3">
                    <p className="text-[13px] text-text-primary font-medium">{selectedTrainer.availability_summary}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                        <CheckCircle2 size={14} className="text-primary" /> Virtual
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                        <CheckCircle2 size={14} className="text-primary" /> In-person
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-3">Why we matched you</h3>
                  <div className="space-y-3">
                    {selectedTrainer.match_reasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-3 text-[13px] text-text-primary font-medium">
                        <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-primary" />
                        </div>
                        {reason === "Strength match" ? "✓ Strength specialisation match" : 
                         reason === "Chennai" ? "✓ Same city (Chennai)" :
                         reason === "Evening slots" ? "✓ Evening slots available" : `✓ ${reason}`}
                      </div>
                    ))}
                    <div className="flex items-center gap-3 text-[13px] text-text-primary font-medium">
                      <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-primary" />
                      </div>
                      ✓ {selectedTrainer.client_slots_available} client slots remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Selection Bar */}
            <div className="absolute bottom-0 w-full p-6 bg-white border-t border-border-light z-40 pb-10">
              <button 
                onClick={() => setState('CONFIRM_MODAL')}
                className="w-full btn-primary h-[54px] shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
              >
                Select This Trainer
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Bottom Sheet */}
      <AnimatePresence>
        {state === 'CONFIRM_MODAL' && selectedTrainer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-[60]"
              onClick={() => setState('TRAINER_DETAIL')}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 w-full bg-white rounded-t-[32px] z-[70] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border-light rounded-full mx-auto mb-8" />
              <h3 className="text-[20px] font-bold text-text-primary mb-8 text-center">Confirm your trainer</h3>
              
              <div className="flex items-center gap-4 bg-[#F9FAFB] p-5 rounded-2xl border border-border-light mb-8">
                <img 
                  src={selectedTrainer.photo_url} 
                  alt={selectedTrainer.full_name} 
                  className="w-16 h-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-[16px] font-bold text-text-primary">{selectedTrainer.full_name}</h4>
                  <p className="text-[13px] text-text-secondary">{selectedTrainer.specialisations[0]} · {selectedTrainer.city}</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-blue-light/30 rounded-xl border border-blue/10 mb-8">
                <Info size={20} className="text-blue shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue leading-relaxed font-medium">
                  Your request will be sent to {selectedTrainer.full_name?.split(' ')[0] || 'your trainer'}. Once she accepts, your program will begin.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleConfirmSelection}
                  className="w-full btn-primary h-[54px] font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  Confirm selection
                </button>
                <button 
                  onClick={() => setState('TRAINER_DETAIL')}
                  className="w-full py-4 text-text-secondary text-[14px] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Submitting Overlay */}
      <AnimatePresence>
        {state === 'SUBMITTING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-12 text-center"
          >
            <Loader2 className="animate-spin text-primary mb-6" size={48} />
            <h3 className="text-xl font-bold text-text-primary mb-2">Sending request...</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Notifying {selectedTrainer?.full_name} and updating your program status.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success View */}
      <AnimatePresence>
        {state === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-white z-[110] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-light flex items-center justify-center text-primary mb-8 shadow-inner ring-8 ring-primary/5">
              <CheckCircle2 size={64} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">Request Sent!</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed mb-8">
              We've notified {selectedTrainer?.full_name}. You'll be able to see your schedule as soon as the request is accepted.
            </p>
            <div className="w-full max-w-[200px] flex items-center justify-center gap-2 text-primary font-bold animate-pulse">
              <span>Redirecting home</span>
              <ArrowRight size={18} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toasts */}
      {errorToast && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="absolute bottom-24 left-6 right-6 bg-red text-white px-4 py-3 rounded-xl shadow-lg z-[200] flex items-center gap-3"
        >
          <AlertCircle size={20} />
          <p className="text-[13px] font-medium">{errorToast}</p>
          <button onClick={() => setErrorToast(null)} className="ml-auto"><X size={18} /></button>
        </motion.div>
      )}
    </div>
  );
}
