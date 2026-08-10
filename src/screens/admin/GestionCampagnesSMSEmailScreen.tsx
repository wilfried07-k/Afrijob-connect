import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

type Campaign = { id: string; name: string; channel: 'SMS' | 'Email'; audience: string; status: 'Envoyée' | 'Planifiée' | 'Brouillon' };

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Relance candidats inactifs', channel: 'SMS', audience: '12 400 destinataires', status: 'Envoyée' },
  { id: '2', name: 'Nouveautés Premium recruteurs', channel: 'Email', audience: '850 entreprises', status: 'Planifiée' },
  { id: '3', name: 'Offre spéciale rentrée', channel: 'Email', audience: '30 000 candidats', status: 'Brouillon' },
];

const STATUS_STYLE: Record<Campaign['status'], { bg: string; text: string }> = {
  Envoyée: { bg: 'bg-secondary/10', text: 'text-secondary' },
  Planifiée: { bg: 'bg-primary/10', text: 'text-primary' },
  Brouillon: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

export default function GestionCampagnesSMSEmailScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Campagnes SMS/Email</Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={CAMPAIGNS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status];
          return (
            <Pressable
              onPress={() => navigation.navigate('CiblageCampagnePush', { campaignName: item.name })}
              className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name={item.channel === 'SMS' ? 'sms' : 'mark-email-read'} size={18} color={colors.primary} />
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{item.name}</Text>
                </View>
                <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
                  <Text className={`text-[10px] font-sans-bold ${style.text}`}>{item.status}</Text>
                </View>
              </View>
              <Text className="font-sans text-label-md text-on-surface-variant">{item.audience}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
