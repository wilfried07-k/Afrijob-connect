import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { scheduleInterview } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'PlanifierEntretien'>;
type Mode = 'virtual' | 'onsite';
const TIME_SLOTS = ['09:00', '10:30', '14:00', '15:30'];

export default function PlanifierEntretienScreen({ navigation, route }: Props) {
  const applicationId = route.params?.applicationId;
  const candidateName = route.params?.candidateName ?? 'Candidat';
  const role = route.params?.role ?? 'Poste';
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    return date;
  }), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [mode, setMode] = useState<Mode>('virtual');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const confirm = async () => {
    if (!applicationId) {
      Alert.alert('Candidature manquante', 'Ouvre la planification depuis une candidature pour associer cet entretien au bon candidat.');
      return;
    }
    const [hour, minute] = selectedTime.split(':').map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hour, minute, 0, 0);
    setSaving(true);
    try {
      await scheduleInterview({
        application_id: applicationId,
        scheduled_at: scheduledAt.toISOString(),
        mode: mode === 'virtual' ? 'video' : 'onsite',
        location_or_link: location.trim() || undefined,
      });
      Alert.alert('Entretien planifié', 'La candidature a été mise à jour et l’entretien est enregistré.', [{ text: 'OK', onPress: () => navigation.navigate('GestionEntretiensVideo') }]);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de planifier cet entretien.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={22} color={colors.primary} /></Pressable>
        <Text className="font-sans-semibold text-title-lg text-on-surface">Planifier l’entretien</Text>
        <View className="w-6" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Text className="font-sans-bold text-title-lg text-primary">{candidateName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View>
          <View className="flex-1"><Text className="font-sans-semibold text-headline-md text-on-surface">{candidateName}</Text><Text className="font-sans text-body-md text-on-surface-variant">{role}</Text></View>
        </View>
        <View className="gap-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Choisir une date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {dates.map((date) => {
              const active = date.toDateString() === selectedDate.toDateString();
              return <Pressable key={date.toISOString()} onPress={() => setSelectedDate(date)} className={`min-w-[64px] items-center rounded-xl p-3 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}><Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}</Text><Text className={`font-sans-bold text-title-lg ${active ? 'text-on-primary' : 'text-on-surface'}`}>{date.getDate()}</Text></Pressable>;
            })}
          </ScrollView>
        </View>
        <View className="gap-sm"><Text className="font-sans-semibold text-title-lg text-on-surface">Créneau horaire</Text><View className="flex-row flex-wrap gap-2">{TIME_SLOTS.map((time) => <Pressable key={time} onPress={() => setSelectedTime(time)} className={`w-[47%] items-center rounded-xl border py-3 ${time === selectedTime ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className="font-sans-semibold text-label-lg text-on-surface">{time}</Text></Pressable>)}</View></View>
        <View className="gap-sm"><Text className="font-sans-semibold text-title-lg text-on-surface">Mode d’entretien</Text>{(['virtual', 'onsite'] as Mode[]).map((value) => <Pressable key={value} onPress={() => setMode(value)} className={`flex-row items-center gap-md rounded-xl border p-md ${mode === value ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'}`}><MaterialIcons name={value === 'virtual' ? 'videocam' : 'location-on'} size={20} color={colors.primary} /><Text className="font-sans-medium text-label-lg text-on-surface">{value === 'virtual' ? 'Visioconférence' : 'Sur site'}</Text></Pressable>)}</View>
        <View className="gap-sm"><Text className="font-sans-semibold text-title-lg text-on-surface">Lien ou adresse (facultatif)</Text><TextInput value={location} onChangeText={setLocation} placeholder={mode === 'virtual' ? 'Lien de visioconférence' : 'Adresse du rendez-vous'} autoCapitalize="none" className="rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-3 font-sans text-body-md text-on-surface" /></View>
      </ScrollView>
      <View className="border-t border-outline-variant px-container-margin py-md"><Pressable disabled={saving} onPress={() => void confirm()} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary">{saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="event-available" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Confirmer l’entretien</Text></>}</Pressable></View>
    </Screen>
  );
}
