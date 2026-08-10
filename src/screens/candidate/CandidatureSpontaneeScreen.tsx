import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureSpontanee'>;

const MIN_CHARS = 150;

export default function CandidatureSpontaneeScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'MTN Cameroon';
  const [motivation, setMotivation] = useState('');

  const canSubmit = motivation.length >= MIN_CHARS;

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-title-lg text-primary">EmploiCamer</Text>
        <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-primary-container">
          <Text className="font-sans-bold text-xs text-primary">SN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between gap-md">
          <View className="flex-row items-center gap-md">
            <View className="h-16 w-16 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <MaterialIcons name="business" size={28} color={colors.onSurfaceVariant} />
            </View>
            <View>
              <Text className="font-sans-bold text-headline-lg-mobile text-primary">Candidature Spontanée</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Postuler chez <Text className="font-sans-bold text-on-surface">{company}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View className="self-start rounded-full bg-secondary-container px-md py-1">
          <Text className="font-sans-medium text-label-md text-on-secondary-container">
            Réponse rapide (72h)
          </Text>
        </View>

        {/* Motivation */}
        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-label-lg text-primary">Message de motivation</Text>
          <TextInput
            value={motivation}
            onChangeText={setMotivation}
            placeholder={`Expliquez pourquoi vous souhaitez rejoindre l'équipe de ${company}...`}
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            className="min-h-[200px] rounded-lg border border-outline bg-surface-container-low p-md font-sans text-body-md text-on-surface"
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
              {motivation.length} / {MIN_CHARS}
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View className="flex-row items-start gap-md rounded-lg border border-primary-container/20 bg-primary-container/5 p-md">
          <MaterialIcons name="campaign" size={20} color={colors.primaryContainer} />
          <Text className="flex-1 font-sans text-body-md italic leading-relaxed text-on-surface-variant">
            En envoyant une candidature spontanée, vous permettez aux recruteurs de {company} d'accéder à
            votre profil même si aucun poste correspondant n'est actuellement ouvert. Votre CV sera
            conservé dans notre base de données pendant 12 mois.
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-outline-variant px-container-margin py-md">
        <Pressable
          disabled={!canSubmit}
          onPress={() => navigation.replace('CandidatureEnvoyee', { company })}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !canSubmit ? 'opacity-50' : ''
          }`}
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer ma candidature</Text>
          <MaterialIcons name="send" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
