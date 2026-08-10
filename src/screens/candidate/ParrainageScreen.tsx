import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const REFERRALS = [
  { id: '1', name: 'Paul Etoundi', status: 'Embauché', reward: '5 000 FCFA' },
  { id: '2', name: 'Christelle M.', status: 'Entretien en cours', reward: 'En attente' },
  { id: '3', name: 'Boris N.', status: 'Inscrit', reward: 'En attente' },
];

export default function ParrainageScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Parrainage</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Hero */}
        <View className="items-center gap-md rounded-2xl bg-primary p-lg shadow-lg">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <MaterialIcons name="card-giftcard" size={32} color="#ffffff" />
          </View>
          <Text className="text-center font-sans-bold text-headline-md text-white">
            Gagnez 5 000 FCFA par ami embauché !
          </Text>
          <Text className="text-center font-sans text-body-md text-white/85">
            Partagez votre lien unique. Dès qu'un ami est embauché grâce à vous, vous touchez votre récompense.
          </Text>
          <View className="w-full flex-row items-center gap-2 rounded-xl bg-white/15 px-md py-3">
            <Text className="flex-1 font-sans-medium text-label-lg text-white" numberOfLines={1}>
              emploicamer.cm/r/samuel-nd8k2
            </Text>
            <MaterialIcons name="content-copy" size={18} color="#ffffff" />
          </View>
          <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-white py-3">
            <MaterialIcons name="share" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Partager mon lien</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2">
          <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-bold text-headline-md text-primary">3</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Filleuls</Text>
          </View>
          <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-bold text-headline-md text-secondary">5 000</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">FCFA gagnés</Text>
          </View>
          <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-bold text-headline-md text-tertiary">1</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Embauché</Text>
          </View>
        </View>

        {/* Referral list */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Mes filleuls</Text>
            <Pressable onPress={() => navigation.navigate('MesRecompensesParrainage')}>
              <Text className="font-sans-semibold text-label-lg text-primary">Mes récompenses</Text>
            </Pressable>
          </View>
          <View className="gap-2">
            {REFERRALS.map((r) => (
              <View key={r.id} className="flex-row items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center gap-md">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Text className="font-sans-bold text-label-md text-primary">{r.name[0]}</Text>
                  </View>
                  <View>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{r.name}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">{r.status}</Text>
                  </View>
                </View>
                <Text className={`font-sans-semibold text-label-md ${r.reward === 'En attente' ? 'text-on-surface-variant' : 'text-secondary'}`}>
                  {r.reward}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
