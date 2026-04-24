/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ChevronRight, 
  MessageSquare, 
  ClipboardList,
  AlertCircle,
  Clock,
  Calendar,
  Users
} from 'lucide-react';
import { User } from '../types';
import { Avatar, Badge } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';

interface TrainersScreenProps {
  trainers: User[];
  assignedTrainerId?: string | null;
  onViewProfile: (trainer: User) => void;
  onViewSession: (session: any) => void;
}

export default function TrainersScreen({ trainers, assignedTrainerId, onViewProfile, onViewSession }: TrainersScreenProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Strength', 'Yoga', 'Nutrition', 'Ayurveda', 'Wellness'];
  
  const assignedTrainer = trainers.find(t => t.id === assignedTrainerId);
  
  const filteredTrainers = trainers.filter(t => {
    const matchesSearch = t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || t.specialties?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const mockUpcomingSessions = [
    { title: 'Morning Yoga Flow', time: 'Tomorrow, 08:00 AM', status: 'Booked', type: 'yoga' },
    { title: 'Strength Assessment', time: 'Thu, 10:00 AM', status: 'Booked', type: 'strength' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tabs */}
      <div className="flex bg-white px-2 pt-2 border-b border-border-light sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-3 text-sm font-semibold relative transition-colors ${activeTab === 'my' ? 'text-primary' : 'text-text-secondary'}`}
        >
          My Trainer
          {activeTab === 'my' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 text-sm font-semibold relative transition-colors ${activeTab === 'discover' ? 'text-primary' : 'text-text-secondary'}`}
        >
          Discover
          {activeTab === 'discover' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'my' ? (
            <motion.div 
              key="my" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {assignedTrainer ? (
                <>
                  <div className="card space-y-4 shadow-sm border border-border-light p-5">
                    <div className="flex gap-4">
                      <Avatar name={assignedTrainer.full_name} role={assignedTrainer.role} size="md" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-[14px] font-semibold text-text-primary">{assignedTrainer.full_name}</h3>
                            <p className="text-[12px] text-text-secondary mb-1">{assignedTrainer.specialties?.[0]}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[12px]">
                            <Star size={14} className="text-amber fill-amber" />
                            <span className="font-medium">{assignedTrainer.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {assignedTrainer.certifications?.slice(0, 2).map((cert, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 bg-input-bg text-text-secondary rounded font-medium">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 btn-outline btn-small py-2.5 flex items-center justify-center gap-2">
                        <ClipboardList size={16} />
                        View plan
                      </button>
                      <button className="flex-1 btn-primary btn-small py-2.5 flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Message
                      </button>
                    </div>
                  </div>

                  <section className="space-y-3">
                    <h3 className="label-caps text-text-secondary text-[11px] tracking-widest pl-1">UPCOMING SESSIONS</h3>
                    <div className="space-y-3">
                      {mockUpcomingSessions.length > 0 ? (
                        mockUpcomingSessions.map((session, i) => (
                          <button 
                            key={i} 
                            className="w-full card flex items-center justify-between py-3 hover:bg-input-bg/30 transition-colors text-left"
                            onClick={() => onViewSession(session)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-xl">
                                {session.type === 'yoga' ? '🧘' : '💪'}
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold">{session.title}</h4>
                                <p className="text-[11px] text-text-secondary">{session.time}</p>
                              </div>
                            </div>
                            <Badge text={session.status} color={session.status === 'Today' ? 'green' : 'blue'} />
                          </button>
                        ))
                      ) : (
                        <div className="py-10 text-center text-text-secondary">
                          <p className="text-[13px]">No sessions scheduled.</p>
                          <p className="text-[11px] opacity-60 mt-1">Your trainer will add sessions soon.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-light border border-amber/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-amber/10 p-2 rounded-full text-amber">
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-text-primary">Trainer matching in progress</p>
                      <p className="text-[11px] text-text-secondary">You'll be notified once a trainer is recommended.</p>
                    </div>
                  </div>
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale grayscale-0">
                     <Users size={64} className="text-text-secondary mb-4" />
                     <p className="text-sm font-medium">No assigned trainer yet</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="discover" 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6 pb-20"
            >
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search trainers, specialties..." 
                    className="input-field pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2.5 rounded-lg border border-border text-text-secondary bg-white">
                  <Filter size={18} />
                </button>
              </div>

              {/* Tags */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
                {categories.map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => setSelectedCategory(tag)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                      selectedCategory === tag 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white border-border-light text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredTrainers.map((t) => (
                  <button 
                    key={t.id} 
                    className="w-full card flex gap-4 text-left hover:border-primary/20 transition-all active:scale-[0.98]"
                    onClick={() => onViewProfile(t)}
                  >
                    <Avatar name={t.full_name} role={t.role} size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-sm">{t.full_name}</h3>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          <Star size={12} className="text-amber fill-amber" />
                          <span>{t.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mb-3">
                        <p className="text-[11px] text-text-secondary">{t.specialties?.join(' • ')}</p>
                        <div className="flex items-center gap-1 text-[11px] text-text-secondary opacity-70">
                          <MapPin size={10} />
                          <span>{t.city || 'Remote'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge text="Available" color="green" />
                        <ChevronRight size={16} className="text-text-secondary opacity-40" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
