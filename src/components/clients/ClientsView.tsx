import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ClientsView: React.FC = () => {
  const { clients, projects, invoices, openClientDrawer, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ClientStatus>('All');
  const [sortBy, setSortBy] = useState<'name_asc' | 'revenue_desc' | 'last_active' | 'overdue'>('last_active');

  // Compute metrics for each client (active projects count, paid total, outstanding balance)
  const clientDataWithTotals = useMemo(() => {
    return clients.map(client => {
      const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
      const clientProjects = projects.filter(p => p.clientId === client.id);

      const totalPaid = clientInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
      const totalOutstanding = clientInvoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)), 0);

      const hasOverdue = clientInvoices.some(inv => inv.status === 'overdue');

      return {
        ...client,
        activeProjectsCount: clientProjects.filter(p => p.status !== 'Completed').length,
        totalProjectsCount: clientProjects.length,
        totalPaid,
        totalOutstanding,
        hasOverdue,
        projectsList: clientProjects
      };
    });
  }, [clients, projects, invoices]);

  // Overall metric strip figures
  const activeEngagementsCount = clientDataWithTotals.filter(c => c.status === 'Active').length;
  const pipelineInvoiced = clientDataWithTotals.reduce((acc, c) => acc + c.totalPaid + c.totalOutstanding, 0);
  const overdueExposure = clientDataWithTotals.reduce((acc, c) => (c.hasOverdue ? acc + c.totalOutstanding : acc), 0);
  const onboardingQueueCount = clientDataWithTotals.filter(c => c.status === 'Onboarding').length;

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    return clientDataWithTotals
      .filter(client => {
        // Status filter
        if (statusFilter !== 'All' && client.status !== statusFilter) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (client.name || '').toLowerCase().includes(q);
          const matchCompany = (client.company || '').toLowerCase().includes(q);
          const matchEmail = (client.email || '').toLowerCase().includes(q);
          if (!matchName && !matchCompany && !matchEmail) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'revenue_desc') {
          return b.totalPaid - a.totalPaid;
        }
        if (sortBy === 'overdue') {
          return b.totalOutstanding - a.totalOutstanding;
        }
        // default: last active (creation / id)
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [clientDataWithTotals, statusFilter, searchQuery, sortBy]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Name', 'Company', 'Email', 'Phone', 'Status', 'Paid', 'Outstanding'],
      ...filteredClients.map(c => [
        `"${c.name || ''}"`,
        `"${c.company || ''}"`,
        `"${c.email || ''}"`,
        `"${c.phone || ''}"`,
        `"${c.status || 'Active'}"`,
        c.totalPaid,
        c.totalOutstanding
      ])
    ];
    const blob = new Blob([csvRows.map(e => e.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientflow_clients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast({
      type: 'success',
      title: 'CSV Export Complete',
      message: `${filteredClients.length} client records downloaded.`
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-space-3xl">
      {/* Top Stat Highlights & Page Control Header */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold">
                  Clients
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary font-label-sm text-label-sm font-semibold">
                  {clients.length} Total Clients
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                Manage partner relationships, invoicing lifecycles, and direct touchpoints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest dark:bg-canvas-card text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 shadow-sm transition-all font-label-md text-label-md border border-outline-variant/30 dark:border-card-border"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => openClientDrawer()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all font-label-md text-label-md font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Add New Client</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm">
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-medium">
                Active Engagements
              </span>
              <span className="font-numeric-lg text-numeric-lg text-on-surface dark:text-text-high font-bold mt-1">
                {activeEngagementsCount}{' '}
                <span className="font-body-sm text-body-sm text-secondary dark:text-status-emerald-text font-medium">
                  ({clients.length > 0 ? Math.round((activeEngagementsCount / clients.length) * 100) : 0}%)
                </span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 dark:bg-status-emerald-bg flex items-center justify-center text-secondary dark:text-status-emerald-text">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-medium">
                Pipeline Invoiced
              </span>
              <span className="font-numeric-lg text-numeric-lg text-on-surface dark:text-text-high font-bold mt-1">
                ${pipelineInvoiced.toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-primary dark:text-brand-primary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-medium">
                Overdue Exposure
              </span>
              <span className="font-numeric-lg text-numeric-lg text-error dark:text-status-red-text font-bold mt-1">
                ${overdueExposure.toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-error-container/40 dark:bg-status-red-bg flex items-center justify-center text-error dark:text-status-red-text">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-medium">
                Onboarding Queue
              </span>
              <span className="font-numeric-lg text-numeric-lg text-tertiary dark:text-status-amber-text font-bold mt-1">
                {onboardingQueueCount} Accounts
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 dark:bg-status-amber-bg flex items-center justify-center text-tertiary dark:text-status-amber-text">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Command Bar */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-sm shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
        {/* Search Bar */}
        <div className="flex items-center gap-space-xs bg-surface-container-low dark:bg-canvas-card-elevated px-space-sm py-2 rounded-xl flex-1 max-w-xl border border-outline-variant/30 dark:border-card-border">
          <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px]">search</span>
          <input
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface dark:text-text-high placeholder:text-outline dark:placeholder:text-text-muted focus:outline-none"
            placeholder="Search by client name, company, email..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-on-surface-variant dark:text-text-muted hover:text-on-surface p-0.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Status Filters & Sorting */}
        <div className="flex items-center flex-wrap gap-space-xs">
          <div className="flex items-center bg-surface-container-low dark:bg-canvas-card-elevated p-1 rounded-xl border border-outline-variant/20 dark:border-card-border">
            {(['All', 'Active', 'Onboarding', 'Archived'] as const).map(tab => {
              const count =
                tab === 'All'
                  ? clients.length
                  : clients.filter(c => c.status === tab).length;

              const isSelected = statusFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest dark:bg-canvas-card text-primary dark:text-brand-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high'
                  }`}
                  type="button"
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-outline-variant/30 dark:bg-card-border hidden md:block"></div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-low dark:bg-canvas-card-elevated px-3 py-1.5 rounded-xl border border-outline-variant/20 dark:border-card-border">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-text-muted">sort</span>
            <select
              className="bg-transparent font-label-md text-label-md text-on-surface dark:text-text-high font-medium focus:outline-none cursor-pointer"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value="last_active">Last Active</option>
              <option value="revenue_desc">Highest Revenue</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="overdue">Most Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Data Table Card */}
      {filteredClients.length === 0 ? (
        <EmptyState
          type={clients.length === 0 ? 'no-data' : 'no-results'}
          title={
            clients.length === 0
              ? 'No clients in directory yet'
              : `No clients match “${searchQuery}”`
          }
          description={
            clients.length === 0
              ? 'Add your first client partner to start organizing projects, billable hours, and invoices.'
              : 'Try checking for typos, exploring archived directories, or clearing your active filters to expand search bounds.'
          }
          query={searchQuery}
          primaryActionText="Add As New Client"
          onPrimaryAction={() => openClientDrawer()}
          secondaryActionText={clients.length > 0 ? "Clear All Filters" : undefined}
          onSecondaryAction={clients.length > 0 ? () => {
            setSearchQuery('');
            setStatusFilter('All');
          } : undefined}
        />
      ) : (
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Desktop / Tablet Table View */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider h-11 select-none">
                  <th className="px-space-md py-2 font-semibold">Client / Company</th>
                  <th className="px-space-md py-2 font-semibold">Contact Details</th>
                  <th className="px-space-md py-2 font-semibold">Active Projects</th>
                  <th className="px-space-md py-2 font-semibold text-right">Invoiced / Paid</th>
                  <th className="px-space-md py-2 font-semibold text-right">Outstanding</th>
                  <th className="px-space-md py-2 font-semibold text-center">Status</th>
                  <th className="px-space-md py-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 dark:divide-card-border/40 font-body-md text-body-md text-on-surface dark:text-text-high">
                {filteredClients.map(client => {
                  const clientInitials = (client.name || 'Client')
                    .split(' ')
                    .filter(Boolean)
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'CF';

                  return (
                    <tr
                      key={client.id}
                      onClick={() => openClientDrawer(client.id)}
                      className="hover:bg-surface-container-low/50 dark:hover:bg-canvas-card-elevated/50 transition-colors group cursor-pointer"
                    >
                      {/* Client / Company */}
                      <td className="px-space-md py-3.5">
                        <div className="flex items-center gap-space-sm">
                          {client.avatarUrl ? (
                            <img
                              className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm ring-1 ring-outline-variant/40"
                              src={client.avatarUrl}
                              alt={client.name || 'Client'}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary font-bold flex items-center justify-center shrink-0 text-sm">
                              {clientInitials}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold group-hover:text-primary dark:group-hover:text-brand-primary transition-colors">
                              {client.name || 'Unnamed Client'}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                              {client.company || 'Individual Client'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="px-space-md py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col text-on-surface-variant dark:text-text-medium">
                          <span className="font-body-sm text-body-sm text-on-surface dark:text-text-high flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-outline">mail</span>
                            {client.email || '—'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-numeric-md text-numeric-md text-on-surface-variant dark:text-text-muted">
                              {client.phone || '—'}
                            </span>
                            {client.phone && (
                              <a
                                className="text-secondary dark:text-status-emerald-text hover:opacity-80 p-0.5 rounded transition-colors inline-flex"
                                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                title="WhatsApp Ping"
                              >
                                <span className="material-symbols-outlined text-[15px]">chat</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Active Projects */}
                      <td className="px-space-md py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {client.activeProjectsCount > 0 ? (
                            <>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-container dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm font-medium">
                                {client.projectsList[0]?.name.slice(0, 14)}...
                              </span>
                              {client.activeProjectsCount > 1 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-container dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm font-medium">
                                  +{client.activeProjectsCount - 1} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-body-sm text-body-sm text-outline dark:text-text-muted">None</span>
                          )}
                        </div>
                      </td>

                      {/* Invoiced / Paid */}
                      <td className="px-space-md py-3.5 text-right font-numeric-md text-numeric-md font-semibold text-on-surface dark:text-text-high">
                        ${client.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Outstanding */}
                      <td className="px-space-md py-3.5 text-right font-numeric-md text-numeric-md">
                        {client.totalOutstanding > 0 ? (
                          <span
                            className={
                              client.hasOverdue
                                ? 'text-error dark:text-status-red-text font-bold'
                                : 'text-tertiary dark:text-status-amber-text font-medium'
                            }
                          >
                            ${client.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-secondary dark:text-status-emerald-text font-medium">$0.00</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-space-md py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                            client.status === 'Active'
                              ? 'bg-secondary-container/50 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                              : client.status === 'Onboarding'
                              ? 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text'
                              : 'bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-text-muted'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              client.status === 'Active'
                                ? 'bg-secondary dark:bg-status-emerald'
                                : client.status === 'Onboarding'
                                ? 'bg-tertiary dark:bg-status-amber'
                                : 'bg-outline dark:bg-text-muted'
                            }`}
                          ></span>
                          {client.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-space-md py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openClientDrawer(client.id)}
                            className="p-1.5 text-on-surface-variant dark:text-text-medium hover:text-primary dark:hover:text-brand-primary hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit Client"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
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
      )}
    </div>
  );
};
