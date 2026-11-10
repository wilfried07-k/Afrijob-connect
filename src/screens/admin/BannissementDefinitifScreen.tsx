import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { banUser } from '../../lib/api';

type Props = {
  navigation: { goBack: () => void };
  route?: { params?: { name?: string; userId?: number } };
};

export default function BannissementDefinitifScreen({ navigation, route }: Props) {
  const name = route?.params?.name ?? 'Compte sélectionné';
  const userId = route?.params?.userId;
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const canConfirm = confirmText.trim().toUpperCase() === 'BANNIR' && reason.trim().length > 0;

  const handleBan = async () => {
    if (!canConfirm || loading) return;
    setLoading(true);
    try {
      if (userId) {
        await banUser({ user_id: userId, reason: reason.trim(), definitive: true });
      }
      Alert.alert(
        'Bannissement appliqué',
        `Le compte de ${name} a été suspendu avec succès.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible d’appliquer le bannissement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
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
            {name} sera définitivement banni de la plateforme : suppression de l'accès, retrait des offres et blocage de toute réinscription.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Motif du bannissement *</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Ex: Fraude constatée, usurpation d'identité, tentative d'escroquerie..."
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
          disabled={!canConfirm || loading}
          onPress={() => void handleBan()}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-xl bg-error ${
            !canConfirm || loading ? 'opacity-40' : ''
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <MaterialIcons name="block" size={18} color="#ffffff" />
              <Text className="font-sans-semibold text-title-lg text-white">Confirmer le bannissement</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
