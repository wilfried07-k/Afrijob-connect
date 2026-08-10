import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'GestionEntretiensVideo'>;

type Status = 'live' | 'scheduled' | 'done';

type Interview = {
  id: string;
  name: string;
  role: string;
  time: string;
  status: Status;
};

const INTERVIEWS: Interview[] = [
  { id: '1', name: 'Jean-Marc Tchakounté', role: 'Développeur Fullstack Senior', time: '14:00 — 15:00', status: 'live' },
  { id: '2', name: 'Amandine N.', role: 'Designer Senior UX/UI', time: 'Demain, 10:30', status: 'scheduled' },
  { id: '3', name: 'Sarah M.', role: 'Frontend Expert', time: 'Vendredi, 09:00', status: 'scheduled' },
  { id: '4', name: 'Marc Atangana', role: 'Senior Developer', time: 'Hier, 14:30', status: 'done' },
];

const FILTERS: { label: string; value: Status | 'Tout' }[] = [
  { label: 'À venir', value: 'scheduled' },
  { label: 'En cours', value: 'live' },
  { label: 'Terminés', value: 'done' },
];

export default function GestionEntretiensVideoScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Status | 'Tout'>('scheduled');
  const [recording, setRecording] = useState(false);
  const items = INTERVIEWS.filter((i) => i.status === filter);

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Entretiens Vidéo</Text>
        <View className="w-6" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            {/* Invite link card */}
            <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <Text className="font-sans-semibold text-label-lg text-on-surface">Lien d'invitation rapide</Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 rounded-lg border border-outline-variant bg-surface-container px-md py-2">
                  <Text className="font-sans text-label-md text-on-surface-variant" numberOfLines={1}>
                    meet.emploicamer.cm/recruiter-01
                  </Text>
                </View>
                <Pressable className="h-10 w-10 items-center justify-center rounded-lg bg-secondary-container">
                  <MaterialIcons name="content-copy" size={18} color={colors.onSecondaryContainer} />
                </Pressable>
              </View>
              <Pressable
                onPress={() => setRecording((v) => !v)}
                className={`mt-1 flex-row items-center justify-center gap-2 self-start rounded-full border px-md py-2 ${
                  recording ? 'border-error bg-error-container/10' : 'border-outline'
                }`}
              >
                <MaterialIcons name="fiber-manual-record" size={16} color={recording ? colors.error : colors.onSurfaceVariant} />
                <Text className={`font-sans-medium text-label-md ${recording ? 'text-error' : 'text-on-surface-variant'}`}>
                  Enregistrement : {recording ? 'ON' : 'OFF'}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row gap-2">
              {FILTERS.map((f) => {
                const active = f.value === filter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value as Status)}
                    className={`rounded-full px-md py-2 ${active ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            className={`gap-md rounded-2xl p-md shadow-sm ${
              item.status === 'live' ? 'border-l-4 border-l-error bg-surface-container-lowest' : 'border border-outline-variant/30 bg-surface-container-lowest'
            }`}
          >
            <View className="flex-row items-center gap-md">
              <View className="relative">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container">
                  <Text className="font-sans-bold text-label-lg text-on-surface-variant">
                    {item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                {item.status === 'live' && (
                  <View className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-error" />
                )}
              </View>
              <View className="flex-1">
                {item.status === 'live' && (
                  <View className="mb-1 self-start rounded-full bg-error/10 px-2 py-0.5">
                    <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-error">En cours</Text>
                  </View>
                )}
                <Text className="font-sans-semibold text-title-lg text-on-surface">{item.name}</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">{item.role}</Text>
                <Text className="mt-1 font-sans text-label-md text-on-surface-variant">{item.time}</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              {item.status === 'live' && (
                <Pressable
                  onPress={() => navigation.navigate('VideoconferenceEntretien', { name: item.name, role: item.role, asRecruiter: true })}
                  className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md"
                >
                  <MaterialIcons name="call" size={18} color="#ffffff" />
                  <Text className="font-sans-semibold text-label-lg text-on-primary">Rejoindre l'appel</Text>
                </Pressable>
              )}
              {item.status === 'scheduled' && (
                <Pressable
                  onPress={() => navigation.navigate('NotesEntretien', { candidateName: item.name, role: item.role })}
                  className="h-11 flex-1 items-center justify-center rounded-xl border border-primary"
                >
                  <Text className="font-sans-semibold text-label-lg text-primary">Préparer mes notes</Text>
                </Pressable>
              )}
              {item.status === 'done' && (
                <Pressable
                  onPress={() => navigation.navigate('RedactionRapportEntretien', { candidateName: item.name, role: item.role })}
                  className="h-11 flex-1 items-center justify-center rounded-xl bg-secondary shadow-sm"
                >
                  <Text className="font-sans-semibold text-label-lg text-white">Rédiger le rapport</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="event-busy" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucun entretien ici</Text>
          </View>
        }
      />
    </Screen>
  );
}
