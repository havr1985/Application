import { type FC, useState } from 'react';
import { aiApi } from '../api/ai.api.ts';
import { Bot, Send, X } from 'lucide-react';
import { AnswerContent } from './AnswerContent.tsx';

export const AiAssistantChat: FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setAnswer('');
      const data = await aiApi.ask(question);
      setAnswer(data.answer);
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
          <Bot size={20} className="text-accent-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Assistant</h1>
          <p className="text-sm text-text-secondary">
            Ask questions about your events in natural language
          </p>
        </div>
      </div>

      <div className="card p-6">
        {/* Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g., What events am I attending this week?"
              className="input-field pr-9"
              disabled={isLoading}
            />
            {question && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            className="btn-accent flex items-center gap-2 shrink-0"
          >
            <Send size={16} />
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>

        {/* Example questions */}
        {!answer && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'What events am I attending this week?',
              'When is my next event?',
              'Show public tech events',
              'List all events I organize',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setQuestion(q)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent-500" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:0.3s]" />
            </div>
            <span className="text-sm">Analyzing your question...</span>
          </div>
        )}

        {/* Answer */}
        {answer && !isLoading && (
          <div className="mt-6">
            <div className="flex items-start gap-3 rounded-lg bg-surface-secondary p-4">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-100">
                <Bot size={14} className="text-accent-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs font-medium text-text-tertiary">
                  AI Assistant
                </p>
                <AnswerContent text={answer} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
