import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'SuiviCandidatures'>;

type Status = 'interview' | 'review' | 'rejected' | 'accepted';

type Application = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: Status;
  statusLabel: string;
  detail: string;
  timeAgo: string;
};

const APPLICATIONS: Application[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'MTN Cameroon',
    location: 'Douala',
    status: 'interview',
    statusLabel: 'Entretien prévu',
    detail: 'Entretien le 15 Octobre, 14:00',
    timeAgo: 'Il y a 2 jours',
  },
  {
    id: '2',
    title: 'Analyste Financier',
    company: 'Afriland First Bank',
    location: 'Yaoundé',
    status: 'review',
    statusLabel: 'En examen',
    detail: 'Candidature en cours de traitement',
    timeAgo: 'Il y a 4 jours',
  },
  {
    id: '3',
    title: 'Développeur Mobile',
    company: 'Camtel',
    location: 'Douala',
    status: 'rejected',
    statusLabel: 'Non retenue',
    detail: "L'entreprise a pourvu le poste",
    timeAgo: 'Il y a 1 semaine',
  },
];

const FILTERS: { label: string; value: 'Toutes' | Status }[] = [
  { label: 'Toutes', value: 'Toutes' },
  { label: 'En cours', value: 'review' },
  { label: 'Entretien', value: 'interview' },
  { label: 'Terminées', value: 'rejected' },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  interview: { bg: 'bg-secondary-container/30', text: 'text-on-secondary-container', icon: 'event' },
  review: { bg: 'bg-primary/10', text: 'text-primary', icon: 'hourglass-top' },
  rejected: { bg: 'bg-error/10', text: 'text-error', icon: 'close' },
  accepted: { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'check-circle' },
};

export default function SuiviCandidaturesScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<'Toutes' | Status>('Toutes');
  const applications = filter === 'Toutes' ? APPLICATIONS : APPLICATIONS.filter((a) => a.status === filter);

  return (
    <Screen>
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.navigate('CandidateTabs')} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Mes Candidatures</Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            {/* Stats */}
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'Total', value: '24', color: colors.primary },
                { label: 'En cours', value: '12', color: colors.primary },
                { label: 'Entretiens', value: '03', color: colors.secondary },
                { label: 'Refusées', value: '09', color: colors.error },
              ].map((stat) => (
                <View key={stat.label} className="w-[47%] gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                  <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
                  <Text className="font-sans-bold text-headline-md" style={{ color: stat.color }}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Filters */}
            <View className="flex-row flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f.value === filter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value)}
                    className={`rounded-full px-lg py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status];
          return (
            <Pressable
              onPress={() => {
                if (item.status === 'interview') {
                  navigation.navigate('ConfirmationEntretien', { company: item.company, position: item.title });
                } else {
                  navigation.navigate('DetailsCandidature', { title: item.title, company: item.company });
                }
              }}
              className="rounded-lg border border-outline-variant bg-white p-md shadow-sm"
            >
              <View className="mb-sm flex-row items-start justify-between gap-2">
                <View className="flex-1 flex-row items-center gap-md">
                  <View className="h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-high">
                    <MaterialIcons name="business" size={20} color={colors.onSurfaceVariant} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{item.title}</Text>
                    <Text className="font-sans text-body-md text-on-surface-variant">
                      {item.company} • {item.location}
                    </Text>
                  </View>
                </View>
                <View className={`rounded-full px-3 py-1 ${style.bg}`}>
                  <Text className={`font-sans-semibold text-label-md ${style.text}`}>{item.statusLabel}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-sm">
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={style.icon} size={18} color={style.text.includes('error') ? colors.error : colors.secondary} />
                  <Text className="font-sans-semibold text-label-lg" style={{ color: colors.onSurfaceVariant }}>
                    {item.detail}
                  </Text>
                </View>
                <Text className="font-sans text-label-md text-on-surface-variant">{item.timeAgo}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="description" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune candidature ici</Text>
          </View>
        }
      />
    </Screen>
  );
}
