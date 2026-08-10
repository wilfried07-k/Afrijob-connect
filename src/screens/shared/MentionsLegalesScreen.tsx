import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const SECTIONS = [
  { title: '1. Éditeur de la plateforme', body: "EmploiCamer est édité par EmploiCamer SARL, immatriculée au RCCM de Douala. Siège social : Akwa, Douala, Cameroun." },
  { title: '2. Collecte des données personnelles', body: "Nous collectons les données nécessaires à la mise en relation entre candidats et recruteurs, conformément à la loi camerounaise sur la protection des données personnelles." },
  { title: '3. Utilisation des données', body: "Vos données (CV, profil, candidatures) sont utilisées uniquement dans le cadre de votre recherche d'emploi ou de recrutement et ne sont jamais revendues à des tiers." },
  { title: '4. Droits des utilisateurs', body: "Vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données via les Paramètres du compte ou en contactant notre support." },
  { title: '5. Cookies et traceurs', body: "L'application utilise des identifiants techniques nécessaires à son fonctionnement (session, préférences). Aucun cookie publicitaire tiers n'est utilisé." },
];

export default function MentionsLegalesScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mentions Légales & CGU</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Text className="font-sans text-label-md text-outline">Dernière mise à jour : 1er Juillet 2026</Text>
        {SECTIONS.map((s) => (
          <View key={s.title} className="gap-2">
            <Text className="font-sans-semibold text-title-lg text-on-surface">{s.title}</Text>
            <Text className="font-sans text-body-md leading-relaxed text-on-surface-variant">{s.body}</Text>
          </View>
        ))}
        <Pressable className="mt-md flex-row items-center justify-center gap-2 rounded-xl border border-primary py-md">
          <MaterialIcons name="description" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Télécharger le document complet (PDF)</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
