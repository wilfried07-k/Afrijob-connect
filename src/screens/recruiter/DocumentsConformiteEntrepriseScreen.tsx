import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type DocStatus = 'valid' | 'expiring' | 'missing';

type Doc = { id: string; name: string; status: DocStatus; expiry?: string };

const DOCS: Doc[] = [
  { id: '1', name: 'Registre de Commerce (RCCM)', status: 'valid', expiry: 'Valide jusqu\u2019au 12/2027' },
  { id: '2', name: 'Attestation NIU', status: 'valid', expiry: 'Valide jusqu\u2019au 06/2027' },
  { id: '3', name: 'Attestation de non-redevance CNPS', status: 'expiring', expiry: 'Expire dans 12 jours' },
  { id: '4', name: 'Statuts de la société', status: 'missing' },
];

const STATUS_STYLE: Record<DocStatus, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  valid: { icon: 'check-circle', color: colors.secondary, label: 'À jour' },
  expiring: { icon: 'warning', color: colors.tertiary, label: 'Expire bientôt' },
  missing: { icon: 'error-outline', color: colors.error, label: 'Manquant' },
};

export default function DocumentsConformiteEntrepriseScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Documents de Conformité</Text>
      </View>

      <FlatList
        data={DOCS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
            Maintenez vos documents à jour pour conserver votre badge "Entreprise Vérifiée".
          </Text>
        }
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status];
          return (
            <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-11 w-11 items-center justify-center rounded-lg bg-surface-container-high">
                <MaterialIcons name="description" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.name}</Text>
                {item.expiry && <Text className="font-sans text-label-md text-on-surface-variant">{item.expiry}</Text>}
              </View>
              <View className="items-end gap-1">
                <MaterialIcons name={style.icon} size={20} color={style.color} />
                <Text className="text-[10px] font-sans-bold" style={{ color: style.color }}>{style.label}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
