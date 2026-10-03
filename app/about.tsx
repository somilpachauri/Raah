import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../src/components';
import { colors, spacing } from '../src/design/tokens';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.placeholder}>
        <ThemedText variant="h2" color={colors.granite}>
          About
        </ThemedText>
        <ThemedText variant="body" color={colors.granite}>
          About screen – coming next
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.snow },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
