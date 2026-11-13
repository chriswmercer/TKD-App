import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Empty, Screen, SectionTitle, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getBelt, getPattern } from '@/data';
import { useTheme } from '@/hooks/use-theme';

export default function PatternDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const pattern = getPattern(id);
  const [mode, setMode] = useState<'all' | 'one'>('all');
  const [step, setStep] = useState(0);
  if (!pattern) return <Screen><Empty>Pattern not found.</Empty></Screen>;

  const belt = pattern.beltId ? getBelt(pattern.beltId) : undefined;
  const moves = pattern.movements;
  const shown = mode === 'all' ? moves : moves.slice(step, step + 1);

  return (
    <Screen>
      <Stack.Screen options={{ title: pattern.name }} />
      <Txt variant="title">{pattern.name}</Txt>
      <Txt color="textSecondary">
        {pattern.movementCount} movements · {belt?.name ?? pattern.grade}
      </Txt>
      {pattern.meaning ? <Txt style={{ marginTop: Spacing.three }}>{pattern.meaning}</Txt> : null}

      <SectionTitle>Overview</SectionTitle>
      <Card>
        {pattern.startingPosition ? <Txt><Txt style={{ fontWeight: '700' }}>Start: </Txt>{pattern.startingPosition}</Txt> : null}
        {pattern.endingPosition ? <Txt style={{ marginTop: 6 }}><Txt style={{ fontWeight: '700' }}>End: </Txt>{pattern.endingPosition}</Txt> : null}
        {pattern.diagram ? <Txt style={{ marginTop: 6 }}><Txt style={{ fontWeight: '700' }}>Floor pattern: </Txt>{pattern.diagram}</Txt> : null}
      </Card>

      <SectionTitle>Movements</SectionTitle>
      <View style={{ flexDirection: 'row' }}>
        <Chip label="Show all" selected={mode === 'all'} onPress={() => setMode('all')} />
        <Chip label="One move at a time" selected={mode === 'one'} onPress={() => setMode('one')} />
      </View>
      {moves.length === 0 ? <Empty>No movement list available for this pattern.</Empty> : null}
      {shown.map((m) => (
        <Card key={m.n} style={{ marginBottom: Spacing.two, flexDirection: 'row', gap: 14 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Txt style={{ color: theme.onAccent, fontWeight: '700' }}>{m.n}</Txt>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            {m.footwork ? <Txt variant="small" color="textSecondary">{m.footwork}</Txt> : null}
            {m.stance ? <Txt style={{ fontWeight: '600' }}>{m.stance}</Txt> : null}
            {m.technique ? <Txt>{m.technique}</Txt> : null}
            {m.direction ? <Txt variant="small" color="textSecondary">Direction: {m.direction}</Txt> : null}
          </View>
        </Card>
      ))}
      {mode === 'one' && moves.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: Spacing.two }}>
          <View style={{ flex: 1 }}><Button kind="secondary" label="Back" disabled={step === 0} onPress={() => setStep((s) => Math.max(0, s - 1))} /></View>
          <View style={{ flex: 1 }}><Button label={step >= moves.length - 1 ? 'Done' : 'Next'} disabled={step >= moves.length - 1} onPress={() => setStep((s) => Math.min(moves.length - 1, s + 1))} /></View>
        </View>
      ) : null}
      {mode === 'one' && moves.length > 0 ? (
        <Txt variant="small" color="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.two }}>
          Move {step + 1} of {moves.length}
        </Txt>
      ) : null}
    </Screen>
  );
}
