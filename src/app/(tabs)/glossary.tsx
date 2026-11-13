import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Card, Chip, Empty, Screen, Txt } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getBelt, glossary, type TermCategory } from '@/data';
import { useTheme } from '@/hooks/use-theme';

const CATEGORIES: { key: TermCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'number', label: 'Numbers' },
  { key: 'command', label: 'Commands' },
  { key: 'stance', label: 'Stances' },
  { key: 'technique', label: 'Techniques' },
  { key: 'body', label: 'Body parts' },
  { key: 'other', label: 'Other' },
];

export default function GlossaryScreen() {
  const theme = useTheme();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<TermCategory | 'all'>('all');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return glossary.filter(
      (t) => (cat === 'all' || t.category === cat) && (!s || t.english.toLowerCase().includes(s) || t.korean.toLowerCase().includes(s))
    );
  }, [q, cat]);

  return (
    <Screen>
      <Txt variant="title">Korean glossary</Txt>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search English or Korean"
        placeholderTextColor={theme.textSecondary}
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search glossary"
        style={{ marginVertical: Spacing.three, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, color: theme.text, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.label} selected={cat === c.key} onPress={() => setCat(c.key)} />
        ))}
      </View>
      <Txt variant="small" color="textSecondary" style={{ marginBottom: Spacing.two }}>
        {results.length} term{results.length === 1 ? '' : 's'}
      </Txt>
      {results.length === 0 ? <Empty>No terms match.</Empty> : null}
      {results.map((t, i) => (
        <Card key={`${t.english}-${t.korean}-${i}`} style={{ marginBottom: Spacing.two, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontWeight: '700' }}>{t.korean}</Txt>
            <Txt color="textSecondary">{t.english}</Txt>
          </View>
          <Txt variant="small" color="textSecondary">{getBelt(t.beltId)?.name}</Txt>
        </Card>
      ))}
    </Screen>
  );
}
