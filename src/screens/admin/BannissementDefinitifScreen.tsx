import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void }; route?: { params?: { name?: string } } };

export default function BannissementDefinitifScreen({ navigation, route }: Props) {
  const name = route?.params?.name ?? 'FastCash SARL';
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');

  const canConfirm = confirmText.trim().toUpperCase() === 'BANNIR';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-error">Bannissement Définitif</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="items-center gap-md rounded-xl border border-error/30 bg-error-container/10 p-lg">
          <MaterialIcons name="gpp-bad" size={44} color={colors.error} />
          <Text className="text-center font-sans-bold text-headline-md text-error">
            Cette action est irréversible
          </Text>
          <Text className="text-center font-sans text-body-md text-on-surface-variant">
            {name} sera définitivement banni de la plateforme : plus aucun accès, offres supprimées,
            aucune possibilité de réhabilitation automatique.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Motif du bannissement</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Décrivez la raison de cette décision définitive..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
            Tapez "BANNIR" pour confirmer
          </Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="BANNIR"
            placeholderTextColor={colors.outline}
            autoCapitalize="characters"
            className="h-12 rounded-xl border border-error px-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          disabled={!canConfirm}
          onPress={() => navigation.goBack()}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-error shadow-lg ${!canConfirm ? 'opacity-40' : ''}`}
        >
          <MaterialIcons name="block" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-error">Confirmer le bannissement définitif</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
