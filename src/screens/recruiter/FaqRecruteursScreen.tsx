import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const FAQS = [
  { q: 'Comment publier ma première offre ?', a: 'Rendez-vous dans "Gestion des offres" puis "Créer une offre" et suivez les 3 étapes du formulaire.' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'MTN Mobile Money, Orange Money, virement bancaire et carte via nos partenaires USSD.' },
  { q: 'Comment fonctionne le score de correspondance IA ?', a: "Il compare le profil du candidat à votre offre sur les compétences, l'expérience et la localisation." },
  { q: 'Puis-je changer de forfait à tout moment ?', a: "Oui, depuis Facturation & Abonnement, le changement est effectif au prochain cycle de facturation." },
];

export default function FaqRecruteursScreen({ navigation }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">FAQ Recruteurs</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <Pressable
              key={faq.q}
              onPress={() => setOpenIndex(open ? null : index)}
              className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{faq.q}</Text>
                <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={22} color={colors.primary} />
              </View>
              {open && <Text className="font-sans text-body-md text-on-surface-variant">{faq.a}</Text>}
            </Pressable>
          );
        })}

        <Pressable className="mt-md flex-row items-center justify-center gap-2 rounded-xl border border-primary py-md">
          <MaterialIcons name="question-answer" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Contacter le support</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
