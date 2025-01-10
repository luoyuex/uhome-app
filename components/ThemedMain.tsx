import React from 'react';
import { View, type ViewProps, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedMain({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[{ backgroundColor, paddingTop: insets.top }, style]}
      {...otherProps}
    />
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemedMain lightColor="#ffffff" darkColor="#000000">
        <Text>Hello, World!</Text>
      </ThemedMain>
    </SafeAreaProvider>
  );
};

export default App;