import React from 'react';
import { useApp } from '../../context/AppContext';

export const PriorityInvoices: React.FC = () => {
  const { invoices, setCurrentRoute, openInvoicePreview, showToast } = useApp();

  // Filter for pending or overdue invoices, sorted by priority (overdue first)
  const priorityList = invoices
    .filter(inv => inv.status === 'overdue' || inv.status === 'pending')
    .sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const handleWhatsAppPing = (invoiceNumber: string, clientName: string) => {
    showToast({
      type: 'success',
      title: 'WhatsApp Reminder Queued',
      message: `Direct payment link for ${invoiceNumber} prepared for ${clientName}.`,
      liveTag: 'Sent'
    });
  };

  const handleEmailResend = (invoiceNumber: string, clientEmail: string) => {
    showToast({
      type: 'success',
      title: 'Invoice Dispatched',
      message: `Copy of ${invoiceNumber} resent to ${clientEmail}.`
    });
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
            Priority Invoices Awaiting Payment
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            {priorityList.length} accounts require operator follow-up
          </span>
        </div>
        <button
          onClick={() => setCurrentRoute('invoices')}
          className="font-label-md text-label-md text-primary dark:text-brand-primary hover:underline font-semibold flex items-center gap-0.5"
          type="button"
        >
          <span>View all {invoices.length}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {priorityList.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-container dark:bg-canvas-card-elevated flex items-center justify-center text-outline dark:text-text-muted mb-2">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
          </div>
          <p className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold">
            All Invoices Settled
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1 max-w-sm">
            No overdue or pending invoices requiring immediate action. Your ledger is completely clear!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-space-lg px-space-lg">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider h-9">
                <th className="px-space-sm rounded-l-lg font-semibold">Client & Invoice</th>
                <th className="px-space-sm font-semibold">Due Date</th>
                <th className="px-space-sm text-right font-semibold">Amount</th>
                <th className="px-space-sm text-center font-semibold">Status</th>
                <th className="px-space-sm text-right rounded-r-lg font-semibold">Remind Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low dark:divide-card-border/40">
            {priorityList.map(inv => {
              const isOverdue = inv.status === 'overdue';
              const remaining = Math.max(0, inv.totalAmount - (inv.paidAmount || 0));
              const clientInitials = inv.clientName
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={inv.id}
                  className="h-14 hover:bg-surface-container-low/60 dark:hover:bg-canvas-card-elevated/60 transition-colors group cursor-pointer"
                  onClick={() => openInvoicePreview(inv.id)}
                >
                  <td className="px-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container dark:bg-canvas-card-elevated flex items-center justify-center font-bold text-primary dark:text-brand-primary text-[12px] border border-outline-variant/30 dark:border-card-border">
                        {clientInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title-md text-title-md text-on-surface dark:text-text-high truncate font-medium">
                          {inv.clientCompany || inv.clientName}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                          {inv.invoiceNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td
                    className={`px-space-sm font-body-sm text-body-sm font-medium ${
                      isOverdue
                        ? 'text-error dark:text-status-red-text'
                        : 'text-tertiary dark:text-status-amber-text'
                    }`}
                  >
                    {inv.dueDate} {isOverdue ? '(Overdue)' : ''}
                  </td>

                  <td className="px-space-sm font-numeric-md text-numeric-md font-semibold text-right text-on-surface dark:text-text-high">
                    ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-space-sm text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        isOverdue
                          ? 'bg-error-container dark:bg-status-red-bg text-on-error-container dark:text-status-red-text'
                          : 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOverdue ? 'bg-error dark:bg-status-red' : 'bg-tertiary dark:bg-status-amber'
                        }`}
                      ></span>{' '}
                      {isOverdue ? 'Overdue' : 'Due Soon'}
                    </span>
                  </td>

                  <td className="px-space-sm text-right" onClick={e => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleWhatsAppPing(inv.invoiceNumber, inv.clientName)}
                        className="p-1.5 text-secondary dark:text-status-emerald-text hover:bg-secondary-container/40 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Send WhatsApp Ping"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </button>
                      <button
                        onClick={() => handleEmailResend(inv.invoiceNumber, inv.clientEmail)}
                        className="p-1.5 text-primary dark:text-brand-primary hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Resend Invoice Email"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
