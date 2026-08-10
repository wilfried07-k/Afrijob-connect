import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  route?: { params?: { title?: string; company?: string } };
};

const TIMELINE = [
  { id: '1', label: 'Candidature envoyée', date: '02 Juil, 09:12', done: true },
  { id: '2', label: 'Candidature consultée', date: '02 Juil, 14:30', done: true },
  { id: '3', label: 'Présélectionné', date: '04 Juil, 10:00', done: true },
  { id: '4', label: 'Entretien programmé', date: '15 Juil, 14:00', done: false, current: true },
  { id: '5', label: 'Décision finale', date: 'À venir', done: false },
];

export default function DetailsCandidatureScreen({ navigation, route }: Props) {
  const title = route?.params?.title ?? 'Product Designer Senior';
  const company = route?.params?.company ?? 'MTN Cameroon';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Ma Candidature</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        {/* Header */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-md">
            <View className="h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <MaterialIcons name="business" size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-title-lg text-on-surface">{title}</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">{company}</Text>
            </View>
          </View>
          <View className="self-start rounded-full bg-secondary-container/30 px-3 py-1">
            <Text className="font-sans-semibold text-label-md text-on-secondary-container">Entretien prévu</Text>
          </View>
        </View>

        {/* Timeline */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Suivi de la candidature</Text>
          <View className="gap-0">
            {TIMELINE.map((step, index) => (
              <View key={step.id} className="flex-row gap-md">
                <View className="items-center">
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full ${
                      step.done ? 'bg-secondary' : step.current ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}
                  >
                    {step.done && <MaterialIcons name="check" size={14} color="#ffffff" />}
                  </View>
                  {index < TIMELINE.length - 1 && (
                    <View className={`w-[2px] flex-1 ${step.done ? 'bg-secondary' : 'bg-outline-variant/40'}`} style={{ minHeight: 32 }} />
                  )}
                </View>
                <View className="flex-1 pb-lg">
                  <Text className={`font-sans-semibold text-label-lg ${step.current ? 'text-primary' : 'text-on-surface'}`}>
                    {step.label}
                  </Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="gap-md">
          <Pressable
            onPress={() => navigation.navigate('DiscussionCandidat', { company })}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary-container"
          >
            <MaterialIcons name="mail" size={18} color={colors.onPrimaryContainer} />
            <Text className="font-sans-semibold text-label-lg text-on-primary-container">
              Contacter le recruteur
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ConfirmationEntretien', { company, position: title })}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-primary"
          >
            <MaterialIcons name="event" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Voir les détails de l'entretien</Text>
          </Pressable>
          <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-error/30">
            <MaterialIcons name="cancel" size={18} color={colors.error} />
            <Text className="font-sans-semibold text-label-lg text-error">Retirer ma candidature</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
