import { useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { submitProductFeedback } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
const QUESTIONS = ['Qualité des candidatures reçues', 'Facilité d’utilisation de la plateforme', 'Rapport qualité-prix de votre abonnement'];

export default function FeedbackExperienceScreen({ navigation }: Props) {
  const [ratings, setRatings] = useState<number[]>([0, 0, 0]);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const setRating = (index: number, value: number) => setRatings((current) => current.map((item, i) => i === index ? value : item));

  const send = async () => {
    if (ratings.some((rating) => rating < 1)) { Alert.alert('Notes manquantes', 'Attribue une note à chaque question avant l’envoi.'); return; }
    setSending(true);
    try {
      await submitProductFeedback({ applications_rating: ratings[0], usability_rating: ratings[1], value_rating: ratings[2], comment: comment.trim() || undefined });
      Alert.alert('Avis envoyé', 'Merci. Ton avis a été enregistré.', [{ text: 'OK', onPress: navigation.goBack }]);
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer ton avis.'); }
    finally { setSending(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Votre avis compte</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <Text className="font-sans text-body-lg text-on-surface-variant">Partage ton expérience pour nous aider à améliorer EmploiCamer.</Text>
        {QUESTIONS.map((question, index) => <View key={question} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><Text className="font-sans-semibold text-label-lg text-on-surface">{question}</Text><View className="flex-row gap-1">{[1, 2, 3, 4, 5].map((rating) => <Pressable key={rating} onPress={() => setRating(index, rating)} hitSlop={4}><MaterialIcons name={rating <= ratings[index] ? 'star' : 'star-border'} size={28} color={rating <= ratings[index] ? colors.tertiary : colors.outlineVariant} /></Pressable>)}</View></View>)}
        <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Commentaire (facultatif)</Text><TextInput value={comment} onChangeText={setComment} placeholder="Qu’est-ce qui pourrait être amélioré ?" placeholderTextColor={colors.outline} multiline numberOfLines={4} textAlignVertical="top" className="min-h-[100px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface" /></View>
        <Pressable disabled={sending} onPress={() => void send()} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg">{sending ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="send" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer mon avis</Text></>}</Pressable>
      </ScrollView>
    </View>
  );
}
