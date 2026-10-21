import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { getConversationMessages, sendMessage, type MessageItem } from '../../lib/api';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void }; route?: { params?: { company?: string; conversationId?: number } } };

export default function DiscussionScreen({ navigation, route }: Props) {
  const company = route?.params?.company ?? 'Entreprise';
  const conversationId = route?.params?.conversationId;
  const { authState } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadMessages = async () => {
      if (!conversationId) { setLoadError('Conversation introuvable.'); setLoading(false); return; }
      try {
        const list = await getConversationMessages(conversationId);
        if (active) setMessages(list);
      } catch (error) { if (active) setLoadError((error as Error).message || 'Impossible de charger les messages.'); }
      finally { if (active) setLoading(false); }
    };
    void loadMessages();
    return () => { active = false; };
  }, [conversationId]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    if (!conversationId || !authState.userId) { Alert.alert('Conversation indisponible', 'Ouvre la discussion depuis une candidature ou un fil existant.'); return; }
    setSending(true);
    try {
      const message = await sendMessage(conversationId, { sender_user_id: authState.userId, text });
      setMessages((current) => [...current, message]);
      setInput('');
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Le message n’a pas été envoyé.'); }
    finally { setSending(false); }
  };

  const isMe = (message: MessageItem) => message.sender_user_id === authState.userId;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 border-b border-outline-variant/20 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container"><MaterialIcons name="business" size={18} color={colors.onSurfaceVariant} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{company}</Text><Text className="font-sans text-label-md text-on-surface-variant">Conversation</Text></View></View>
      {loading ? <View className="flex-1 items-center justify-center py-8"><ActivityIndicator size="large" color={colors.primary} /></View> : loadError ? <View className="flex-1 items-center justify-center px-container-margin"><Text className="font-sans text-body-md text-error">{loadError}</Text></View> : <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }} showsVerticalScrollIndicator={false}>
        {messages.length === 0 ? <Text className="py-xl text-center font-sans text-body-md text-on-surface-variant">Aucun message. Tu peux commencer la conversation.</Text> : messages.map((message) => <View key={message.id} className={'max-w-[80%] gap-1 ' + (isMe(message) ? 'self-end items-end' : 'self-start items-start')}><View className={'rounded-2xl px-md py-3 ' + (isMe(message) ? 'bg-primary' : 'border border-outline-variant/20 bg-surface-container-lowest')}><Text className={'font-sans text-body-md ' + (isMe(message) ? 'text-on-primary' : 'text-on-surface')}>{message.text}</Text></View><Text className="font-sans text-[10px] text-outline">{new Date(message.created_at).toLocaleTimeString('fr-FR')}</Text></View>)}
      </ScrollView>}
      <View className="flex-row items-center gap-2 border-t border-outline-variant/20 px-container-margin py-md"><View className="h-11 flex-1 flex-row items-center rounded-full border border-outline-variant bg-surface-container-lowest px-md"><TextInput value={input} onChangeText={setInput} placeholder="Écrire un message..." placeholderTextColor={colors.outline} editable={!loading && !loadError} className="flex-1 font-sans text-body-md text-on-surface" onSubmitEditing={() => void send()} /></View><Pressable disabled={sending || loading || Boolean(loadError)} onPress={() => void send()} className="h-11 w-11 items-center justify-center rounded-full bg-primary">{sending ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="send" size={18} color="#ffffff" />}</Pressable></View>
    </KeyboardAvoidingView>
  );
}
