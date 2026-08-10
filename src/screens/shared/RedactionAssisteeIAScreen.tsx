import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const TEMPLATES = [
  { id: 'motivation', label: 'Lettre de motivation', icon: 'mail' as const },
  { id: 'summary', label: 'Résumé de profil', icon: 'person' as const },
  { id: 'job', label: "Description d'offre", icon: 'work' as const },
];

export default function RedactionAssisteeIAScreen({ navigation }: Props) {
  const [template, setTemplate] = useState('motivation');
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(
        "Madame, Monsieur,\n\nFort(e) de plusieurs années d'expérience dans le secteur, je suis particulièrement intéressé(e) par cette opportunité qui correspond à mes compétences et à mes ambitions professionnelles...\n\n(Texte généré à titre d'exemple — modifiable ci-dessous)"
      );
      setLoading(false);
    }, 900);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
          <MaterialIcons name="auto-fix-high" size={18} color={colors.onPrimaryContainer} />
        </View>
        <Text className="font-sans-bold text-headline-md text-primary">Rédaction IA</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row gap-2">
          {TEMPLATES.map((t) => {
            const active = t.id === template;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTemplate(t.id)}
                className={`flex-1 items-center gap-2 rounded-xl border-2 p-md ${active ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}
              >
                <MaterialIcons name={t.icon} size={20} color={active ? colors.primary : colors.onSurfaceVariant} />
                <Text className={`text-center font-sans-semibold text-label-md ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Quelques informations clés</Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Ex : Poste de Product Designer chez MTN, 5 ans d'expérience en Fintech..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={generate}
          className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md"
        >
          <MaterialIcons name="auto-awesome" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-label-lg text-on-primary">
            {loading ? 'Génération...' : 'Générer avec l\u2019IA'}
          </Text>
        </Pressable>

        {generated ? (
          <View className="gap-2">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Résultat (modifiable)</Text>
            <TextInput
              value={generated}
              onChangeText={setGenerated}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              className="min-h-[200px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
            />
            <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-primary">
              <MaterialIcons name="content-copy" size={16} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-primary">Copier le texte</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
