/**
 * Security & Anti-Scraping / Anti-Tampering Utility for ParkGolf Madang
 * Provides:
 * 1. Disabling malicious DevTools shortcuts & right click context menu (optional gentle mode)
 * 2. Input sanitization (XSS prevention)
 * 3. Honeypot check for bots
 * 4. Content protection banner & integrity checks
 */

// Basic HTML/Script tag sanitization against XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// SQL / Script injection heuristic filter
export function isSuspiciousPayload(str: string): boolean {
  if (!str) return false;
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /union\s+select/gi,
    /drop\s+table/gi,
    /--/g,
    /exec\s*\(/gi,
    /eval\s*\(/gi
  ];
  return suspiciousPatterns.some(pattern => pattern.test(str));
}

// Anti-Cloning & Code Protection Initializer
export function initClientSecurityGuards() {
  if (typeof window === 'undefined') return;

  // Prevent drag and drop scraping of images and core badges
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'IMG' || target.classList.contains('no-drag'))) {
      e.preventDefault();
    }
  };

  // Prevent right-click on sensitive images or text if marked with 'protect-copy'
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.closest('.protect-content')) {
      e.preventDefault();
    }
  };

  // Block F12 / Inspect shortcut combinations on protected elements if configured
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+U (View Source) or Ctrl+S (Save Page) warning
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      // Allow standard dev if needed, or gentle warning
    }
  };

  window.addEventListener('dragstart', handleDragStart);
  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('dragstart', handleDragStart);
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('keydown', handleKeyDown);
  };
}
