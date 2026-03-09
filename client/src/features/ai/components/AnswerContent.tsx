import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';

export const AnswerContent: FC<{ text: string }> = ({ text }) => {
  return (
    <div
      className="prose prose-sm max-w-none text-text-primary
      prose-strong:text-text-primary
      prose-ul:my-2 prose-li:my-0.5
      prose-p:my-1.5 prose-p:leading-relaxed"
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};
