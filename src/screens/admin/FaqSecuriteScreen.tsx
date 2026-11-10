import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const FAQS = [
  { q: 'Comment identifier une offre frauduleuse ?', a: 'Vérifiez les signalements automatiques (frais demandés, promesses de gains irréalistes, entreprise non vérifiée au RCCM).' },
  { q: 'Quelle est la procédure de bannissement définitif ?', a: 'Elle nécessite une validation à double confirmation et est réservée aux cas de fraude avérée ou de récidive après avertissement.' },
  { q: 'Comment sont protégées les données des utilisateurs ?', a: 'Chiffrement au repos et en transit, accès restreint par rôle, journalisation de tous les accès sensibles.' },
];

export default function FaqSecuriteScreen({ navigation }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">FAQ Sécurité</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        {FAQS.map((faq, index) => {
          const isOpen = open === index;
          return (
            <Pressable
              key={faq.q}
              onPress={() => setOpen(isOpen ? null : index)}
              className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{faq.q}</Text>
                <MaterialIcons name={isOpen ? 'expand-less' : 'expand-more'} size={22} color={colors.primary} />
              </View>
              {isOpen && <Text className="font-sans text-body-md text-on-surface-variant">{faq.a}</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
