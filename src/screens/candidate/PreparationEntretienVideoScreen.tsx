import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'PreparationEntretienVideo'>;

const TIPS = [
  'Testez votre connexion internet au moins 10 minutes avant.',
  "Choisissez un endroit calme et bien éclairé, face à une source de lumière.",
  'Ayez votre CV et une copie de l\'offre sous les yeux.',
];

export default function PreparationEntretienVideoScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'MTN Cameroon';
  const position = route.params?.position ?? 'Product Designer Senior';

  const [micReady, setMicReady] = useState(false);
  const [camReady, setCamReady] = useState(false);

  const allReady = micReady && camReady;

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Prêt à commencer ?</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View>
          <Text className="font-sans-semibold text-title-lg text-on-surface">{position}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">Entretien avec {company}</Text>
        </View>

        {/* Camera preview placeholder */}
        <View className="aspect-video items-center justify-center rounded-xl bg-inverse-surface">
          {camReady ? (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <MaterialIcons name="person" size={40} color="rgba(255,255,255,0.6)" />
            </View>
          ) : (
            <View className="items-center gap-2">
              <MaterialIcons name="no-photography" size={40} color="rgba(255,255,255,0.4)" />
              <Text className="font-sans-medium text-label-lg text-white/60">
                Caméra désactivée
              </Text>
            </View>
          )}
          <View className="absolute bottom-md left-md right-md flex-row justify-between">
            <View className="rounded-lg bg-black/40 px-md py-1">
              <Text className="font-sans-medium text-label-md text-white">
                Connexion : {micReady || camReady ? 'Stable' : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Device check */}
        <View className="flex-row gap-md">
          <Pressable
            onPress={() => setMicReady(true)}
            className={`h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl border ${
              micReady ? 'border-secondary bg-secondary-container/20' : 'border-outline-variant bg-surface-container-lowest'
            }`}
          >
            <MaterialIcons name={micReady ? 'mic' : 'mic-off'} size={20} color={micReady ? colors.secondary : colors.onSurfaceVariant} />
            <Text className={`font-sans-semibold text-label-lg ${micReady ? 'text-secondary' : 'text-on-surface-variant'}`}>
              Micro {micReady ? 'OK' : 'Tester'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCamReady(true)}
            className={`h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl border ${
              camReady ? 'border-secondary bg-secondary-container/20' : 'border-outline-variant bg-surface-container-lowest'
            }`}
          >
            <MaterialIcons name={camReady ? 'videocam' : 'videocam-off'} size={20} color={camReady ? colors.secondary : colors.onSurfaceVariant} />
            <Text className={`font-sans-semibold text-label-lg ${camReady ? 'text-secondary' : 'text-on-surface-variant'}`}>
              Caméra {camReady ? 'OK' : 'Tester'}
            </Text>
          </Pressable>
        </View>

        {/* Tips */}
        <View className="gap-md rounded-xl bg-primary-container p-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="lightbulb" size={20} color={colors.onPrimaryContainer} />
            <Text className="font-sans-semibold text-title-lg text-on-primary-container">
              Conseils avant de commencer
            </Text>
          </View>
          <View className="gap-2">
            {TIPS.map((tip) => (
              <View key={tip} className="flex-row items-start gap-2">
                <MaterialIcons name="check" size={16} color={colors.onPrimaryContainer} />
                <Text className="flex-1 font-sans text-body-md text-on-primary-container/90">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          disabled={!allReady}
          onPress={() => navigation.navigate('VideoconferenceEntretien', { role: position })}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !allReady ? 'opacity-40' : ''
          }`}
        >
          <MaterialIcons name="videocam" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Rejoindre l'entretien</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
