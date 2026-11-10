import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

type Decision = 'ban' | 'warn' | 'dismiss';

const OPTIONS: { key: Decision; title: string; subtitle: string; color: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'ban', title: "Bannir l'entreprise", subtitle: 'Violation grave et avérée des règles', color: colors.error, icon: 'block' },
  { key: 'warn', title: 'Avertissement officiel', subtitle: 'Faute reconnue mais non grave', color: colors.tertiary, icon: 'warning' },
  { key: 'dismiss', title: 'Classer sans suite', subtitle: 'Preuves insuffisantes ou litige résolu', color: colors.secondary, icon: 'check-circle' },
];

export default function DecisionArbitrageFinalScreen({ navigation }: Props) {
  const [decision, setDecision] = useState<Decision | null>(null);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Décision d'Arbitrage</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <MaterialIcons name="folder" size={20} color={colors.onSurfaceVariant} />
          <Text className="font-sans-semibold text-label-lg text-on-surface">Dossier #4821 — FastCash SARL</Text>
        </View>

        <View className="gap-md">
          {OPTIONS.map((opt) => {
            const active = decision === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setDecision(opt.key)}
                className={`flex-row items-center gap-md rounded-xl border-2 p-lg ${active ? 'bg-surface-container-lowest' : 'border-outline-variant bg-surface-container-lowest'}`}
                style={active ? { borderColor: opt.color } : undefined}
              >
                <View className="h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: opt.color + '20' }}>
                  <MaterialIcons name={opt.icon} size={22} color={opt.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-title-lg" style={{ color: active ? opt.color : colors.onSurface }}>
                    {opt.title}
                  </Text>
                  <Text className="font-sans text-body-md text-on-surface-variant">{opt.subtitle}</Text>
                </View>
                {active && <MaterialIcons name="check-circle" size={22} color={opt.color} />}
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
          <MaterialIcons name="info" size={18} color={colors.onSurfaceVariant} />
          <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
            Cette décision sera consignée dans le journal d'audit et notifiée aux deux parties.
          </Text>
        </View>

        <Pressable
          disabled={!decision}
          onPress={() => navigation.navigate('ModerationLitiges')}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${!decision ? 'opacity-40' : ''}`}
        >
          <MaterialIcons name="gavel" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Confirmer la décision</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
