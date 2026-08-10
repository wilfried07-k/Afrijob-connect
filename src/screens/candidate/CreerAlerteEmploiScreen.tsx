import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void };
  route?: { params?: { alertId?: string; title?: string } };
};

const FREQUENCIES = [
  { label: 'Instantané', value: 'instant' },
  { label: 'Résumé quotidien', value: 'daily' },
  { label: 'Résumé hebdomadaire', value: 'weekly' },
];

const CITIES = [
  { label: 'Toutes les villes', value: '' },
  { label: 'Douala', value: 'douala' },
  { label: 'Yaoundé', value: 'yaounde' },
  { label: 'Remote', value: 'remote' },
];

export default function CreerAlerteEmploiScreen({ navigation, route }: Props) {
  const isEditing = !!route?.params?.alertId;
  const [title, setTitle] = useState(route?.params?.title ?? '');
  const [city, setCity] = useState('');
  const [frequency, setFrequency] = useState('instant');

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">
          {isEditing ? "Modifier l'alerte" : 'Nouvelle alerte'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Intitulé du poste</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : Product Designer"
            placeholderTextColor={colors.outline}
            className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
          />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Localisation</Text>
          <SelectField icon="location-on" placeholder="Toutes les villes" options={CITIES} value={city} onChange={setCity} />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Fréquence des notifications</Text>
          <View className="gap-2">
            {FREQUENCIES.map((f) => {
              const active = f.value === frequency;
              return (
                <Pressable
                  key={f.value}
                  onPress={() => setFrequency(f.value)}
                  className={`flex-row items-center justify-between rounded-xl border p-md ${
                    active ? 'border-primary bg-primary-container/10' : 'border-outline-variant'
                  }`}
                >
                  <Text className={`font-sans-medium text-label-lg ${active ? 'text-primary' : 'text-on-surface'}`}>{f.label}</Text>
                  {active && <MaterialIcons name="check-circle" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button label={isEditing ? "Enregistrer l'alerte" : "Créer l'alerte"} onPress={() => navigation.goBack()} disabled={!title} />
      </ScrollView>
    </Screen>
  );
}
