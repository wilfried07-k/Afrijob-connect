import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureRapide'>;

export default function CandidatureRapideScreen({ navigation, route }: Props) {
  const title = route.params?.title ?? 'Product Designer Senior';
  const company = route.params?.company ?? 'MTN Cameroon';

  const [selectedDoc, setSelectedDoc] = useState<'main' | 'other'>('main');
  const [message, setMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-semibold text-title-lg text-primary">Candidature Rapide</Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Review info */}
        <View className="gap-md">
          <Text className="px-1 font-sans-semibold text-headline-md text-on-surface">
            Révision des informations
          </Text>
          <View className="flex-row items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-container bg-surface-variant">
              <Text className="font-sans-bold text-title-lg text-primary">SN</Text>
            </View>
            <View>
              <Text className="font-sans-semibold text-title-lg text-on-surface">Samuel Ndongo</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">Développeur Full-Stack Senior</Text>
            </View>
          </View>
          <View className="flex-row gap-md">
            <View className="flex-1 gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-primary">Email</Text>
              <Text className="font-sans text-body-md text-on-surface">samuel.ndongo@example.cm</Text>
            </View>
            <View className="flex-1 gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-primary">Téléphone</Text>
              <Text className="font-sans text-body-md text-on-surface">+237 670 000 000</Text>
            </View>
          </View>
        </View>

        {/* Documents */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between px-1">
            <Text className="font-sans-semibold text-headline-md text-on-surface">Documents</Text>
            <Text className="font-sans-semibold text-label-lg text-primary">Gérer mes fichiers</Text>
          </View>

          <Pressable
            onPress={() => setSelectedDoc('main')}
            className={`flex-row items-center gap-md rounded-lg border-2 p-md ${
              selectedDoc === 'main' ? 'border-primary-container bg-surface-container-lowest' : 'border-outline-variant'
            }`}
          >
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MaterialIcons name="description" size={22} color={colors.primary} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-semibold text-title-lg text-on-surface">CV_Ndongo_2024.pdf</Text>
                {selectedDoc === 'main' && <MaterialIcons name="check-circle" size={20} color={colors.primary} />}
              </View>
              <Text className="text-xs font-sans text-on-surface-variant">Dernière mise à jour: il y a 2 jours</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setSelectedDoc('other')}
            className={`flex-row items-center gap-md rounded-lg border border-dashed p-md ${
              selectedDoc === 'other' ? 'border-primary bg-primary/5' : 'border-outline'
            }`}
          >
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface-variant">
              <MaterialIcons name="upload-file" size={22} color={colors.onSurfaceVariant} />
            </View>
            <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface-variant">
              Téléverser un autre document
            </Text>
            {selectedDoc === 'other' && <MaterialIcons name="check-circle" size={20} color={colors.primary} />}
          </Pressable>
        </View>

        {/* Message */}
        <View className="gap-md">
          <Text className="px-1 font-sans-semibold text-headline-md text-on-surface">
            Message de motivation (optionnel)
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={`Expliquez pourquoi vous êtes fait(e) pour ce poste chez ${company}...`}
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-lg border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="gap-md border-t border-outline-variant px-container-margin py-md">
        <Pressable className="flex-row items-start gap-2" onPress={() => setAcceptedTerms((v) => !v)}>
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              acceptedTerms ? 'border-primary bg-primary' : 'border-outline'
            }`}
          >
            {acceptedTerms && <MaterialIcons name="check" size={14} color="#ffffff" />}
          </View>
          <Text className="flex-1 font-sans text-label-md leading-tight text-on-surface-variant">
            J'autorise EmploiCamer à transmettre mes coordonnées et mon profil à {company} conformément à
            la politique de confidentialité.
          </Text>
        </Pressable>
        <Pressable
          disabled={!acceptedTerms}
          onPress={() => navigation.replace('CandidatureEnvoyee', { company })}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !acceptedTerms ? 'opacity-50' : ''
          }`}
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer ma candidature</Text>
          <MaterialIcons name="send" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
