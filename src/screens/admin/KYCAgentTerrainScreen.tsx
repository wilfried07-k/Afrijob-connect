import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function KYCAgentTerrainScreen({ navigation }: Props) {
  const [captured, setCaptured] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Vérification Terrain</Text>
      </View>

      <View className="flex-1 items-center justify-center gap-lg px-container-margin">
        <View className="flex-row items-center gap-2 rounded-full bg-primary-container/20 px-md py-2">
          <MaterialIcons name="my-location" size={16} color={colors.primary} />
          <Text className="font-sans-semibold text-label-md text-primary">Kmer Digital Services — Douala</Text>
        </View>

        <View className="aspect-square w-4/5 items-center justify-center overflow-hidden rounded-2xl bg-surface-container-highest">
          <View className="relative h-4/5 w-4/5">
            <View className="absolute -top-1 -left-1 h-6 w-6 border-l-4 border-t-4 border-primary" />
            <View className="absolute -top-1 -right-1 h-6 w-6 border-r-4 border-t-4 border-primary" />
            <View className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary" />
            <View className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary" />
            <View className="flex-1 items-center justify-center">
              <MaterialIcons name="document-scanner" size={40} color={colors.primary} />
            </View>
          </View>
        </View>

        <Text className="max-w-xs text-center font-sans text-body-md text-on-surface-variant">
          Scannez le registre de commerce affiché sur place, puis prenez une photo de la devanture.
        </Text>

        <Pressable
          onPress={() => setCaptured(true)}
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg"
        >
          <MaterialIcons name="qr-code-scanner" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Scanner le document</Text>
        </Pressable>

        {captured && (
          <View className="w-full flex-row items-center gap-2 rounded-xl bg-secondary-container/20 p-md">
            <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
            <Text className="font-sans-semibold text-label-lg text-secondary">Document capturé — prêt à soumettre</Text>
          </View>
        )}

        <Pressable
          disabled={!captured}
          onPress={() => navigation.goBack()}
          className={`h-14 w-full items-center justify-center rounded-full bg-primary shadow-lg ${!captured ? 'opacity-40' : ''}`}
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Soumettre la vérification</Text>
        </Pressable>
      </View>
    </View>
  );
}
