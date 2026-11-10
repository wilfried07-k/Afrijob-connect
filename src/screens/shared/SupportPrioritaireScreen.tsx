import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'SupportPrioritaire'>;

export default function SupportPrioritaireScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Contacter le support</Text></View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View className="items-center gap-md rounded-2xl bg-primary p-lg"><View className="h-16 w-16 items-center justify-center rounded-full bg-white/20"><MaterialIcons name="support-agent" size={32} color="#ffffff" /></View><Text className="text-center font-sans-bold text-headline-md text-white">Une question ou un problème ?</Text><Text className="text-center font-sans text-body-md text-white/85">Envoie une demande au support. Elle sera enregistrée avec ton compte pour que l’équipe puisse la traiter.</Text></View>
        <Pressable onPress={() => navigation.navigate('CentreAssistance')} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"><MaterialIcons name="edit" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Créer une demande</Text></Pressable>
        <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"><MaterialIcons name="info-outline" size={18} color={colors.onSurfaceVariant} /><Text className="flex-1 font-sans text-label-md text-on-surface-variant">Le traitement prioritaire, les délais garantis et les abonnements Premium ne sont pas encore connectés à un système de facturation ou de suivi.</Text></View>
      </ScrollView>
    </View>
  );
}
