import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={icon} size={size} color={color as string} />,
});

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { color: theme.text },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen name="index" options={{ ...tab('Belts', 'ribbon-outline'), title: 'Belts' }} />
      <Tabs.Screen name="patterns" options={tab('Patterns', 'footsteps-outline')} />
      <Tabs.Screen name="glossary" options={tab('Glossary', 'language-outline')} />
      <Tabs.Screen name="quiz" options={tab('Quiz', 'help-circle-outline')} />
      <Tabs.Screen name="info" options={tab('Info', 'information-circle-outline')} />
    </Tabs>
  );
}
