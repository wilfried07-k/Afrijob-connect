import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const SECTIONS = [
  { icon: 'person' as const, label: 'Informations personnelles', complete: true },
  { icon: 'work' as const, label: 'Expériences professionnelles', complete: true },
  { icon: 'school' as const, label: 'Formation', complete: true },
  { icon: 'bolt' as const, label: 'Compétences', complete: false },
  { icon: 'language' as const, label: 'Langues', complete: false },
];

export default function MonCVDocumentsScreen({ navigation }: Props) {
  const completedCount = SECTIONS.filter((s) => s.complete).length;
  const percent = Math.round((completedCount / SECTIONS.length) * 100);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mon CV</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* CV Preview card */}
        <View className="items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="h-40 w-28 items-center justify-center rounded-lg border border-outline-variant bg-white shadow-md">
            <MaterialIcons name="description" size={36} color={colors.primary} />
          </View>
          <Text className="font-sans-semibold text-title-lg text-on-surface">CV_Samuel_Ndongo.pdf</Text>
          <View className="flex-row gap-2">
            <Pressable className="flex-row items-center gap-1 rounded-lg bg-primary-container px-md py-2">
              <MaterialIcons name="download" size={16} color={colors.onPrimaryContainer} />
              <Text className="font-sans-semibold text-label-md text-on-primary-container">Télécharger</Text>
            </Pressable>
            <Pressable className="flex-row items-center gap-1 rounded-lg border border-outline px-md py-2">
              <MaterialIcons name="edit" size={16} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-primary">Modifier</Text>
            </Pressable>
          </View>
        </View>

        {/* Completion */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Complétude du CV</Text>
            <Text className="font-sans-bold text-label-lg text-primary">{percent}%</Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <View className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </View>
        </View>

        {/* Sections */}
        <View className="gap-2">
          {SECTIONS.map((s) => (
            <Pressable key={s.label} className="flex-row items-center gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
              <View className={`h-10 w-10 items-center justify-center rounded-full ${s.complete ? 'bg-secondary-container/30' : 'bg-surface-container-high'}`}>
                <MaterialIcons name={s.icon} size={18} color={s.complete ? colors.secondary : colors.onSurfaceVariant} />
              </View>
              <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{s.label}</Text>
              {s.complete ? (
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
              ) : (
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-primary py-md">
          <MaterialIcons name="add" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Importer un autre CV</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
