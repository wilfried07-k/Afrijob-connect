import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { createCompanyReview, listCompanyReviews, type CompanyReview } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'AvisCultureEntreprise'>;

export default function AvisCultureEntrepriseScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'Entreprise';
  const companyId = route.params?.companyId;
  const { authState } = useAuth();
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(5);
  const [role, setRole] = useState('');
  const [body, setBody] = useState('');

  const load = useCallback(async () => {
    if (!companyId) { setLoading(false); return; }
    try { setReviews(await listCompanyReviews(companyId)); }
    catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de charger les avis.'); }
    finally { setLoading(false); }
  }, [companyId]);

  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!companyId) { Alert.alert('Entreprise indisponible', 'Ouvre cette page depuis le détail d’une offre.'); return; }
    if (!authState.profile?.candidate_profile_id) { Alert.alert('Profil requis', 'Connecte-toi et complète ton profil candidat pour publier un avis.'); return; }
    if (body.trim().length < 20) { Alert.alert('Avis trop court', 'Écris au moins 20 caractères.'); return; }
    setSending(true);
    try {
      const created = await createCompanyReview({ company_id: companyId, rating, role: role.trim() || undefined, body: body.trim() });
      setReviews((current) => [created, ...current]);
      setBody('');
      setRole('');
      Alert.alert('Avis publié', 'Merci pour ton retour sur cette entreprise.');
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de publier cet avis.'); }
    finally { setSending(false); }
  };

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Avis entreprise</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 36 }} keyboardShouldPersistTaps="handled">
        <View className="items-center gap-2 rounded-xl bg-primary p-lg">
          <Text className="font-sans-semibold text-label-lg text-white/80">{company}</Text>
          <Text className="font-sans-extrabold text-display-lg text-white">{reviews.length ? average.toFixed(1) : '—'} / 5</Text>
          <Text className="font-sans text-label-md text-white/80">{reviews.length} avis publiés par les candidats</Text>
        </View>
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Partager ton expérience</Text>
          <Text className="font-sans text-label-lg text-on-surface-variant">Ta note</Text>
          <View className="flex-row gap-2">{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setRating(value)} hitSlop={8}><MaterialIcons name={value <= rating ? 'star' : 'star-border'} size={28} color={colors.tertiary} /></Pressable>)}</View>
          <TextInput value={role} onChangeText={setRole} placeholder="Ton poste (facultatif)" placeholderTextColor={colors.outline} className="rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <TextInput value={body} onChangeText={setBody} placeholder="Décris ton expérience (20 caractères minimum)" placeholderTextColor={colors.outline} multiline textAlignVertical="top" className="min-h-[120px] rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <Pressable disabled={sending} onPress={() => void submit()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">
            {sending ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="send" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-white">Publier mon avis</Text></>}
          </Pressable>
        </View>
        <Text className="font-sans-semibold text-title-lg text-on-surface">Avis publiés</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : reviews.length === 0 ? <Text className="rounded-lg bg-surface-container p-md font-sans text-body-md text-on-surface-variant">Aucun avis enregistré pour le moment.</Text> : reviews.map((review) => (
          <View key={review.id} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
            <View className="flex-row items-center justify-between">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{review.role || 'Membre candidat'}</Text>
              <View className="flex-row">{[1, 2, 3, 4, 5].map((i) => <MaterialIcons key={i} name={i <= review.rating ? 'star' : 'star-border'} size={15} color={colors.tertiary} />)}</View>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">{review.body}</Text>
            <Text className="font-sans text-label-md text-outline">{new Date(review.created_at).toLocaleDateString('fr-FR')}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}