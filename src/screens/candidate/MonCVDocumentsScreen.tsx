import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

export default function MonCVDocumentsScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const profile = authState.profile;

  const cleanName = profile?.full_name ? profile.full_name.trim().replace(/\s+/g, '_') : 'Mon_CV';
  const cvFileName = `CV_${cleanName}.pdf`;

  const sections = [
    {
      icon: 'person' as const,
      label: 'Informations personnelles',
      complete: Boolean(profile?.full_name && profile?.email),
      detail: profile?.full_name ?? 'Non renseigné',
    },
    {
      icon: 'work' as const,
      label: 'Intitulé & Objectif',
      complete: Boolean(profile?.job_title && profile?.summary),
      detail: profile?.job_title ?? 'Non renseigné',
    },
    {
      icon: 'bolt' as const,
      label: 'Compétences clés',
      complete: Boolean(profile?.skills && profile.skills.trim().length > 0),
      detail: profile?.skills ?? 'Ajoutez vos technologies et compétences',
    },
    {
      icon: 'timeline' as const,
      label: 'Expérience professionnelle',
      complete: Boolean(profile?.years_experience !== undefined && profile.years_experience > 0),
      detail: profile?.years_experience ? `${profile.years_experience} an(s) d'expérience` : '0 an',
    },
    {
      icon: 'location-on' as const,
      label: 'Ville / Disponibilité',
      complete: Boolean(profile?.city),
      detail: profile?.city ?? 'Cameroun',
    },
  ];

  const completedCount = sections.filter((s) => s.complete).length;
  const percent = Math.round((completedCount / sections.length) * 100);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mon CV</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* CV Preview card */}
        <View className="items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="h-40 w-28 items-center justify-center rounded-lg border border-outline-variant bg-white shadow-md">
            <MaterialIcons name="description" size={36} color={colors.primary} />
          </View>
          <Text className="font-sans-semibold text-title-lg text-on-surface">{cvFileName}</Text>
          <Text className="font-sans text-label-md text-on-surface-variant">
            Généré automatiquement à partir de votre profil EmploiCamer
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => Alert.alert('Téléchargement', `Le fichier ${cvFileName} a été généré.`)}
              className="flex-row items-center gap-1 rounded-lg bg-primary-container px-md py-2"
            >
              <MaterialIcons name="download" size={16} color={colors.onPrimaryContainer} />
              <Text className="font-sans-semibold text-label-md text-on-primary-container">Télécharger</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('CreationProfilCandidat')}
              className="flex-row items-center gap-1 rounded-lg border border-outline px-md py-2"
            >
              <MaterialIcons name="edit" size={16} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-primary">Modifier mon profil</Text>
            </Pressable>
          </View>
        </View>

        {/* Completion */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Complétude du profil & CV</Text>
            <Text className="font-sans-bold text-label-lg text-primary">{percent}%</Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <View className="h-full rounded-full bg-primary" style={{ width: `${percent}%` as any }} />
          </View>
        </View>

        {/* Sections */}
        <View className="gap-2">
          {sections.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => navigation.navigate('CreationProfilCandidat')}
              className="flex-row items-center gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className={`h-10 w-10 items-center justify-center rounded-full ${s.complete ? 'bg-secondary-container/30' : 'bg-surface-container-high'}`}>
                <MaterialIcons name={s.icon} size={18} color={s.complete ? colors.secondary : colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{s.label}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant" numberOfLines={1}>{s.detail}</Text>
              </View>
              {s.complete ? (
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
              ) : (
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate('CreationProfilCandidat')}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-primary py-md"
        >
          <MaterialIcons name="tune" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Mettre à jour mes informations</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
