import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InvoiceStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const InvoicesView: React.FC = () => {
  const {
    invoices,
    openInvoiceDrawer,
    openInvoicePreview,
    deleteInvoice,
    toggleInvoicePaid,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchClient = inv.clientName.toLowerCase().includes(q);
        const matchCompany = (inv.clientCompany || '').toLowerCase().includes(q);
        if (!matchNumber && !matchClient && !matchCompany) return false;
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  // Metric Cards computations
  const overdueTotal = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  const pendingTotal = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)), 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

  const paidTotal = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;

  const draftTotal = invoices
    .filter(inv => inv.status === 'draft')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;

  const handleExportCSV = () => {
    const csvRows = [
      ['Invoice Number', 'Client', 'Company', 'Issue Date', 'Due Date', 'Status', 'Total Amount', 'Paid Amount'],
      ...filteredInvoices.map(inv => [
        `"${inv.invoiceNumber}"`,
        `"${inv.clientName}"`,
        `"${inv.clientCompany}"`,
        `"${inv.issueDate}"`,
        `"${inv.dueDate}"`,
        `"${inv.status}"`,
        inv.totalAmount,
        inv.paidAmount || 0
      ])
    ];
    const blob = new Blob([csvRows.map(e => e.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientflow_invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast({
      type: 'success',
      title: 'Invoices Exported',
      message: `${filteredInvoices.length} invoice records exported.`
    });
  };

  const handleWhatsAppSend = (invNumber: string, clientName: string) => {
    showToast({
      type: 'success',
      title: 'WhatsApp Reminder Dispatched',
      message: `Direct invoice remittance link for ${invNumber} sent to ${clientName}.`,
      liveTag: 'Live'
    });
  };

  return (
    <div className="flex flex-col w-full pb-space-3xl gap-space-xl">
      {/* Top Title & Primary Call to Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold">
              Invoices
            </span>
            <span className="bg-surface-container-high dark:bg-canvas-card-elevated text-primary dark:text-brand-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
              Automated Ledger
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium">
            Create, track, and automate client billing and payment reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-surface-container-lowest dark:bg-canvas-card hover:bg-surface-container-low dark:hover:bg-slate-700 text-on-surface dark:text-text-high px-space-md py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all border border-outline-variant/30 dark:border-card-border"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_upload</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => openInvoiceDrawer()}
            className="flex items-center gap-2 bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary px-space-md py-2 rounded-xl font-label-md text-label-md shadow-md hover:shadow-lg transition-all font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Status Metric Cards (Bento Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Overdue */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-error dark:bg-status-red"></div>
          <div className="flex items-center justify-between pl-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
              Overdue Balance
            </span>
            <span className="material-symbols-outlined text-error dark:text-status-red-text text-[20px]">warning</span>
          </div>
          <div className="mt-space-sm pl-space-xs flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-error dark:text-status-red-text tracking-tight">
              ${overdueTotal.toLocaleString()}
            </span>
            <span className="bg-error-container dark:bg-status-red-bg text-on-error-container dark:text-status-red-text font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
              {overdueCount} invoices
            </span>
          </div>
          <div className="mt-space-xs pl-space-xs flex items-center gap-1 text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
            <span className="text-error dark:text-status-red-text font-medium">Action required</span>
            <span>· Aging &gt; 14 days</span>
          </div>
        </div>

        {/* Outstanding / Pending */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-tertiary dark:bg-status-amber"></div>
          <div className="flex items-center justify-between pl-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
              Outstanding
            </span>
            <span className="material-symbols-outlined text-tertiary dark:text-status-amber-text text-[20px]">schedule</span>
          </div>
          <div className="mt-space-sm pl-space-xs flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high tracking-tight">
              ${pendingTotal.toLocaleString()}
            </span>
            <span className="bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
              {pendingCount} invoices
            </span>
          </div>
          <div className="mt-space-xs pl-space-xs flex items-center gap-1 text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
            <span>Due within next 15 days</span>
          </div>
        </div>

        {/* Paid This Month */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary dark:bg-status-emerald"></div>
          <div className="flex items-center justify-between pl-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
              Paid This Month
            </span>
            <span className="material-symbols-outlined text-secondary dark:text-status-emerald-text text-[20px]">check_circle</span>
          </div>
          <div className="mt-space-sm pl-space-xs flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-secondary dark:text-status-emerald-text tracking-tight">
              ${paidTotal.toLocaleString()}
            </span>
            <span className="bg-secondary-container dark:bg-status-emerald-bg text-on-secondary-container dark:text-status-emerald-text font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
              {paidCount} invoices
            </span>
          </div>
          <div className="mt-space-xs pl-space-xs flex items-center gap-1 text-secondary dark:text-status-emerald-text font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-semibold">+18.2%</span>
            <span className="text-on-surface-variant dark:text-text-muted">vs last month</span>
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-outline dark:bg-text-muted"></div>
          <div className="flex items-center justify-between pl-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
              Draft Invoices
            </span>
            <span className="material-symbols-outlined text-outline dark:text-text-muted text-[20px]">edit_note</span>
          </div>
          <div className="mt-space-sm pl-space-xs flex items-baseline justify-between">
            <span className="font-numeric-lg text-numeric-lg font-bold text-on-surface dark:text-text-high tracking-tight">
              ${draftTotal.toLocaleString()}
            </span>
            <span className="bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
              {draftCount} drafts
            </span>
          </div>
          <div className="mt-space-xs pl-space-xs flex items-center gap-1 text-on-surface-variant dark:text-text-muted font-body-sm text-body-sm">
            <span>Ready for review</span>
          </div>
        </div>
      </div>

      {/* Invoices Section & Data Table Canvas */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 dark:border-card-border/50">
          {/* Search Input */}
          <div className="flex-1 max-w-sm flex items-center gap-space-xs bg-surface-container-low dark:bg-canvas-card-elevated px-space-sm py-2 rounded-xl border border-outline-variant/30 dark:border-card-border">
            <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px]">search</span>
            <input
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface dark:text-text-high placeholder:text-outline dark:placeholder:text-text-muted focus:outline-none"
              placeholder="Filter by invoice #, client, or company..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Segmented Status Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-low dark:bg-canvas-card-elevated p-1 rounded-xl overflow-x-auto border border-outline-variant/20 dark:border-card-border">
            {(['all', 'paid', 'pending', 'overdue', 'draft'] as const).map(tab => {
              const count =
                tab === 'all'
                  ? invoices.length
                  : invoices.filter(inv => inv.status === tab).length;

              const isSelected = statusFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all capitalize ${
                    isSelected
                      ? 'text-on-primary bg-primary dark:bg-brand-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high'
                  }`}
                  type="button"
                >
                  {tab === 'all' ? `All (${count})` : `${tab} (${count})`}
                </button>
              );
            })}
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-space-xs">
            <div className="flex items-center gap-2 bg-surface-container-low dark:bg-canvas-card-elevated px-space-sm py-2 rounded-xl text-on-surface-variant dark:text-text-medium font-label-md text-label-md border border-outline-variant/20 dark:border-card-border">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>All Ledger Periods</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {filteredInvoices.length === 0 ? (
          <EmptyState
            type="no-data"
            title={searchQuery ? `No invoices match "${searchQuery}"` : 'No invoices in this status'}
            description="Create your first professional invoice in seconds and send it directly via WhatsApp or email with instant payment links."
            primaryActionText="+ Create First Invoice"
            onPrimaryAction={() => openInvoiceDrawer()}
            secondaryActionText={searchQuery ? 'Clear Search' : undefined}
            onSecondaryAction={() => setSearchQuery('')}
          />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="py-3 px-space-md font-semibold">Invoice ID</th>
                  <th className="py-3 px-space-md font-semibold">Client & Company</th>
                  <th className="py-3 px-space-md font-semibold">Issue Date</th>
                  <th className="py-3 px-space-md font-semibold">Due Date</th>
                  <th className="py-3 px-space-md font-semibold text-right">Total Amount</th>
                  <th className="py-3 px-space-md font-semibold text-center">Status</th>
                  <th className="py-3 px-space-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-surface-container-high/40 dark:divide-card-border/40 text-on-surface dark:text-text-high">
                {filteredInvoices.map(inv => {
                  const isPaid = inv.status === 'paid';
                  const isOverdue = inv.status === 'overdue';
                  const isPending = inv.status === 'pending';

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => openInvoicePreview(inv.id)}
                      className="hover:bg-surface-container-low/50 dark:hover:bg-canvas-card-elevated/50 transition-colors group cursor-pointer"
                    >
                      {/* Invoice ID */}
                      <td className="py-3.5 px-space-md font-numeric-md text-numeric-md font-semibold text-primary dark:text-brand-primary">
                        <span className="hover:underline">{inv.invoiceNumber}</span>
                      </td>

                      {/* Client & Company */}
                      <td className="py-3.5 px-space-md">
                        <div className="flex flex-col min-w-0">
                          <span className="font-title-md text-title-md text-on-surface dark:text-text-high leading-tight truncate font-medium">
                            {inv.clientName}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted truncate">
                            {inv.clientCompany || 'Direct Client'}
                          </span>
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-space-md text-on-surface-variant dark:text-text-medium font-numeric-md text-numeric-md">
                        {inv.issueDate}
                      </td>

                      {/* Due Date */}
                      <td
                        className={`py-3.5 px-space-md font-numeric-md text-numeric-md font-medium ${
                          isOverdue
                            ? 'text-error dark:text-status-red-text font-bold'
                            : isPending
                            ? 'text-tertiary dark:text-status-amber-text'
                            : 'text-on-surface-variant dark:text-text-muted'
                        }`}
                      >
                        {inv.dueDate}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-space-md text-right font-numeric-md text-numeric-md font-bold text-on-surface dark:text-text-high">
                        ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-space-md text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isPaid
                              ? 'bg-secondary-container/50 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                              : isOverdue
                              ? 'bg-error-container dark:bg-status-red-bg text-on-error-container dark:text-status-red-text'
                              : isPending
                              ? 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text'
                              : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-text-muted'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid
                                ? 'bg-secondary dark:bg-status-emerald'
                                : isOverdue
                                ? 'bg-error dark:bg-status-red'
                                : isPending
                                ? 'bg-tertiary dark:bg-status-amber'
                                : 'bg-outline dark:bg-text-muted'
                            }`}
                          ></span>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-space-md text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleWhatsAppSend(inv.invoiceNumber, inv.clientName)}
                            className="p-1.5 text-secondary dark:text-status-emerald-text hover:bg-secondary-container/30 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Send WhatsApp Reminder"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                          </button>

                          <button
                            onClick={() => toggleInvoicePaid(inv.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPaid
                                ? 'text-on-surface-variant dark:text-text-muted hover:text-primary dark:hover:text-brand-primary hover:bg-surface-container'
                                : 'text-secondary dark:text-status-emerald-text hover:bg-secondary-container/30'
                            }`}
                            title={isPaid ? 'Mark as Pending' : 'Record Payment (Mark Paid)'}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isPaid ? 'undo' : 'check_circle'}
                            </span>
                          </button>

                          <button
                            onClick={() => openInvoiceDrawer(inv.id)}
                            className="p-1.5 text-primary dark:text-brand-primary hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit Invoice"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${inv.invoiceNumber}?`)) {
                                deleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-error dark:hover:text-status-red-text hover:bg-error-container/30 dark:hover:bg-status-red-bg rounded-lg transition-colors"
                            title="Delete Invoice"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
