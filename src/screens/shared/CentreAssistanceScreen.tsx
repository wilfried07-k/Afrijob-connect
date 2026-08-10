import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const CATEGORIES: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: 'person', label: 'Mon compte' },
  { icon: 'work', label: 'Candidatures' },
  { icon: 'payments', label: 'Paiements' },
  { icon: 'security', label: 'Sécurité' },
];

const POPULAR_TOPICS = [
  'Comment réinitialiser mon mot de passe ?',
  'Comment supprimer mon compte ?',
  'Pourquoi ma candidature est-elle refusée automatiquement ?',
];

export default function CentreAssistanceScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Centre d'Assistance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="h-12 flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-md">
          <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
          <TextInput
            placeholder="Comment pouvons-nous vous aider ?"
            placeholderTextColor={colors.outline}
            className="flex-1 font-sans text-body-md text-on-surface"
          />
        </View>

        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Pressable key={c.label} className="min-w-[47%] flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name={c.icon} size={22} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-on-surface">{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Questions fréquentes</Text>
          <View className="gap-2">
            {POPULAR_TOPICS.map((topic) => (
              <Pressable key={topic} className="flex-row items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md">
                <Text className="flex-1 font-sans text-body-md text-on-surface">{topic}</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-md rounded-xl bg-primary p-lg shadow-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="support-agent" size={22} color="#ffffff" />
            <Text className="font-sans-semibold text-title-lg text-white">Besoin d'aide supplémentaire ?</Text>
          </View>
          <Text className="font-sans text-body-md text-white/85">
            Notre équipe support est disponible du lundi au samedi, 8h-19h.
          </Text>
          <Pressable className="mt-1 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3">
            <MaterialIcons name="headset-mic" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Contacter le support</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
