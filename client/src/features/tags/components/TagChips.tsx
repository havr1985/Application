import type { FC } from 'react';
import { DEFAULT_COLOR, TAG_COLORS } from '../constants/tags.constants.ts';

interface TagChipsProps {
  tags: { id: string; name: string }[];
}

export const TagChips: FC<TagChipsProps> = ({ tags }: TagChipsProps) => {
  if (!tags) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[tag.name] || DEFAULT_COLOR}`}
        >
          #{tag.name.toUpperCase()}
        </span>
      ))}
    </div>
  );
};
