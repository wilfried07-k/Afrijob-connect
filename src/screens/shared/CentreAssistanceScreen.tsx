import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { createSupportTicket } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
const CATEGORIES: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: 'person', label: 'Mon compte' }, { icon: 'work', label: 'Candidatures' },
  { icon: 'payments', label: 'Paiements' }, { icon: 'security', label: 'Sécurité' },
];
const FAQS = [
  { question: 'Comment réinitialiser mon mot de passe ?', answer: 'Depuis la connexion, utilise le lien « Mot de passe oublié » si cette option est proposée. Sinon, contacte le support avec l’adresse de ton compte.' },
  { question: 'Comment supprimer mon compte ?', answer: 'Envoie une demande au support depuis ce formulaire. Nous vérifierons ton identité avant de traiter la suppression.' },
  { question: 'Pourquoi ma candidature a-t-elle changé de statut ?', answer: 'Le statut est mis à jour par le recruteur. Tu peux consulter son évolution dans le suivi des candidatures.' },
];

export default function CentreAssistanceScreen({ navigation }: Props) {
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const filteredFaqs = useMemo(() => FAQS.filter((item) => item.question.toLowerCase().includes(search.trim().toLowerCase())), [search]);

  const send = async () => {
    if (!subject.trim() || !body.trim()) { Alert.alert('Informations manquantes', 'Renseigne un sujet et décris ta demande.'); return; }
    setSending(true);
    try {
      const ticket = await createSupportTicket({ category, subject: subject.trim(), body: body.trim() });
      setSubject(''); setBody('');
      Alert.alert('Demande enregistrée', 'Référence ' + ticket.id + ' · statut ' + ticket.status + '. Le support pourra la consulter dans le système.');
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible d’envoyer la demande.'); }
    finally { setSending(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Centre d’assistance</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="h-12 flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-md"><MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} /><TextInput value={search} onChangeText={setSearch} placeholder="Rechercher dans les questions" placeholderTextColor={colors.outline} className="flex-1 font-sans text-body-md text-on-surface" /></View>
        <View className="flex-row flex-wrap gap-2">{CATEGORIES.map((item) => <Pressable key={item.label} onPress={() => setCategory(item.label)} className={'min-w-[47%] flex-1 items-center gap-2 rounded-xl border p-md ' + (category === item.label ? 'border-primary bg-primary-container/20' : 'border-outline-variant/30 bg-surface-container-lowest')}><MaterialIcons name={item.icon} size={22} color={colors.primary} /><Text className="font-sans-semibold text-label-md text-on-surface">{item.label}</Text></Pressable>)}</View>
        <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Questions fréquentes</Text>{filteredFaqs.map((faq) => <Pressable key={faq.question} onPress={() => setExpanded(expanded === faq.question ? null : faq.question)} className="gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md"><View className="flex-row items-center justify-between"><Text className="flex-1 font-sans text-body-md text-on-surface">{faq.question}</Text><MaterialIcons name={expanded === faq.question ? 'expand-less' : 'chevron-right'} size={20} color={colors.outlineVariant} /></View>{expanded === faq.question && <Text className="font-sans text-label-md text-on-surface-variant">{faq.answer}</Text>}</Pressable>)}{filteredFaqs.length === 0 && <Text className="font-sans text-body-md text-on-surface-variant">Aucun résultat.</Text>}</View>
        <View className="gap-md rounded-xl bg-primary p-lg shadow-lg"><View className="flex-row items-center gap-2"><MaterialIcons name="support-agent" size={22} color="#fff" /><Text className="font-sans-semibold text-title-lg text-white">Envoyer une demande au support</Text></View><Text className="font-sans text-body-md text-white/85">La demande sera enregistrée et consultable par l’équipe support.</Text><TextInput value={subject} onChangeText={setSubject} placeholder="Sujet" placeholderTextColor="#dbeafe" className="rounded-lg bg-white/15 px-md py-3 font-sans text-body-md text-white" /><TextInput value={body} onChangeText={setBody} placeholder="Décris ton problème" placeholderTextColor="#dbeafe" multiline textAlignVertical="top" className="min-h-[100px] rounded-lg bg-white/15 p-md font-sans text-body-md text-white" /><Pressable disabled={sending} onPress={() => void send()} className="mt-1 h-12 flex-row items-center justify-center gap-2 rounded-xl bg-white">{sending ? <ActivityIndicator color={colors.primary} /> : <><MaterialIcons name="send" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Envoyer la demande</Text></>}</Pressable></View>
      </ScrollView>
    </View>
  );
}
