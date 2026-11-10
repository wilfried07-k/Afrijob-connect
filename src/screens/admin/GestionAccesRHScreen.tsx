import { useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void } };

type Role = 'Super Admin' | 'Modérateur' | 'Support' | 'Agent Terrain';

type TeamMember = {
  id: string;
  name: string;
  role: Role;
  email: string;
  active: boolean;
};

const ROLE_STYLE: Record<Role, { bg: string; text: string }> = {
  'Super Admin': { bg: 'bg-error/10', text: 'text-error' },
  Modérateur: { bg: 'bg-primary/10', text: 'text-primary' },
  Support: { bg: 'bg-secondary/10', text: 'text-secondary' },
  'Agent Terrain': { bg: 'bg-tertiary/10', text: 'text-tertiary' },
};

export default function GestionAccesRHScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const currentAdmin = authState.profile;

  const initialMembers = useMemo<TeamMember[]>(() => {
    const list: TeamMember[] = [];
    if (currentAdmin?.full_name) {
      list.push({
        id: 'current-admin',
        name: `${currentAdmin.full_name} (Vous)`,
        role: 'Super Admin',
        email: currentAdmin.email,
        active: true,
      });
    }
    list.push(
      { id: '2', name: 'Paul Etoundi', role: 'Modérateur', email: 'paul.e@emploicamer.cm', active: true },
      { id: '3', name: 'Chantal Biya', role: 'Support', email: 'chantal.b@emploicamer.cm', active: true },
      { id: '4', name: 'Roger Fokou', role: 'Agent Terrain', email: 'roger.f@emploicamer.cm', active: false }
    );
    return list;
  }, [currentAdmin]);

  const [members, setMembers] = useState(initialMembers);

  const toggle = (id: string) => {
    if (id === 'current-admin') {
      Alert.alert('Action impossible', 'Vous ne pouvez pas désactiver votre propre compte administrateur.');
      return;
    }
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Équipe & Accès</Text>
        </View>
        <Pressable
          onPress={() => Alert.alert('Inviter un collaborateur', 'Formulaire d’invitation d’un nouveau modérateur ou gestionnaire RH.')}
          className="h-9 w-9 items-center justify-center rounded-full bg-primary"
        >
          <MaterialIcons name="person-add" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => {
          const style = ROLE_STYLE[item.role];
          return (
            <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
                <Text className="font-sans-bold text-label-lg text-primary">{item.name[0]}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-title-md text-on-surface">{item.name}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">{item.email}</Text>
                <View className={`mt-1 self-start rounded-full px-2 py-0.5 ${style.bg}`}>
                  <Text className={`text-[10px] font-sans-bold ${style.text}`}>{item.role}</Text>
                </View>
              </View>
              <Switch
                value={item.active}
                onValueChange={() => toggle(item.id)}
                trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
