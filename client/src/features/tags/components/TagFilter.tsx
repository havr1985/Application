import type { FC } from 'react';
import { useTags } from '../store/tags.selectors.ts';
import { DEFAULT_COLOR, TAG_COLORS } from '../constants/tags.constants.ts';

interface TagFilterProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export const TagFilter: FC<TagFilterProps> = ({ selected, onChange }) => {
  const tags = useTags();

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const clearAll = () => onChange([]);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-text-secondary">Filter:</span>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.id);
        const color = TAG_COLORS[tag.name] || DEFAULT_COLOR;

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${color} ${isSelected ? 'ring-2 ring-offset-1 ring-accent-500 shadow-sm' : 'opacity-50 hover:opacity-80'}`}
          >
            #{tag.name.toUpperCase()}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          onClick={clearAll}
          className="text-xs text-text-tertiary hover:text-danger-500 transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
