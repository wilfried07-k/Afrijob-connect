import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  navigation: { goBack: () => void };
  route: { params?: { name?: string; role?: string; asRecruiter?: boolean } };
};

/**
 * Écran d'appel vidéo générique, utilisé à la fois côté Candidat (rejoindre
 * un entretien) et côté Recruteur (mener un entretien). `asRecruiter`
 * détermine simplement le libellé affiché pour l'autre participant.
 */
export default function VideoconferenceEntretienScreen({ navigation, route }: Props) {
  const otherName = route.params?.name ?? 'Amandine N.';
  const role = route.params?.role ?? 'Designer Senior UX/UI';
  const asRecruiter = route.params?.asRecruiter ?? false;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');

  return (
    <View className="flex-1 bg-[#0a0a0c]">
      {/* Main video area (placeholder for the other participant) */}
      <View className="flex-1 items-center justify-center">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-white/10">
          <Text className="font-sans-bold text-display-lg text-white">
            {otherName.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
      </View>

      {/* Top header overlay */}
      <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-container-margin pt-14">
        <View className="flex-row items-center gap-2 rounded-xl bg-black/40 px-md py-2">
          <View className="h-2 w-2 rounded-full bg-error" />
          <Text className="font-sans-semibold text-label-md text-white">
            En direct • {mm}:{ss}
          </Text>
        </View>
        <View className="rounded-xl bg-black/40 px-md py-2">
          <Text className="font-sans-semibold text-label-md text-white">
            {asRecruiter ? otherName : role}
          </Text>
        </View>
      </View>

      {/* Self PIP */}
      <View className="absolute bottom-40 right-container-margin h-32 w-24 items-center justify-center rounded-2xl border-2 border-white/30 bg-surface-container-high">
        {camOn ? (
          <MaterialIcons name="person" size={32} color="rgba(255,255,255,0.5)" />
        ) : (
          <MaterialIcons name="videocam-off" size={24} color="rgba(255,255,255,0.5)" />
        )}
        <Text className="absolute bottom-1 rounded bg-black/50 px-1 text-[9px] font-sans-bold text-white">
          Vous
        </Text>
      </View>

      {/* Notes/info drawer (recruiter only) */}
      {drawerOpen && asRecruiter && (
        <View className="absolute bottom-24 left-container-margin right-container-margin rounded-2xl bg-surface p-lg shadow-2xl">
          <Text className="mb-2 font-sans-semibold text-title-lg text-on-surface">Poste concerné</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">{role}</Text>
          <Text className="mt-md font-sans text-label-md text-outline">
            Astuce : ouvrez l'écran "Notes d'entretien" pour prendre des notes structurées pendant l'appel.
          </Text>
        </View>
      )}

      {/* Bottom control bar */}
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-md">
        <ControlButton
          active={!micOn}
          icon={micOn ? 'mic' : 'mic-off'}
          onPress={() => setMicOn((v) => !v)}
        />
        <ControlButton
          active={!camOn}
          icon={camOn ? 'videocam' : 'videocam-off'}
          onPress={() => setCamOn((v) => !v)}
        />
        {asRecruiter && (
          <ControlButton
            active={drawerOpen}
            icon="description"
            onPress={() => setDrawerOpen((v) => !v)}
          />
        )}
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-14 w-14 items-center justify-center rounded-full bg-error shadow-lg"
        >
          <MaterialIcons name="call-end" size={26} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  active,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-14 w-14 items-center justify-center rounded-full ${active ? 'bg-error-container' : 'bg-white/15'}`}
    >
      <MaterialIcons name={icon} size={24} color={active ? '#B3261E' : '#ffffff'} />
    </Pressable>
  );
}
