/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, TrainingProgram } from '../types';

export interface TrainerShortlistEntry {
  trainer_id: string;
  full_name: string;
  photo_url: string;
  specialisations: string[];
  certifications: string[];
  city: string;
  session_type: string[];
  availability_summary: string;
  client_slots_available: number;
  match_score: number;
  match_reasons: string[];
  rating: number;
  review_count: number;
  status: string;
  bio?: string;
}

const MOCK_SHORTLIST: TrainerShortlistEntry[] = [
  {
    trainer_id: "TR-001",
    full_name: "Priya Sharma",
    photo_url: "https://picsum.photos/seed/priya/200/200",
    specialisations: ["Strength", "Conditioning", "HIIT"],
    certifications: ["ACE CPT", "NSCA"],
    city: "Chennai",
    session_type: ["video", "in_person"],
    availability_summary: "Mon–Sat · 6am–8am, 6pm–8pm",
    client_slots_available: 4,
    match_score: 96,
    match_reasons: ["Strength match", "Chennai", "Evening slots"],
    rating: 4.9,
    review_count: 34,
    status: "active",
    bio: "Priya is a high-performance coach specializing in functional strength for working professionals. She focuses on sustainable lifestyle changes."
  },
  {
    trainer_id: "TR-002",
    full_name: "Rajesh Menon",
    photo_url: "https://picsum.photos/seed/rajesh/200/200",
    specialisations: ["Functional Training", "Weight Loss"],
    certifications: ["Gold's Gym Certified", "Kettlebell L1"],
    city: "Chennai",
    session_type: ["video"],
    availability_summary: "Mon–Fri · 7am–9am, 5pm–7pm",
    client_slots_available: 6,
    match_score: 84,
    match_reasons: ["Functionality focus", "City match", "Morning availability"],
    rating: 4.7,
    review_count: 22,
    status: "active",
    bio: "Rajesh brings a holistic approach to fitness, combining traditional strength training with modern functional movements."
  },
  {
    trainer_id: "TR-003",
    full_name: "Suresh Kumar",
    photo_url: "https://picsum.photos/seed/suresh/200/200",
    specialisations: ["Strength Training", "Powerlifting"],
    certifications: ["IPF Certified", "Strength Coach L2"],
    city: "Bangalore",
    session_type: ["video", "in_person"],
    availability_summary: "Tue–Sun · 10am–1pm, 4pm–7pm",
    client_slots_available: 2,
    match_score: 71,
    match_reasons: ["Strength match", "Experienced", "Cross-city backup"],
    rating: 4.5,
    review_count: 18,
    status: "active",
    bio: "Suresh is a competitive powerlifter who helps clients build raw strength and perfect their lifting technique safely."
  }
];

export async function fetchTrainerShortlist(clientId: string): Promise<TrainerShortlistEntry[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulation: 404/403 could be handled here with throws
  // For now, return the mock list
  return MOCK_SHORTLIST;
}

export async function submitTrainerSelection(clientId: string, trainerId: string): Promise<{ assignment_id: string; status: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Logic for 409 (capacity) could be added here
  
  return {
    assignment_id: `ASGN-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending'
  };
}

const MOCK_PROGRAM: TrainingProgram = {
  program_id: "PROG-2024-001",
  trainer: {
    trainer_id: "TR-001",
    full_name: "Priya Sharma",
    photo_url: "https://picsum.photos/seed/priya/200/200",
    specialisations: ["Strength", "Conditioning"]
  },
  program_name: "12-Week Strength Foundation",
  duration_weeks: 12,
  sessions_per_week: 3,
  goals: [
    "Build foundational strength in compound movements (squat, deadlift, press)",
    "Improve mobility and reduce knee discomfort through targeted warm-up protocols",
    "Reach intermediate lifting benchmarks by week 8",
    "Establish consistent training habit — 3 sessions/week attendance target"
  ],
  client_approval_status: "pending",
  created_at: "2026-04-11T10:00:00Z"
};

export async function fetchTrainingProgram(clientId: string): Promise<TrainingProgram> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulation: If NO trainer accepted yet, we might throw 404
  if (clientId === 'NO_PROGRAM') {
    throw new Error('program_not_ready');
  }

  return MOCK_PROGRAM;
}

export async function submitProgramApproval(
  programId: string, 
  status: 'approved' | 'changes_requested',
  notes?: string
): Promise<{ program_id: string; client_approval_status: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    program_id: programId,
    client_approval_status: status
  };
}
