import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';

type Status = 'Ouvert' | 'Brouillon' | 'Fermé';

type JobListing = {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  location: string;
  candidates: number;
  status: Status;
  iconBg: string;
  iconColor: string;
};

const JOBS: JobListing[] = [
  { id: '1', title: 'Senior Frontend Developer', icon: 'developer-mode', location: 'Douala', candidates: 24, status: 'Ouvert', iconBg: 'bg-secondary-container/30', iconColor: colors.secondary },
  { id: '2', title: 'Chef Comptable', icon: 'account-balance', location: 'Yaoundé', candidates: 12, status: 'Ouvert', iconBg: 'bg-primary/10', iconColor: colors.primary },
  { id: '3', title: 'Assistant RH', icon: 'group', location: 'Douala', candidates: 6, status: 'Brouillon', iconBg: 'bg-tertiary-fixed/30', iconColor: colors.tertiary },
  { id: '4', title: 'Chargé de communication', icon: 'campaign', location: 'Remote', candidates: 41, status: 'Fermé', iconBg: 'bg-surface-container-highest', iconColor: colors.onSurfaceVariant },
];

const FILTERS: { label: string; value: Status | 'Tout'; count: number }[] = [
  { label: 'Tout', value: 'Tout', count: 12 },
  { label: 'Ouvert', value: 'Ouvert', count: 8 },
  { label: 'Brouillon', value: 'Brouillon', count: 3 },
  { label: 'Fermé', value: 'Fermé', count: 1 },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string }> = {
  Ouvert: { bg: 'bg-secondary/10', text: 'text-secondary' },
  Brouillon: { bg: 'bg-tertiary/10', text: 'text-tertiary' },
  Fermé: { bg: 'bg-error/10', text: 'text-error' },
};

export default function GestionDesOffresScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const [filter, setFilter] = useState<Status | 'Tout'>('Tout');
  const jobs = filter === 'Tout' ? JOBS : JOBS.filter((j) => j.status === filter);

  return (
    <Screen>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            <View className="flex-row items-center justify-between gap-md">
              <View className="flex-1">
                <Text className="font-sans-bold text-headline-lg text-on-surface">Gestion des Offres</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">
                  Suivez et gérez vos recrutements en temps réel.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('PublierOffre')}
              className="flex-row items-center justify-center gap-2 self-start rounded-full bg-primary px-lg py-3 shadow-md"
            >
              <MaterialIcons name="add" size={18} color="#ffffff" />
              <Text className="font-sans-semibold text-label-lg text-on-primary">Créer une offre</Text>
            </Pressable>
            <View className="flex-row flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f.value === filter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value)}
                    className={`rounded-full border px-lg py-2 ${
                      active ? 'border-primary/20 bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {f.label} ({f.count})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
            <Pressable
              onPress={() => navigation.navigate('AnalytiqueOffre', { title: item.title })}
              className="flex-row items-center gap-md"
            >
              <View className={`h-14 w-14 items-center justify-center rounded-lg ${item.iconBg}`}>
                <MaterialIcons name={item.icon} size={28} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="font-sans-semibold text-headline-md text-on-surface">{item.title}</Text>
                  <View className={`rounded px-2 py-0.5 ${STATUS_STYLE[item.status].bg}`}>
                    <Text className={`text-[10px] font-sans-bold uppercase tracking-wider ${STATUS_STYLE[item.status].text}`}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View className="mt-1 flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-body-md text-on-surface-variant">{item.location}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-sans-bold text-headline-md text-on-surface">{item.candidates}</Text>
                <Text className="text-[10px] font-sans-bold uppercase tracking-tighter text-on-surface-variant">
                  Candidats
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('SponsoringOffres')}
              className="mt-md flex-row items-center justify-center gap-1 rounded-lg border border-primary/30 py-2"
            >
              <MaterialIcons name="rocket-launch" size={14} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-primary">Sponsoriser cette offre</Text>
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
