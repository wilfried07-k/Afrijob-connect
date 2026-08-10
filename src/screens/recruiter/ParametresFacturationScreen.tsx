import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function ParametresFacturationScreen({ navigation }: Props) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [companyName, setCompanyName] = useState('TechCamer Solutions SARL');
  const [taxId, setTaxId] = useState('M012345678901Z');
  const [email, setEmail] = useState('facturation@techcamer.cm');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Paramètres de Facturation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <MaterialIcons name="autorenew" size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Renouvellement automatique</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Votre abonnement se renouvelle chaque mois</Text>
          </View>
          <Switch value={autoRenew} onValueChange={setAutoRenew} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Informations de facturation</Text>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Raison sociale</Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Numéro NIU</Text>
            <TextInput
              value={taxId}
              onChangeText={setTaxId}
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Email de facturation</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
        </View>

        <Pressable className="h-14 items-center justify-center rounded-full bg-primary shadow-lg">
          <Text className="font-sans-semibold text-title-lg text-on-primary">Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
