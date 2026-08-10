import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const PLANS = [
  {
    name: 'Essentiel',
    price: '0',
    period: 'Gratuit',
    features: ['2 offres actives', 'Accès base candidats', 'Support email'],
  },
  {
    name: 'Premium',
    price: '45 000',
    period: '/ mois',
    highlighted: true,
    features: ['Offres illimitées', 'Recommandations IA', 'Sponsoring inclus (2/mois)', 'Support prioritaire'],
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    period: '',
    features: ['Comptes multi-utilisateurs', 'API & intégrations RH', 'Account manager dédié'],
  },
];

export default function TarifsEntreprisesScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Nos Tarifs</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        {PLANS.map((plan) => (
          <View
            key={plan.name}
            className={`gap-md rounded-2xl p-lg ${plan.highlighted ? 'bg-primary shadow-xl' : 'border border-outline-variant/30 bg-surface-container-lowest shadow-sm'}`}
          >
            {plan.highlighted && (
              <View className="self-start rounded-full bg-white/20 px-3 py-1">
                <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-white">
                  Le plus populaire
                </Text>
              </View>
            )}
            <Text className={`font-sans-bold text-title-lg ${plan.highlighted ? 'text-white' : 'text-on-surface'}`}>
              {plan.name}
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className={`font-sans-extrabold text-display-lg ${plan.highlighted ? 'text-white' : 'text-primary'}`}>
                {plan.price}
              </Text>
              <Text className={`font-sans ${plan.highlighted ? 'text-white/80' : 'text-on-surface-variant'}`}>
                {plan.period}
              </Text>
            </View>
            <View className="gap-2">
              {plan.features.map((f) => (
                <View key={f} className="flex-row items-center gap-2">
                  <MaterialIcons name="check-circle" size={16} color={plan.highlighted ? '#ffffff' : colors.secondary} />
                  <Text className={`font-sans text-body-md ${plan.highlighted ? 'text-white/90' : 'text-on-surface-variant'}`}>
                    {f}
                  </Text>
                </View>
              ))}
            </View>
            <Pressable
              onPress={() => navigation.navigate('SelectionModePaiement')}
              className={`mt-2 h-12 items-center justify-center rounded-xl ${plan.highlighted ? 'bg-white' : 'bg-primary-container'}`}
            >
              <Text className={`font-sans-semibold text-label-lg ${plan.highlighted ? 'text-primary' : 'text-on-primary-container'}`}>
                Choisir ce plan
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
