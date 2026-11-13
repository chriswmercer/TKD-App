import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Card, Screen, Txt, useColumns } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getBelt, patterns } from '@/data';

export default function PatternsScreen() {
  const router = useRouter();
  const cols = useColumns(300);
  return (
    <Screen>
      <Txt variant="title">Patterns</Txt>
      <Txt color="textSecondary" style={{ marginBottom: Spacing.three }}>
        All patterns (tul), in grading order.
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -Spacing.two }}>
        {patterns.map((p) => (
          <View key={p.id} style={{ width: `${100 / cols}%`, padding: Spacing.two }}>
            <Card onPress={() => router.push({ pathname: '/pattern/[id]', params: { id: p.id } })}>
              <Txt variant="heading">{p.name}</Txt>
              <Txt variant="small" color="textSecondary">
                {p.movementCount} movements · {(p.beltId && getBelt(p.beltId)?.name) || p.grade || 'Grade not stated'}
              </Txt>
            </Card>
          </View>
        ))}
      </View>
    </Screen>
  );
}
