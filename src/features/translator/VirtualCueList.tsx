import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useState, type RefObject } from 'react';
import type { Cue } from '../../core/srt/srt';
import type { Profile } from '../../core/subtitles/subtitles';
import { CueRow } from './CueRow';

const ESTIMATED_CUE_ROW_HEIGHT = 220;
const VISIBLE_ROW_BUFFER = 8;

interface Props {
  cues: Cue[];
  translations: Record<string, string>;
  edited: Record<string, boolean>;
  activeIds: ReadonlySet<string>;
  failed: boolean;
  profile?: Profile;
  groups: number[];
  activeId?: string;
  follow: boolean;
  scrollElement: RefObject<HTMLDivElement | null>;
  onSave: (id: string, value: string) => void;
}

export function VirtualCueList({
  cues,
  translations,
  edited,
  activeIds,
  failed,
  profile,
  groups,
  activeId,
  follow,
  scrollElement,
  onSave,
}: Props) {
  const [editingIndexes, setEditingIndexes] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const activeIndex = useMemo(
    () => (activeId ? cues.findIndex((cue) => cue.id === activeId) : -1),
    [activeId, cues],
  );
  // TanStack Virtual owns mutable measurements and intentionally exposes
  // imperative scroll methods, so React Compiler cannot safely memoize it.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: cues.length,
    getScrollElement: () => scrollElement.current,
    estimateSize: () => ESTIMATED_CUE_ROW_HEIGHT,
    overscan: VISIBLE_ROW_BUFFER,
    rangeExtractor: (range) =>
      editingIndexes.size
        ? [
            ...new Set([...defaultRangeExtractor(range), ...editingIndexes]),
          ].sort((left, right) => left - right)
        : defaultRangeExtractor(range),
  });

  useEffect(() => {
    setEditingIndexes(new Set());
  }, [cues]);

  useEffect(() => {
    if (follow && activeIndex >= 0)
      rowVirtualizer.scrollToIndex(activeIndex, { align: 'center' });
  }, [activeIndex, follow, rowVirtualizer]);

  return (
    <div
      className="virtual-cue-list"
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const cue = cues[virtualRow.index];
        const group = groups[virtualRow.index];
        return (
          <div
            key={cue.id}
            ref={rowVirtualizer.measureElement}
            data-index={virtualRow.index}
            className="virtual-cue-row"
            style={{ transform: `translateY(${virtualRow.start}px)` }}
          >
            <CueRow
              cue={cue}
              translation={translations[cue.id]}
              edited={!!edited[cue.id]}
              active={activeIds.has(cue.id)}
              failed={failed}
              profile={profile}
              group={group}
              groupStart={
                virtualRow.index === 0 || group !== groups[virtualRow.index - 1]
              }
              onSave={onSave}
              onEditingChange={(editing) => {
                setEditingIndexes((previous) => {
                  const next = new Set(previous);
                  if (editing) next.add(virtualRow.index);
                  else next.delete(virtualRow.index);
                  return next;
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
