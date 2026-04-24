/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyTrackingLog } from '../types';

// In-memory store to simulate DB persistence during session
const mockStorage: Record<string, DailyTrackingLog> = {};

export async function syncFromExternalApp(clientId: string): Promise<{ steps: number; last_sync: string }> {
  // Simulate API call to health service
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    steps: 8420,
    last_sync: new Date().toISOString()
  };
}

export async function fetchDailyLog(clientId: string, date: string): Promise<DailyTrackingLog> {
  const key = `${clientId}_${date}`;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (mockStorage[key]) {
    return mockStorage[key];
  }

  // Return default blank log for 404 simulation
  return {
    log_date: date,
    water_litres: 0,
    steps_manual: null,
    steps_wearable: clientId === 'CLIENT-WEARABLE' ? 7430 : null,
    last_wearable_sync: clientId === 'CLIENT-WEARABLE' ? new Date().toISOString() : undefined,
    sleep_hours: null,
    mood_score: null,
    meals: []
  };
}

export async function saveDailyLog(clientId: string, log: DailyTrackingLog): Promise<{ success: boolean; n13_suppressed: boolean }> {
  const key = `${clientId}_${log.log_date}`;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  mockStorage[key] = log;

  return {
    success: true,
    n13_suppressed: true
  };
}
