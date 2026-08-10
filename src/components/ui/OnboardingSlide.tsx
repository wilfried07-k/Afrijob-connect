import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from './Screen';
import Button from './Button';
import { colors } from '../../theme';

type Props = {
  step: number; // 0-based index (0 to totalSteps - 1)
  totalSteps: number;
  illustrationIcon: keyof typeof MaterialIcons.glyphMap;
  chipIcon: keyof typeof MaterialIcons.glyphMap;
  chipLabel: string;
  title: string;
  description: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  onSkip?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

/**
 * Reproduit la mise en page des maquettes onboarding_X_4 :
 * illustration en carte + puce flottante, feuille "glassmorphism" avec
 * titre/description, indicateurs de progression, puis CTA.
 * Les photos de stock des maquettes (lh3.googleusercontent.com) sont
 * remplacées par une illustration iconographique locale — remplace
 * `illustrationIcon` par une vraie image (require('../../assets/...'))
 * quand les assets finaux seront disponibles.
 */
export default function OnboardingSlide({
  step,
  totalSteps,
  illustrationIcon,
  chipIcon,
  chipLabel,
  title,
  description,
  primaryLabel,
  onPrimaryPress,
  onSkip,
  secondaryLabel,
  onSecondaryPress,
}: Props) {
  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-end px-container-margin">
        {onSkip && (
          <Pressable onPress={onSkip} hitSlop={8}>
            <Text className="font-sans-semibold text-label-lg text-primary">Passer</Text>
          </Pressable>
        )}
      </View>

      {/* Illustration */}
      <View className="flex-1 items-center justify-center px-container-margin">
        <View className="relative aspect-[4/5] w-full max-w-sm">
          <View className="h-full w-full items-center justify-center rounded-[40px] border border-outline-variant/30 bg-surface-container-lowest shadow-2xl">
            <MaterialIcons name={illustrationIcon} size={96} color={colors.primary} />
          </View>
          <View className="absolute -right-2 bottom-10 z-20 flex-row items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface px-md py-sm shadow-lg">
            <MaterialIcons name={chipIcon} size={20} color={colors.secondary} />
            <Text className="font-sans-semibold text-label-lg text-on-surface">{chipLabel}</Text>
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View className="gap-xl rounded-t-[40px] border-t border-outline-variant/20 bg-surface/60 px-container-margin pb-xl pt-xl">
        <View className="items-center gap-md">
          <Text className="max-w-xs text-center font-sans-bold text-headline-lg-mobile text-on-surface">
            {title}
          </Text>
          <Text className="max-w-xs text-center font-sans text-body-md leading-relaxed text-on-surface-variant">
            {description}
          </Text>
        </View>

        {/* Progress dots */}
        <View className="flex-row justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === step ? 'w-8 bg-primary' : 'w-1.5 bg-outline-variant'
              }`}
            />
          ))}
        </View>

        <View className="w-full items-center gap-md">
          <Button label={primaryLabel} onPress={onPrimaryPress} />
          {secondaryLabel && (
            <Pressable onPress={onSecondaryPress} hitSlop={8}>
              <Text className="font-sans-semibold text-label-lg text-primary">{secondaryLabel}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Screen>
  );
}
