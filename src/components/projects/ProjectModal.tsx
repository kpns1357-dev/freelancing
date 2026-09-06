import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

export const ProjectModal: React.FC = () => {
  const {
    isProjectModalOpen,
    closeProjectModal,
    editingProjectId,
    projects,
    clients,
    addProject,
    updateProject,
    deleteProject
  } = useApp();

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [price, setPrice] = useState<number>(5000);
  const [progress, setProgress] = useState<number>(0);
  const [scope, setScope] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = Boolean(editingProjectId);
  const editingProject = projects.find(p => p.id === editingProjectId);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setClientId(editingProject.clientId);
      setStatus(editingProject.status);
      setStartDate(editingProject.startDate);
      setDeadline(editingProject.deadline);
      setPrice(editingProject.price);
      setProgress(editingProject.progress);
      setScope(editingProject.scope || '');
      setErrors({});
    } else {
      // New Project defaults
      setName('');
      setClientId(clients[0]?.id || '');
      setStatus('Planning');
      const now = new Date();
      setStartDate(now.toISOString().split('T')[0]);
      const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      setDeadline(future.toISOString().split('T')[0]);
      setPrice(7500);
      setProgress(0);
      setScope('');
      setErrors({});
    }
  }, [editingProject, isProjectModalOpen, clients]);

  if (!isProjectModalOpen) return null;

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Project title is required';
    if (!clientId) errs.clientId = 'Please select a linked client';
    if (!deadline) errs.deadline = 'Target deadline date is required';
    if (price < 0) errs.price = 'Contract price must be positive';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedClient = clients.find(c => c.id === clientId);
    const clientName = selectedClient ? `${selectedClient.name} (${selectedClient.company || ''})` : 'Client';

    if (isEditing && editingProjectId) {
      updateProject(editingProjectId, {
        name,
        clientId,
        clientName,
        status,
        startDate,
        deadline,
        price: Number(price),
        progress: Number(progress),
        scope
      });
      closeProjectModal();
    } else {
      addProject({
        name,
        clientId,
        clientName,
        status,
        startDate,
        deadline,
        price: Number(price),
        progress: Number(progress),
        scope
      });
      closeProjectModal();
    }
  };

  const handleDelete = () => {
    if (editingProjectId && window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      deleteProject(editingProjectId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeProjectModal}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="relative bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/30 dark:border-card-border rounded-2xl shadow-2xl max-w-lg w-full p-space-lg flex flex-col gap-space-md z-10">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 dark:border-card-border/60">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary dark:text-brand-primary text-[24px]">
              folder_open
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
              {isEditing ? 'Edit Project Deliverable' : 'New Project Scope'}
            </h3>
          </div>
          <button
            onClick={closeProjectModal}
            className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-sm">
          {/* Project Name */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Project Title *
            </label>
            <input
              className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.name ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
              }`}
              placeholder="e.g. Phase 2: Mobile UI/UX Design System"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && (
              <span className="font-body-sm text-body-sm text-error">{errors.name}</span>
            )}
          </div>

          {/* Linked Client */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Linked Client *
            </label>
            <select
              className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company}
                </option>
              ))}
            </select>
          </div>

          {/* Status & Contract Price */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Status
              </label>
              <select
                className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus)}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Contract Value ($)
              </label>
              <input
                className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-numeric-md text-numeric-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Start Date & Deadline */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Start Date
              </label>
              <input
                className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Deadline *
              </label>
              <input
                className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.deadline ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
                }`}
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Progress % Slider & Number */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Progress Completion
              </label>
              <span className="font-numeric-md text-numeric-md font-bold text-primary dark:text-brand-primary">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-brand-primary"
            />
          </div>

          {/* Scope / Deliverable Description */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Scope Summary
            </label>
            <textarea
              className="p-2.5 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={2}
              placeholder="e.g. Design system guidelines, interactive Figma prototype..."
              value={scope}
              onChange={e => setScope(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Action Tray */}
        <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20 dark:border-card-border/60 mt-1">
          {isEditing ? (
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-error dark:text-status-red-text hover:bg-error-container/30 dark:hover:bg-status-red-bg rounded-xl font-label-md text-label-md font-semibold transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>Delete</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-space-xs">
            <button
              onClick={closeProjectModal}
              className="px-3 py-2 text-on-surface-variant dark:text-text-medium hover:bg-surface-container dark:hover:bg-slate-700 rounded-xl font-label-md text-label-md transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover rounded-xl font-label-md text-label-md font-semibold shadow-sm transition-all"
              type="button"
            >
              {isEditing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
