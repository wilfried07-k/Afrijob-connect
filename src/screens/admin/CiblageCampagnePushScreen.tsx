import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  route?: { params?: { campaignName?: string } };
};

const SEGMENTS = [
  { key: 'candidates', label: 'Tous les candidats', count: '128 400' },
  { key: 'recruiters', label: 'Tous les recruteurs', count: '3 200' },
  { key: 'inactive', label: 'Candidats inactifs (30j+)', count: '42 100' },
  { key: 'premium', label: 'Recruteurs Premium', count: '850' },
];

export default function CiblageCampagnePushScreen({ navigation, route }: Props) {
  const campaignName = route?.params?.campaignName ?? 'Nouvelle campagne';
  const [selectedSegment, setSelectedSegment] = useState('candidates');
  const [scheduleNow, setScheduleNow] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary" numberOfLines={1}>{campaignName}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Cibler une audience</Text>
          <View className="gap-2">
            {SEGMENTS.map((seg) => {
              const active = seg.key === selectedSegment;
              return (
                <Pressable
                  key={seg.key}
                  onPress={() => setSelectedSegment(seg.key)}
                  className={`flex-row items-center justify-between rounded-xl border-2 p-md ${active ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}
                >
                  <Text className={`font-sans-medium text-label-lg ${active ? 'text-primary' : 'text-on-surface'}`}>{seg.label}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{seg.count}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Envoyer immédiatement</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Sinon, programmez une date d'envoi</Text>
          </View>
          <Switch value={scheduleNow} onValueChange={setScheduleNow} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('ConfirmationEnvoiCampagne', { campaignName })}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer la campagne</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
