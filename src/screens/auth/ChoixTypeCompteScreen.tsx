import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ChoixTypeCompte'>;

type AccountType = 'seeker' | 'recruiter';

export default function ChoixTypeCompteScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<AccountType | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    (navigation.getParent() as any)?.navigate(
      selected === 'seeker' ? 'CandidateApp' : 'RecruiterApp'
    );
  };

  return (
    <Screen>
      <View className="flex-1 px-container-margin py-xl">
        {/* Headline */}
        <View className="mb-xl items-center gap-sm">
          <Text className="text-center font-sans-bold text-display-lg text-on-surface">
            Bienvenue ! Quel est votre objectif ?
          </Text>
          <Text className="text-center font-sans text-body-lg text-on-surface-variant">
            Cela nous permettra de personnaliser votre expérience sur la plateforme.
          </Text>
        </View>

        {/* Cards */}
        <View className="gap-md">
          <AccountCard
            icon="work"
            iconBg="bg-primary-fixed"
            iconColor={colors.primary}
            title="Je cherche un emploi"
            description="Trouvez des opportunités, créez votre CV et postulez en un clic."
            selected={selected === 'seeker'}
            onPress={() => setSelected('seeker')}
          />
          <AccountCard
            icon="business"
            iconBg="bg-secondary-container"
            iconColor={colors.secondary}
            title="Je souhaite recruter"
            description="Publiez des offres, gérez vos candidatures et trouvez les meilleurs talents."
            selected={selected === 'recruiter'}
            onPress={() => setSelected('recruiter')}
          />
        </View>
      </View>

      {/* Sticky bottom action */}
      <View className="border-t border-outline-variant px-container-margin py-md">
        <Button label="Continuer" disabled={!selected} onPress={handleContinue} />
        <Pressable
          onPress={() => (navigation.getParent() as any)?.navigate('AdminApp')}
          className="mt-md items-center"
        >
          <Text className="font-sans text-label-md text-outline">Accès Administrateur (démo)</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function AccountCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  selected,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg border-2 bg-surface-container-lowest p-lg shadow-md ${
        selected ? 'border-primary' : 'border-outline-variant'
      }`}
    >
      <View className="flex-row items-start gap-md">
        <View className={`h-14 w-14 items-center justify-center rounded-md ${iconBg}`}>
          <MaterialIcons name={icon} size={28} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-title-lg text-on-surface">{title}</Text>
          <Text className="mt-1 font-sans text-body-md leading-relaxed text-on-surface-variant">
            {description}
          </Text>
        </View>
        {selected && <MaterialIcons name="check-circle" size={22} color={colors.primary} />}
      </View>
    </Pressable>
  );
}
