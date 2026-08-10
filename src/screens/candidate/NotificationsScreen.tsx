import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void };
};

type NotifType = 'application' | 'message' | 'interview' | 'job';

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timeAgo: string;
  unread: boolean;
};

const ICONS: Record<NotifType, { icon: keyof typeof MaterialIcons.glyphMap; bg: string; color: string }> = {
  application: { icon: 'description', bg: 'bg-primary/10', color: colors.primary },
  message: { icon: 'mail', bg: 'bg-secondary-container/30', color: colors.secondary },
  interview: { icon: 'event', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
  job: { icon: 'work', bg: 'bg-surface-container-highest', color: colors.onSurfaceVariant },
};

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'interview', title: 'Entretien confirmé', body: 'Votre entretien avec MTN Cameroon est confirmé pour lundi 14:00.', timeAgo: 'Il y a 10 min', unread: true },
  { id: '2', type: 'message', title: 'Nouveau message', body: 'Orange Cameroun vous a envoyé un message.', timeAgo: 'Il y a 1h', unread: true },
  { id: '3', type: 'application', title: 'Candidature consultée', body: 'Afriland First Bank a consulté votre candidature.', timeAgo: 'Il y a 3h', unread: false },
  { id: '4', type: 'job', title: 'Nouvelle offre correspondante', body: '3 nouvelles offres de Développeur Fullstack à Douala.', timeAgo: 'Hier', unread: false },
];

export default function NotificationsScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Notifications</Text>
        </View>
        <Text className="font-sans-semibold text-label-lg text-primary">Tout marquer lu</Text>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 8 }}
        renderItem={({ item }) => {
          const style = ICONS[item.type];
          return (
            <View className={`flex-row gap-md rounded-xl p-md ${item.unread ? 'bg-primary-container/5' : 'bg-surface-container-lowest'} border border-outline-variant/20`}>
              <View className={`h-11 w-11 items-center justify-center rounded-full ${style.bg}`}>
                <MaterialIcons name={style.icon} size={20} color={style.color} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.title}</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">{item.body}</Text>
                <Text className="mt-1 font-sans text-label-md text-outline">{item.timeAgo}</Text>
              </View>
              {item.unread && <View className="mt-1 h-2 w-2 rounded-full bg-primary" />}
            </View>
          );
        }}
      />
    </View>
  );
}
