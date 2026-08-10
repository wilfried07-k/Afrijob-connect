# AfriJob Connect / EmploiCamer — App React Native

Application mobile de recrutement pour le Cameroun, générée à partir de 170 maquettes Stitch (`stitch_afrijob_connect.zip`).

## Stack technique

- **Expo** (SDK 57) + TypeScript
- **NativeWind** (Tailwind CSS pour React Native) — thème synchronisé avec `DESIGN.md`, mode sombre inclus
- **React Navigation** (native stack + bottom tabs)
- **Plus Jakarta Sans** via `@expo-google-fonts`
- **@expo/vector-icons** (MaterialIcons, FontAwesome pour les logos sociaux)
- **@react-native-community/slider** pour le curseur de fourchette salariale

## Lancer le projet

```bash
npm install
npx expo start
```

Scanne le QR code avec l'app **Expo Go** (iOS/Android), ou appuie sur `w` pour la version web.

## Structure

```
src/
  theme/            → couleurs (light/dark), typographie, colorScheme.ts (bascule de thème)
  navigation/        → RootNavigator + un stack par espace (Candidate/Recruiter/Admin)
                       + navigateurs d'onglets (Candidate/Recruiter/Admin Navigator)
  components/ui/     → Screen, Button, TextField, SelectField, PlaceholderScreen...
  screens/
    onboarding/       → Splash, Onboarding 1-4
    auth/             → Connexion, Inscription, OTP, Choix du type de compte
    candidate/        → Tous les écrans de l'espace candidat (~40 fichiers)
    recruiter/        → Tous les écrans de l'espace recruteur (~40 fichiers)
    admin/            → Tous les écrans de l'espace admin (~25 fichiers)
    shared/           → Écrans utilisés par plusieurs espaces (paramètres, appel
                        vidéo, pages légales, paiement...)
```

## État du projet : 114 écrans convertis

Le projet couvre les **trois espaces applicatifs complets**, chacun avec
navigation de bout en bout, interconnectés entre eux :

### Espace Candidat (~40 écrans)
Onboarding, authentification, tableau de bord, recherche avancée, détail
d'offre, candidature (rapide/spontanée), suivi de candidatures (liste +
détail), messages/discussion, favoris, profil (création + public),
entretiens (préparation, appel vidéo, confirmation), calendrier,
coffre-fort documents + CV dédié, alertes emploi (gestion + création +
détail), comparaison des salaires, coaching carrière IA, rédaction
assistée par IA, conseils carrière, tests de compétences + résultats
détaillés, portfolio, réseau professionnel, avis d'entreprise, parrainage
+ récompenses, notifications, centre de préférences, paramètres, pages
légales/support.

### Espace Recruteur (~40 écrans)
Tableau de bord, gestion des offres, pipeline candidats (Kanban),
statistiques, profil entreprise (+ dirigeant + création + conformité),
publier une offre (assistant 3 étapes), détail candidat, planifier/mener
un entretien vidéo, notes, rapport d'entretien, validation RH, comparaison
de candidats, vérification KYC entreprise, facturation (abonnement +
paramètres + historique + approbation), analytique (globale + par offre),
sponsoring d'offres, tarifs, FAQ, recommandations IA, programme
partenaire, guide de bonnes pratiques, feedback, relances automatiques,
bibliothèque de modèles, export de rapports.

### Espace Admin (~25 écrans)
Tableau de bord, modération des litiges (+ dossier détaillé + arbitrage),
modération KYC, bannissements (+ définitif), paiements, remboursements,
journal d'audit (+ financier), conformité, marketing (dashboard +
campagnes SMS/Email + ciblage + confirmation + suivi de performance +
rapport trimestriel), gestion des accès équipe, rapport de sécurité,
équipes d'agents terrain, supervision, KYC agent terrain + mission
terrain, offres frauduleuses, FAQ sécurité, codes de remise.

### Mode sombre
Implémenté **au niveau du thème global** (variables CSS dans `global.css`
+ `tailwind.config.js`), pas écran par écran — tous les écrans en
bénéficient automatiquement. Sélecteur Clair/Sombre/Système dans
Paramètres du compte (`src/theme/colorScheme.ts`).

**Limite connue** : les couleurs passées en props d'icônes
(`color={colors.primary}`) restent basées sur la palette claire dans les
fichiers où elles sont définies en dehors du corps du composant. Le
contraste reste correct dans la plupart des cas.

## Ce qui n'est pas couvert (volontairement)

- **Doublons de maquettes** déjà couverts par une version unique et
  consolidée (ex. 2e version de "comparaison de candidats", "avis
  d'entreprise", "FAQ recruteurs", "entretiens vidéo" — la logique et le
  design pattern sont identiques, une seule implémentation suffit)
- **Pages hors application mobile** : `documentation_technique_du_projet`,
  `landing_page_marketing_desktop`, `showcase_emploicamer_presentation`,
  `pan_african_professional_system` — supports de présentation/doc, pas
  des écrans de l'app

## Notes techniques

- Toutes les données affichées sont **statiques** (tableaux d'exemple
  dans chaque fichier) — à connecter à une vraie API/backend
- Les appels API réels (connexion, paiement, envoi de messages...) sont
  simulés avec `setTimeout` où c'est pertinent, marqués `// TODO`
- Les logos sociaux utilisent `FontAwesome` (Google/Facebook/Apple)
- Photos de stock des maquettes originales remplacées par des icônes
  (les URLs Google Photos ne conviennent pas pour la production)
