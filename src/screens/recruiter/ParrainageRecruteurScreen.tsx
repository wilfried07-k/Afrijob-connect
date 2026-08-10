import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const REFERRED_COMPANIES = [
  { id: '1', name: 'Kmer Digital Services', status: 'Abonnement Premium actif', reward: '25 000 FCFA' },
  { id: '2', name: 'BuildRight Cameroun', status: "Période d'essai", reward: 'En attente' },
];

export default function ParrainageRecruteurScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Programme Partenaire</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Hero */}
        <View className="items-center gap-md rounded-2xl bg-primary p-lg shadow-lg">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <MaterialIcons name="handshake" size={32} color="#ffffff" />
          </View>
          <Text className="text-center font-sans-bold text-headline-md text-white">
            Recommandez EmploiCamer, gagnez 25 000 FCFA
          </Text>
          <Text className="text-center font-sans text-body-md text-white/85">
            Chaque entreprise que vous parrainez et qui souscrit à un abonnement Premium vous rapporte
            une commission.
          </Text>
          <View className="w-full flex-row items-center gap-2 rounded-xl bg-white/15 px-md py-3">
            <Text className="flex-1 font-sans-medium text-label-lg text-white" numberOfLines={1}>
              emploicamer.cm/entreprise/r/kmer-tc8x
            </Text>
            <MaterialIcons name="content-copy" size={18} color="#ffffff" />
          </View>
          <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-white py-3">
            <MaterialIcons name="share" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Partager le lien</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2">
          <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-bold text-headline-md text-primary">2</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Entreprises parrainées</Text>
          </View>
          <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-bold text-headline-md text-secondary">25 000</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">FCFA gagnés</Text>
          </View>
        </View>

        {/* Referred companies */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Entreprises parrainées</Text>
          <View className="gap-2">
            {REFERRED_COMPANIES.map((c) => (
              <View key={c.id} className="flex-row items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center gap-md">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcons name="apartment" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{c.name}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">{c.status}</Text>
                  </View>
                </View>
                <Text className={`font-sans-semibold text-label-md ${c.reward === 'En attente' ? 'text-on-surface-variant' : 'text-secondary'}`}>
                  {c.reward}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
