import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AccountType, AdminUserItem } from '../../lib/api';
import { createAdminUser, deleteAdminUser, listAdminUsers, updateAdminUser } from '../../lib/api';
import type { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'GestionUtilisateurs'>;
type RoleFilter = 'all' | AccountType | 'admin';

export default function GestionUtilisateursScreen({ navigation }: Props) {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('candidate');
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listAdminUsers({ search: search.trim() || undefined, account_type: roleFilter === 'all' ? undefined : roleFilter });
      setUsers(result);
      setError('');
    } catch (err) {
      setError((err as Error).message || 'Impossible de charger les comptes.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setFullName(''); setEmail(''); setPassword(''); setAccountType('candidate');
    setModalVisible(true);
  };

  const openEdit = (user: AdminUserItem) => {
    if (user.account_type === 'admin') return;
    setEditingUser(user);
    setFullName(user.full_name); setEmail(user.email); setPassword('');
    setAccountType(user.account_type);
    setModalVisible(true);
  };

  const saveUser = async () => {
    if (!fullName.trim() || (!editingUser && (!email.trim() || password.length < 8))) {
      Alert.alert('Informations requises', 'Indiquez le nom, l’adresse email et un mot de passe de 8 caractères minimum pour un nouveau compte.');
      return;
    }
    setSaving(true);
    try {
      if (editingUser) await updateAdminUser(editingUser.id, { full_name: fullName.trim(), account_type: accountType });
      else await createAdminUser({ full_name: fullName.trim(), email: email.trim(), password, account_type: accountType });
      setModalVisible(false);
      await loadUsers();
    } catch (err) {
      Alert.alert('Enregistrement impossible', (err as Error).message || 'Vérifiez les informations.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (user: AdminUserItem) => Alert.alert('Supprimer ce compte ?', `${user.full_name} · ${user.email}`, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => {
      try {
        await deleteAdminUser(user.id);
        setUsers((current) => current.filter((item) => item.id !== user.id));
      } catch (err) {
        Alert.alert('Suppression impossible', (err as Error).message || 'Suspendez le compte pour préserver son historique.');
      }
    } },
  ]);

  const roles: { value: AccountType; label: string }[] = [
    { value: 'candidate', label: 'Candidat' },
    { value: 'recruiter', label: 'Recruteur' },
  ];
  const filters: { value: RoleFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'candidate', label: 'Candidats' },
    { value: 'recruiter', label: 'Recruteurs' },
    { value: 'admin', label: 'Admins' },
  ];

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="flex-1 font-sans-bold text-headline-md text-primary">Utilisateurs</Text>
        <Pressable onPress={openCreate} accessibilityLabel="Créer un utilisateur" className="h-10 w-10 items-center justify-center rounded-full bg-primary"><MaterialIcons name="person-add" size={19} color="#fff" /></Pressable>
      </View>
      <View className="gap-md px-container-margin pb-md">
        <View className="h-12 flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-md"><MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} /><TextInput value={search} onChangeText={setSearch} placeholder="Nom ou adresse email" placeholderTextColor={colors.outline} className="ml-2 flex-1 font-sans text-body-md text-on-surface" /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{filters.map((filter) => <Pressable key={filter.value} onPress={() => setRoleFilter(filter.value)} className={`rounded-full border px-4 py-2 ${roleFilter === filter.value ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-semibold text-label-md ${roleFilter === filter.value ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{filter.label}</Text></Pressable>)}</ScrollView>
      </View>
      {loading && !users.length ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : <ScrollView contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 32 }}>
        {error ? <View className="gap-2"><Text className="font-sans text-body-md text-error">{error}</Text><Pressable onPress={() => void loadUsers()}><Text className="font-sans-semibold text-label-lg text-primary">Réessayer</Text></Pressable></View> : null}
        <Text className="font-sans text-label-md text-on-surface-variant">{users.length} compte{users.length === 1 ? '' : 's'} affiché{users.length === 1 ? '' : 's'} · la présence en ligne n’est pas suivie</Text>
        {users.map((user) => <View key={user.id} className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10"><MaterialIcons name={user.account_type === 'admin' ? 'security' : user.account_type === 'recruiter' ? 'business' : 'person'} size={20} color={colors.primary} /></View>
          <View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{user.full_name}</Text><Text className="font-sans text-label-md text-on-surface-variant">{user.email}</Text><Text className="font-sans text-label-md text-primary">{user.account_type === 'candidate' ? 'Candidat' : user.account_type === 'recruiter' ? 'Recruteur' : 'Administrateur'}</Text></View>
          {user.account_type !== 'admin' ? <><Pressable onPress={() => openEdit(user)} hitSlop={8}><MaterialIcons name="edit" size={20} color={colors.primary} /></Pressable><Pressable onPress={() => confirmDelete(user)} hitSlop={8}><MaterialIcons name="delete-outline" size={21} color={colors.error} /></Pressable></> : null}
        </View>)}
        {!loading && !error && !users.length ? <Text className="py-xl text-center font-sans text-body-md text-on-surface-variant">Aucun compte correspondant.</Text> : null}
      </ScrollView>}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40"><View className="gap-md rounded-t-2xl bg-surface-container-lowest p-lg">
          <Text className="font-sans-bold text-title-lg text-on-surface">{editingUser ? 'Modifier le compte' : 'Créer un compte'}</Text>
          <TextInput value={fullName} onChangeText={setFullName} placeholder="Nom complet" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant px-md font-sans text-body-md text-on-surface" />
          {!editingUser ? <><TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Adresse email" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant px-md font-sans text-body-md text-on-surface" /><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe temporaire (8 caractères minimum)" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant px-md font-sans text-body-md text-on-surface" /></> : null}
          <View className="flex-row gap-2">{roles.map((role) => <Pressable key={role.value} onPress={() => setAccountType(role.value)} className={`flex-1 items-center rounded-lg border py-3 ${accountType === role.value ? 'border-primary bg-primary-container' : 'border-outline-variant'}`}><Text className={`font-sans-semibold text-label-md ${accountType === role.value ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{role.label}</Text></Pressable>)}</View>
          <Pressable disabled={saving} onPress={() => void saveUser()} className="h-12 items-center justify-center rounded-lg bg-primary">{saving ? <ActivityIndicator color="#fff" /> : <Text className="font-sans-semibold text-label-lg text-on-primary">Enregistrer</Text>}</Pressable>
          <Pressable onPress={() => setModalVisible(false)} className="items-center py-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Annuler</Text></Pressable>
        </View></View>
      </Modal>
    </Screen>
  );
}