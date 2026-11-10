import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const TEAMS = [
  { name: 'Modération', members: 6, load: 78 },
  { name: 'KYC & Conformité', members: 4, load: 52 },
  { name: 'Support Client', members: 8, load: 90 },
];

export default function TableauDeBordSupervisionScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Supervision</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row gap-2">
          <View className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <MaterialIcons name="supervisor-account" size={20} color={colors.primary} />
            <Text className="font-sans text-label-md text-on-surface-variant">Agents actifs</Text>
            <Text className="font-sans-bold text-headline-md text-on-surface">18</Text>
          </View>
          <View className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <MaterialIcons name="pending-actions" size={20} color={colors.tertiary} />
            <Text className="font-sans text-label-md text-on-surface-variant">Tâches en attente</Text>
            <Text className="font-sans-bold text-headline-md text-on-surface">142</Text>
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Charge par équipe</Text>
          <View className="gap-md">
            {TEAMS.map((team) => (
              <View key={team.name} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{team.name}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{team.members} membres</Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View
                    className={`h-full rounded-full ${team.load > 85 ? 'bg-error' : team.load > 60 ? 'bg-tertiary' : 'bg-secondary'}`}
                    style={{ width: `${team.load}%` }}
                  />
                </View>
                <Text className="font-sans text-[11px] text-outline">Charge de travail : {team.load}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
