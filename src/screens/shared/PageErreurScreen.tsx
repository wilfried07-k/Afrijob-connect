import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void }; route?: { params?: { type?: 'maintenance' | 'error' | 'offline' } } };

const CONTENT = {
  maintenance: {
    icon: 'construction' as const,
    title: 'Maintenance en cours',
    body: "Nous améliorons EmploiCamer pour vous offrir une meilleure expérience. De retour dans quelques minutes.",
  },
  error: {
    icon: 'error-outline' as const,
    title: 'Une erreur est survenue',
    body: "Quelque chose s'est mal passé de notre côté. Réessayez ou revenez plus tard.",
  },
  offline: {
    icon: 'wifi-off' as const,
    title: 'Pas de connexion',
    body: 'Vérifiez votre connexion internet et réessayez.',
  },
};

export default function PageErreurScreen({ navigation, route }: Props) {
  const type = route?.params?.type ?? 'maintenance';
  const content = CONTENT[type];

  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-28 w-28 items-center justify-center rounded-full bg-surface-container">
        <MaterialIcons name={content.icon} size={56} color={colors.onSurfaceVariant} />
      </View>
      <View className="items-center gap-2">
        <Text className="font-sans-bold text-headline-lg text-on-surface">{content.title}</Text>
        <Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">
          {content.body}
        </Text>
      </View>
      <Pressable
        onPress={() => navigation.goBack()}
        className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary px-xl shadow-lg"
      >
        <MaterialIcons name="refresh" size={20} color="#ffffff" />
        <Text className="font-sans-semibold text-title-lg text-on-primary">Réessayer</Text>
      </Pressable>
    </View>
  );
}
