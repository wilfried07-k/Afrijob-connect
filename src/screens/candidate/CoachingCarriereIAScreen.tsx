import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Message = { id: string; from: 'ai' | 'user'; text: string };

const SUGGESTIONS = [
  'Comment améliorer mon CV ?',
  "Comment négocier mon salaire ?",
  "Préparer un entretien technique",
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', from: 'ai', text: "Bonjour Samuel ! Je suis votre coach carrière IA. Comment puis-je vous aider aujourd'hui ?" },
];

export default function CoachingCarriereIAScreen({ navigation }: Props) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          from: 'ai',
          text: "Excellente question ! Concentrez-vous sur des réalisations chiffrées et adaptez vos mots-clés à l'offre visée. Voulez-vous que je révise un exemple précis ?",
        },
      ]);
    }, 700);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
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
