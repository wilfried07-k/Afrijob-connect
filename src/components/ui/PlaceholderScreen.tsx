import { Text, View } from 'react-native';
import Screen from './Screen';
import Button from './Button';

type Props = {
  title: string;
  section: string;
  onNext?: () => void;
  nextLabel?: string;
};

/**
 * Écran temporaire affiché tant que la maquette correspondante n'a pas
 * encore été convertie depuis /stitch_afrijob_connect. Remplace-le par le
 * vrai écran au fur et à mesure — même nom de fichier, même emplacement.
 */
export default function PlaceholderScreen({ title, section, onNext, nextLabel = 'Continuer' }: Props) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-md px-container-margin">
        <Text className="font-sans-semibold text-xs uppercase tracking-widest text-outline">
          {section}
        </Text>
        <Text className="text-center font-sans-bold text-headline-lg text-on-surface">{title}</Text>
        <Text className="text-center font-sans text-body-md text-on-surface-variant">
          Écran à convertir depuis la maquette Stitch correspondante.
        </Text>
        {onNext && (
          <View className="mt-lg w-full">
            <Button label={nextLabel} onPress={onNext} />
          </View>
        )}
      </View>
    </Screen>
  );
}
