import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const SECTORS = [
  { label: 'Télécommunications', value: 'telecom' },
  { label: 'Banque & Finance', value: 'finance' },
  { label: 'BTP & Construction', value: 'btp' },
  { label: 'Technologie', value: 'tech' },
];

const SIZES = [
  { label: '1 - 10 employés', value: 'small' },
  { label: '11 - 50 employés', value: 'medium' },
  { label: '51 - 500 employés', value: 'large' },
  { label: '500+ employés', value: 'enterprise' },
];

export default function CreationProfilEntrepriseScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil de l'entreprise</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Pressable className="items-center gap-2 self-center">
          <View className="h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low">
            <MaterialIcons name="add-a-photo" size={28} color={colors.onSurfaceVariant} />
          </View>
          <Text className="font-sans-semibold text-label-md text-primary">Ajouter un logo</Text>
        </Pressable>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Nom de l'entreprise</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex : TechCamer Solutions"
            placeholderTextColor={colors.outline}
            className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
          />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Secteur d'activité</Text>
          <SelectField placeholder="Choisir un secteur" options={SECTORS} value={sector} onChange={setSector} />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Taille de l'entreprise</Text>
          <SelectField placeholder="Nombre d'employés" options={SIZES} value={size} onChange={setSize} />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Présentez votre entreprise, sa mission, ses valeurs..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-lg border border-outline p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          className="h-14 items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Créer le profil</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
