import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void } };

type DocStatus = 'valid' | 'expiring' | 'missing';

type Doc = { id: string; name: string; status: DocStatus; expiry?: string; fileUri?: string };

const REQUIRED_DOCS = [
  { id: 'rccm', name: 'Registre de Commerce (RCCM)' },
  { id: 'niu', name: 'Attestation NIU (Contribuable)' },
  { id: 'cnps', name: 'Attestation pour soumission CNPS' },
  { id: 'statuts', name: 'Statuts notariés de la société' },
];

const STATUS_STYLE: Record<DocStatus, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  valid: { icon: 'check-circle', color: colors.secondary, label: 'À jour' },
  expiring: { icon: 'warning', color: colors.tertiary, label: 'Expire bientôt' },
  missing: { icon: 'error-outline', color: colors.error, label: 'Manquant' },
};

export default function DocumentsConformiteEntrepriseScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const profile = authState.profile;
  const companyName = profile?.company_name || 'Votre entreprise';
  const companyKey = profile?.company_id ?? authState.userId ?? 'unknown';
  const companyDirectory = useMemo(() => new Directory(Paths.document, `company-compliance-${companyKey}`), [companyKey]);
  const [loading, setLoading] = useState(true);

  const [docs, setDocs] = useState<Doc[]>(REQUIRED_DOCS.map((doc) => ({ ...doc, status: 'missing' })));

  const refreshDocuments = useCallback(() => {
    try {
      if (!companyDirectory.exists) companyDirectory.create({ intermediates: true, idempotent: true });
      const storedFiles = companyDirectory.list().filter((item): item is File => item instanceof File);
      setDocs(REQUIRED_DOCS.map((doc) => {
        const file = storedFiles.find((item) => item.name.startsWith(`${doc.id}--`));
        return { ...doc, status: file ? 'valid' : 'missing', expiry: file ? `Fichier sur cet appareil : ${file.name.split('--').slice(1).join('--')}` : undefined, fileUri: file?.uri };
      }));
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de lire les documents.');
    } finally {
      setLoading(false);
    }
  }, [companyDirectory]);

  useEffect(() => { refreshDocuments(); }, [refreshDocuments]);

  const handleUpload = async (doc: Doc) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const selected = result.assets[0];
      const safeName = selected.name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_');
      const target = new File(companyDirectory, `${doc.id}--${Date.now()}--${safeName}`);
      await new File(selected.uri).copy(target);
      refreshDocuments();
      Alert.alert('Fichier conservé sur cet appareil', 'La pièce est enregistrée localement. Elle n’a pas encore été envoyée à l’équipe de conformité.');
    } catch (error) {
      Alert.alert('Import impossible', (error as Error).message || 'Le fichier n’a pas pu être ajouté.');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Conformité Entreprise</Text>
      </View>

      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-2">
            <View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <Text className="font-sans-bold text-title-md text-on-surface">{companyName}</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Dossier juridique et conformité réglementaire République du Cameroun.
              </Text>
            </View>
            <Text className="font-sans text-label-md text-on-surface-variant">Les pièces jointes restent sur cet appareil et ne sont pas encore transmises au serveur.</Text>
            <Text className="mt-2 font-sans text-label-lg text-on-surface-variant">
              Maintenez ces pièces officielles à jour pour conserver votre label "Entreprise Vérifiée".
            </Text>
          </View>
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
              <Pressable
                onPress={() => void handleUpload(item)}
                className="items-end gap-1 rounded-lg border border-outline-variant/30 p-2"
              >
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={style.icon} size={18} color={style.color} />
                  <Text className="text-[11px] font-sans-bold" style={{ color: style.color }}>
                    {style.label}
                  </Text>
                </View>
                <Text className="text-[10px] font-sans-medium text-primary">{item.fileUri ? 'Remplacer' : 'Choisir un fichier'}</Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} /> : null}
      />
    </View>
  );
}
