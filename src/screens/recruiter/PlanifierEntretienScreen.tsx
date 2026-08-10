import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'PlanifierEntretien'>;

const DATES = [
  { label: 'LUN', date: 14 },
  { label: 'MAR', date: 15 },
  { label: 'MER', date: 16 },
  { label: 'JEU', date: 17 },
  { label: 'VEN', date: 18 },
];

const TIME_SLOTS = ['09:00 — 10:00', '10:30 — 11:30', '14:00 — 15:00', '15:30 — 16:30'];

type Mode = 'virtual' | 'onsite';

export default function PlanifierEntretienScreen({ navigation, route }: Props) {
  const candidateName = route.params?.candidateName ?? 'Amandine N.';
  const role = route.params?.role ?? 'Designer Senior UX/UI';

  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedTime, setSelectedTime] = useState('10:30 — 11:30');
  const [mode, setMode] = useState<Mode>('virtual');

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-semibold text-title-lg text-on-surface">Planifier l'entretien</Text>
        <MaterialIcons name="more-vert" size={22} color={colors.onSurfaceVariant} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Candidate summary */}
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="relative">
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-container bg-primary/10">
              <Text className="font-sans-bold text-title-lg text-primary">
                {candidateName.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-secondary" />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-headline-md text-on-surface">{candidateName}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">{role}</Text>
            <View className="mt-1 self-start rounded-full bg-secondary-container px-2 py-0.5">
              <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-on-secondary-container">
                Top Talent
              </Text>
            </View>
          </View>
        </View>

        {/* Date picker */}
        <View className="gap-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Choisir une date</Text>
            <Text className="font-sans-semibold text-label-lg text-primary">Voir calendrier</Text>
          </View>
          <View className="flex-row gap-2">
            {DATES.map((d) => {
              const active = d.date === selectedDate;
              return (
                <Pressable
                  key={d.date}
                  onPress={() => setSelectedDate(d.date)}
                  className={`h-20 w-16 items-center justify-center rounded-xl ${
                    active ? 'bg-primary shadow-lg' : 'bg-surface-container-high'
                  }`}
                >
                  <Text className={`text-xs font-sans-medium ${active ? 'text-on-primary opacity-90' : 'text-on-surface-variant'}`}>
                    {d.label}
                  </Text>
                  <Text className={`font-sans-bold text-title-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                    {d.date}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Time slots */}
        <View className="gap-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Créneaux horaires</Text>
          <View className="flex-row flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => {
              const active = slot === selectedTime;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setSelectedTime(slot)}
                  className={`w-[47%] items-center rounded-xl border py-3 ${
                    active ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  <Text className={`font-sans-semibold text-label-lg ${active ? 'text-primary' : 'text-on-surface'}`}>
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Mode */}
        <View className="gap-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Mode d'entretien</Text>
          <View className="gap-sm">
            <Pressable
              onPress={() => setMode('virtual')}
              className={`flex-row items-center rounded-xl border p-md ${
                mode === 'virtual' ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${mode === 'virtual' ? 'border-primary' : 'border-outline'}`}>
                {mode === 'virtual' && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </View>
              <View className="ml-md flex-1">
                <Text className="font-sans-medium text-label-lg text-on-surface">Visioconférence</Text>
                <Text className="mt-0.5 text-xs font-sans-medium text-secondary">
                  Lien Google Meet généré automatiquement
                </Text>
              </View>
              <MaterialIcons name="videocam" size={20} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => setMode('onsite')}
              className={`flex-row items-center rounded-xl border p-md ${
                mode === 'onsite' ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${mode === 'onsite' ? 'border-primary' : 'border-outline'}`}>
                {mode === 'onsite' && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </View>
              <View className="ml-md flex-1">
                <Text className="font-sans-medium text-label-lg text-on-surface">Sur site</Text>
                <Text className="mt-0.5 text-xs font-sans-medium text-on-surface-variant">
                  Bureaux de l'entreprise
                </Text>
              </View>
              <MaterialIcons name="location-on" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-outline-variant px-container-margin py-md">
        <Pressable
          onPress={() =>
            navigation.navigate('GestionEntretiensVideo')
          }
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="event-available" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Confirmer l'entretien</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
