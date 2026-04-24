/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Role } from '../types';

export const Avatar = ({ name, role, size = 'md' }: { name: string; role: Role; size?: 'sm' | 'md' | 'lg' }) => {
  const getInitials = (n: string) => {
    if (!n) return '?';
    return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);
  };
  const getRoleColor = (r: Role) => {
    switch(r) {
      case 'trainer': return 'bg-primary text-white';
      case 'client': return 'bg-blue text-white';
      case 'nutritionist': return 'bg-amber text-white';
      case 'assessment_expert': return 'bg-purple text-white';
      default: return 'bg-text-secondary text-white';
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-[12px]',
    lg: 'w-16 h-16 text-[18px]'
  };

  return (
    <div className={`rounded-full flex items-center justify-center font-semibold ${getRoleColor(role)} ${sizeClasses[size]}`}>
      {getInitials(name)}
    </div>
  );
};

export const Badge = (props: any) => {
  const { text, color = 'green' } = props;
  const colors = {
    green: 'bg-green-light text-primary',
    blue: 'bg-blue-light text-blue',
    amber: 'bg-amber-light text-amber',
    purple: 'bg-purple-light text-purple',
    red: 'bg-red-light text-red'
  };
  return <span className={`badge ${colors[color]}`}>{text}</span>;
};

export const ProgressBar = (props: any) => {
  const { label, current, target, unit } = props;
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-text-secondary text-xs">{label}</span>
        <span className="font-medium text-xs">{current}{unit} <span className="opacity-40">/ {target}{unit}</span></span>
      </div>
      <div className="progress-bg">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="progress-fill"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
