import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CueRow } from './CueRow';
import { parseSrt, validateOutput } from '../../core/srt/srt';

const cue = parseSrt('7\n00:00:01,000 --> 00:00:04,000\nHello.')[0];
const props = {
  cue,
  translation: '<i>Original translation</i>',
  edited: false,
  active: false,
  failed: false,
  profile: 'adult' as const,
  group: 1,
  groupStart: true,
  onEditingChange: vi.fn(),
};
describe('cue editing', () => {
  it('keeps the persistent edit state and cancels without changing saved output', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(<CueRow {...props} onSave={save} />);
    await user.click(screen.getByRole('button', { name: 'Edit cue 7' }));
    expect(screen.getByLabelText('Translation cue 7')).toHaveClass(
      'is-editing',
    );
    await user.clear(screen.getByLabelText('Edit translation 7'));
    await user.type(
      screen.getByLabelText('Edit translation 7'),
      'Discard this draft',
    );
    await user.click(screen.getByRole('button', { name: 'Cancel edit' }));
    expect(save).not.toHaveBeenCalled();
    expect(screen.getByText('Original translation')).toBeInTheDocument();
    expect(screen.getByLabelText('Translation cue 7')).not.toHaveClass(
      'is-editing',
    );
  });
  it('rejects invalid edits, then saves valid text', async () => {
    const user = userEvent.setup();
    const save = vi.fn((_id: string, text: string) => validateOutput(text));
    render(<CueRow {...props} onSave={save} />);
    await user.click(screen.getByRole('button', { name: 'Edit cue 7' }));
    await user.clear(screen.getByLabelText('Edit translation 7'));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert')).toHaveTextContent('nonempty');
    await user.type(
      screen.getByLabelText('Edit translation 7'),
      'Saved correction',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).toHaveBeenLastCalledWith('cue-1', 'Saved correction');
    expect(
      screen.queryByLabelText('Edit translation 7'),
    ).not.toBeInTheDocument();
  });
});
