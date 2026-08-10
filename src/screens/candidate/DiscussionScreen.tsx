import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void }; route?: { params?: { company?: string } } };

type ChatMessage = { id: string; from: 'them' | 'me'; text: string; time: string };

const INITIAL: ChatMessage[] = [
  { id: '1', from: 'them', text: "Bonjour Samuel, merci pour votre candidature au poste de Product Designer !", time: '09:12' },
  { id: '2', from: 'them', text: 'Votre profil nous intéresse vivement pour ce poste. Seriez-vous disponible pour un entretien la semaine prochaine ?', time: '09:13' },
  { id: '3', from: 'me', text: 'Bonjour, merci beaucoup ! Oui, je suis disponible mardi ou mercredi après-midi.', time: '09:40' },
];

export default function DiscussionScreen({ navigation, route }: Props) {
  const company = route?.params?.company ?? 'MTN Cameroon';
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now().toString(), from: 'me', text: input, time: 'Maintenant' }]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      {/* Header */}
      <View className="h-16 flex-row items-center gap-3 border-b border-outline-variant/20 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcons name="business" size={18} color={colors.onSurfaceVariant} />
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-title-lg text-on-surface">{company}</Text>
          <Text className="font-sans text-label-md text-secondary">En ligne</Text>
        </View>
        <Pressable hitSlop={8}>
          <MaterialIcons name="call" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} className={`max-w-[80%] gap-1 ${msg.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
            <View className={`rounded-2xl px-md py-3 ${msg.from === 'me' ? 'bg-primary' : 'bg-surface-container-lowest border border-outline-variant/20'}`}>
              <Text className={`font-sans text-body-md ${msg.from === 'me' ? 'text-on-primary' : 'text-on-surface'}`}>
                {msg.text}
              </Text>
            </View>
            <Text className="font-sans text-[10px] text-outline">{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Composer */}
      <View className="flex-row items-center gap-2 border-t border-outline-variant/20 px-container-margin py-md">
        <Pressable hitSlop={8}>
          <MaterialIcons name="attach-file" size={22} color={colors.onSurfaceVariant} />
        </Pressable>
        <View className="h-11 flex-1 flex-row items-center rounded-full border border-outline-variant bg-surface-container-lowest px-md">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écrire un message..."
            placeholderTextColor={colors.outline}
            className="flex-1 font-sans text-body-md text-on-surface"
            onSubmitEditing={send}
          />
        </View>
        <Pressable onPress={send} className="h-11 w-11 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="send" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
