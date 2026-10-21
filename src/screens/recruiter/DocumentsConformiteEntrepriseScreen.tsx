import { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void } };

type DocStatus = 'valid' | 'expiring' | 'missing';

type Doc = { id: string; name: string; status: DocStatus; expiry?: string };

const STATUS_STYLE: Record<DocStatus, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  valid: { icon: 'check-circle', color: colors.secondary, label: 'À jour' },
  expiring: { icon: 'warning', color: colors.tertiary, label: 'Expire bientôt' },
  missing: { icon: 'error-outline', color: colors.error, label: 'Manquant' },
};

export default function DocumentsConformiteEntrepriseScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const profile = authState.profile;
  const companyName = profile?.company_name || 'Votre entreprise';

  const [docs, setDocs] = useState<Doc[]>([
    { id: '1', name: 'Registre de Commerce (RCCM)', status: 'valid', expiry: 'Valide jusqu’au 12/2027' },
    { id: '2', name: 'Attestation NIU (Contribuable)', status: 'valid', expiry: 'Valide jusqu’au 06/2027' },
    { id: '3', name: 'Attestation pour soumission CNPS', status: 'valid', expiry: 'Valide pour le trimestre en cours' },
    { id: '4', name: 'Statuts notariés de la société', status: 'missing' },
  ]);

  const handleUpload = (docId: string, docName: string) => {
    Alert.alert(
      'Téléverser un document',
      `Sélectionnez le fichier PDF ou l'image pour "${docName}".`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Sélectionner un fichier',
          onPress: () => {
            setDocs((current) =>
              current.map((d) => (d.id === docId ? { ...d, status: 'valid', expiry: 'Document soumis en cours d’examen' } : d))
            );
            Alert.alert('Succès', 'Document téléversé avec succès. Il sera vérifié par notre équipe de conformité.');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
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
                onPress={() => handleUpload(item.id, item.name)}
                className="items-end gap-1 rounded-lg border border-outline-variant/30 p-2"
              >
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={style.icon} size={18} color={style.color} />
                  <Text className="text-[11px] font-sans-bold" style={{ color: style.color }}>
                    {style.label}
                  </Text>
                </View>
                <Text className="text-[10px] font-sans-medium text-primary">Mettre à jour</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
