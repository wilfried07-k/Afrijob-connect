import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, TextInput, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CandidateStackParamList } from '../../navigation/types';
import { connectCandidate, disconnectCandidate, getMyNetwork, type NetworkPerson } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ReseauProfessionnel'>;

export default function ReseauProfessionnelScreen({ navigation }: Props) {
  const [connections, setConnections] = useState<NetworkPerson[]>([]);
  const [suggestions, setSuggestions] = useState<NetworkPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [showConnections, setShowConnections] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const network = await getMyNetwork();
      setConnections(network.connections);
      setSuggestions(network.suggestions);
      setTotal(network.total_connections);
    } catch (error) {
      Alert.alert('Réseau indisponible', (error as Error).message || 'Impossible de charger votre réseau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const people = useMemo(() => (showConnections ? connections : suggestions).filter((person) =>
    `${person.full_name} ${person.job_title ?? ''} ${person.city ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  ), [connections, query, showConnections, suggestions]);

  const toggleConnection = async (person: NetworkPerson, connected: boolean) => {
    try {
      if (connected) await disconnectCandidate(person.id);
      else await connectCandidate(person.id);
      await load();
    } catch (error) {
      Alert.alert('Action impossible', (error as Error).message || 'Réessayez plus tard.');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mon Réseau</Text>
      </View>

      <FlatList
        data={people}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 gap-md">
            <View className="flex-row items-center gap-2"><MaterialIcons name="groups" size={22} color={colors.primary} /><Text className="font-sans-bold text-title-lg text-on-surface">{total} connexion{total === 1 ? '' : 's'}</Text></View>
            <View className="flex-row gap-2"><Pressable onPress={() => setShowConnections(false)} className={`rounded-full border px-4 py-2 ${!showConnections ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-semibold text-label-md ${!showConnections ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>Suggestions</Text></Pressable><Pressable onPress={() => setShowConnections(true)} className={`rounded-full border px-4 py-2 ${showConnections ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-semibold text-label-md ${showConnections ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>Mes connexions</Text></Pressable></View>
            <View className="h-12 flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-md"><MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} /><TextInput value={query} onChangeText={setQuery} placeholder="Nom, métier ou ville" placeholderTextColor={colors.outline} className="ml-2 flex-1 font-sans text-body-md text-on-surface" /></View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('ProfilPublicCandidat', { candidateId: item.id })} className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Text className="font-sans-bold text-label-lg text-primary">{item.full_name[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{item.full_name}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{item.job_title || 'Candidat'}{item.city ? ` · ${item.city}` : ''}</Text>
            </View>
            <Pressable
              onPress={(event) => { event.stopPropagation(); void toggleConnection(item, showConnections); }}
              className={`rounded-full px-md py-2 ${showConnections ? 'bg-surface-container-high' : 'bg-primary-container'}`}
            >
              <Text className={`font-sans-semibold text-label-md ${showConnections ? 'text-on-surface-variant' : 'text-on-primary-container'}`}>
                {showConnections ? 'Retirer' : 'Connecter'}
              </Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} /> : <Text className="py-xl text-center font-sans text-body-md text-on-surface-variant">{showConnections ? 'Aucune connexion pour le moment.' : 'Aucune suggestion disponible.'}</Text>}
      />
    </View>
  );
}
