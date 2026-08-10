import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import OnboardingSlide from '../../components/ui/OnboardingSlide';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Onboarding2'>;

export default function Onboarding2Screen({ navigation }: Props) {
  return (
    <OnboardingSlide
      step={1}
      totalSteps={4}
      illustrationIcon="search"
      chipIcon="location-on"
      chipLabel="Douala, Yaoundé..."
      title="Trouvez l'emploi idéal"
      description="Accédez à des milliers d'offres ciblées selon vos compétences et votre localisation au Cameroun."
      primaryLabel="Suivant"
      onPrimaryPress={() => navigation.navigate('Onboarding3')}
      onSkip={() => navigation.navigate('Onboarding4')}
    />
  );
}
