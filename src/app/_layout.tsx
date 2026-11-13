import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, background: c.background, card: c.card, text: c.text, border: c.border, primary: c.accent },
  };
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="belt/[id]" options={{ title: 'Grading' }} />
        <Stack.Screen name="pattern/[id]" options={{ title: 'Pattern' }} />
        <Stack.Screen name="quiz/[id]" options={{ title: 'Quiz', gestureEnabled: false }} />
      </Stack>
    </ThemeProvider>
  );
}
