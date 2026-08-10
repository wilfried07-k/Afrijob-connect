import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const SECTIONS = [
  { key: 'overview', label: "Vue d'ensemble", checked: true },
  { key: 'candidates', label: 'Détail des candidatures', checked: true },
  { key: 'jobs', label: 'Performance des offres', checked: true },
  { key: 'finance', label: 'Données financières', checked: false },
];

const FORMATS = ['PDF', 'Excel (XLSX)', 'CSV'];

export default function ExportationRapportScreen({ navigation }: Props) {
  const [sections, setSections] = useState(SECTIONS);
  const [format, setFormat] = useState('PDF');
  const [exporting, setExporting] = useState(false);

  const toggle = (key: string) =>
    setSections((list) => list.map((s) => (s.key === key ? { ...s, checked: !s.checked } : s)));

  const doExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1200);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Exporter un rapport</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Sections à inclure</Text>
          <View className="gap-2">
            {sections.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => toggle(s.key)}
                className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
              >
                <View className={`h-6 w-6 items-center justify-center rounded border-2 ${s.checked ? 'border-primary bg-primary' : 'border-outline'}`}>
                  {s.checked && <MaterialIcons name="check" size={16} color="#ffffff" />}
                </View>
                <Text className="flex-1 font-sans-medium text-body-md text-on-surface">{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Format du fichier</Text>
          <View className="flex-row gap-2">
            {FORMATS.map((f) => {
              const active = f === format;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFormat(f)}
                  className={`flex-1 items-center rounded-xl border-2 py-3 ${active ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}
                >
                  <Text className={`font-sans-semibold text-label-md ${active ? 'text-primary' : 'text-on-surface'}`}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={doExport}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name={exporting ? 'hourglass-top' : 'ios-share'} size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">
            {exporting ? 'Génération en cours...' : 'Générer et exporter'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
