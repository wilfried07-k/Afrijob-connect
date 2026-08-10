import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import OnboardingSlide from '../../components/ui/OnboardingSlide';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Onboarding1'>;

export default function Onboarding1Screen({ navigation }: Props) {
  return (
    <OnboardingSlide
      step={0}
      totalSteps={4}
      illustrationIcon="school"
      chipIcon="check-circle"
      chipLabel="Prêt pour le succès"
      title="Bienvenue sur EmploiCamer"
      description="L'accès aux meilleures opportunités d'emploi au Cameroun et partout en Afrique."
      primaryLabel="Suivant"
      onPrimaryPress={() => navigation.navigate('Onboarding2')}
      onSkip={() => navigation.navigate('Onboarding4')}
    />
  );
}
