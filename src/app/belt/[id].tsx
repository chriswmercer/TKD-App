import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { BeltBadge, Button, Card, Empty, Screen, SectionTitle, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getBelt, getPattern } from '@/data';

export default function BeltDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const belt = getBelt(id);
  if (!belt) return <Screen><Empty>Grade not found.</Empty></Screen>;

  const colourKnown = belt.beltColour && !/not stated/i.test(belt.beltColour);
  return (
    <Screen>
      <Stack.Screen options={{ title: belt.name }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BeltBadge colour={belt.beltColour} size={64} />
        <View style={{ flex: 1 }}>
          <Txt variant="title">{belt.name}</Txt>
          {colourKnown ? <Txt color="textSecondary">{belt.beltColour} belt</Txt> : null}
        </View>
      </View>
      <View style={{ marginTop: Spacing.three }}>
        <Button label={`Quiz me on ${belt.name}`} onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: belt.id } })} />
      </View>

      {belt.patterns.length > 0 && (
        <>
          <SectionTitle>Patterns</SectionTitle>
          {belt.patterns.map((pid) => {
            const p = getPattern(pid);
            return p ? (
              <Card key={pid} onPress={() => router.push({ pathname: '/pattern/[id]', params: { id: pid } })} style={{ marginBottom: Spacing.two }}>
                <Txt variant="heading">{p.name}</Txt>
                <Txt variant="small" color="textSecondary">{p.movementCount} movements</Txt>
              </Card>
            ) : null;
          })}
        </>
      )}

      {belt.practical.length > 0 && (
        <>
          <SectionTitle>Practical</SectionTitle>
          <Card>
            {belt.practical.map((p, i) => (
              <View key={i} style={{ marginBottom: i === belt.practical.length - 1 ? 0 : 10 }}>
                <Txt style={{ fontWeight: '600' }}>{p.title}</Txt>
                {p.detail ? <Txt variant="small" color="textSecondary">{p.detail}</Txt> : null}
              </View>
            ))}
          </Card>
        </>
      )}

      {belt.sparring.length > 0 && (
        <>
          <SectionTitle>Sparring</SectionTitle>
          <Card>
            {belt.sparring.map((s, i) => (
              <Txt key={i} style={{ marginBottom: 6 }}>• {s}</Txt>
            ))}
          </Card>
        </>
      )}

      {belt.theory.length > 0 && (
        <>
          <SectionTitle>Theory</SectionTitle>
          {belt.theory.map((t, i) => (
            <Card key={i} style={{ marginBottom: Spacing.two }}>
              <Txt style={{ fontWeight: '700' }}>{t.question}</Txt>
              {t.answer ? <Txt color="textSecondary" style={{ marginTop: 4 }}>{t.answer}</Txt> : null}
            </Card>
          ))}
        </>
      )}

      {belt.terminology.length > 0 && (
        <>
          <SectionTitle>Korean terms</SectionTitle>
          <Card>
            {belt.terminology.map((t, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, gap: 12 }}>
                <Txt style={{ flex: 1, fontWeight: '600' }}>{t.korean}</Txt>
                <Txt style={{ flex: 1 }} color="textSecondary">{t.english}</Txt>
              </View>
            ))}
          </Card>
        </>
      )}

      {belt.otherSections.map((s, i) => (
        <View key={i}>
          <SectionTitle>{s.heading}</SectionTitle>
          <Card>
            {s.items.map((it, j) => (
              <Txt key={j} style={{ marginBottom: 6 }}>• {it}</Txt>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
