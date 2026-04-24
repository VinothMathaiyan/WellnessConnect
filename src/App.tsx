/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  Bell, 
  ChevronLeft, 
  Search, 
  Filter, 
  Star, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Activity, Notification, ProgressMetric, Role, TrainingSession } from './types';
import SignUpScreen from './screens/SignUpScreen';
import HealthProfileScreen from './screens/HealthProfileScreen';
import AssessmentBookingScreen from './screens/AssessmentBookingScreen';
import AccountReadyScreen from './screens/AccountReadyScreen';
import TrainerSelectionScreen from './screens/TrainerSelectionScreen';
import TrainingGoalApprovalScreen from './screens/TrainingGoalApprovalScreen';
import DailyWellnessTrackingScreen from './screens/DailyWellnessTrackingScreen';
import HomeScreen from './screens/HomeScreen';
import HomeAuditScreen from './screens/HomeAuditScreen';
import TrainersScreen from './screens/TrainersScreen';
import ProgressScreen from './screens/ProgressScreen';
import AlertsScreen from './screens/AlertsScreen';
import TrainerDetailSubScreen from './screens/TrainerDetailSubScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';
import WeeklyCheckInScreen from './screens/WeeklyCheckInScreen';
import ScoreRevealScreen from './screens/ScoreRevealScreen';
import CheckInResultSubScreen from './screens/CheckInResultSubScreen';
import NutritionLogFlow from './screens/NutritionLogFlow';
import StepsDetailScreen from './screens/StepsDetailScreen';
import WeeklyReportScreen from './screens/WeeklyReportScreen';
import { Avatar } from './components/Common';
import { WeeklyReport } from './types';

// --- MOCK DATA ---

const mockWeeklyReport: WeeklyReport = {
  week_number: 4,
  start_date: 'Mon 20 Apr',
  end_date: 'Sun 26 Apr',
  status: 'available',
  averages: {
    readiness: 74,
    sleep_hours: 7.2,
    water_litres: 2.1,
    mood_score: 4.1,
    energy_level: 8.1,
    pain_score: 1.8,
    mobility_score: 7.2,
    steps: 7840
  },
  trends: {
    best_day: 'Wednesday',
    consistent_metric: 'Sleep',
    sleep: [
      { day_offset: 0, value: 6.5 },
      { day_offset: 1, value: 7.0 },
      { day_offset: 2, value: 8.5 },
      { day_offset: 3, value: 7.0 },
      { day_offset: 4, value: 7.2 },
      { day_offset: 5, value: 6.8 },
      { day_offset: 6, value: 7.4 }
    ],
    water: [
      { day_offset: 0, value: 1.5 },
      { day_offset: 1, value: 2.5 },
      { day_offset: 2, value: 2.1 },
      { day_offset: 3, value: 1.8 },
      { day_offset: 4, value: 2.5 },
      { day_offset: 5, value: 2.2 },
      { day_offset: 6, value: 2.0 }
    ],
    mood: [
      { day_offset: 0, value: 3 },
      { day_offset: 1, value: 4 },
      { day_offset: 2, value: 5 },
      { day_offset: 3, value: 4 },
      { day_offset: 4, value: 4 },
      { day_offset: 5, value: 4 },
      { day_offset: 6, value: 4.5 }
    ],
    energy: [
      { day_offset: 0, value: 7 },
      { day_offset: 1, value: 8 },
      { day_offset: 2, value: 9 },
      { day_offset: 3, value: 6 },
      { day_offset: 4, value: 8 },
      { day_offset: 5, value: 8.5 },
      { day_offset: 6, value: 9 }
    ],
    pain: [
      { day_offset: 0, value: 2 },
      { day_offset: 1, value: 4 },
      { day_offset: 2, value: 2 },
      { day_offset: 3, value: 1 },
      { day_offset: 4, value: 1 },
      { day_offset: 5, value: 1 },
      { day_offset: 6, value: 1 }
    ],
    mobility: [
      { day_offset: 0, value: 5 },
      { day_offset: 1, value: 6 },
      { day_offset: 2, value: 6 },
      { day_offset: 3, value: 7 },
      { day_offset: 4, value: 8 },
      { day_offset: 5, value: 9 },
      { day_offset: 6, value: 9.5 }
    ],
    steps: [
      { day_offset: 0, value: 6500 },
      { day_offset: 1, value: 8200 },
      { day_offset: 2, value: 10500 },
      { day_offset: 3, value: 7100 },
      { day_offset: 4, value: 8900 },
      { day_offset: 5, value: 5400 },
      { day_offset: 6, value: 8200 }
    ]
  },
  daily_readiness: [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 68 },
    { day: 'Fri', score: 74 },
    { day: 'Sat', score: null },
    { day: 'Sun', score: null },
  ],
  trainer_week_note: 'Excellent work this week! Your mobility is improving significantly. I noticed a slight dip in energy on Thursday (likely due to the lower sleep night), but you recovered well. Keep pushing on the Sun Salutations — the form is getting much cleaner.',
  client_reflection: '',
  client_viewed: false
};

const trainers: User[] = [
  {
    id: 'TR-2024-0001',
    full_name: 'Sarah Chen',
    role: 'trainer',
    mobile: '+919876543210',
    specialties: ['Yoga', 'HIIT', 'Wellness'],
    rating: 4.9,
    reviewCount: 124,
    bio: 'Certified Yoga instructor with 8 years of experience in holistic wellness. Specialized in Vinyasa and mindfulness practices.',
    city: 'Mumbai',
    certifications: ['RYT-500 Yoga Teacher', 'Functional HIIT Specialist'],
    availability: ['Mon-Fri (08:00 - 11:00)', 'Sat (09:00 - 12:00)'],
    sessionCount: 450
  },
  {
    id: 'TR-2024-0002',
    full_name: 'Marcus Thorne',
    role: 'trainer',
    mobile: '+919876543211',
    specialties: ['Strength', 'HIIT'],
    rating: 4.8,
    reviewCount: 89,
    bio: 'Professional strength coach dedicated to functional movement and power. Helping clients reach their physical peak.',
    city: 'Bangalore',
    certifications: ['NSCA Personal Trainer', 'Precision Nutrition L1'],
    availability: ['Mon-Thu (16:00 - 20:00)', 'Sun (08:00 - 12:00)'],
    sessionCount: 320
  },
  {
    id: 'TR-2024-0003',
    full_name: 'Elena Rodriguez',
    role: 'nutritionist',
    mobile: '+919876543212',
    specialties: ['Nutrition', 'Wellness'],
    rating: 5.0,
    reviewCount: 56,
    bio: 'Clinical nutritionist specializing in performance-based dietary planning and gut health optimization.',
    city: 'Delhi',
    certifications: ['Registered Dietitian (RD)', 'Sports Nutrition Expert'],
    availability: ['Wed-Fri (10:00 - 15:00)'],
    sessionCount: 210
  }
];

const dashboardActivities: Activity[] = [
  { id: '1', title: 'Morning Vinyasa', category: 'Yoga', time: '08:00 AM', status: 'completed' },
  { id: '2', title: 'Power Lunch', category: 'Nutrition', time: '12:30 PM', status: 'completed' },
  { id: '3', title: 'Strength Sesh', category: 'Gym', time: '05:30 PM', status: 'pending' },
];

// --- SHARED COMPONENTS IN APP ---

const NavButton = ({ active, Icon, label, onClick }: { active: boolean; Icon: any; label: string; onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-text-secondary hover:text-primary'}`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </button>
  );
};

// --- APP COMPONENT ---

type AppFlow = 'onboarding_step1' | 'onboarding_step2' | 'onboarding_step3' | 'onboarding_step4' | 'main_app' | 'weekly_check_in' | 'score_reveal' | 'weekly_check_in_result' | 'trainer_selection' | 'goals_review' | 'wellness_tracking' | 'nutrition_logging' | 'steps_tracker' | 'steps_detail' | 'weekly_report' | 'home_audit';

export default function App() {
  const [flow, setFlow] = useState<AppFlow>('onboarding_step1');
  const [activeTab, setActiveTab] = useState<'home' | 'trainers' | 'progress' | 'alerts'>('home');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [checkInResult, setCheckInResult] = useState<{ score: number; answers: any } | null>(null);
  const [notificationsData, setNotificationsData] = useState<Notification[]>([
    { id: 'n1', title: 'Session Reminder', message: 'Reminder: Power Yoga Flow with Sarah Chen today at 10:30 AM.', time: '2 hours ago', type: 'reminder', isRead: false, actionType: 'session_detail' },
    { id: 'n2', title: 'Check-in Confirmation', message: 'Your check-in has been received. Readiness score updated to 84/100.', time: '5 hours ago', type: 'success', isRead: true },
    { id: 'n3', title: 'Daily Nudge', message: 'Don\'t forget your daily habits! 1 of 3 completed today.', time: 'Yesterday', type: 'info', isRead: false },
    { id: 'n4', title: 'Plan Update', message: 'Sarah Chen has updated your training plan for next week.', time: '2 days ago', type: 'info', isRead: true, actionType: 'plan_update' },
    { id: 'n5', title: 'Risk Alert', message: 'Your trainer and assessment team have been notified about your injury flag.', time: 'Apr 18', type: 'alert', isRead: true },
  ]);
  const now = new Date();
  const mockSessions: TrainingSession[] = [
    {
      id: 'SESS-IMM',
      session_name: 'Power Yoga Flow',
      session_type: 'yoga',
      trainer_name: 'Priya Sharma',
      scheduled_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // Starting in 5 mins
      duration_minutes: 45,
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      status: 'scheduled',
      trainer_note: 'Focus on breathing during the inversion sequence today. Take rest if you feel lightheaded.',
      exercises: [
        { id: 'ex1', name: 'Sun Salutations', instructions: '3 rounds, focus on rhythmic breathing', client_completed: false },
        { id: 'ex2', name: 'Warrior II', instructions: 'Hold for 5 breaths each side', client_completed: false },
        { id: 'ex3', name: 'Tree Pose', instructions: 'Find a focal point for balance', client_completed: false },
        { id: 'ex4', name: 'Savasana', instructions: '5 minutes deep relaxation', client_completed: false }
      ]
    },
    {
      id: 'SESS-UPC',
      session_name: 'Strength Training',
      session_type: 'strength',
      trainer_name: 'Sarah Chen',
      scheduled_at: new Date(now.getTime() + 120 * 60 * 1000).toISOString(), // In 2 hours
      duration_minutes: 60,
      status: 'scheduled',
      trainer_note: 'Focus on form today, not weight. Keep your core engaged.',
      exercises: [
        { id: 'ex5', name: 'Goblet Squats', instructions: '3 sets of 12 reps, 20kg kettlebell', client_completed: false },
        { id: 'ex6', name: 'Pushups', instructions: '3 sets to failure, maintain plank form', client_completed: false },
        { id: 'ex7', name: 'Plank', instructions: '3 sets of 60 seconds', client_completed: false }
      ]
    },
    {
      id: 'SESS-COM',
      session_name: 'Nutrition Review',
      session_type: 'nutrition',
      trainer_name: 'Dr. Rahul Bose',
      scheduled_at: new Date(now.getTime() - 180 * 60 * 1000).toISOString(), // 3 hours ago
      duration_minutes: 30,
      status: 'completed',
      exercises: []
    }
  ];

  const [userData, setUserData] = useState<any>({
    full_name: '',
    mobile: '',
    email: '',
    readinessScore: 84, // Mock initial score
    adherenceScore: 92,
    sessionsDone: 12,
    weeksActive: 4,
    progressBreakdown: {
      mobility: 85,
      sleepRecovery: 78,
      sessionAttendance: 95,
      habitCompletion: 88,
    },
    riskStatus: 'green',
    riskReason: null,
    riskLastChecked: 'Yesterday',
    readinessHistory: [
      { week: 'W1', score: 72 },
      { week: 'W2', score: 78 },
      { week: 'W3', score: 82 },
      { week: 'W4', score: 84 },
    ],
    currentWeek: 4,
    checkInStatus: 'due',
    weeklyReportStatus: 'available',
    weeklyReportTeaser: {
      sleep: '7.2h',
      mood: '4/5',
      energy: 'High'
    },
    stepTrackingEnabled: true,
    todaySteps: {
      count: 6842,
      goal: 10000,
      isSyncing: false
    },
    habitProgress: { done: 1, total: 7 },
    trainerName: 'Priya Sharma', 
    trainerStatus: 'pending',
    programReviewStatus: 'pending',
    assessmentStatus: 'pending',
    sessions: mockSessions
  });

  const handleSignUpSuccess = (data: any) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
    setFlow('onboarding_step2');
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'home': return 'WellnessConnect';
      case 'trainers': return 'Find Experts';
      case 'progress': return 'My Progress';
      case 'alerts': return 'Notifications';
      default: return 'WellnessConnect';
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center py-0 sm:py-8 font-inter">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[375px] bg-background min-h-screen sm:min-h-[812px] sm:h-[812px] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[40px] sm:border-[8px] sm:border-gray-900">
        
        {flow === 'onboarding_step1' && (
          <SignUpScreen onSuccess={handleSignUpSuccess} />
        )}

        {flow === 'onboarding_step2' && (
          <HealthProfileScreen 
            onBack={() => setFlow('onboarding_step1')}
            onContinue={(data) => {
              setUserData((prev: any) => ({ ...prev, ...data }));
              setFlow('onboarding_step3');
            }}
          />
        )}

        {flow === 'onboarding_step3' && (
          <AssessmentBookingScreen 
            onBack={() => setFlow('onboarding_step2')}
            onConfirm={(data) => {
              setUserData((prev: any) => ({ 
                ...prev, 
                ...data, 
                assessmentStatus: 'pending',
                profileStep: 3
              }));
              setFlow('onboarding_step4');
            }}
          />
        )}

        {flow === 'onboarding_step4' && (
          <AccountReadyScreen 
            userData={userData}
            onGoToDashboard={(finalId) => {
              setUserData((prev: any) => ({ ...prev, id: finalId }));
              setFlow('main_app');
            }}
          />
        )}

        {flow === 'trainer_selection' && (
          <TrainerSelectionScreen
            clientId={userData.id || 'CLIENT-123'}
            onBack={() => setFlow('main_app')}
            onSuccess={(trainerName) => {
              setUserData((prev: any) => ({ ...prev, trainerName, trainerStatus: 'pending' }));
              setFlow('main_app');
            }}
          />
        )}

        {flow === 'goals_review' && (
          <TrainingGoalApprovalScreen
            clientId={userData.id || 'CLIENT-123'}
            onBack={() => setFlow('main_app')}
            onDone={(status) => {
              setUserData((prev: any) => ({ 
                ...prev, 
                programReviewStatus: status,
                trainerStatus: status === 'approved' ? 'active' : prev.trainerStatus
              }));
              if (status === 'approved') {
                setFlow('main_app');
              }
            }}
          />
        )}

        {flow === 'wellness_tracking' && (
          <DailyWellnessTrackingScreen
            clientId={userData.id || 'CLIENT-123'}
            onBack={() => setFlow('main_app')}
            onViewProgress={() => {
              setFlow('main_app');
              setActiveTab('progress');
              setUserData((prev: any) => ({
                ...prev,
                habitProgress: { ...prev.habitProgress, done: 7 }
              }));
            }}
          />
        )}

        {flow === 'nutrition_logging' && (
          <NutritionLogFlow
            onBack={() => setFlow('main_app')}
          />
        )}

        {flow === 'steps_tracker' && (
          <StepsDetailScreen
            onBack={() => setFlow('main_app')}
          />
        )}

        {flow === 'home_audit' && (
          <HomeAuditScreen onBack={() => setFlow('main_app')} />
        )}

        {flow === 'main_app' && (
          <>
            {selectedSession ? (
              <SessionDetailScreen 
                session={selectedSession} 
                onBack={() => setSelectedSession(null)}
                userInitials={(userData?.full_name || "V")[0].toUpperCase()}
              />
            ) : (
              <div className="flex flex-col h-full bg-white overflow-hidden">
                {/* Redesigned Global Header */}
                <header className="bg-white text-[#111827] px-6 py-5 flex items-center justify-between sticky top-0 z-50 border-b border-[#E5E7EB]/50 shrink-0">
              <div className="flex items-center gap-1">
                {activeTab !== 'home' ? (
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                ) : (
                  <div className="w-6" />
                )}
              </div>
              <h1 className="text-[17px] font-bold tracking-tight">{getTitle()}</h1>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="w-9 h-9 rounded-full bg-white border-[1.5px] border-[#1D9E75] flex items-center justify-center text-[#1D9E75] font-bold text-[14px] shadow-sm active:scale-95 transition-transform"
              >
                {(userData?.full_name || "V")[0].toUpperCase()}
              </button>
            </header>

            <main className={`flex-1 overflow-y-auto pb-24 scroll-smooth ${activeTab === 'home' ? 'p-0' : 'p-4'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                      {activeTab === 'home' && (
                    <HomeScreen 
                      userData={userData} 
                      onViewSession={(s) => setSelectedSession(s)} 
                      onStartCheckIn={() => setFlow('weekly_check_in')}
                      onFindTrainer={() => setFlow('trainer_selection')}
                      onReviewGoals={() => setFlow('goals_review')}
                      onTrackToday={() => setFlow('wellness_tracking')}
                      onTrackNutrition={() => setFlow('nutrition_logging')}
                      onTrackSteps={() => setFlow('steps_tracker')}
                      onViewWeeklyReport={() => setFlow('weekly_report')}
                      onViewStepsDetail={() => setFlow('steps_detail')}
                    />
                  )}
                  
                  {activeTab === 'trainers' && (
                    selectedTrainer ? (
                      <TrainerDetailSubScreen 
                        trainer={selectedTrainer} 
                        onBack={() => setSelectedTrainer(null)} 
                        canRequest={!userData.trainerName}
                        onRequest={(id) => {
                          const trainer = trainers.find(t => t.id === id);
                          setUserData((prev: any) => ({ ...prev, trainerName: trainer?.full_name, trainerId: id }));
                          setSelectedTrainer(null);
                        }}
                      />
                    ) : (
                      <TrainersScreen 
                        trainers={trainers} 
                        assignedTrainerId={userData.trainerId}
                        onViewProfile={(t) => setSelectedTrainer(t)}
                        onViewSession={(s) => setSelectedSession(userData.sessions[0])} // Fallback
                      />
                    )
                  )}
                  {activeTab === 'progress' && <ProgressScreen userData={userData} />}
                  {activeTab === 'alerts' && (
                    <AlertsScreen 
                      notifications={notificationsData} 
                      onMarkRead={(id) => {
                        setNotificationsData(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
                      }}
                      onMarkAllRead={() => {
                        setNotificationsData(prev => prev.map(n => ({ ...n, isRead: true })));
                      }}
                      onAction={(n) => {
                        if (n.actionType === 'session_detail') {
                          setSelectedSession(userData.sessions[0]);
                        } else if (n.actionType === 'plan_update') {
                          setActiveTab('trainers');
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

                <nav className="bg-white border-t border-border-light px-6 py-3 flex items-center justify-between shrink-0 pb-8 sm:pb-6">
                  <NavButton active={activeTab === 'home'} Icon={Home} label="Home" onClick={() => setActiveTab('home')} />
                  <NavButton active={activeTab === 'trainers'} Icon={Users} label="Trainers" onClick={() => setActiveTab('trainers')} />
                  <NavButton active={activeTab === 'progress'} Icon={BarChart3} label="Progress" onClick={() => setActiveTab('progress')} />
                  <NavButton active={activeTab === 'alerts'} Icon={Bell} label="Alerts" onClick={() => setActiveTab('alerts')} />
                </nav>
              </div>
            )}
          </>
        )}

        {flow === 'weekly_check_in' && (
          <WeeklyCheckInScreen 
            onBack={() => setFlow('main_app')}
            onSubmit={(score, answers) => {
              setCheckInResult({ score, answers });
              setUserData((prev: any) => ({
                ...prev,
                readinessScore: score,
                checkInScore: score,
                checkInStatus: 'submitted'
              }));
              setFlow('score_reveal');
            }}
          />
        )}

        {flow === 'score_reveal' && checkInResult && (
          <ScoreRevealScreen
            score={checkInResult.score}
            userName={userData.full_name?.split(' ')[0] || 'Vinoth'}
            answers={checkInResult.answers}
            onViewProgress={() => {
              setFlow('main_app');
              setActiveTab('progress');
            }}
            onGoHome={() => setFlow('main_app')}
          />
        )}

        {flow === 'weekly_check_in_result' && checkInResult && (
          <CheckInResultSubScreen 
            score={checkInResult.score}
            answers={checkInResult.answers}
            trainerName={userData.trainerName || 'Your trainer'}
            onGoHome={() => setFlow('main_app')}
          />
        )}

        {flow === 'steps_detail' && (
          <StepsDetailScreen 
            onBack={() => setFlow('main_app')} 
          />
        )}

        {flow === 'weekly_report' && (
          <WeeklyReportScreen
            report={mockWeeklyReport}
            onBack={() => setFlow('main_app')}
            onSave={(reflection) => {
              setUserData((prev: any) => ({
                ...prev,
                weeklyReportViewed: true,
                weeklyReportReflection: reflection
              }));
              setFlow('main_app');
            }}
          />
        )}

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-black/40 flex items-end"
              onClick={() => setShowProfile(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white w-full rounded-t-3xl p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6" />
                <div className="flex flex-col items-center mb-8">
                  <Avatar name={userData?.full_name || "User"} role="client" size="lg" />
                  <h3 className="text-xl font-bold mt-4">{userData?.full_name || "User"}</h3>
                  <p className="text-text-secondary text-sm">{userData?.mobile || "WC-YYYY-XXXXX"}</p>
                </div>
                <div className="space-y-3">
                  <button className="btn-outline" onClick={() => { setShowProfile(false); setFlow('home_audit'); }}>View Home Design Specs</button>
                  <button className="btn-outline">My Profile</button>
                  <button className="btn-outline" onClick={() => setFlow('onboarding_step1')}>Restart Onboarding</button>
                  <button 
                    className="bg-red-light text-red btn-primary mt-4 border-none hover:bg-red hover:text-white transition-colors"
                    onClick={() => { setShowProfile(false); setFlow('onboarding_step1'); }}
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
