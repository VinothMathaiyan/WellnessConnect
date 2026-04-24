/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Clock, 
  Award,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';
import { User } from '../types';
import { Avatar, Badge } from '../components/Common';

interface TrainerDetailSubScreenProps {
  trainer: User;
  onBack: () => void;
  canRequest: boolean;
  onRequest: (trainerId: string) => void;
}

export default function TrainerDetailSubScreen({ trainer, onBack, canRequest, onRequest }: TrainerDetailSubScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-border-light flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="p-1 -ml-1 text-text-primary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg">Trainer Profile</h1>
        <div className="w-8" />
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <section className="bg-white p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={trainer.full_name} role={trainer.role} size="lg" />
            <h2 className="text-xl font-bold mt-4">{trainer.full_name}</h2>
            <p className="text-sm text-text-secondary mt-1">{trainer.specialties?.join(' • ')}</p>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-2 opacity-80">
              <MapPin size={14} />
              <span>{trainer.city || 'Remote'}</span>
            </div>
            
            <div className="flex gap-6 mt-6 w-full max-w-[280px]">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center gap-1 text-primary font-bold text-lg">
                  <Star size={18} className="fill-primary" />
                  <span>{trainer.rating}</span>
                </div>
                <p className="text-[10px] label-caps text-text-secondary mt-1">Rating</p>
              </div>
              <div className="w-[1px] h-10 bg-border-light self-center" />
              <div className="flex-1 flex flex-col items-center">
                <span className="text-primary font-bold text-lg">{trainer.sessionCount || 120}+</span>
                <p className="text-[10px] label-caps text-text-secondary mt-1">Sessions</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="label-caps text-text-secondary text-[11px] tracking-widest border-b border-border-light pb-2">SPECIALISATIONS</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.specialties?.map(s => (
                <Badge key={s} text={s} color="blue" />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="label-caps text-text-secondary text-[11px] tracking-widest border-b border-border-light pb-2">CERTIFICATIONS</h3>
            <ul className="space-y-3">
              {trainer.certifications?.map((cert, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-primary">
                  <Award size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="label-caps text-text-secondary text-[11px] tracking-widest border-b border-border-light pb-2 text-left">AVAILABILITY</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.availability?.map((slot, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-input-bg rounded-lg border border-border-light">
                  <Clock size={12} className="text-text-secondary" />
                  <span className="text-[12px] font-medium text-text-primary">{slot}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2 pb-10">
            <h3 className="label-caps text-text-secondary text-[11px] tracking-widest border-b border-border-light pb-2 text-left">BIO</h3>
            <p className="text-[13px] last:text-text-secondary leading-relaxed">
              {trainer.bio}
            </p>
          </div>
        </section>
      </div>

      {/* Persistence Bar */}
      <div className="bg-white border-t border-border-light p-6 sticky bottom-0 z-20">
        {canRequest ? (
          <button 
            onClick={() => onRequest(trainer.id)}
            className="w-full btn-primary py-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Request this trainer
          </button>
        ) : (
          <div className="w-full bg-input-bg border border-border-light rounded-xl p-4 flex items-center gap-3">
            <div className="text-text-secondary opacity-40">
              <Info size={20} />
            </div>
            <p className="text-[12px] font-medium text-text-secondary">
              You already have an assigned trainer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
