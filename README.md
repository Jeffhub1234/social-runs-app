# Social Runs

Social Runs er en React Native-app (Expo) til sociale løbeture. Man kan finde løbeture, der passer til ens eget tempo, oprette sine egne ture og melde sig til andres. Hver tur viser tydeligt tempo, distance, mødested og en social aktivitet bagefter (fx kaffe), så det er nemt at vurdere, om turen passer til én.

**Demovideo:** [youtube.com/shorts/ssJa7kzU8b0](https://youtube.com/shorts/ssJa7kzU8b0?feature=share)

## Funktioner

- **Login og brugeroprettelse** med Firebase Authentication (inkl. "glemt adgangskode"). Login huskes, når appen lukkes.
- **Find runs** med **søgning** (navn, sted, arrangør, beskrivelse) og **tempofilter**: Brugeren vælger sit eget tempo og ser ture i det tempo og ét interval hurtigere eller langsommere. Det valgte tempo gemmes på telefonen med AsyncStorage.
- **Opret løbetur** med faste tempointervaller, dato- og tidsvælger, lokation og social aktivitet efter løbet.
- **Deltag / forlad løbetur** på detaljeskærmen. Deltagerantallet opdateres live for alle brugere.
- **Mine runs** og **Tilmeldte** viser henholdsvis de ture, man har oprettet, og dem, man er meldt til.

## Skærme og navigation

| Skærm | Fil | Indhold |
| --- | --- | --- |
| Login / Opret bruger | `screens/AuthScreen.js` | Log ind, opret bruger, nulstil adgangskode |
| Find runs | `screens/HomeScreen.js` | Alle løbeture med søgning og tempofilter |
| Mine runs | `screens/MyRunsScreen.js` | Ture, brugeren selv har oprettet |
| Tilmeldte | `screens/JoinedRunsScreen.js` | Ture, brugeren har meldt sig til |
| Opret | `screens/CreateRunScreen.js` | Formular til en ny løbetur |
| Detaljer | `screens/RunDetailsScreen.js` | Én løbetur og knappen "Deltag / Forlad" |

Navigationen bruger en **stack-navigator** (oversigt → detaljer) med en **top-tab-navigator** med de fire faner Find runs, Mine runs, Tilmeldte og Opret (`App.js`).

## Data

- **Firebase Firestore** gemmer løbeture (`runs`) og tilmeldinger (`users/{uid}/joinedRuns`). Appen lytter live på ændringer. Reglerne ligger i `firestore.rules`.
- **Firebase Authentication** håndterer brugere. På telefonen gemmes login med **AsyncStorage**.
- **AsyncStorage** husker også brugerens valgte tempo i filteret på Find runs.

## Projektstruktur

```
App.js                  Navigation og login-flow
styles.js               Al styling (samlet i én fil)
firebase.js             Forbindelse til Firebase (læser .env)
firebaseAuth*.js        Login-persistens på telefon og web
data/runRepository.js   Læsning og skrivning til Firestore
data/pace.js            Tempointervaller og tempofilter
screens/                Appens skærme
components/             Genbrugelige komponenter (liste, valgfelt, dato/tid)
tests/                  Tests af Firestore-reglerne (se tests/README.md)
```

## Firebase

Følg [Firebase-guiden](FIREBASE_SETUP.md) for at oprette databasen og forbinde appen, før du opretter løbeture.

## Start projektet

Projektet bruger Expo SDK 58 og kræver en Expo Go-version, der understøtter SDK 58.

```sh
npm install
npx expo start --clear
```

Hvis Expo allerede kører under en opgradering, stop serveren med `Ctrl+C` og start den igen med kommandoen ovenfor. Scan derefter QR-koden i Expo Go.

## På en anden computer med GitHub Desktop

1. Installer GitHub Desktop og Node.js 22 (mindst version 22.13).
2. Log ind i GitHub Desktop, vælg **File → Clone repository**, og klon dette repository.
3. Kopiér `.env.example` til `.env`, og udfyld værdierne fra dit eksisterende Firebase-projekt; se [Firebase-guiden](FIREBASE_SETUP.md). Brug samme Firebase-projekt som på den første computer. `.env` gemmes kun lokalt.
4. Åbn terminalen i projektmappen, og kør startkommandoerne ovenfor: `npm install` og `npx expo start --clear`.

Brug **Commit to main** og **Push origin** i GitHub Desktop, når du vil gemme ændringer på GitHub. På den anden computer henter du dem med **Fetch origin** og derefter **Pull origin**, før du arbejder videre.

## Tests

Firestore-reglerne testes mod Firebase-emulatoren. Se [tests/README.md](tests/README.md).
