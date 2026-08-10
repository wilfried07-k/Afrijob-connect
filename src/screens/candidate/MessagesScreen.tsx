import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';

type Conversation = {
  id: string;
  company: string;
  jobTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  verified?: boolean;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    company: 'MTN Cameroon',
    jobTitle: 'Product Designer',
    lastMessage: 'Votre candidature nous intéresse vivement pour ce poste...',
    time: '14:20',
    unread: true,
    verified: true,
  },
  {
    id: '2',
    company: 'Orange Cameroun',
    jobTitle: 'Ingénieur Réseaux',
    lastMessage: 'Bonjour, seriez-vous disponible pour un entretien Zoom ?',
    time: 'Hier',
    unread: true,
  },
  {
    id: '3',
    company: 'Afriland First Bank',
    jobTitle: 'Analyste Financier',
    lastMessage: 'Merci pour votre entretien, nous revenons vers vous sous 48h.',
    time: 'Lun.',
    unread: false,
  },
  {
    id: '4',
    company: 'Bolloré Logistics',
    jobTitle: 'Chef de projet',
    lastMessage: 'Pouvez-vous nous transmettre vos disponibilités ?',
    time: '02/07',
    unread: false,
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container">
            <Text className="font-sans-bold text-label-lg text-primary">SN</Text>
          </View>
          <Text className="font-sans-bold text-headline-lg-mobile tracking-tight text-primary">
            Messages
          </Text>
        </View>
        <MaterialIcons name="search" size={24} color={colors.primary} />
      </View>

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
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
              <Text className="font-sans-semibold text-label-lg text-primary">
                Tout marquer comme lu
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DiscussionCandidat', { company: item.company })}
            className={`flex-row items-center gap-md rounded-lg border border-outline-variant/30 p-md shadow-sm ${
              item.unread ? 'bg-surface-container-lowest' : 'bg-surface-container-lowest/60'
            }`}
          >
            <View className="relative h-14 w-14">
              <View className="h-full w-full items-center justify-center rounded-full border border-outline-variant bg-white">
                <MaterialIcons name="business" size={22} color={colors.onSurfaceVariant} />
              </View>
              {item.verified && (
                <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-secondary">
                  <MaterialIcons name="check" size={10} color="#ffffff" />
                </View>
              )}
            </View>
            <View className="flex-1">
              <View className="mb-0.5 flex-row items-center justify-between">
                <Text className="flex-1 font-sans-semibold text-headline-md text-on-surface" numberOfLines={1}>
                  {item.company}
                </Text>
                <Text className={`font-sans-bold text-label-md ${item.unread ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {item.time}
                </Text>
              </View>
              <Text className="mb-1 font-sans text-label-lg text-on-surface-variant" numberOfLines={1}>
                {item.jobTitle}
              </Text>
              <Text
                className={`font-sans text-body-md leading-tight text-on-surface ${item.unread ? 'font-sans-semibold' : ''}`}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
            {item.unread && <View className="h-3 w-3 rounded-full bg-error" />}
          </Pressable>
        )}
      />
    </Screen>
  );
}
