import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { getCompany, listDipeDeclarations, type CompanyInfo, type DipeDeclarationItem } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'AttestationCNPS'>;

export default function AttestationCNPSScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [declarations, setDeclarations] = useState<DipeDeclarationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    const load = async () => {
      if (!companyId) { setLoading(false); return; }
      setLoading(true); setLoadError('');
      try {
        const [companyData, declarationList] = await Promise.all([getCompany(companyId), listDipeDeclarations(companyId)]);
        if (active) { setCompany(companyData); setDeclarations(declarationList); }
      } catch (error) { if (active) setLoadError((error as Error).message || 'Impossible de charger les données CNPS.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [companyId]));

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Données CNPS</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md"><MaterialIcons name="info-outline" size={20} color={colors.tertiary} /><Text className="flex-1 font-sans text-body-md text-on-surface-variant">Aucune connexion à la CNPS n’est configurée. Cet écran ne peut pas vérifier une attestation ni confirmer le paiement des cotisations.</Text></View>
        {loading ? <ActivityIndicator color={colors.primary} /> : loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : <>
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><Text className="font-sans-semibold text-title-lg text-on-surface">Entreprise</Text><View className="flex-row justify-between gap-4"><Text className="font-sans text-label-lg text-on-surface-variant">Raison sociale</Text><Text className="flex-1 text-right font-sans-semibold text-label-lg text-on-surface">{company?.name || 'Non renseignée'}</Text></View><View className="flex-row justify-between gap-4"><Text className="font-sans text-label-lg text-on-surface-variant">Matricule employeur</Text><Text className="font-sans-semibold text-label-lg text-on-surface">{company?.cnps_employer_matricule || 'Non renseigné'}</Text></View></View>
          <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Déclarations DIPE enregistrées</Text>{declarations.length === 0 ? <Text className="font-sans text-body-md text-on-surface-variant">Aucune déclaration enregistrée.</Text> : declarations.map((item) => <View key={item.id} className="gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><Text className="font-sans-semibold text-label-lg text-on-surface">{item.candidate_name || 'Candidat'} · {item.declaration_id}</Text><Text className="font-sans text-label-md text-on-surface-variant">Début : {item.start_date} · {item.contract_type} · {new Intl.NumberFormat('fr-FR').format(item.gross_salary)} FCFA</Text><Text className="font-sans-semibold text-label-md text-tertiary">{item.status}</Text></View>)}</View>
        </>}
        <Pressable onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesCandidats' })} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary"><MaterialIcons name="groups" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-on-primary">Ouvrir le pipeline candidat</Text></Pressable>
      </ScrollView>
    </View>
  );
}
