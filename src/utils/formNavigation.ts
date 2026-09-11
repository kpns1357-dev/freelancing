import React, { useEffect } from 'react';

/**
 * Handles Enter, ArrowDown, and ArrowUp keyboard navigation across form fields.
 * Smoothly advances focus to the next/previous field during form filling.
 */
export const handleFormKeyDown = (e: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  const tagName = target.tagName?.toLowerCase();
  const isInput = tagName === 'input';
  const isSelect = tagName === 'select';
  const isTextarea = tagName === 'textarea';

  if (!isInput && !isSelect && !isTextarea) return;

  const isEnter = e.key === 'Enter';
  const isDown = e.key === 'ArrowDown';
  const isUp = e.key === 'ArrowUp';

  if (!isEnter && !isDown && !isUp) return;

  // In textarea: allow normal Enter for new lines unless Ctrl/Cmd is pressed
  if (isTextarea) {
    if (isEnter && !e.ctrlKey && !e.metaKey) {
      return;
    }
    const textarea = target as HTMLTextAreaElement;
    if (isUp && textarea.selectionStart > 0) {
      return;
    }
    if (isDown && textarea.selectionEnd < textarea.value.length) {
      return;
    }
  }

  // In select: let native arrow keys change options, but Enter moves to the next field
  if (isSelect && (isDown || isUp)) {
    return;
  }

  // Find enclosing container (drawer, modal, form, or dialog)
  const container =
    target.closest('form') ||
    target.closest('[data-form-container]') ||
    target.closest('.drawer-container') ||
    target.closest('[role="dialog"]') ||
    target.closest('.modal-container') ||
    document.body;

  if (!container) return;

  // Selector for focusable input elements in DOM order
  const focusableSelector = [
    'input:not([type="hidden"]):not([disabled]):not([readonly])',
    'select:not([disabled])',
    'textarea:not([disabled])'
  ].join(', ');

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector)
  ).filter(el => {
    return (
      el.offsetWidth > 0 ||
      el.offsetHeight > 0 ||
      el.getClientRects().length > 0
    );
  });

  const currentIndex = elements.indexOf(target);
  if (currentIndex === -1) return;

  if (isEnter || isDown) {
    e.preventDefault();
    const nextElement = elements[currentIndex + 1];
    if (nextElement) {
      nextElement.focus();
      if (
        nextElement instanceof HTMLInputElement &&
        ['text', 'number', 'email', 'tel', 'url', 'search'].includes(nextElement.type)
      ) {
        nextElement.select?.();
      }
    }
  } else if (isUp) {
    e.preventDefault();
    const prevElement = elements[currentIndex - 1];
    if (prevElement) {
      prevElement.focus();
      if (
        prevElement instanceof HTMLInputElement &&
        ['text', 'number', 'email', 'tel', 'url', 'search'].includes(prevElement.type)
      ) {
        prevElement.select?.();
      }
    }
  }
};

/**
 * React hook to enable smooth form keyboard navigation globally
 */
export const useFormKeyboardNavigation = () => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleFormKeyDown(e);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);
};
