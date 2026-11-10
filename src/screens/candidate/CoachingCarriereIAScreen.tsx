import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void } };

type Message = { id: string; from: 'ai' | 'user'; text: string };

const SUGGESTIONS = [
  'Comment améliorer mon CV ?',
  'Comment négocier mon salaire au Cameroun ?',
  'Préparer un entretien technique',
  'Quelles compétences devrais-je développer ?',
];

export default function CoachingCarriereIAScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const profile = authState.profile;
  const firstName = useMemo(() => {
    return profile?.full_name ? profile.full_name.trim().split(' ')[0] : 'Candidat';
  }, [profile?.full_name]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'ai',
      text: `Bonjour ${firstName} ! Je suis votre coach carrière IA. ${
        profile?.job_title ? `Je vois que vous évoluez dans le domaine "${profile.job_title}". ` : ''
      }Comment puis-je vous aider aujourd'hui ?`,
    },
  ]);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply = "Excellente question ! Concentrez-vous sur des réalisations concrètes et quantifiables pour marquer des points auprès des recruteurs camerounais.";
      const lower = text.toLowerCase();
      if (lower.includes('cv')) {
        reply = `Pour optimiser votre CV ${profile?.job_title ? `en ${profile.job_title}` : ''}, assurez-vous d'indiquer des résultats chiffrés, d'adapter vos mots-clés selon l'offre et de mettre en valeur vos compétences certifiées.`;
      } else if (lower.includes('salaire')) {
        reply = "Pour négocier votre rémunération, renseignez-vous sur les grilles salariales du marché local (ex: Douala/Yaoundé). Exprimez vos prétentions sous forme de fourchette nette et valorisez votre impact direct sur les projets.";
      } else if (lower.includes('entretien')) {
        reply = "Préparez votre pitch en 2 minutes (parcours, réussites majeures, motivation pour l'entreprise). Renseignez-vous à fond sur l'entreprise et préparez 2 à 3 questions pertinentes pour le recruteur.";
      } else if (lower.includes('compétence')) {
        reply = profile?.skills
          ? `Vos compétences actuelles (${profile.skills}) sont un bon socle. Complétez-les avec des certifications reconnues et des projets pratiques visibles dans votre portfolio.`
          : "Identifiez les compétences les plus demandées sur les offres d'emploi actuelles sur EmploiCamer et passez les tests de compétences disponibles sur l'application.";
      }

      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          from: 'ai',
          text: reply,
        },
      ]);
    }, 700);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
          <MaterialIcons name="smart-toy" size={18} color={colors.onPrimaryContainer} />
        </View>
        <Text className="font-sans-bold text-headline-md text-primary">Coach Carrière IA</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} className={`max-w-[85%] rounded-2xl p-md ${msg.from === 'ai' ? 'self-start bg-surface-container-lowest border border-outline-variant/20' : 'self-end bg-primary'}`}>
            <Text className={`font-sans text-body-md ${msg.from === 'ai' ? 'text-on-surface' : 'text-on-primary'}`}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="gap-md px-container-margin py-md">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} onPress={() => send(s)} className="rounded-full border border-primary/30 bg-primary-container/10 px-md py-2">
              <Text className="font-sans-medium text-label-md text-primary">{s}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View className="h-12 flex-row items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-md">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Posez votre question..."
            placeholderTextColor={colors.outline}
            className="flex-1 font-sans text-body-md text-on-surface"
            onSubmitEditing={() => send(input)}
          />
          <Pressable onPress={() => send(input)} className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <MaterialIcons name="send" size={16} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
