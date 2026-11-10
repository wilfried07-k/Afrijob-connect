import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const PACKAGES = [
  { id: 'boost', name: 'Boost 7 jours', price: '15 000 FCFA', reach: 'x3 visibilité', icon: 'bolt' as const },
  { id: 'premium', name: 'Premium 14 jours', price: '35 000 FCFA', reach: 'x5 visibilité + badge Urgent', icon: 'stars' as const, recommended: true },
  { id: 'featured', name: 'Vedette 30 jours', price: '60 000 FCFA', reach: 'Épinglé en haut des résultats', icon: 'workspace-premium' as const },
];

export default function SponsoringOffresScreen({ navigation }: Props) {
  const [selected, setSelected] = useState('premium');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Sponsoriser une offre</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-1">
          <Text className="font-sans-semibold text-headline-md text-on-surface">
            Développeur Fullstack Senior
          </Text>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Boostez la visibilité de cette offre pour recevoir plus de candidatures qualifiées.
          </Text>
        </View>

        <View className="gap-md">
          {PACKAGES.map((pkg) => {
            const active = pkg.id === selected;
            return (
              <Pressable
                key={pkg.id}
                onPress={() => setSelected(pkg.id)}
                className={`gap-2 rounded-xl border-2 p-lg ${active ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'}`}
              >
                {pkg.recommended && (
                  <View className="self-start rounded-full bg-secondary-container px-3 py-1">
                    <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-on-secondary-container">
                      Recommandé
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center gap-md">
                  <View className={`h-11 w-11 items-center justify-center rounded-full ${active ? 'bg-primary' : 'bg-surface-container-high'}`}>
                    <MaterialIcons name={pkg.icon} size={20} color={active ? '#ffffff' : colors.onSurfaceVariant} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{pkg.name}</Text>
                    <Text className="font-sans text-label-lg text-on-surface-variant">{pkg.reach}</Text>
                  </View>
                  {active && <MaterialIcons name="check-circle" size={22} color={colors.primary} />}
                </View>
                <Text className="font-sans-bold text-title-lg text-primary">{pkg.price}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="rocket-launch" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Booster cette offre</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
