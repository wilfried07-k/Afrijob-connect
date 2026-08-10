import { ReactNode } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaView className={`flex-1 bg-background ${className}`}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}