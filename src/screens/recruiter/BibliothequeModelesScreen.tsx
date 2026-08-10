import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Template = { id: string; title: string; category: 'Offre' | 'Message' | 'Rejet'; uses: number };

const TEMPLATES: Template[] = [
  { id: '1', title: 'Offre — Poste Technique Standard', category: 'Offre', uses: 24 },
  { id: '2', title: 'Message — Invitation à un entretien', category: 'Message', uses: 61 },
  { id: '3', title: 'Message — Confirmation de candidature reçue', category: 'Message', uses: 118 },
  { id: '4', title: 'Réponse — Candidature non retenue', category: 'Rejet', uses: 45 },
];

const CATEGORY_STYLE: Record<Template['category'], { bg: string; text: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  Offre: { bg: 'bg-primary/10', text: 'text-primary', icon: 'work' },
  Message: { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'mail' },
  Rejet: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', icon: 'block' },
};

const FILTERS: ('Tous' | Template['category'])[] = ['Tous', 'Offre', 'Message', 'Rejet'];

export default function BibliothequeModelesScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<'Tous' | Template['category']>('Tous');
  const templates = filter === 'Tous' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Bibliothèque de Modèles</Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  className={`rounded-full px-md py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <Text className={`font-sans-semibold text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        }
        renderItem={({ item }) => {
          const style = CATEGORY_STYLE[item.category];
          return (
            <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className={`h-11 w-11 items-center justify-center rounded-full ${style.bg}`}>
                <MaterialIcons name={style.icon} size={20} color={style.text.includes('primary') ? colors.primary : style.text.includes('secondary') ? colors.secondary : colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.title}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">Utilisé {item.uses} fois</Text>
              </View>
              <Pressable className="rounded-lg p-2">
                <MaterialIcons name="file-copy" size={18} color={colors.primary} />
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
