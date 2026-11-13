import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Empty, Screen, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getBelt } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { buildQuiz, gradeFor, type Question } from '@/lib/quiz';
import { saveResult } from '@/lib/storage';

const QUESTIONS = 15;

export default function QuizRun() {
  const { id, earlier } = useLocalSearchParams<{ id: string; earlier?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const belt = getBelt(id);
  const [round, setRound] = useState(0);
  const questions = useMemo<Question[]>(() => buildQuiz(id, earlier === '1', QUESTIONS), [id, earlier, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    if (finished && belt && total) {
      saveResult({ beltId: belt.id, beltName: belt.name, correct, total, percent, date: new Date().toISOString() });
    }
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!belt || total === 0) return <Screen><Empty>There are not enough questions for this belt yet.</Empty></Screen>;

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setCorrect(0);
    setFinished(false);
  };

  if (finished) {
    const g = gradeFor(percent);
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Results', headerBackVisible: false }} />
        <Card style={{ alignItems: 'center', paddingVertical: Spacing.five }}>
          <Txt variant="label" color="textSecondary">{belt.name}</Txt>
          <Txt style={{ fontSize: 64, lineHeight: 76, fontWeight: '800', color: theme.accent }}>{percent}%</Txt>
          <Txt variant="heading">{g.label}</Txt>
          <Txt color="textSecondary" style={{ textAlign: 'center', marginTop: 8 }}>{g.message}</Txt>
          <Txt style={{ marginTop: 12 }}>{correct} of {total} correct</Txt>
        </Card>
        <View style={{ gap: 12, marginTop: Spacing.four }}>
          <Button label="Try again" onPress={restart} />
          <Button kind="secondary" label={`Review ${belt.name}`} onPress={() => router.replace({ pathname: '/belt/[id]', params: { id: belt.id } })} />
          <Button kind="secondary" label="Back to quizzes" onPress={() => router.dismissTo('/quiz')} />
        </View>
      </Screen>
    );
  }

  const q = questions[index];
  const advance = (wasCorrect: boolean) => {
    if (wasCorrect) setCorrect((c) => c + 1);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setPicked(null);
      setRevealed(false);
    }
  };
  const answered = q.kind === 'choice' ? picked !== null : revealed;

  return (
    <Screen>
      <Stack.Screen options={{ title: belt.name }} />
      <Txt variant="small" color="textSecondary">Question {index + 1} of {total}</Txt>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.border, marginVertical: Spacing.two }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.accent, width: `${(index / total) * 100}%` }} />
      </View>
      {q.hint ? <Txt variant="label" color="textSecondary" style={{ marginTop: Spacing.two }}>{q.hint}</Txt> : null}
      <Txt variant="heading" style={{ marginVertical: Spacing.three }}>{q.prompt}</Txt>

      {q.kind === 'choice' ? (
        <View style={{ gap: 10 }}>
          {q.options.map((o) => {
            const isAnswer = o === q.answer;
            const isPicked = picked === o;
            const border = picked === null ? theme.border : isAnswer ? theme.success : isPicked ? theme.danger : theme.border;
            return (
              <Card
                key={o}
                onPress={picked === null ? () => { setPicked(o); } : undefined}
                style={{ borderColor: border, borderWidth: picked !== null && (isAnswer || isPicked) ? 2 : 1 }}>
                <Txt style={{ fontWeight: '600' }}>{o}</Txt>
              </Card>
            );
          })}
          {picked !== null ? (
            <>
              <Txt color={picked === q.answer ? 'success' : 'danger'} style={{ fontWeight: '700' }}>
                {picked === q.answer ? 'Correct' : `Not quite. The answer is: ${q.answer}`}
              </Txt>
              <Button label={index + 1 >= total ? 'See results' : 'Next'} onPress={() => advance(picked === q.answer)} />
            </>
          ) : null}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {!revealed ? (
            <>
              <Txt color="textSecondary">Think of your answer, then reveal it to check.</Txt>
              <Button label="Show answer" onPress={() => setRevealed(true)} />
            </>
          ) : (
            <>
              <Card><Txt>{q.answer}</Txt></Card>
              <Txt color="textSecondary">Did you get it right?</Txt>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}><Button kind="secondary" label="No" onPress={() => advance(false)} /></View>
                <View style={{ flex: 1 }}><Button label="Yes" onPress={() => advance(true)} /></View>
              </View>
            </>
          )}
        </View>
      )}
      {!answered ? null : null}
    </Screen>
  );
}
