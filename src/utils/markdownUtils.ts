
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const renderMarkdown = (text: string): string => {
  // Parse markdown to HTML
  const rawHtml = marked.parse(text, { breaks: true });
  
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  return sanitizedHtml;
};
