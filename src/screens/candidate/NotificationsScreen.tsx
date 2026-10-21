import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listNotifications, markNotificationRead, markAllNotificationsRead, type NotificationItem } from '../../lib/api';

type Props = {
  navigation: { goBack: () => void };
};

type NotifType = 'application' | 'message' | 'interview' | 'job';

const ICONS: Record<NotifType, { icon: keyof typeof MaterialIcons.glyphMap; bg: string; color: string }> = {
  application: { icon: 'description', bg: 'bg-primary/10', color: colors.primary },
  message: { icon: 'mail', bg: 'bg-secondary-container/30', color: colors.secondary },
  interview: { icon: 'event', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
  job: { icon: 'work', bg: 'bg-surface-container-highest', color: colors.onSurfaceVariant },
};

export default function NotificationsScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userId = authState.userId;
        if (userId) {
          const items = await listNotifications(userId);
          setNotifications(items);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error('Erreur chargement notifications', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.userId]);

  const handleMarkRead = async (notificationId: number) => {
    try {
      const updated = await markNotificationRead(notificationId);
      setNotifications((current) =>
        current?.map((notif) => (notif.id === updated.id ? updated : notif)) ?? []
      );
    } catch (err) {
      console.error('Erreur marquer notification lue', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const userId = authState.userId;
      if (!userId) return;
      await markAllNotificationsRead(userId);
      setNotifications((current) => current?.map((notif) => ({ ...notif, read: true })) ?? []);
    } catch (err) {
      console.error('Erreur marquer toutes notifications lues', err);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Notifications</Text>
        </View>
        <Pressable onPress={handleMarkAllRead}>
          <Text className="font-sans-semibold text-label-lg text-primary">Tout marquer lu</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications || []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 20, gap: 8 }}
          ListEmptyComponent={
            <View className="items-center gap-md py-xl">
              <MaterialIcons name="notifications-off" size={48} color={colors.outline} />
              <Text className="font-sans text-body-md text-on-surface-variant">Aucune notification pour le moment</Text>
            </View>
          }
          renderItem={({ item }) => {
            const style = ICONS[item.type as NotifType] ?? ICONS.job;
            return (
              <Pressable
                onPress={() => handleMarkRead(item.id)}
                className={`flex-row gap-md rounded-xl p-md ${item.read ? 'bg-surface-container-lowest' : 'bg-primary-container/5'} border border-outline-variant/20`}
              >
                <View className={`h-11 w-11 items-center justify-center rounded-full ${style.bg}`}>
                  <MaterialIcons name={style.icon} size={20} color={style.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{item.title}</Text>
                  <Text className="font-sans text-body-md text-on-surface-variant">{item.body}</Text>
                  <Text className="mt-1 font-sans text-label-md text-outline">{item.created_at ? new Date(item.created_at).toLocaleString('fr-FR') : ''}</Text>
                </View>
                {!item.read && <View className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
