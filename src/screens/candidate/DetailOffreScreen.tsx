import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'DetailOffre'>;

const MISSIONS = [
  "Concevoir des interfaces utilisateur intuitives et esthétiques pour les applications mobiles et web.",
  "Mener des recherches utilisateurs et des tests d'utilisabilité pour améliorer l'expérience client.",
  'Collaborer étroitement avec les équipes produit et ingénierie pour assurer la faisabilité technique.',
  'Maintenir et faire évoluer le Design System global.',
];

const BENEFITS: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: 'health-and-safety', label: 'Assurance santé' },
  { icon: 'payments', label: 'Bonus annuel' },
  { icon: 'home-work', label: 'Télétravail partiel' },
];

export default function DetailOffreScreen({ navigation, route }: Props) {
  const title = route.params?.title ?? 'Product Designer Senior';
  const company = route.params?.company ?? 'MTN Cameroon';
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Premium Jobs</Text>
        <MaterialIcons name="more-vert" size={24} color={colors.onSurfaceVariant} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}>
        {/* Header card */}
        <View className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="mb-md flex-row items-start justify-between">
            <View className="flex-row items-start gap-md">
              <View className="h-16 w-16 items-center justify-center rounded-lg bg-[#FFCC00] shadow-sm">
                <MaterialIcons name="business" size={28} color="#1a1a1a" />
              </View>
              <View>
                <Text className="mb-1 font-sans-bold text-headline-lg leading-tight text-on-surface">
                  {title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="font-sans-semibold text-title-lg text-primary">{company}</Text>
                  <MaterialIcons name="verified" size={16} color={colors.primary} />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Tag icon="location-on" label="Douala, Akwa" />
            <Tag icon="work" label="CDI" tint />
            <Tag icon="schedule" label="Publiée il y a 2j" />
          </View>
        </View>

        {/* Key info */}
        <View className="flex-row gap-md">
          <View className="flex-1 items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-md">
            <MaterialIcons name="payments" size={28} color={colors.primary} />
            <Text className="text-center font-sans-medium text-[11px] uppercase tracking-wider text-on-surface-variant">
              Salaire Mensuel
            </Text>
            <Text className="font-sans-semibold text-title-lg text-primary">450k - 600k CFA</Text>
          </View>
          <View className="flex-1 items-center gap-2 rounded-lg border border-tertiary/10 bg-tertiary-fixed/20 p-md">
            <MaterialIcons name="military-tech" size={28} color={colors.tertiary} />
            <Text className="text-center font-sans-medium text-[11px] uppercase tracking-wider text-on-surface-variant">
              Expérience
            </Text>
            <Text className="font-sans-semibold text-title-lg text-tertiary">5+ ans requis</Text>
          </View>
        </View>

        {/* Missions */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-1.5 rounded-full bg-primary" />
            <Text className="font-sans-semibold text-headline-md text-on-surface">Missions principales</Text>
          </View>
          <View className="gap-md rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            {MISSIONS.map((mission) => (
              <View key={mission} className="flex-row items-start gap-md">
                <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                <Text className="flex-1 font-sans text-body-lg leading-relaxed text-on-surface-variant">
                  {mission}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile sought */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-1.5 rounded-full bg-secondary" />
            <Text className="font-sans-semibold text-headline-md text-on-surface">Profil recherché</Text>
          </View>
          <View className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">
              Vous êtes passionné(e) de design avec une solide expérience dans le secteur technologique.
              Vous maîtrisez Figma, les principes du Material Design, et possédez un portfolio démontrant
              des solutions complexes simplifiées par le design. Une expérience en Fintech est un atout majeur.
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-1.5 rounded-full bg-tertiary" />
            <Text className="font-sans-semibold text-headline-md text-on-surface">Avantages exclusifs</Text>
          </View>
          <View className="gap-2">
            {BENEFITS.map((benefit) => (
              <View
                key={benefit.label}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/20 bg-white p-md shadow-sm"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary-container/20">
                  <MaterialIcons name={benefit.icon} size={20} color={colors.secondary} />
                </View>
                <Text className="font-sans-semibold text-label-lg text-on-surface">{benefit.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About company */}
        <View className="rounded-lg bg-inverse-surface p-lg shadow-lg">
          <Text className="mb-md font-sans-semibold text-headline-md text-inverse-on-surface">
            À propos de {company}
          </Text>
          <Text className="font-sans text-body-md leading-relaxed text-inverse-on-surface/90">
            Leader des télécommunications au Cameroun, {company} s'engage à offrir les avantages d'un
            monde connecté et moderne à tous les Camerounais. Rejoindre {company}, c'est intégrer une
            culture d'innovation et d'excellence.
          </Text>
          <Pressable
            className="mt-md flex-row items-center gap-1 self-start"
            onPress={() => navigation.navigate('CandidatureSpontanee', { company })}
          >
            <Text className="font-sans-semibold text-label-lg text-inverse-primary">
              Pas le bon poste ? Postuler spontanément
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.inversePrimary} />
          </Pressable>
          <Pressable
            className="mt-2 flex-row items-center gap-1 self-start"
            onPress={() => navigation.navigate('AvisCultureEntreprise', { company })}
          >
            <MaterialIcons name="reviews" size={16} color={colors.inversePrimary} />
            <Text className="font-sans-semibold text-label-lg text-inverse-primary">
              Voir les avis sur {company}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Fixed action bar */}
      <View className="flex-row items-center gap-md border-t border-outline-variant bg-surface px-container-margin py-md">
        <Pressable
          onPress={() => setSaved((s) => !s)}
          className="h-14 w-14 items-center justify-center rounded-lg border-2 border-outline-variant"
        >
          <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={22} color={saved ? colors.primary : colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-lg"
          onPress={() => navigation.navigate('CandidatureRapide', { title, company })}
        >
          <Text className="font-sans-semibold text-label-lg text-white">Postuler maintenant</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}

function Tag({ icon, label, tint }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; tint?: boolean }) {
  return (
    <View
      className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${
        tint ? 'border-secondary/20 bg-secondary-container/30' : 'border-outline-variant/50 bg-surface-container-low'
      }`}
    >
      <MaterialIcons name={icon} size={16} color={tint ? colors.secondary : colors.onSurfaceVariant} />
      <Text className={`font-sans-medium text-label-lg ${tint ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>
        {label}
      </Text>
    </View>
  );
}
