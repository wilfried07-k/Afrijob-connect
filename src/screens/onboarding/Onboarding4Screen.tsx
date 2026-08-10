import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import OnboardingSlide from '../../components/ui/OnboardingSlide';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Onboarding4'>;

export default function Onboarding4Screen({ navigation }: Props) {
  return (
    <OnboardingSlide
      step={3}
      totalSteps={4}
      illustrationIcon="groups"
      chipIcon="celebration"
      chipLabel="+50 000 membres"
      title="Prêt à commencer ?"
      description="Rejoignez la plus grande communauté de professionnels au Cameroun dès aujourd'hui."
      primaryLabel="Commencer"
      onPrimaryPress={() => (navigation.getParent() as any)?.navigate('Auth', { screen: 'Inscription' })}
      secondaryLabel="Se connecter"
      onSecondaryPress={() => (navigation.getParent() as any)?.navigate('Auth', { screen: 'Connexion' })}
    />
  );
}
