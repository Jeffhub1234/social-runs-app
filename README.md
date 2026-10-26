# Social Runs

Social Runs er en React Native-app (Expo) til sociale løbeture. Man kan finde løbeture, der passer til ens eget tempo, oprette sine egne ture og melde sig til andres. Hver tur viser tydeligt tempo, distance, mødested og en social aktivitet bagefter (fx kaffe), så det er nemt at vurdere, om turen passer til én.

**Demovideo:** [youtube.com/shorts/ssJa7kzU8b0](https://youtube.com/shorts/ssJa7kzU8b0?feature=share)

## Funktioner

- **Login og brugeroprettelse** med Firebase Authentication (inkl. "glemt adgangskode"). Login huskes, når appen lukkes.
- **Find runs** viser kommende løbeture (snarest først) som **liste** eller på et **kort**. På kortet er hver tur en nål ved startstedet. Tryk på nålen for at se turen, og tryk igen for at åbne den.
- **Detaljerede filtre** på Find runs: eget tempo (± ét interval), distance, dag (i dag, i morgen, næste 7 dage, weekend), tidspunkt på dagen, afstand fra dig og "kun ture med social aktivitet bagefter". Filtrene gemmes på telefonen med AsyncStorage.
- **Lokation:** Med brugerens tilladelse viser appen "x km fra dig" ved hver tur og kan filtrere efter afstand.
- **Opret løbetur** med faste tempointervaller, distance i km, dato- og tidsvælger, mødested, **start og slut valgt på et kort** og social aktivitet efter løbet.
- **Deltag / forlad løbetur** på detaljeskærmen, hvor ruten også vises på et lille kort. Deltagerantallet opdateres live for alle brugere.
- **Mine runs** og **Tilmeldte** viser henholdsvis de ture, man har oprettet, og dem, man er meldt til.

## Skærme og navigation

| Skærm | Fil | Indhold |
| --- | --- | --- |
| Login / Opret bruger | `screens/AuthScreen.js` | Log ind, opret bruger, nulstil adgangskode |
| Find runs | `screens/HomeScreen.js` | Kommende løbeture som liste eller kort, med filtre |
| Mine runs | `screens/MyRunsScreen.js` | Ture, brugeren selv har oprettet |
| Tilmeldte | `screens/JoinedRunsScreen.js` | Ture, brugeren har meldt sig til |
| Opret | `screens/CreateRunScreen.js` | Formular til en ny løbetur, inkl. start og slut på kort |
| Detaljer | `screens/RunDetailsScreen.js` | Én løbetur, rutekort og knappen "Deltag / Forlad" |

Navigationen bruger en **stack-navigator** (oversigt → detaljer) med en **top-tab-navigator** med de fire faner Find runs, Mine runs, Tilmeldte og Opret (`App.js`).

## Data

- **Firebase Firestore** gemmer løbeture (`runs`) og tilmeldinger (`users/{uid}/joinedRuns`). Appen lytter live på ændringer. En løbetur gemmer bl.a. starttidspunkt (`startsAt`) og start- og slutpunkt (`start`, `end` med bredde- og længdegrad). Reglerne ligger i `firestore.rules`.
- **Firebase Authentication** håndterer brugere. På telefonen gemmes login med **AsyncStorage**.
- **AsyncStorage** husker også brugerens filtre på Find runs.

## Kort og lokation

Kortet bruger `react-native-maps` (Apple Maps på iPhone, Google Maps på Android), og brugerens position hentes med `expo-location`. Begge virker direkte i Expo Go. Siger brugeren nej til lokation, virker appen stadig. Kortet starter så i København, og afstandsfilteret er slået fra.

## Projektstruktur

```
App.js                  Navigation og login-flow
styles.js               Al styling (samlet i én fil)
firebase.js             Forbindelse til Firebase (læser .env)
firebaseAuth*.js        Login-persistens på telefon og web
data/runRepository.js   Læsning og skrivning til Firestore
data/pace.js            Tempointervaller og tempomatch
data/filters.js         Filtrene på Find runs
data/location.js        Lokation, afstand og kortudsnit
screens/                Appens skærme
components/             Genbrugelige komponenter (liste, kort, filterark, kortvælger, valgfelt, dato/tid)
tests/                  Tests af Firestore-reglerne (se tests/README.md)
```

## Firebase

Følg [Firebase-guiden](FIREBASE_SETUP.md) for at oprette databasen og forbinde appen, før du opretter løbeture. Efter opdateringen med kort og filtre skal de nye `firestore.rules` publiceres i Firebase-konsollen.

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
