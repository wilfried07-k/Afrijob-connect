import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Contact = {
  id: string;
  name: string;
  role: string;
  mutual: number;
  connected: boolean;
};

const SUGGESTIONS: Contact[] = [
  { id: '1', name: 'Léa Fokou', role: 'Product Manager • Camtel', mutual: 12, connected: false },
  { id: '2', name: 'Éric Mbarga', role: 'Ingénieur DevOps • Orange', mutual: 8, connected: false },
  { id: '3', name: 'Sandrine Owona', role: 'Recruteuse Tech • MTN', mutual: 5, connected: true },
];

export default function ReseauProfessionnelScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mon Réseau</Text>
      </View>

      <FlatList
        data={SUGGESTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row gap-2">
            <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name="groups" size={22} color={colors.primary} />
              <Text className="font-sans-bold text-title-lg text-on-surface">248</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Connexions</Text>
            </View>
            <View className="flex-1 items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name="visibility" size={22} color={colors.secondary} />
              <Text className="font-sans-bold text-title-lg text-on-surface">32</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Vues du profil</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Text className="font-sans-bold text-label-lg text-primary">{item.name[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{item.name}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{item.role}</Text>
              <Text className="font-sans text-[11px] text-outline">{item.mutual} relations en commun</Text>
            </View>
            <Pressable
              className={`rounded-full px-md py-2 ${item.connected ? 'bg-surface-container-high' : 'bg-primary-container'}`}
            >
              <Text className={`font-sans-semibold text-label-md ${item.connected ? 'text-on-surface-variant' : 'text-on-primary-container'}`}>
                {item.connected ? 'Connecté' : 'Se connecter'}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
