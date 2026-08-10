import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding1'), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-container-margin">
        <View className="relative mb-lg h-24 w-24 items-center justify-center rounded-xl bg-primary-container shadow-lg">
          <MaterialIcons name="work" size={48} color={colors.onPrimaryContainer} />
          <View className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full bg-secondary-container">
            <MaterialIcons name="verified" size={18} color={colors.onSecondaryContainer} />
          </View>
        </View>

        <Text className="mb-1 font-sans-extrabold text-[32px] tracking-tight text-primary">
          EmploiCamer
        </Text>
        <Text className="font-sans text-body-lg text-on-surface-variant">
          Votre carrière, notre priorité
        </Text>

        <View className="absolute bottom-xl flex-row items-center gap-1">
          <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
          <Text className="font-sans-medium text-xs uppercase tracking-widest text-on-surface-variant">
            Cameroun
          </Text>
        </View>
      </View>
    </Screen>
  );
}
