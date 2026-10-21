import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCandidateConversations, type ConversationSummary } from '../../lib/api';

export default function MessagesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  const { authState } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const candidateId = authState.profile?.candidate_profile_id;
        if (candidateId) {
          const res = await listCandidateConversations(candidateId);
          setConversations(res);
        } else {
          setConversations([]);
        }
      } catch (err) {
        console.error('Erreur chargement conversations', err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.profile]);

  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container">
            <Text className="font-sans-bold text-label-lg text-primary">SN</Text>
          </View>
          <Text className="font-sans-bold text-headline-lg-mobile tracking-tight text-primary">Messages</Text>
        </View>
        <MaterialIcons name="search" size={24} color={colors.primary} />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations || []}
          keyExtractor={(item) => String(item.conversation_id)}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListHeaderComponent={
            <View className="mb-md gap-md">
              <View className="h-12 flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-md">
                <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
                <TextInput
                  placeholder="Rechercher une entreprise ou un poste..."
                  placeholderTextColor={colors.outline}
                  className="ml-2 flex-1 font-sans text-body-md text-on-surface"
                />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-semibold text-title-lg text-on-surface">Récent</Text>
                <Text className="font-sans-semibold text-label-lg text-primary">Tout marquer comme lu</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('DiscussionCandidat', { conversationId: item.conversation_id, company: item.company_name })}
              className={`flex-row items-center gap-md rounded-lg border border-outline-variant/30 p-md shadow-sm ${
                item.unread_count && item.unread_count > 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-lowest/60'
              }`}
            >
              <View className="relative h-14 w-14">
                <View className="h-full w-full items-center justify-center rounded-full border border-outline-variant bg-white">
                  <MaterialIcons name="business" size={22} color={colors.onSurfaceVariant} />
                </View>
                {item.company_name && (
                  <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-secondary">
                    <MaterialIcons name="check" size={10} color="#ffffff" />
                  </View>
                )}
              </View>
              <View className="flex-1">
                <View className="mb-0.5 flex-row items-center justify-between">
                  <Text className="flex-1 font-sans-semibold text-headline-md text-on-surface" numberOfLines={1}>
                    {item.company_name ?? 'Conversation'}
                  </Text>
                  <Text className={`font-sans-bold text-label-md ${item.unread_count && item.unread_count > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {item.last_message_at ? new Date(item.last_message_at).toLocaleTimeString('fr-FR') : ''}
                  </Text>
                </View>
                <Text className="mb-1 font-sans text-label-lg text-on-surface-variant" numberOfLines={1}>
                  {item.last_message ?? ''}
                </Text>
                <Text
                  className={`font-sans text-body-md leading-tight text-on-surface ${item.unread_count && item.unread_count > 0 ? 'font-sans-semibold' : ''}`}
                  numberOfLines={1}
                >
                  {item.last_message ?? ''}
                </Text>
              </View>
              {item.unread_count && item.unread_count > 0 && <View className="h-3 w-3 rounded-full bg-error" />}
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="items-center gap-md py-xl">
              <MaterialIcons name="mail-outline" size={48} color={colors.outline} />
              <Text className="font-sans text-body-md text-on-surface-variant">Aucune conversation disponible</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}
