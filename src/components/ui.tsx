import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type TextProps,
  type ViewStyle,
} from 'react-native';

import { MaxContentWidth, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { beltLook } from '@/lib/belt';

type Variant = 'title' | 'heading' | 'body' | 'small' | 'label';

export function Txt({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: ThemeColor }) {
  const theme = useTheme();
  return <Text {...rest} style={[{ color: theme[color] }, textStyles[variant], style]} />;
}

const textStyles = StyleSheet.create({
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
});

/** Scrolling screen with centred, width-capped content (phone and tablet friendly). */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const theme = useTheme();
  const inner = <View style={styles.inner}>{children}</View>;
  return scroll ? (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled">
      {inner}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, { backgroundColor: theme.background, flex: 1 }]}>{inner}</View>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const base = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [base, pressed && { backgroundColor: theme.cardSelected }]}>
      {children}
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? theme.accent : theme.card },
      ]}>
      <Txt variant="small" style={{ color: selected ? theme.onAccent : theme.text, fontWeight: '600' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const theme = useTheme();
  const primary = kind === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.accent : theme.card,
          borderColor: primary ? theme.accent : theme.border,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}>
      <Txt style={{ color: primary ? theme.onAccent : theme.text, fontWeight: '700' }}>{label}</Txt>
    </Pressable>
  );
}

export function BeltBadge({ colour, size = 44 }: { colour: string; size?: number }) {
  const look = beltLook(colour);
  return (
    <View
      accessibilityLabel={`${colour || 'belt'} belt`}
      style={{ width: size, height: size * 0.34, borderRadius: 4, backgroundColor: look.main, borderWidth: 1, borderColor: 'rgba(128,128,128,0.45)', overflow: 'hidden' }}>
      {look.stripe ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: '33%', height: '34%', backgroundColor: look.stripe }} />
      ) : null}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Txt variant="label" color="textSecondary" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
      {children}
    </Txt>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <Txt color="textSecondary" style={{ marginVertical: Spacing.three }}>
      {children}
    </Txt>
  );
}

/** Column count that grows on tablets / landscape. */
export function useColumns(minWidth = 340) {
  const { width } = useWindowDimensions();
  const usable = Math.min(width, MaxContentWidth) - Spacing.four * 2;
  return Math.max(1, Math.floor((usable + Spacing.three) / (minWidth + Spacing.three)));
}

export function useGoBack() {
  const r = useRouter();
  return () => (r.canGoBack() ? r.back() : r.replace('/'));
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%', maxWidth: MaxContentWidth, padding: Spacing.three, paddingBottom: Spacing.six },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: Spacing.three },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: Spacing.two,
    marginBottom: Spacing.two,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
