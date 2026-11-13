import { useState } from 'react';
import { View } from 'react-native';

import { Card, Screen, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { generalSections } from '@/data';

export default function InfoScreen() {
  const [open, setOpen] = useState<string | null>(generalSections[0]?.id ?? null);
  return (
    <Screen>
      <Txt variant="title">Tae Kwon-Do info</Txt>
      <Txt color="textSecondary" style={{ marginBottom: Spacing.three }}>
        Tenets, oath, conduct and rules.
      </Txt>
      {generalSections.map((s) => {
        const isOpen = open === s.id;
        return (
          <Card key={s.id} onPress={() => setOpen(isOpen ? null : s.id)} style={{ marginBottom: Spacing.two }}>
            <Txt variant="heading">{s.title}</Txt>
            {isOpen ? (
              <View style={{ marginTop: Spacing.two, gap: 8 }}>
                {s.summary ? <Txt color="textSecondary">{s.summary}</Txt> : null}
                {s.items.map((it, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                    <Txt color="textSecondary" style={{ width: 22 }}>{i + 1}.</Txt>
                    <Txt style={{ flex: 1 }}>
                      {it.title ? <Txt style={{ fontWeight: '700' }}>{it.title}. </Txt> : null}
                      {it.text}
                    </Txt>
                  </View>
                ))}
              </View>
            ) : null}
          </Card>
        );
      })}
      <Txt variant="small" color="textSecondary" style={{ marginTop: Spacing.four }}>
        This is an unofficial study aid based on the TAGB syllabus. Always follow your instructor and the official syllabus. Examiners may vary the grading format.
      </Txt>
    </Screen>
  );
}
