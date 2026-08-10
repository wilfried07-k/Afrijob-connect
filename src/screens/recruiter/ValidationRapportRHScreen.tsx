import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'ValidationRapportRH'>;

const CRITERIA = [
  { label: 'Compétences Techniques', score: 5 },
  { label: 'Communication', score: 4 },
  { label: 'Soft Skills', score: 4 },
];

export default function ValidationRapportRHScreen({ navigation, route }: Props) {
  const candidateName = route.params?.candidateName ?? 'Marc Atangana';
  const role = route.params?.role ?? 'Senior Developer';

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Validation du rapport</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Candidate + score */}
        <View className="gap-md">
          <View className="flex-row items-center gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
            <View className="relative">
              <View className="h-20 w-20 items-center justify-center rounded-xl border-2 border-white bg-primary/10 shadow-sm">
                <Text className="font-sans-bold text-headline-md text-primary">
                  {candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
              <View className="absolute -bottom-2 -right-2 rounded-full bg-secondary px-2 py-0.5">
                <Text className="text-[9px] font-sans-bold uppercase tracking-wider text-on-secondary">Vérifié</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-headline-md text-on-surface">{candidateName}</Text>
              <Text className="font-sans-semibold text-title-lg text-primary">{role}</Text>
              <View className="mt-1 flex-row flex-wrap gap-2">
                <View className="flex-row items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5">
                  <MaterialIcons name="location-on" size={12} color={colors.onSurfaceVariant} />
                  <Text className="text-[10px] font-sans text-on-surface-variant">Douala, CM</Text>
                </View>
                <View className="flex-row items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5">
                  <MaterialIcons name="work-history" size={12} color={colors.onSurfaceVariant} />
                  <Text className="text-[10px] font-sans text-on-surface-variant">8+ ans</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="items-center gap-2 rounded-xl bg-primary p-lg shadow-lg">
            <Text className="font-sans-semibold text-label-lg uppercase tracking-widest text-on-primary/80">
              Score du recruteur
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="font-sans-extrabold text-display-lg text-on-primary">4.5</Text>
              <Text className="text-xl font-sans text-on-primary/70">/ 5</Text>
            </View>
            <View className="flex-row gap-1">
              {[1, 2, 3, 4].map((i) => (
                <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
              ))}
              <MaterialIcons name="star-half" size={20} color="#FFD700" />
            </View>
          </View>
        </View>

        {/* Evaluation breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Évaluation détaillée</Text>
          {CRITERIA.map((c) => (
            <View key={c.label} className="flex-row items-center justify-between">
              <Text className="font-sans text-body-md text-on-surface-variant">{c.label}</Text>
              <View className="flex-row gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <MaterialIcons key={i} name={i <= c.score ? 'star' : 'star-border'} size={16} color={i <= c.score ? colors.tertiary : colors.outlineVariant} />
                ))}
              </View>
            </View>
          ))}
          <View className="mt-2 rounded-lg bg-primary-container/10 p-md">
            <Text className="font-sans-semibold text-label-lg text-primary">Recommandation : Recruter</Text>
            <Text className="mt-1 font-sans text-body-md text-on-surface-variant">
              Excellente maîtrise technique, forte communication. Profil aligné avec les besoins de l'équipe.
            </Text>
          </View>
        </View>

        {/* HR decision */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Décision RH</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Validez ce rapport pour lancer le processus d'offre, ou renvoyez-le au recruteur pour
            complément d'information.
          </Text>
          <View className="flex-row gap-md">
            <Pressable
              onPress={() => navigation.navigate('GestionEntretiensVideo')}
              className="h-12 flex-1 items-center justify-center rounded-xl border border-outline"
            >
              <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Demander révision</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('GestionEntretiensVideo')}
              className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-secondary shadow-md"
            >
              <MaterialIcons name="check" size={18} color="#ffffff" />
              <Text className="font-sans-semibold text-label-lg text-white">Valider</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
