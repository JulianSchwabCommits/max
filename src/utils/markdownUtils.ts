
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const renderMarkdown = (text: string): string => {
  // Parse markdown to HTML
  // Use marked.parse in synchronous mode by specifying { async: false }
  const rawHtml = marked.parse(text, { breaks: true, async: false }) as string;
  
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  return sanitizedHtml;
};
