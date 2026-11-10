import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const EVIDENCE = [
  { id: '1', label: 'Capture_conversation.png', type: 'image' as const },
  { id: '2', label: 'Preuve_paiement.pdf', type: 'pdf' as const },
];

const TIMELINE = [
  { id: '1', actor: 'Candidat (plaignant)', text: "L'entreprise m'a demandé 15 000 FCFA de frais de dossier avant l'entretien.", timeAgo: 'Il y a 2j' },
  { id: '2', actor: 'Entreprise (mise en cause)', text: "Il s'agit d'une erreur de communication, ce n'était pas un frais obligatoire.", timeAgo: 'Il y a 1j' },
];

export default function GestionContentieuxAvanceScreen({ navigation }: Props) {
  const [note, setNote] = useState('');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Dossier Contentieux #4821</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-2 rounded-xl border border-error/20 bg-error-container/10 p-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="gavel" size={20} color={colors.error} />
            <Text className="font-sans-semibold text-title-lg text-error">Fraude aux frais de dossier</Text>
          </View>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Plaignant : Jean M. (Candidat) • Mis en cause : FastCash SARL (Recruteur)
          </Text>
        </View>

        {/* Timeline */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Échanges</Text>
          <View className="gap-2">
            {TIMELINE.map((t) => (
              <View key={t.id} className="gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{t.actor}</Text>
                  <Text className="font-sans text-label-md text-outline">{t.timeAgo}</Text>
                </View>
                <Text className="font-sans text-body-md text-on-surface-variant">{t.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Evidence */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Pièces jointes</Text>
          <View className="flex-row gap-2">
            {EVIDENCE.map((ev) => (
              <View key={ev.id} className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
                <MaterialIcons name={ev.type === 'pdf' ? 'description' : 'attachment'} size={24} color={colors.onSurfaceVariant} />
                <Text className="text-center font-sans text-label-md text-on-surface-variant" numberOfLines={1}>{ev.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Arbitration note */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Note d'instruction</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Résumez les faits et votre analyse avant la décision finale..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('DecisionArbitrageFinal')}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="balance" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Passer à la décision finale</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
