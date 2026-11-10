import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureSpontanee'>;

const MIN_CHARS = 100;

export default function CandidatureSpontaneeScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'Entreprise partenaire';
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { authState } = useAuth();

  const profile = authState.profile;
  const initials = profile?.full_name
    ? profile.full_name
        .trim()
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'EC';

  const canSubmit = motivation.trim().length >= MIN_CHARS;

  const handleSend = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      // Simulation or submission to spontaneous pipeline
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigation.replace('CandidatureEnvoyee', { company });
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || "Impossible d'envoyer votre candidature spontanée.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-title-lg text-primary">EmploiCamer</Text>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
          <Text className="font-sans-bold text-xs text-primary">{initials}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between gap-md">
          <View className="flex-row items-center gap-md">
            <View className="h-16 w-16 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <MaterialIcons name="business" size={28} color={colors.onSurfaceVariant} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-headline-lg-mobile text-primary">Candidature Spontanée</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Postuler chez <Text className="font-sans-bold text-on-surface">{company}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View className="self-start rounded-full bg-secondary-container px-md py-1">
          <Text className="font-sans-medium text-label-md text-on-secondary-container">
            Transmis directement aux RH de l'entreprise
          </Text>
        </View>

        {/* Profile info recap */}
        {profile?.full_name ? (
          <View className="gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Candidat : {profile.full_name}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">
              {profile.job_title ?? 'Profil général'} · {profile.city ?? 'Cameroun'} · {profile.email}
            </Text>
          </View>
        ) : null}

        {/* Motivation */}
        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-label-lg text-primary">Message de motivation</Text>
          <TextInput
            value={motivation}
            onChangeText={setMotivation}
            placeholder={`Expliquez vos compétences et ce que vous pouvez apporter à ${company}...`}
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="min-h-[160px] rounded-lg border border-outline bg-surface-container-low p-md font-sans text-body-md text-on-surface"
          />
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="info" size={14} color={colors.onSurfaceVariant} />
              <Text className="font-sans text-label-md text-on-surface-variant">
                Minimum {MIN_CHARS} caractères
              </Text>
            </View>
            <Text
              className={`font-sans-semibold text-label-md ${canSubmit ? 'text-secondary' : 'text-on-surface-variant'}`}
            >
              {motivation.trim().length} / {MIN_CHARS}
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View className="flex-row items-start gap-md rounded-lg border border-primary-container/20 bg-primary-container/5 p-md">
          <MaterialIcons name="campaign" size={20} color={colors.primary} />
          <Text className="flex-1 font-sans text-body-md italic leading-relaxed text-on-surface-variant">
            En envoyant une candidature spontanée, vous permettez aux recruteurs de {company} d'accéder à
            votre profil et CV même si aucun poste correspondant n'est actuellement ouvert.
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-outline-variant px-container-margin py-md">
        <Pressable
          disabled={!canSubmit || submitting}
          onPress={() => void handleSend()}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !canSubmit || submitting ? 'opacity-50' : ''
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer ma candidature</Text>
              <MaterialIcons name="send" size={18} color="#ffffff" />
            </>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}
