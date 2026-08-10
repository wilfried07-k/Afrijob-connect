import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'NotesEntretien'>;

const CHECKLIST_DEFAULT = [
  { id: '1', label: "Culture d'entreprise & valeurs", checked: false },
  { id: '2', label: 'Responsabilités quotidiennes', checked: false },
  { id: '3', label: "Possibilités d'évolution interne", checked: false },
];

export default function NotesEntretienScreen({ navigation, route }: Props) {
  const candidateName = route.params?.candidateName ?? 'Jean-Paul Nkou';
  const role = route.params?.role ?? 'Lead Frontend Developer';

  const [checklist, setChecklist] = useState(CHECKLIST_DEFAULT);
  const [notes, setNotes] = useState('');
  const [positives, setPositives] = useState('');
  const [concerns, setConcerns] = useState('');

  const toggleItem = (id: string) =>
    setChecklist((list) => list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Notes d'entretien</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="h-12 w-12 items-center justify-center rounded-lg bg-tertiary-fixed">
            <Text className="font-sans-bold text-title-lg text-tertiary">{candidateName[0]}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-title-lg text-on-surface">{role}</Text>
            <Text className="font-sans text-label-lg text-on-surface-variant">{candidateName}</Text>
            <View className="mt-1 self-start rounded-full bg-secondary-container px-2 py-0.5">
              <Text className="text-[10px] font-sans-semibold text-on-secondary-container">Entretien technique</Text>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Points à aborder</Text>
            <Text className="font-sans-semibold text-label-lg text-primary">+ Ajouter</Text>
          </View>
          <View className="divide-y divide-outline-variant/20 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
            {checklist.map((item) => (
              <Pressable key={item.id} onPress={() => toggleItem(item.id)} className="flex-row items-center gap-md p-md">
                <View
                  className={`h-6 w-6 items-center justify-center rounded border-2 ${
                    item.checked ? 'border-primary bg-primary' : 'border-outline'
                  }`}
                >
                  {item.checked && <MaterialIcons name="check" size={16} color="#ffffff" />}
                </View>
                <Text className={`flex-1 font-sans text-body-md ${item.checked ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Live notes */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Notes pendant l'entretien</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Saisissez vos notes en direct ici..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="min-h-[140px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>

        {/* Positives / Concerns */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="thumb-up" size={18} color={colors.secondary} />
            <Text className="font-sans-semibold text-title-lg text-secondary">Points positifs</Text>
          </View>
          <TextInput
            value={positives}
            onChangeText={setPositives}
            placeholder="Qu'est-ce qui s'est bien passé ?"
            placeholderTextColor={colors.secondary + '80'}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-[80px] rounded-xl border border-secondary/20 bg-secondary-container/10 p-md font-sans text-body-md text-on-surface"
          />
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="warning" size={18} color={colors.error} />
            <Text className="font-sans-semibold text-title-lg text-error">Vigilance</Text>
          </View>
          <TextInput
            value={concerns}
            onChangeText={setConcerns}
            placeholder="Y a-t-il des points de doute ?"
            placeholderTextColor={colors.error + '80'}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-[80px] rounded-xl border border-error/20 bg-error-container/10 p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('RedactionRapportEntretien', { candidateName, role })}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="edit-note" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Passer à la rédaction du rapport</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
