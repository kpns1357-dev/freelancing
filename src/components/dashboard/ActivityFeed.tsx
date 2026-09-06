import React from 'react';
import { useApp } from '../../context/AppContext';

export const ActivityFeed: React.FC = () => {
  const { activities } = useApp();

  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
            Recent Activity Feed
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            Real-time ledger events & client milestones
          </span>
        </div>
        <span className="material-symbols-outlined text-outline dark:text-text-muted text-[20px]">tune</span>
      </div>

      <div className="relative flex flex-col gap-space-md">
        {activities.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-canvas-card-elevated flex items-center justify-center text-outline dark:text-text-muted mb-2">
              <span className="material-symbols-outlined text-[20px]">notifications_paused</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
              No activity logged yet. New clients, project updates, and payments will show up here.
            </p>
          </div>
        ) : (
          activities.slice(0, 6).map(act => {
            let icon = 'info';
            let iconBoxStyle = 'bg-surface-container text-on-surface-variant dark:bg-canvas-card-elevated dark:text-text-muted';

            if (act.type === 'payment') {
              icon = 'check_circle';
              iconBoxStyle = 'bg-secondary-container/70 text-on-secondary-container dark:bg-status-emerald-bg dark:text-status-emerald-text';
            } else if (act.type === 'comment') {
              icon = 'forum';
              iconBoxStyle = 'bg-surface-container-high text-primary dark:bg-brand-primary/20 dark:text-brand-primary-light';
            } else if (act.type === 'client') {
              icon = 'handshake';
              iconBoxStyle = 'bg-primary-container text-on-primary dark:bg-brand-primary dark:text-white';
            } else if (act.type === 'invoice') {
              icon = 'receipt';
              iconBoxStyle = 'bg-surface-container text-primary dark:bg-canvas-card-elevated dark:text-brand-primary';
            } else if (act.type === 'reminder') {
              icon = 'send';
              iconBoxStyle = 'bg-secondary-container/40 text-secondary dark:bg-status-emerald-bg dark:text-status-emerald-text';
            }

            return (
              <div key={act.id} className="flex gap-space-sm items-start relative">
                <div className={`w-9 h-9 rounded-full ${iconBoxStyle} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="font-body-md text-body-md text-on-surface dark:text-text-high leading-snug">
                    {act.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-label-sm text-label-sm text-outline dark:text-text-muted font-medium">
                      {act.timeAgo}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline dark:bg-text-muted"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-medium">
                      {act.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
