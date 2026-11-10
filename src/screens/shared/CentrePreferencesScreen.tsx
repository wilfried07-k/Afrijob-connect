import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function CentrePreferencesScreen({ navigation }: Props) {
  const [profileVisible, setProfileVisible] = useState(true);
  const [openToWork, setOpenToWork] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [autoApply, setAutoApply] = useState(false);

  const rows: { key: string; icon: keyof typeof MaterialIcons.glyphMap; label: string; description: string; value: boolean; onChange: (v: boolean) => void }[] = [
    { key: 'visible', icon: 'visibility', label: 'Profil visible par les recruteurs', description: 'Votre profil apparaît dans les recherches recruteurs', value: profileVisible, onChange: setProfileVisible },
    { key: 'open', icon: 'work', label: '"Ouvert aux opportunités"', description: 'Badge visible signalant votre disponibilité', value: openToWork, onChange: setOpenToWork },
    { key: 'sharing', icon: 'share', label: 'Partage de données avec nos partenaires', description: 'Utilisé pour vous proposer des offres externes pertinentes', value: dataSharing, onChange: setDataSharing },
    { key: 'autoapply', icon: 'bolt', label: 'Candidature automatique (Premium)', description: 'Postule automatiquement aux offres à fort taux de correspondance', value: autoApply, onChange: setAutoApply },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Centre de Préférences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        <Text className="mb-1 font-sans text-body-md text-on-surface-variant">
          Contrôlez comment votre profil et vos données sont utilisés sur EmploiCamer.
        </Text>
        {rows.map((row) => (
          <View key={row.key} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
              <MaterialIcons name={row.icon} size={20} color={colors.onSurfaceVariant} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{row.label}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{row.description}</Text>
            </View>
            <Switch value={row.value} onValueChange={row.onChange} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
