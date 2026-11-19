import { useEffect, useRef } from 'react';
import { Alert, Button, Card, Flex, Layout, Typography } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { spacing } from '../../app/theme';

const { Title, Paragraph, Link, Text } = Typography;

const qualityNotes = [
  {
    group: '246',
    note: 'The expressive nuance did not come through correctly.',
  },
  {
    group: '213',
    note: 'The speaking perspective was wrong. My original note also points to cue 251; check who is speaking and who they are talking about.',
  },
  { group: '207', note: 'Pretty good — about 4/5 in my test.' },
  { group: '189', note: 'Turned out well.' },
  { group: '151', note: 'Turned out well.' },
  { group: '132', note: 'An absolute masterpiece in my test.' },
  {
    group: '77',
    note: 'Not how a native speaker would phrase it. The counting expression did not sound natural in Mongolian.',
  },
  { group: '56', note: 'Turned out well.' },
];

export function ReviewerGuide({ busy }: { busy: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <Layout.Content
      className="reviewer-guide"
      aria-labelledby="reviewer-guide-title"
    >
      <Flex vertical gap={spacing.large} className="reviewer-guide-inner">
        <header>
          <Button
            href="#translator"
            icon={<ArrowLeftOutlined aria-hidden="true" />}
          >
            Back to translator
          </Button>
          <Title id="reviewer-guide-title" ref={heading} tabIndex={-1}>
            Reviewers Guide
          </Title>
          <Paragraph className="reviewer-guide-intro">
            Hello reviewer, thanks for checking my page! Here’s how to try the
            translator, review the results, and let me know what worked in your
            language.
          </Paragraph>
        </header>

        {busy && (
          <Alert
            type="info"
            showIcon
            title="Translation is running"
            description="Keep this tab open and in the foreground. Return to the translator to monitor progress or cancel."
          />
        )}

        <Card>
          <Title level={2}>Who is this for?</Title>
          <Paragraph>
            This is for a pretty niche group of movie viewers who:
          </Paragraph>
          <ol>
            <li>
              Are tech savvy and know how to find and download torrents. I’m not
              promoting piracy, but you know, life sometimes makes you “sail the
              seas.”
            </li>
            <li>
              Know how to get subtitles for their movie. The{' '}
              <Link
                href="https://github.com/exebetche/vlsub"
                target="_blank"
                rel="noopener noreferrer"
              >
                VLSub extension for VLC
              </Link>{' '}
              is my suggested starting point for finding an{' '}
              <Text code>.srt</Text> subtitle.
            </li>
          </ol>
          <Paragraph>
            New to subtitle files? You can still review the app using the
            example below.
          </Paragraph>
        </Card>

        <Card>
          <Title level={2}>Steps to check</Title>
          <ol className="reviewer-steps">
            <li>
              <Title level={3}>Upload an English .srt</Title>
              <Paragraph>
                Choose or drop your subtitle into the translator. If you don’t
                have one, download this English example from{' '}
                <em>The Devil Wears Prada 2</em>, then return to the translator
                and upload it. It is cut down to about 22 minutes: 461 cues,
                ending at 00:22:33.185. Plenty to try the workflow!
              </Paragraph>
              <Button
                href="/examples/devil-wears-prada-2-review.en.srt"
                download="devil-wears-prada-2-review.en.srt"
                icon={<DownloadOutlined aria-hidden="true" />}
              >
                Download example SRT
              </Button>
              <Paragraph type="secondary" className="sample-note">
                Provided for testing and review. I don’t own the copyright to
                the movie or its subtitles; no ownership or license is claimed
                here.
              </Paragraph>
            </li>
            <li>
              <Title level={3}>Choose your target language</Title>
              <Paragraph>
                This app uses English as its source language. Try English →
                Mongolian, English → Korean, English → Uzbek, or another target
                in the picker. Check{' '}
                <Link
                  href="https://docs.cloud.google.com/translate/docs/languages"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google’s supported languages and support levels
                </Link>{' '}
                for your chosen model. A language appearing in the picker does
                not guarantee full TLLM support.
              </Paragraph>
              <Paragraph>
                Google lists Mongolian as experimental for TLLM (checked
                November 5, 2026); it is also listed for NMT. In my Mongolian
                test, the results were mixed: some sounded very wrong, while
                others were excellent. I suspect limited language resources may
                play a part, but I haven’t established the cause. My hope is
                that an average viewer can follow the movie better than with
                English subtitles alone.
              </Paragraph>
            </li>
            <li>
              <Title level={3}>Select a translation method</Title>
              <Paragraph>
                I recommend trying TLLM first: it is Google Cloud Translation’s
                specialized Translation LLM. NMT is the fast general translation
                option. Quality varies by language and scene, so compare the
                results rather than assuming one model always wins. You don’t
                need an API key; the project owner pays for translation.
              </Paragraph>
            </li>
            <li>
              <Title level={3}>Choose a reading profile</Title>
              <Paragraph>
                Choose Adult (20 characters per second) or Children (17
                characters per second). This controls reading-speed guidance and
                how translated text is fitted into the existing time slots. Line
                wrapping aims for 42 visible characters per line and at most two
                lines where possible; it isn’t a fixed number of words per line.
                Readability warnings flag text that still needs review.
              </Paragraph>
            </li>
            <li>
              <Title level={3}>Press Start translation</Title>
              <Paragraph>
                Requests are sent in batches through the project’s Google
                Translation gateway. Watch the completed-cue count and progress.
                Keep the tab open and in the foreground; reloading loses this
                session’s work. If a quota cooldown appears, wait for its
                scheduled retry, or cancel. After a failure, Retry translation
                keeps completed cues and saved edits.
              </Paragraph>
            </li>
          </ol>
        </Card>

        <Card>
          <Title level={2}>Check the quality</Title>
          <Paragraph>
            Compare the English and translated columns, and watch the scene if
            you can. Does it keep the meaning, sound natural, preserve who is
            speaking, and appear at the right moment? Joined speech is placed
            back into the original time slots approximately, so unchanged
            timecodes don’t guarantee perfect alignment.
          </Paragraph>
          <Paragraph>
            Look for the <Text strong>Group</Text> labels above the subtitle
            cards. These are my group references and personal impressions from
            an earlier English → Mongolian test, not scores for every language
            or model.
          </Paragraph>
          <table className="reviewer-quality-table">
            <caption>My Mongolian spot-check notes</caption>
            <thead>
              <tr>
                <th scope="col">Group</th>
                <th scope="col">What I noticed</th>
              </tr>
            </thead>
            <tbody>
              {qualityNotes.map(({ group, note }) => (
                <tr key={group}>
                  <th scope="row">{group}</th>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paragraph type="secondary">
            Group numbers can shift between source versions. In this download,
            Group 213 and cue 251 are separate locations; my original note
            mentions both, so review both rather than treating them as the same
            passage.
          </Paragraph>
          <Paragraph>
            Try the pencil button to edit a translated cue, then Save. Once
            every cue has valid output, Download translated SRT becomes
            available. Check the downloaded file in your player; saved edits are
            included and the original cue numbers and timecodes are retained.
          </Paragraph>
        </Card>

        <Card>
          <Title level={2}>Tell me how it went</Title>
          <Paragraph>
            Please check in your own language and let me know how it went! When
            sharing feedback with me, include the language, NMT or TLLM, the
            group and cue numbers, what sounded wrong, and how you would
            naturally say it. Let me know about good examples too, and whether
            you edited the output.
          </Paragraph>
          <Button
            type="primary"
            href="#translator"
            icon={<ArrowLeftOutlined aria-hidden="true" />}
          >
            Back to translator
          </Button>
        </Card>
      </Flex>
    </Layout.Content>
  );
}
