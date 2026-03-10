import type { FC } from 'react';
import { TAG_CONFIG } from '../../constants/tags.constants.ts';

interface TagChipsProps {
  tags: { id: string; name: string }[];
}

export const TagChips: FC<TagChipsProps> = ({ tags }: TagChipsProps) => {
  if (!tags) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const config = TAG_CONFIG[tag.name];
        return (
          <span
            key={tag.id}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config?.bg || 'bg-surface-tertiary'} ${config?.text || 'text-text-secondary'}`}
          >
            #{tag.name.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
