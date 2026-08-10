import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function ProfilDirigeantEntrepriseScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil du Dirigeant</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="items-center gap-md">
          <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-primary-fixed bg-primary/10">
            <MaterialIcons name="badge" size={36} color={colors.primary} />
          </View>
          <Text className="font-sans-semibold text-title-lg text-on-surface">Directeur Général</Text>
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Nom complet</Text>
            <TextInput
              defaultValue="Jean Dupont"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Fonction</Text>
            <TextInput
              defaultValue="Directeur Général"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Email professionnel</Text>
            <TextInput
              defaultValue="j.dupont@techcamer.cm"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Pièce d'identité</Text>
            <View className="flex-row items-center gap-2 rounded-lg border border-outline px-md py-3">
              <MaterialIcons name="badge" size={18} color={colors.onSurfaceVariant} />
              <Text className="flex-1 font-sans text-body-md text-on-surface-variant">CNI n° 102938475</Text>
              <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
            </View>
          </View>
        </View>

        <Pressable className="h-14 items-center justify-center rounded-full bg-primary shadow-lg">
          <Text className="font-sans-semibold text-title-lg text-on-primary">Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
