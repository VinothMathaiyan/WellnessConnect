/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import HomeScreen from './HomeScreen';
import { TrainingSession } from '../types';

export default function HomeAuditScreen({ onBack }: { onBack: () => void }) {
  const now = new Date();
  
  const mockSessionsStateA: TrainingSession[] = [
    {
      id: 'SESS-1',
      session_name: 'Power Yoga Flow',
      session_type: 'yoga',
      trainer_name: 'Priya Sharma',
      scheduled_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
      duration_minutes: 45,
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      status: 'scheduled',
      exercises: []
    }
  ];

  const mockSessionsStateB: TrainingSession[] = [
    {
      id: 'SESS-2',
      session_name: 'Strength Training',
      session_type: 'strength',
      trainer_name: 'Sarah Chen',
      scheduled_at: new Date(now.getTime() + 120 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      status: 'scheduled',
      exercises: []
    }
  ];

  const stateAData = {
    full_name: 'Vinoth',
    readinessScore: 84,
    currentWeek: 4,
    assessmentStatus: 'pending' as const,
    habitProgress: { done: 2, total: 5 },
    checkInStatus: 'due' as const,
    sessions: mockSessionsStateA,
    unReadAlertsCount: 2
  };

  const stateBData = {
    full_name: 'Vinoth',
    readinessScore: 92,
    currentWeek: 5,
    assessmentStatus: 'completed' as const,
    habitProgress: { done: 5, total: 5 },
    checkInStatus: 'submitted' as const,
    sessions: mockSessionsStateB,
    unReadAlertsCount: 0
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 flex flex-col gap-8 overflow-auto font-sans">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Home Screen Specs (SCR-H01)</h1>
          <p className="text-sm text-[#6B7280]">Visual Audit: State A (Active) vs State B (Steady State)</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-[#1D9E75] text-white rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform"
        >
          Back to App
        </button>
      </div>

      <div className="flex flex-row gap-8 justify-center">
        {/* State A */}
        <div className="flex flex-col gap-4 items-center">
          <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">State A: Assessment Pending, Session Soon</p>
          <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#111827] overflow-hidden relative">
            <HomeScreen 
              userData={stateAData}
              onViewSession={() => {}}
              onStartCheckIn={() => {}}
              onFindTrainer={() => {}}
              onReviewGoals={() => {}}
              onTrackToday={() => {}}
              onProfileClick={() => {}}
              isStandalone={true}
            />
          </div>
        </div>

        {/* State B */}
        <div className="flex flex-col gap-4 items-center">
          <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">State B: Assessment Done, All Habits Tracked</p>
          <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#111827] overflow-hidden relative">
            <HomeScreen 
              userData={stateBData}
              onViewSession={() => {}}
              onStartCheckIn={() => {}}
              onFindTrainer={() => {}}
              onReviewGoals={() => {}}
              onTrackToday={() => {}}
              onProfileClick={() => {}}
              isStandalone={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
