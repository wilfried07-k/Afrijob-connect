import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'JournalAudit'>;

type Category = 'Security' | 'Billing' | 'Team';

type AuditEvent = {
  id: string;
  actor: string;
  role: string;
  action: string;
  detail: string;
  category: Category;
  timeAgo: string;
};

const EVENTS: AuditEvent[] = [
  { id: '1', actor: 'Fatou Ndiaye', role: 'Manager RH', action: 'Added new recruiter', detail: "Compte créé pour Amadou Diallo avec accès 'Sourcing'.", category: 'Team', timeAgo: 'Il y a 12 min' },
  { id: '2', actor: 'Admin Principal', role: 'Super Admin', action: 'Bannissement compte', detail: 'FastCash SARL banni pour fraude aux frais de dossier.', category: 'Security', timeAgo: 'Il y a 1h' },
  { id: '3', actor: 'Système', role: 'Automatisé', action: 'Remboursement traité', detail: 'REF-9276-MNB réglé pour 120 000 FCFA.', category: 'Billing', timeAgo: 'Il y a 3h' },
  { id: '4', actor: 'Paul Etoundi', role: 'Modérateur', action: 'Offre supprimée', detail: "Poste 'Ingénieur Software Senior' supprimé pour arnaque.", category: 'Security', timeAgo: 'Il y a 5h' },
];

const FILTERS: ('Tous' | Category)[] = ['Tous', 'Security', 'Billing', 'Team'];

const CATEGORY_STYLE: Record<Category, { bg: string; text: string }> = {
  Security: { bg: 'bg-error-container/20', text: 'text-error' },
  Billing: { bg: 'bg-primary/10', text: 'text-primary' },
  Team: { bg: 'bg-secondary-container/30', text: 'text-secondary' },
};

export default function JournalAuditScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<'Tous' | Category>('Tous');
  const events = filter === 'Tous' ? EVENTS : EVENTS.filter((e) => e.category === filter);

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Journal d'audit</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            <View className="h-12 flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-md">
              <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
              <Text className="font-sans text-body-md text-outline">Rechercher un événement...</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f === filter;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFilter(f)}
                    className={`rounded-full px-md py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-medium text-label-md ${active ? 'text-white' : 'text-on-surface-variant'}`}>
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const style = CATEGORY_STYLE[item.category];
          return (
            <View className="gap-2 rounded-xl border border-outline-variant/20 bg-white p-md shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-md">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Text className="font-sans-bold text-label-md text-primary">
                      {item.actor.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{item.actor}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">{item.role}</Text>
                  </View>
                </View>
                <Text className="font-sans text-label-md text-outline">{item.timeAgo}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className={`rounded px-2 py-0.5 ${style.bg}`}>
                  <Text className={`font-sans-semibold text-label-md ${style.text}`}>{item.action}</Text>
                </View>
                <Text className="text-[10px] font-sans-medium uppercase tracking-widest text-outline">
                  {item.category}
                </Text>
              </View>
              <Text className="font-sans text-body-md text-on-surface-variant">{item.detail}</Text>
            </View>
          );
        }}
      />
    </Screen>
  );
}
