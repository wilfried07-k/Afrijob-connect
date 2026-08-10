import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import OnboardingSlide from '../../components/ui/OnboardingSlide';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Onboarding3'>;

export default function Onboarding3Screen({ navigation }: Props) {
  return (
    <OnboardingSlide
      step={2}
      totalSteps={4}
      illustrationIcon="description"
      chipIcon="star"
      chipLabel="CV en 5 min"
      title="Boostez votre visibilité"
      description="Créez un CV professionnel en quelques minutes et attirez l'attention des meilleurs recruteurs."
      primaryLabel="Suivant"
      onPrimaryPress={() => navigation.navigate('Onboarding4')}
      onSkip={() => navigation.navigate('Onboarding4')}
    />
  );
}
