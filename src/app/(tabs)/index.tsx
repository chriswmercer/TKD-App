import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BeltBadge, Card, Screen, Txt, useColumns } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { belts } from '@/data';

export default function BeltsScreen() {
  const router = useRouter();
  const cols = useColumns();
  return (
    <Screen>
      <Txt variant="title">TAGB Syllabus</Txt>
      <Txt color="textSecondary" style={{ marginBottom: Spacing.three }}>
        Choose a grade to see its patterns, techniques, theory and Korean terms.
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -Spacing.two }}>
        {belts.map((b) => (
          <View key={b.id} style={{ width: `${100 / cols}%`, padding: Spacing.two }}>
            <Card onPress={() => router.push({ pathname: '/belt/[id]', params: { id: b.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <BeltBadge colour={b.beltColour} />
              <View style={{ flex: 1 }}>
                <Txt variant="heading">{b.name}</Txt>
                <Txt variant="small" color="textSecondary">
                  {b.beltColour && !/not stated/i.test(b.beltColour) ? `${b.beltColour} · ` : ''}
                  {b.patterns.length} pattern{b.patterns.length === 1 ? '' : 's'} · {b.terminology.length} terms
                </Txt>
              </View>
            </Card>
          </View>
        ))}
      </View>
    </Screen>
  );
}
