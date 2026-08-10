import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const BENEFITS: { icon: keyof typeof MaterialIcons.glyphMap; title: string; body: string }[] = [
  { icon: 'bolt', title: 'Réponse en moins de 2h', body: "Une équipe dédiée traite vos demandes en priorité, 7j/7." },
  { icon: 'headset-mic', title: 'Ligne directe', body: "Un numéro dédié pour joindre un conseiller sans file d'attente." },
  { icon: 'verified-user', title: 'Conseiller attitré', body: 'Un même interlocuteur suit vos dossiers du début à la fin.' },
];

export default function SupportPrioritaireScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Support Prioritaire</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="items-center gap-md rounded-2xl bg-primary p-lg shadow-lg">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <MaterialIcons name="workspace-premium" size={32} color="#ffffff" />
          </View>
          <Text className="text-center font-sans-bold text-headline-md text-white">
            Passez au Support Premium
          </Text>
          <Text className="text-center font-sans text-body-md text-white/85">
            Réservé aux membres Premium — une assistance rapide et personnalisée à chaque étape de
            votre recherche.
          </Text>
        </View>

        <View className="gap-md">
          {BENEFITS.map((b) => (
            <View key={b.title} className="flex-row items-start gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name={b.icon} size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{b.title}</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg">
          <MaterialIcons name="star" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Passer Premium</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
