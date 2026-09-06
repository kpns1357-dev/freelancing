import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ProjectsView: React.FC = () => {
  const { projects, openProjectModal, deleteProject, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'price' | 'name'>('deadline');
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');

  const today = new Date();

  // Helper to compute deadline status
  const getDeadlineInfo = (deadlineStr: string, status: ProjectStatus) => {
    if (status === 'Completed') {
      return { text: 'Completed', color: 'text-secondary dark:text-status-emerald-text', badgeBg: 'bg-secondary-container/50 dark:bg-status-emerald-bg', isOverdue: false };
    }
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)}d overdue`,
        color: 'text-error dark:text-status-red-text font-bold',
        badgeBg: 'bg-error-container/60 dark:bg-status-red-bg text-on-error-container dark:text-status-red-text',
        isOverdue: true
      };
    } else if (diffDays <= 5) {
      return {
        text: `${diffDays === 0 ? 'Today' : `${diffDays} days left`}`,
        color: 'text-tertiary dark:text-status-amber-text font-semibold',
        badgeBg: 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text',
        isOverdue: false
      };
    } else {
      return {
        text: `${diffDays} days left`,
        color: 'text-on-surface-variant dark:text-text-medium',
        badgeBg: 'bg-surface-container dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium',
        isOverdue: false
      };
    }
  };

  // Filtered & sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        if (statusFilter !== 'All' && p.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchClient = p.clientName.toLowerCase().includes(q);
          const matchScope = (p.scope || '').toLowerCase().includes(q);
          if (!matchName && !matchClient && !matchScope) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'price') {
          return b.price - a.price;
        }
        return a.name.localeCompare(b.name);
      });
  }, [projects, statusFilter, searchQuery, sortBy]);

  // KPI Metrics - dynamically calculated
  const totalProjectsCount = projects.length;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const inFlightValue = projects
    .filter(p => p.status !== 'Completed')
    .reduce((acc, p) => acc + p.price, 0);

  const nearingDeadlineCount = projects.filter(p => {
    if (p.status === 'Completed') return false;
    const diff = Math.ceil((new Date(p.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 5;
  }).length;

  const completedCount = projects.filter(p => p.status === 'Completed').length;
  // Progress ratios
  const activeRatio = totalProjectsCount > 0 ? Math.round((activeProjectsCount / totalProjectsCount) * 100) : 0;
  const nearingDeadlineRatio = activeProjectsCount > 0 ? Math.round((nearingDeadlineCount / activeProjectsCount) * 100) : 0;
  const inFlightRatio = inFlightValue > 0 ? Math.min(100, Math.round((inFlightValue / (inFlightValue + 10000)) * 100)) : 0;
  const onTimePercentage = totalProjectsCount > 0 ? Math.round((completedCount / totalProjectsCount) * 100) : 0;

  const handleOptionsClick = () => {
    showToast({
      type: 'success',
      title: 'Portfolio Filters Active',
      message: 'Viewing enterprise deliverables schedule.'
    });
  };

  return (
    <div className="flex flex-col w-full pb-space-3xl">
      {/* Dynamic Ambient Glow */}
      <div className="relative w-full">
        <div className="absolute -top-12 -left-20 w-96 h-96 bg-surface-container-high/60 dark:bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-10 w-80 h-80 bg-primary-fixed/30 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Page Title & Top Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md py-space-sm mb-space-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary dark:text-brand-primary font-bold">
                Workspace Portfolio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted">
                Operations
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold mt-1">
              Projects
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium">
              Track project milestones, client deliverables, budgets, and deadlines
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={handleOptionsClick}
              className="flex items-center gap-1.5 bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/30 dark:border-card-border text-on-surface dark:text-text-high px-space-md py-2 rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container dark:hover:bg-slate-700 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>View Options</span>
            </button>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-2 bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary px-space-md py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[19px]">add_circle</span>
              <span className="tracking-wide">+ New Project</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          {/* KPI 1 */}
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-text-muted font-medium">
                Active Projects
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high dark:bg-canvas-card-elevated flex items-center justify-center text-primary dark:text-brand-primary">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface dark:text-text-high">
                {activeProjectsCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted bg-surface-container-high dark:bg-canvas-card-elevated px-2 py-0.5 rounded-full font-semibold">
                {totalProjectsCount > 0 ? `${activeRatio}% active` : 'No projects'}
              </span>
            </div>
            <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary dark:bg-brand-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${activeRatio}%` }}
              ></div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-text-muted font-medium">
                Nearing Deadline
              </span>
              <div className="w-8 h-8 rounded-lg bg-error-container/60 dark:bg-status-red-bg flex items-center justify-center text-error dark:text-status-red-text">
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className={`font-headline-lg text-headline-lg font-bold ${nearingDeadlineCount > 0 ? 'text-error dark:text-status-red-text' : 'text-on-surface dark:text-text-high'}`}>
                {nearingDeadlineCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted font-medium">
                {nearingDeadlineCount > 0 ? `${nearingDeadlineCount} urgent` : '< 5 days left'}
              </span>
            </div>
            <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-error dark:bg-status-red h-full rounded-full transition-all duration-500"
                style={{ width: `${nearingDeadlineRatio}%` }}
              ></div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-text-muted font-medium">
                Total In-Flight Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high dark:bg-canvas-card-elevated flex items-center justify-center text-primary dark:text-brand-primary">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface dark:text-text-high">
                ${inFlightValue.toLocaleString()}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted bg-surface-container-high dark:bg-canvas-card-elevated px-2 py-0.5 rounded-full font-semibold">
                {inFlightValue > 0 ? 'Active' : '$0.00'}
              </span>
            </div>
            <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-secondary dark:bg-status-emerald h-full rounded-full transition-all duration-500"
                style={{ width: `${inFlightRatio}%` }}
              ></div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-text-muted font-medium">
                On-Time Delivery
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container/50 dark:bg-status-emerald-bg flex items-center justify-center text-secondary dark:text-status-emerald-text">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface dark:text-text-high">
                {onTimePercentage}%
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted">
                {completedCount} of {totalProjectsCount} done
              </span>
            </div>
            <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-secondary dark:bg-status-emerald h-full rounded-full transition-all duration-500"
                style={{ width: `${onTimePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters, Search & Tabs Strip */}
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-sm shadow-sm mb-space-md flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-low dark:bg-canvas-card-elevated p-1 rounded-lg overflow-x-auto border border-outline-variant/20 dark:border-card-border">
            {(['All', 'In Progress', 'Planning', 'Completed'] as const).map(statusTab => {
              const count =
                statusTab === 'All'
                  ? projects.length
                  : projects.filter(p => p.status === statusTab).length;

              const isSelected = statusFilter === statusTab;

              return (
                <button
                  key={statusTab}
                  onClick={() => setStatusFilter(statusTab)}
                  className={`px-space-sm py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-surface-container-lowest dark:bg-canvas-card text-primary dark:text-brand-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high'
                  }`}
                  type="button"
                >
                  <span>{statusTab === 'All' ? 'All Projects' : statusTab}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-numeric-md text-[11px] ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary'
                        : 'bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs flex-1 max-w-xl xl:justify-end">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline dark:text-text-muted">
                search
              </span>
              <input
                className="w-full bg-surface-container-low dark:bg-canvas-card-elevated focus:bg-surface-container-lowest dark:focus:bg-canvas-card text-on-surface dark:text-text-high font-body-sm text-body-sm pl-9 pr-space-md py-2 rounded-lg outline-none border border-outline-variant/20 dark:border-card-border transition-all placeholder:text-outline dark:placeholder:text-text-muted focus:ring-2 focus:ring-primary/20"
                placeholder="Filter projects by name, client, or tag..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-space-xs self-end sm:self-auto">
              <div className="flex items-center gap-1 bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/20 dark:border-card-border px-space-sm py-2 rounded-lg text-on-surface dark:text-text-high font-label-md text-label-md cursor-pointer hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[17px] text-on-surface-variant dark:text-text-muted">
                  sort
                </span>
                <span className="text-on-surface-variant dark:text-text-muted">Sort:</span>
                <select
                  className="bg-transparent font-medium focus:outline-none cursor-pointer"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                >
                  <option value="deadline">Deadline: Soonest First</option>
                  <option value="price">Budget: Highest</option>
                  <option value="name">Title (A-Z)</option>
                </select>
              </div>

              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-surface-container-high dark:bg-canvas-card-elevated text-primary dark:text-brand-primary'
                    : 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-text-muted'
                }`}
                title="Table View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'board'
                    ? 'bg-surface-container-high dark:bg-canvas-card-elevated text-primary dark:text-brand-primary'
                    : 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-text-muted'
                }`}
                title="Board View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project View Rendering */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            type="no-results"
            title={`No projects match “${searchQuery}”`}
            description="Clear search filters or add a new deliverable scope to your workspace portfolio."
            query={searchQuery}
            primaryActionText="+ New Project"
            onPrimaryAction={() => openProjectModal()}
            secondaryActionText="Clear Filter"
            onSecondaryAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          />
        ) : viewMode === 'board' ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {(['Planning', 'In Progress', 'Completed'] as ProjectStatus[]).map(colStatus => {
              const colProjects = filteredProjects.filter(p => p.status === colStatus);
              return (
                <div
                  key={colStatus}
                  className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-md flex flex-col gap-space-sm"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 dark:border-card-border/60">
                    <span className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high">
                      {colStatus}
                    </span>
                    <span className="bg-surface-container dark:bg-slate-800 px-2 py-0.5 rounded-full font-numeric-md text-sm text-on-surface-variant dark:text-text-muted font-semibold">
                      {colProjects.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    {colProjects.map(proj => {
                      const deadlineInfo = getDeadlineInfo(proj.deadline, proj.status);
                      return (
                        <div
                          key={proj.id}
                          onClick={() => openProjectModal(proj.id)}
                          className="p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/20 dark:border-card-border hover:shadow-md cursor-pointer transition-all flex flex-col gap-2"
                        >
                          <span className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high leading-tight">
                            {proj.name}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                            {proj.clientName}
                          </span>

                          <div className="w-full bg-surface-container-high dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-primary dark:bg-brand-primary h-full rounded-full"
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-[12px] pt-1 border-t border-outline-variant/10 dark:border-card-border/50">
                            <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
                            <span className="font-numeric-md font-bold text-on-surface dark:text-text-high">
                              ${proj.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl shadow-sm overflow-hidden mb-space-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider h-10 select-none">
                    <th className="py-2.5 px-space-md font-semibold">Project Name & Scope</th>
                    <th className="py-2.5 px-space-md font-semibold">Linked Client</th>
                    <th className="py-2.5 px-space-md font-semibold text-center">Status</th>
                    <th className="py-2.5 px-space-md font-semibold">Progress</th>
                    <th className="py-2.5 px-space-md font-semibold">Timeline & Deadline</th>
                    <th className="py-2.5 px-space-md font-semibold text-right">Contract Value</th>
                    <th className="py-2.5 px-space-md font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container dark:divide-card-border/40 font-body-sm text-body-sm text-on-surface dark:text-text-high">
                  {filteredProjects.map(proj => {
                    const deadlineInfo = getDeadlineInfo(proj.deadline, proj.status);

                    return (
                      <tr
                        key={proj.id}
                        onClick={() => openProjectModal(proj.id)}
                        className="hover:bg-surface-container-low/60 dark:hover:bg-canvas-card-elevated/60 transition-colors group cursor-pointer"
                      >
                        {/* Name & Scope */}
                        <td className="py-3 px-space-md">
                          <div className="flex flex-col">
                            <span className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high group-hover:text-primary dark:group-hover:text-brand-primary transition-colors">
                              {proj.name}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                              {proj.scope || 'Standard engagement deliverable'}
                            </span>
                          </div>
                        </td>

                        {/* Linked Client */}
                        <td className="py-3 px-space-md">
                          <span className="font-body-md text-body-md text-on-surface dark:text-text-high font-medium">
                            {proj.clientName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-space-md text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                              proj.status === 'Completed'
                                ? 'bg-secondary-container/50 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                                : proj.status === 'In Progress'
                                ? 'bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary'
                                : 'bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-text-muted'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="py-3 px-space-md">
                          <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted">
                              <span>{proj.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container-high dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  proj.progress === 100
                                    ? 'bg-secondary dark:bg-status-emerald'
                                    : 'bg-primary dark:bg-brand-primary'
                                }`}
                                style={{ width: `${proj.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Timeline & Deadline */}
                        <td className="py-3 px-space-md">
                          <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface dark:text-text-high font-medium">
                              {proj.deadline}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md font-label-sm text-[11px] self-start mt-0.5 ${deadlineInfo.badgeBg}`}
                            >
                              {deadlineInfo.text}
                            </span>
                          </div>
                        </td>

                        {/* Contract Value */}
                        <td className="py-3 px-space-md text-right font-numeric-md text-numeric-md font-bold text-on-surface dark:text-text-high">
                          ${proj.price.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-space-md text-right" onClick={e => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openProjectModal(proj.id)}
                              className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-primary dark:hover:text-brand-primary hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Edit Project"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete project "${proj.name}"?`)) {
                                  deleteProject(proj.id);
                                }
                              }}
                              className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-error dark:hover:text-status-red-text hover:bg-error-container/30 dark:hover:bg-status-red-bg rounded-lg transition-colors"
                              title="Delete Project"
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
          </div>
        )}
      </div>
    </div>
  );
};
