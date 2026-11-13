import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { BeltBadge, Card, Chip, Screen, SectionTitle, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { belts } from '@/data';
import { loadResults, type QuizResult } from '@/lib/storage';

export default function QuizTab() {
  const router = useRouter();
  const [includeEarlier, setIncludeEarlier] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  useFocusEffect(
    useCallback(() => {
      loadResults().then(setResults);
    }, [])
  );

  return (
    <Screen>
      <Txt variant="title">Quiz</Txt>
      <Txt color="textSecondary" style={{ marginBottom: Spacing.three }}>
        Pick a belt. You will be asked questions on its terms, patterns and theory and graded at the end.
      </Txt>
      <View style={{ flexDirection: 'row' }}>
        <Chip label="This belt only" selected={!includeEarlier} onPress={() => setIncludeEarlier(false)} />
        <Chip label="Include earlier belts" selected={includeEarlier} onPress={() => setIncludeEarlier(true)} />
      </View>
      {belts.map((b) => {
        const best = results.filter((r) => r.beltId === b.id).reduce((m, r) => Math.max(m, r.percent), -1);
        return (
          <Card
            key={b.id}
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: b.id, earlier: includeEarlier ? '1' : '0' } })}
            style={{ marginBottom: Spacing.two, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <BeltBadge colour={b.beltColour} />
            <Txt variant="heading" style={{ flex: 1 }}>{b.name}</Txt>
            {best >= 0 ? <Txt color="textSecondary" variant="small">Best {best}%</Txt> : null}
          </Card>
        );
      })}
      {results.length > 0 && (
        <>
          <SectionTitle>Recent results</SectionTitle>
          {results.slice(0, 5).map((r, i) => (
            <Txt key={i} variant="small" color="textSecondary">
              {new Date(r.date).toLocaleDateString()} · {r.beltName} · {r.correct}/{r.total} ({r.percent}%)
            </Txt>
          ))}
        </>
      )}
    </Screen>
  );
}
