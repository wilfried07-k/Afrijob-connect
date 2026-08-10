import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type BannedUser = {
  id: string;
  name: string;
  type: 'Candidat' | 'Recruteur';
  reason: string;
  bannedAgo: string;
  strikes: number;
};

const BANNED_USERS: BannedUser[] = [
  { id: '1', name: 'FastCash SARL', type: 'Recruteur', reason: 'Fraude aux frais de dossier', bannedAgo: 'Il y a 2j', strikes: 3 },
  { id: '2', name: 'Robert T.', type: 'Candidat', reason: 'Faux diplômes soumis', bannedAgo: 'Il y a 5j', strikes: 1 },
  { id: '3', name: 'Global Trade Corp', type: 'Recruteur', reason: 'Offres frauduleuses répétées', bannedAgo: 'Il y a 1 semaine', strikes: 4 },
];

const STATS = [
  { label: 'Total Bannis', value: '1 284', icon: 'block' as const, bg: 'bg-error-container/50', color: colors.error },
  { label: 'Récents (24h)', value: '42', icon: 'update' as const, bg: 'bg-primary/10', color: colors.primary },
  { label: 'En surveillance', value: '17', icon: 'warning' as const, bg: 'bg-tertiary/10', color: colors.tertiary },
];

export default function GestionBannissementsScreen() {
  const [users, setUsers] = useState(BANNED_USERS);

  const unban = (id: string) => setUsers((list) => list.filter((u) => u.id !== id));

  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Bannissements</Text>
        <Text className="font-sans text-body-md text-on-surface-variant">
          Comptes suspendus pour violation des règles de la plateforme.
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-2">
            {STATS.map((s) => (
              <View key={s.label} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className={`h-12 w-12 items-center justify-center rounded-full ${s.bg}`}>
                  <MaterialIcons name={s.icon} size={22} color={s.color} />
                </View>
                <View>
                  <Text className="font-sans text-label-md uppercase tracking-wide text-on-surface-variant">{s.label}</Text>
                  <Text className="font-sans-bold text-headline-md text-on-surface">{s.value}</Text>
                </View>
              </View>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 flex-row items-center gap-md">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-error-container/30">
                  <MaterialIcons name={item.type === 'Recruteur' ? 'business' : 'person'} size={20} color={colors.error} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-title-lg text-on-surface">{item.name}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {item.type} • Banni {item.bannedAgo}
                  </Text>
                </View>
              </View>
              <View className="rounded-full bg-error px-2 py-0.5">
                <Text className="text-[10px] font-sans-bold text-on-error">{item.strikes} strikes</Text>
              </View>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">{item.reason}</Text>
            <View className="flex-row gap-2 border-t border-outline-variant/30 pt-md">
              <Pressable className="h-10 flex-1 items-center justify-center rounded-lg border border-outline">
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Voir le dossier</Text>
              </Pressable>
              <Pressable onPress={() => unban(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-secondary shadow-sm">
                <Text className="font-sans-semibold text-label-lg text-white">Réhabiliter</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="how-to-reg" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucun compte banni actuellement</Text>
          </View>
        }
      />
    </Screen>
  );
}
