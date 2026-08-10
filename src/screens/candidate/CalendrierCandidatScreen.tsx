import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CalendrierCandidat'>;

const DAYS = [
  { label: 'LUN', date: 12 },
  { label: 'MAR', date: 13 },
  { label: 'MER', date: 14 },
  { label: 'JEU', date: 15 },
  { label: 'VEN', date: 16 },
  { label: 'SAM', date: 17 },
];

type EventItem = {
  id: string;
  time: string;
  duration: string;
  type: 'Entretien' | 'Mission';
  title: string;
  meta: string;
};

const EVENTS: EventItem[] = [
  { id: '1', time: '09:30', duration: '45 min', type: 'Entretien', title: 'Product Manager Senior', meta: 'MTN Cameroon • Douala' },
  { id: '2', time: '14:00', duration: 'Début', type: 'Mission', title: 'Consultant DevOps', meta: 'Orange Middle East • Remote' },
];

export default function CalendrierCandidatScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState(13);

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Agenda</Text>
        <MaterialIcons name="notifications" size={22} color={colors.primary} />
      </View>

      {/* Date selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}>
        {DAYS.map((day) => {
          const active = day.date === selectedDate;
          return (
            <Pressable
              key={day.date}
              onPress={() => setSelectedDate(day.date)}
              className={`min-w-[56px] items-center rounded-xl p-2 ${active ? 'bg-primary shadow-md' : 'bg-surface-container-high'}`}
            >
              <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                {day.label}
              </Text>
              <Text className={`font-sans-semibold text-title-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                {day.date}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 16 }}>
        <Text className="font-sans-semibold text-headline-md text-on-surface">
          Aujourd'hui, {selectedDate} Octobre
        </Text>

        <View className="gap-md">
          {EVENTS.map((event) => (
            <View
              key={event.id}
              className="flex-row gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="min-w-[64px] items-center border-r border-outline-variant/30 pr-md">
                <Text
                  className="font-sans-semibold text-title-lg"
                  style={{ color: event.type === 'Entretien' ? colors.primary : colors.secondary }}
                >
                  {event.time}
                </Text>
                <Text className="font-sans text-label-md text-outline">{event.duration}</Text>
              </View>
              <View className="flex-1">
                <View className="mb-1 self-start rounded-full bg-primary-container/10 px-2 py-0.5">
                  <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-primary-container">
                    {event.type}
                  </Text>
                </View>
                <Text className="mb-1 font-sans-semibold text-title-lg text-on-surface">{event.title}</Text>
                <Text className="mb-md font-sans text-body-md text-on-surface-variant">{event.meta}</Text>
                {event.type === 'Entretien' ? (
                  <View className="flex-row gap-2">
                    <Pressable
                      className="h-10 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-primary"
                      onPress={() => navigation.navigate('PreparationEntretienVideo', { company: event.meta.split(' • ')[0], position: event.title })}
                    >
                      <MaterialIcons name="videocam" size={16} color="#ffffff" />
                      <Text className="font-sans-semibold text-label-lg text-on-primary">Rejoindre</Text>
                    </Pressable>
                    <Pressable
                      className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high"
                      onPress={() => navigation.navigate('ConfirmationEntretien', { company: event.meta.split(' • ')[0], position: event.title })}
                    >
                      <MaterialIcons name="info" size={18} color={colors.onSurface} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable className="h-10 flex-row items-center justify-center gap-1 rounded-lg border border-primary">
                    <Text className="font-sans-semibold text-label-lg text-primary">Voir les détails</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
