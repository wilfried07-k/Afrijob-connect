import { useEffect, useState } from 'react';
import { Alert, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { createAlert, listAlerts, updateAlert } from '../../lib/api';

type Props = {
  navigation: { goBack: () => void };
  route?: { params?: { alertId?: number; title?: string } };
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
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const alertId = route?.params?.alertId;
  const isEditing = typeof alertId === 'number';
  const [title, setTitle] = useState(route?.params?.title ?? '');
  const [city, setCity] = useState('');
  const [frequency, setFrequency] = useState('instant');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isEditing || !candidateId || alertId === undefined) return () => { active = false; };
    listAlerts(candidateId)
      .then((alerts) => {
        const item = alerts.find((entry) => entry.id === alertId);
        if (item && active) {
          setTitle(item.title);
          setCity(item.city ?? '');
          setFrequency(item.frequency);
        }
      })
      .catch((error) => {
        if (active) Alert.alert('Erreur', (error as Error).message || 'Impossible de charger cette alerte.');
      });
    return () => { active = false; };
  }, [alertId, candidateId, isEditing]);

  const save = async () => {
    if (!candidateId) {
      Alert.alert('Profil candidat requis', 'Complétez votre profil candidat avant de créer une alerte.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Intitulé requis', 'Saisissez un métier pour cette alerte.');
      return;
    }
    setSaving(true);
    try {
      if (isEditing && alertId !== undefined) {
        await updateAlert(alertId, { title: title.trim(), city, frequency });
      } else {
        await createAlert({ candidate_id: candidateId, title: title.trim(), city: city || undefined, frequency });
      }
      Alert.alert('Alerte enregistrée', 'Votre alerte emploi a été sauvegardée.', [
        { text: 'Continuer', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer cette alerte.');
    } finally {
      setSaving(false);
    }
  };
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

        <Button label={saving ? 'Enregistrement...' : isEditing ? "Enregistrer l'alerte" : "Créer l'alerte"} onPress={save} disabled={!title.trim() || saving} />
      </ScrollView>
    </Screen>
  );
}
