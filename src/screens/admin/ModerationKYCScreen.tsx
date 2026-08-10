import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type DocStatus = 'ok' | 'warning' | 'missing';

type KycFile = {
  id: string;
  company: string;
  location: string;
  registeredAgo: string;
  urgent?: boolean;
  documents: { name: string; file: string; status: DocStatus; note?: string }[];
};

const KYC_FILES: KycFile[] = [
  {
    id: '1',
    company: 'Afriland Builders S.A.',
    location: 'Douala',
    registeredAgo: 'Il y a 2h',
    urgent: true,
    documents: [
      { name: 'RCCM', file: 'rccm_2023_afriland.pdf', status: 'ok' },
      { name: 'NIU', file: 'niu_certif_final.pdf', status: 'ok' },
      { name: 'Statuts', file: 'statuts_scanned.jpg', status: 'warning', note: 'Page 4 manquante' },
    ],
  },
  {
    id: '2',
    company: 'Kmer Digital Services',
    location: 'Yaoundé',
    registeredAgo: 'Il y a 5h',
    documents: [
      { name: 'RCCM', file: 'rccm_kds.pdf', status: 'ok' },
      { name: 'NIU', file: 'niu_kds.pdf', status: 'ok' },
      { name: 'Statuts', file: '—', status: 'missing' },
    ],
  },
];

const FILTERS = ['Tous les dossiers', 'Urgence Haute', 'Compléments requis', 'Nouvelles inscriptions'];

const DOC_STYLE: Record<DocStatus, { icon: keyof typeof MaterialIcons.glyphMap; color: string; bg: string }> = {
  ok: { icon: 'check-circle', color: colors.secondary, bg: 'bg-surface-container-low' },
  warning: { icon: 'warning', color: colors.error, bg: 'bg-error-container/5 border border-error/20' },
  missing: { icon: 'error-outline', color: colors.error, bg: 'bg-error-container/5 border border-error/20' },
};

export default function ModerationKYCScreen() {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [files, setFiles] = useState(KYC_FILES);

  const decide = (id: string) => setFiles((list) => list.filter((f) => f.id !== id));

  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Vérification KYC</Text>
        <Text className="font-sans text-body-md text-on-surface-variant">
          Dossiers d'entreprises en attente de validation.
        </Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'En attente', value: '24', icon: 'pending-actions' as const, color: colors.primary },
                { label: 'Urgent', value: '08', icon: 'priority-high' as const, color: colors.error },
                { label: 'Validés (24h)', value: '152', icon: 'check-circle' as const, color: colors.secondary },
              ].map((s) => (
                <View key={s.label} className="min-w-[100px] flex-1 flex-row items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                  <MaterialIcons name={s.icon} size={20} color={s.color} />
                  <View>
                    <Text className="font-sans text-[10px] text-on-surface-variant">{s.label}</Text>
                    <Text className="font-sans-bold text-title-lg" style={{ color: s.color }}>{s.value}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f === filter;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFilter(f)}
                    className={`rounded-full px-md py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-center gap-md">
              <View className="h-12 w-12 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low">
                <MaterialIcons name="apartment" size={22} color={colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-title-lg text-on-surface">{item.company}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">
                  Inscrit {item.registeredAgo} • {item.location}
                </Text>
                {item.urgent && (
                  <View className="mt-1 flex-row items-center gap-1">
                    <MaterialIcons name="bolt" size={12} color={colors.error} />
                    <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-error">Urgent</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="gap-2">
              {item.documents.map((doc) => {
                const style = DOC_STYLE[doc.status];
                return (
                  <View key={doc.name} className={`flex-row items-center justify-between rounded-lg p-2 ${style.bg}`}>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-sans-semibold text-xs text-on-surface-variant">{doc.name}</Text>
                        <MaterialIcons name={style.icon} size={16} color={style.color} />
                      </View>
                      <Text className="font-sans-medium text-label-md text-primary">{doc.file}</Text>
                      {doc.note && <Text className="text-[10px] font-sans-medium text-error">{doc.note}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="flex-row gap-2">
              <Pressable onPress={() => decide(item.id)} className="h-10 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-secondary shadow-sm">
                <MaterialIcons name="done" size={16} color="#ffffff" />
                <Text className="font-sans-semibold text-label-lg text-white">Approuver</Text>
              </Pressable>
              <Pressable onPress={() => decide(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-surface-container-high">
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Compléments requis</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="verified-user" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucun dossier en attente</Text>
          </View>
        }
      />
    </Screen>
  );
}
