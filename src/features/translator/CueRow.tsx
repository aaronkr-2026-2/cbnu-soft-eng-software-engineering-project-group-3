import { useState } from 'react';
import { Button, Input, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Cue } from '../../core/srt/srt';
import { textRuns } from '../../core/srt/markup';
import { quality, type Profile } from '../../core/subtitles/subtitles';

function SubtitleText({ text }: { text: string }) {
  return (
    <div className="subtitle-text">
      {textRuns(text).map((run, index) => (
        <span
          key={index}
          style={{
            fontStyle: run.marks.includes('i') ? 'italic' : undefined,
            fontWeight: run.marks.includes('b') ? 700 : undefined,
            textDecoration: run.marks.includes('u') ? 'underline' : undefined,
          }}
        >
          {run.text}
        </span>
      ))}
    </div>
  );
}

interface Props {
  cue: Cue;
  translation?: string;
  edited: boolean;
  active: boolean;
  failed: boolean;
  profile?: Profile;
  group: number;
  groupStart: boolean;
  onSave: (id: string, value: string) => void;
}

export function CueRow({
  cue,
  translation,
  edited,
  active,
  failed,
  profile,
  group,
  groupStart,
  onSave,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const report =
    translation !== undefined && profile
      ? quality(translation, cue, profile)
      : undefined;
  const status = edited
    ? 'Edited'
    : translation !== undefined
      ? 'Translated'
      : active
        ? 'Translating'
        : failed
          ? 'Pending retry'
          : 'Waiting';
  return (
    <section
      id={cue.id}
      className={`cue-row ${groupStart ? 'group-start' : ''}`}
      aria-label={`Cue ${cue.index}`}
    >
      {groupStart && <div className="group-label">Group {group}</div>}
      <div className="cue-pair">
        <article
          className="cue-card original-card"
          tabIndex={0}
          aria-label={`Original cue ${cue.index}`}
        >
          <div className="cue-meta">
            <strong>#{cue.index}</strong>
            <span>
              {cue.start} → {cue.end}
            </span>
          </div>
          <SubtitleText text={cue.text} />
        </article>
        <article
          className={`cue-card translated-card ${editing ? 'is-editing' : ''}`}
          tabIndex={0}
          aria-label={`Translation cue ${cue.index}`}
        >
          <div className="cue-meta">
            <Tag
              color={
                edited
                  ? 'purple'
                  : translation !== undefined
                    ? 'green'
                    : active
                      ? 'blue'
                      : undefined
              }
            >
              {status}
            </Tag>
            {translation !== undefined && !editing && (
              <Button
                size="small"
                icon={<EditOutlined aria-hidden="true" />}
                aria-label={`Edit cue ${cue.index}`}
                onClick={() => {
                  setDraft(translation);
                  setError('');
                  setEditing(true);
                }}
              >
                Edit
              </Button>
            )}
          </div>
          {editing ? (
            <div className="edit-form">
              <Input.TextArea
                aria-label={`Edit translation ${cue.index}`}
                value={draft}
                autoSize={{ minRows: 2, maxRows: 8 }}
                onChange={(event) => setDraft(event.target.value)}
              />
              {error && <div role="alert">{error}</div>}
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  try {
                    onSave(cue.id, draft);
                    setEditing(false);
                  } catch (failure) {
                    setError(
                      failure instanceof Error
                        ? failure.message
                        : 'Invalid subtitle text.',
                    );
                  }
                }}
              >
                Save
              </Button>
              <Button size="small" onClick={() => setEditing(false)}>
                Cancel edit
              </Button>
            </div>
          ) : translation !== undefined ? (
            <SubtitleText text={translation} />
          ) : (
            <p className="waiting-text">
              {active
                ? 'Translating this batch…'
                : 'Translation will appear here.'}
            </p>
          )}
          {!!report?.warnings.length && (
            <div className="quality-warning">
              <strong>Needs review</strong>
              <ul>
                {report.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
