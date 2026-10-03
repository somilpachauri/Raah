import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import { NHShield } from './NHShield';
import { ThemedText } from './ThemedText';
import { LanguageToggle } from './LanguageToggle';
import { colors, spacing, touchTarget, iconSize, iconStroke } from '../design/tokens';

interface AppHeaderProps {
  title: string;
}

/**
 * App header: NHShield, title, language toggle, "more" menu icon.
 * 56dp height as per the design spec.
 */
export function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <NHShield size={24} />
        <ThemedText variant="h3" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
      </View>
      <View style={styles.right}>
        <LanguageToggle />
        <Pressable
          onPress={() => setMenuOpen(!menuOpen)}
          style={styles.moreButton}
          accessibilityLabel="More options"
          accessibilityRole="button"
          hitSlop={8}
        >
          <MoreVertical
            size={iconSize}
            strokeWidth={iconStroke}
            color={colors.granite}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    backgroundColor: colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreButton: {
    minWidth: touchTarget.min,
    minHeight: touchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
