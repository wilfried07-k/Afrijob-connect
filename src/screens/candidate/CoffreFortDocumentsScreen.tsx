import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Directory } from 'expo-file-system';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { createCandidateFolder, deleteCandidateDocument, listCandidateDocuments, listCandidateFolders, saveCandidateDocument, type CandidateDocument } from '../../lib/candidateFiles';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CoffreFortDocuments'>;

const formatSize = (bytes: number) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

export default function CoffreFortDocumentsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<CandidateDocument[]>([]);
  const [folders, setFolders] = useState<Directory[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | undefined>();
  const [folderModal, setFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(true);

  const loadFiles = useCallback(() => {
    try {
      setDocuments(listCandidateDocuments(activeFolder));
      setFolders(listCandidateFolders(activeFolder));
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de lire les documents.');
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (!result.canceled) {
        await saveCandidateDocument(result.assets[0].uri, result.assets[0].name, activeFolder);
        loadFiles();
      }
    } catch (error) {
      Alert.alert('Import impossible', (error as Error).message || 'Le document n’a pas pu être ajouté.');
    }
  };

  const addFolder = () => {
    if (!folderName.trim()) return;
    try {
      createCandidateFolder(folderName);
      setFolderName('');
      setFolderModal(false);
      loadFiles();
    } catch (error) {
      Alert.alert('Dossier non créé', (error as Error).message || 'Vérifie le nom du dossier.');
    }
  };

  const confirmDelete = (document: CandidateDocument) => Alert.alert('Supprimer ce document ?', document.name, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: () => { deleteCandidateDocument(document.uri); loadFiles(); } },
  ]);

  const filtered = documents.filter((document) => document.name.toLowerCase().includes(search.toLowerCase()));
  const usedBytes = documents.reduce((total, document) => total + document.size, 0);
  const usagePercent = Math.min(100, Math.round((usedBytes / (10 * 1024 * 1024)) * 100));

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => activeFolder ? setActiveFolder(undefined) : navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="flex-1 font-sans-bold text-headline-md text-primary">{activeFolder ?? 'Coffre-fort numérique'}</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uri}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            <View className="flex-row items-center gap-2"><MaterialIcons name="shield" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-primary">Stockage sur cet appareil</Text></View>
            <Text className="font-sans text-body-md text-on-surface-variant">Les fichiers restent dans l’espace privé de cette application.</Text>
            <View className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md">
              <View className="mb-2 flex-row items-center justify-between"><Text className="font-sans-semibold text-label-lg text-on-surface">Espace utilisé</Text><Text className="font-sans text-label-md text-on-surface-variant">{formatSize(usedBytes)} / 10 Mo</Text></View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest"><View className="h-full rounded-full bg-primary" style={{ width: `${usagePercent}%` }} /></View>
              <Text className="mt-2 font-sans text-label-md text-on-surface-variant">{usagePercent}% de l’espace alloué</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              <Pressable onPress={() => void pickDocument()} className="flex-row items-center gap-2 rounded-lg bg-primary-container px-lg py-3"><MaterialIcons name="upload" size={18} color={colors.onPrimaryContainer} /><Text className="font-sans-semibold text-label-lg text-on-primary-container">Ajouter un document</Text></Pressable>
              <Pressable onPress={() => setFolderModal(true)} className="flex-row items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-lg py-3"><MaterialIcons name="create-new-folder" size={18} color={colors.onSurfaceVariant} /><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Nouveau dossier</Text></Pressable>
            </View>
            {folders.length ? <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">Dossiers</Text><View className="flex-row flex-wrap gap-2">{folders.map((folder) => <Pressable key={folder.uri} onPress={() => setActiveFolder(folder.name)} className="flex-row items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-md py-3"><MaterialIcons name="folder" size={18} color={colors.primary} /><Text className="font-sans-medium text-label-md text-on-surface">{folder.name}</Text></Pressable>)}</View></View> : null}
            <View className="h-12 flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-md"><MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} /><TextInput value={search} onChangeText={setSearch} placeholder="Rechercher un document..." placeholderTextColor={colors.outline} className="ml-2 flex-1 font-sans text-body-md text-on-surface" /></View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1 gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md">
            <View className="flex-row items-start justify-between"><View className="h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><MaterialIcons name="description" size={26} color={colors.primary} /></View><Pressable onPress={() => confirmDelete(item)} hitSlop={8}><MaterialIcons name="delete-outline" size={20} color={colors.error} /></Pressable></View>
            <Text className="font-sans-semibold text-label-lg text-on-surface" numberOfLines={1}>{item.name}</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">{formatSize(item.size)}{item.updatedAt ? ` • ${new Date(item.updatedAt).toLocaleDateString('fr-FR')}` : ''}</Text>
          </View>
        )}
        ListEmptyComponent={<View className="items-center gap-md py-xl"><MaterialIcons name={loading ? 'hourglass-empty' : 'folder-open'} size={48} color={colors.outline} /><Text className="font-sans text-body-md text-on-surface-variant">{loading ? 'Chargement…' : 'Aucun document trouvé'}</Text></View>}
      />
      <Modal visible={folderModal} transparent animationType="slide" onRequestClose={() => setFolderModal(false)}>
        <View className="flex-1 justify-end bg-black/40"><View className="gap-md rounded-t-2xl bg-surface-container-lowest p-lg"><Text className="font-sans-bold text-title-lg text-on-surface">Nouveau dossier</Text><TextInput value={folderName} onChangeText={setFolderName} autoFocus placeholder="Nom du dossier" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant px-md font-sans text-body-md text-on-surface" /><Pressable onPress={addFolder} className="items-center rounded-lg bg-primary py-3"><Text className="font-sans-semibold text-label-lg text-on-primary">Créer le dossier</Text></Pressable><Pressable onPress={() => setFolderModal(false)} className="items-center py-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Annuler</Text></Pressable></View></View>
      </Modal>
    </Screen>
  );
}
