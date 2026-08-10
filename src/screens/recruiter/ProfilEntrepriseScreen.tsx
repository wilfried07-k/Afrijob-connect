import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';

type Tab = 'apropos' | 'offres';

const STATS = [
  { label: 'Employés', value: '1000+' },
  { label: 'Création', value: '1999' },
  { label: 'Offres', value: '12' },
];

const VALUES = [
  { icon: 'handshake' as const, label: 'Intégrité', color: colors.secondary, bg: 'bg-secondary-container/10 border-secondary-container/20' },
  { icon: 'bolt' as const, label: 'Innovation', color: colors.primary, bg: 'bg-primary/5 border-primary/10' },
];

const OPEN_ROLES = [
  { id: '1', title: 'Product Designer Senior', location: 'Douala', contract: 'Temps plein' },
  { id: '2', title: 'Ingénieur Réseaux', location: 'Yaoundé', contract: 'CDI' },
  { id: '3', title: 'Chargé de Communication', location: 'Remote', contract: 'CDD' },
];

export default function ProfilEntrepriseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const [tab, setTab] = useState<Tab>('apropos');

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero banner */}
        <View className="h-40 w-full bg-primary/90" />

        {/* Logo + identity */}
        <View className="-mt-10 flex-row items-end gap-md px-container-margin">
          <View className="h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-lg ring-4 ring-white">
            <MaterialIcons name="corporate-fare" size={40} color={colors.primary} />
          </View>
        </View>
        <View className="mt-2 px-container-margin">
          <View className="flex-row items-center gap-1">
            <Text className="font-sans-bold text-headline-lg text-on-surface">MTN Cameroon</Text>
            <MaterialIcons name="verified" size={20} color={colors.primary} />
          </View>
          <Text className="font-sans text-label-lg text-on-surface-variant">
            Télécommunications • Douala, Cameroun
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-md flex-row gap-2 px-container-margin">
          <Pressable className="h-12 flex-1 items-center justify-center rounded-md bg-primary shadow-sm">
            <Text className="font-sans-semibold text-label-lg text-white">Suivre</Text>
          </Pressable>
          <Pressable className="h-12 flex-1 items-center justify-center rounded-md border border-outline">
            <Text className="font-sans-semibold text-label-lg text-primary">Message</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ParametresCompte')}
            className="h-12 w-12 items-center justify-center rounded-md border border-outline"
          >
            <MaterialIcons name="settings" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Billing quick link */}
        <Pressable
          onPress={() => navigation.navigate('FacturationAbonnement')}
          className="mx-container-margin mt-md flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="receipt-long" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Facturation & Abonnement</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">Plan Premium actif</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('FaqRecruteurs')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="help-outline" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">FAQ Recruteurs</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ParrainageRecruteur')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="handshake" size={18} color={colors.secondary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Programme Partenaire</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('MentionsLegales')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="policy" size={18} color={colors.onSurfaceVariant} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Mentions légales & CGU</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('DocumentsConformiteEntreprise')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="fact-check" size={18} color={colors.secondary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Documents de conformité</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ProfilDirigeantEntreprise')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="badge" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Profil du dirigeant</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('GuideBonnesPratiques')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="menu-book" size={18} color={colors.tertiary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Guide de bonnes pratiques</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('FeedbackExperience')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="feedback" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Donner mon avis</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        {/* Stats */}
        <View className="mt-lg flex-row gap-2 px-container-margin">
          {STATS.map((stat) => (
            <View key={stat.label} className="flex-1 items-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
              <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
              <Text className="mt-1 font-sans-semibold text-title-lg text-primary">{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* KYC verification banner */}
        <Pressable
          onPress={() => navigation.navigate('VerificationKycEntreprise')}
          className="mx-container-margin mt-lg flex-row items-center gap-md rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <MaterialIcons name="verified-user" size={20} color={colors.tertiary} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Vérification KYC en attente</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">
              Complétez la vérification pour débloquer les fonctionnalités Premium.
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.tertiary} />
        </Pressable>

        {/* Tabs */}
        <View className="mt-lg flex-row gap-lg border-b border-outline-variant px-container-margin">
          <Pressable onPress={() => setTab('apropos')} className={`pb-3 ${tab === 'apropos' ? 'border-b-2 border-primary' : ''}`}>
            <Text className={`font-sans-semibold text-label-lg ${tab === 'apropos' ? 'text-primary' : 'text-on-surface-variant'}`}>
              À propos
            </Text>
          </Pressable>
          <Pressable onPress={() => setTab('offres')} className={`pb-3 ${tab === 'offres' ? 'border-b-2 border-primary' : ''}`}>
            <Text className={`font-sans-semibold text-label-lg ${tab === 'offres' ? 'text-primary' : 'text-on-surface-variant'}`}>
              Offres d'emploi
            </Text>
          </Pressable>
        </View>

        {tab === 'apropos' ? (
          <View className="gap-lg px-container-margin py-lg">
            <View className="gap-md">
              <Text className="font-sans-semibold text-title-lg text-on-surface">Notre Mission</Text>
              <Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">
                Chez MTN Cameroon, nous sommes fiers de mener l'évolution numérique du Cameroun. Depuis
                1999, nous connectons les gens et créons des opportunités de croissance à travers le pays.
              </Text>
            </View>
            <View className="flex-row gap-md">
              {VALUES.map((value) => (
                <View key={value.label} className={`flex-1 gap-2 rounded-lg border p-lg ${value.bg}`}>
                  <MaterialIcons name={value.icon} size={28} color={value.color} />
                  <Text className="font-sans-semibold text-title-lg" style={{ color: value.color }}>
                    {value.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="gap-md px-container-margin py-lg">
            {OPEN_ROLES.map((role) => (
              <Pressable
                key={role.id}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md"
              >
                <View className="h-12 w-12 items-center justify-center rounded-md bg-surface-container">
                  <MaterialIcons name="work-outline" size={20} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{role.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {role.location} • {role.contract}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
