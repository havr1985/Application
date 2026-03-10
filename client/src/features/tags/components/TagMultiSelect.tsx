import type { FC } from 'react';
import { useTags } from '../store/tags.selectors.ts';
import { SELECTED_RING, TAG_CONFIG } from '../constants/tags.constants.ts';

interface TagMultiSelectProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export const TagMultiSelect: FC<TagMultiSelectProps> = ({
  selected,
  onChange,
}) => {
  const tags = useTags();
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.id);
        const config = TAG_CONFIG[tag.name];

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-all cursor-pointer ${config?.bg || 'bg-surface-tertiary'} ${config?.text || 'text-text-secondary'} ${isSelected ? SELECTED_RING : 'opacity-60 hover:opacity-100'}`}
          >
            #{tag.name.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
