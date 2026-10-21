import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { listBannedAccounts, unbanUser, type BannedAccount } from '../../lib/api';

const STATS = [
  { label: 'Total Bannis', value: '0', icon: 'block' as const, bg: 'bg-error-container/50', color: colors.error },
  { label: 'Récents (24h)', value: '0', icon: 'update' as const, bg: 'bg-primary/10', color: colors.primary },
  { label: 'En surveillance', value: '0', icon: 'warning' as const, bg: 'bg-tertiary/10', color: colors.tertiary },
];

export default function GestionBannissementsScreen() {
  const [users, setUsers] = useState<BannedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanned = async () => {
      try {
        const banned = await listBannedAccounts();
        setUsers(banned);
      } catch (err) {
        console.error('Erreur chargement comptes bannis', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadBanned();
  }, []);

  const handleUnban = async (userId: number) => {
    try {
      await unbanUser(userId);
      setUsers((list) => list.filter((user) => user.user_id !== userId));
    } catch (err) {
      console.error('Erreur réhabilitation utilisateur', err);
    }
  };

  const stats = {
    total: users.length,
    recent: users.filter((u) => !u.definitive).length,
    monitored: users.filter((u) => u.definitive).length,
  };

  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Bannissements</Text>
        <Text className="font-sans text-body-md text-on-surface-variant">
          Comptes suspendus pour violation des règles de la plateforme.
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListHeaderComponent={
            <View className="mb-md gap-2">
              {[
                { label: 'Total Bannis', value: String(stats.total), icon: 'block' as const, color: colors.error, bg: 'bg-error-container/30' },
                { label: 'Récents (24h)', value: String(stats.recent), icon: 'update' as const, color: colors.primary, bg: 'bg-primary-container/30' },
                { label: 'Définitifs', value: String(stats.monitored), icon: 'warning' as const, color: colors.tertiary, bg: 'bg-tertiary-container/30' },
              ].map((s) => (
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
                    <MaterialIcons name="person" size={20} color={colors.error} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">Compte #{item.user_id}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">
                      {item.definitive ? 'Bannissement définitif' : 'Bannissement temporaire'}
                    </Text>
                  </View>
                </View>
                <View className="rounded-full bg-error px-2 py-0.5">
                  <Text className="text-[10px] font-sans-bold text-on-error">{item.active ? 'Actif' : 'Inactif'}</Text>
                </View>
              </View>
              <Text className="font-sans text-body-md text-on-surface-variant">{item.reason}</Text>
              <View className="flex-row gap-2 border-t border-outline-variant/30 pt-md">
                <Pressable className="h-10 flex-1 items-center justify-center rounded-lg border border-outline">
                  <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Voir le dossier</Text>
                </Pressable>
                <Pressable onPress={() => handleUnban(item.user_id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-secondary shadow-sm">
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
      )}
    </Screen>
  );
}
