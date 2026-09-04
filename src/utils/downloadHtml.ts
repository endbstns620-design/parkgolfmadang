import { useState } from 'react';

/**
 * Hook to download current page or offline HTML file
 */
export function useDownloadHtml() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCurrentHtml = async () => {
    setIsDownloading(true);
    try {
      // Fetch current HTML page
      const response = await fetch(window.location.href);
      let htmlText = await response.text();

      // Create a blob and trigger download
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kwang-beauty-studio-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback using document.documentElement.outerHTML
      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kwang-beauty-studio-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadCurrentHtml, isDownloading };
}
