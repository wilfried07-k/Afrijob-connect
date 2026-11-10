import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { AdminTabParamList, AdminStackParamList } from '../../navigation/types';
import { getAdminDashboardSummary, type AdminDashboardSummary } from '../../lib/api';

const CARDS: { key: keyof AdminDashboardSummary; label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { key: 'users', label: 'Utilisateurs', icon: 'group', color: colors.primary },
  { key: 'open_jobs', label: 'Offres ouvertes', icon: 'work', color: colors.secondary },
  { key: 'pending_reports', label: 'Signalements à traiter', icon: 'report-problem', color: colors.error },
  { key: 'pending_kyc', label: 'Dossiers KYC en attente', icon: 'verified-user', color: colors.tertiary },
  { key: 'active_bans', label: 'Comptes suspendus', icon: 'block', color: colors.error },
];

export default function TableauDeBordAdminScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminTabParamList>>();
  const stackNavigation = navigation.getParent<NativeStackNavigationProp<AdminStackParamList>>();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getAdminDashboardSummary()
      .then((data) => { if (active) setSummary(data); })
      .catch((err: Error) => { if (active) setError(err.message || 'Impossible de charger les indicateurs.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 20 }}>
        <View>
          <Text className="font-sans-bold text-headline-lg text-on-surface">Tableau de bord</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">Indicateurs calculés depuis les données de la plateforme.</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? (
          <View className="rounded-xl border border-error/30 bg-error-container/10 p-lg">
            <Text className="font-sans-semibold text-body-md text-error">{error}</Text>
          </View>
        ) : (
          <View className="gap-md">
            {CARDS.map((card) => (
              <Pressable key={card.key} onPress={() => {
                if (card.key === 'users') stackNavigation?.navigate('GestionUtilisateurs');
                else if (card.key === 'open_jobs') stackNavigation?.navigate('OffresOuvertes');
                else if (card.key === 'pending_reports') navigation.navigate('ModerationLitiges');
                else if (card.key === 'pending_kyc') navigation.navigate('ModerationKYC');
                else if (card.key === 'active_bans') navigation.navigate('GestionBannissements');
              }} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
                <MaterialIcons name={card.icon} size={24} color={card.color} />
                <Text className="flex-1 font-sans text-label-lg text-on-surface-variant">{card.label}</Text>
                <Text className="font-sans-bold text-headline-md text-on-surface">{summary?.[card.key] ?? 0}</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
            ))}
          </View>
        )}
        <Text className="font-sans-semibold text-title-lg text-on-surface">À traiter</Text>
        <Pressable onPress={() => navigation.navigate('ModerationLitiges')} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <MaterialIcons name="report-problem" size={22} color={colors.error} />
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Modération des signalements</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ModerationKYC')} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <MaterialIcons name="verified-user" size={22} color={colors.primary} />
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Vérification des entreprises</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('GestionBannissements')} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <MaterialIcons name="block" size={22} color={colors.error} />
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Gestion des bannissements</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>
        <Text className="font-sans text-label-md text-on-surface-variant">Les revenus et tendances ne sont pas affichés car aucun système de transactions n’est encore connecté.</Text>
      </ScrollView>
    </Screen>
  );
}