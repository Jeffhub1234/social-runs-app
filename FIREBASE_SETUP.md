# Firebase til Social Runs

Appen gemmer nye løbeture i Cloud Firestore og viser ændringer løbende. De gamle eksempeldata i `data/runs.js` indlæses ikke længere. Du starter med en tom oversigt.

## Har du allerede Firebase opsat?

For at bruge den nye version med brugere:

1. Åbn **Authentication → Sign-in method → Email/Password**, aktiver almindelig e-mail/adgangskode og gem. E-mail-link er ikke nødvendigt.
2. Åbn **Firestore Database → Rules**, erstat reglerne med hele den opdaterede `firestore.rules`, og tryk **Publish**. De nye regler kræver en rigtig konto og tillader tilmelding/afmelding med korrekt deltagerantal.
3. Genstart Expo med `npx.cmd expo start --clear`. Bruger du din egen udviklingsbuild, skal den bygges igen efter installation af AsyncStorage og PagerView; Expo Go inkluderer modulerne.
4. Opret en konto med navn, e-mail og adgangskode i appen.

Din `.env` kan fortsat bruges. Gamle ture bevares i oversigten, men deres arrangør-id tilhører de tidligere anonyme brugere og bliver ikke automatisk overført til din nye konto. Gamle lokale tilmeldinger var ikke gemt og skal foretages igen.

## 1. Opret projektet

1. Åbn https://console.firebase.google.com/ og log ind med din Google-konto.
2. Vælg at oprette et projekt, og giv det et navn, fx `Social Runs`.
3. Google Analytics er ikke nødvendigt for denne app og kan fravælges.
4. På projektets oversigt vælger du web-ikonet **</>** for at registrere en app. Expo bruger Firebase JavaScript SDK, så du skal registrere en web-app, også når appen kører på telefonen.
5. Kald appen `Social Runs App`. Firebase Hosting er ikke nødvendigt.
6. Gem den viste `firebaseConfig`. Du skal ikke kopiere script-tags ind i App.js.

## 2. Opret databasen

1. Find **Build → Firestore Database** og vælg **Create database**.
2. Vælg Standard edition, hvis du bliver spurgt, og vælg en europæisk placering, der passer til dine brugere. Placeringen kan ikke senere ændres for databasen.
3. Vælg produktionsregler frem for testtilstand.
4. Åbn fanen **Rules**, erstat indholdet med hele indholdet af `firestore.rules` fra dette projekt, og tryk **Publish**.

Reglerne tillader læsning og oprettelse for brugere med en rigtig konto; anonyme brugere har ikke adgang. Reglerne kontrollerer felter og arrangørens bruger-id. Deltagerantal kan kun ændres sammen med brugerens egen tilmelding/afmelding. Redigering af turens øvrige oplysninger og sletning er ikke åbnet. Samlingen `runs` oprettes automatisk, når du gemmer den første løbetur.

## 3. Slå e-mail-login til

1. Åbn **Build → Authentication**, og vælg **Get started**, hvis nødvendigt.
2. Under **Sign-in method** aktiverer du **Email/Password** og gemmer. Du behøver ikke aktivere e-mail-link eller Anonymous.

Appen har login, oprettelse af konto med navn og glemt adgangskode. Navn og e-mail gemmes i Firebase Authentication, hvor du kan se konti under **Users**. Adgangskoder håndteres af Firebase Authentication. Login huskes mellem genstarter på telefonen og i browseren, indtil brugeren logger ud.

## 4. Forbind appen

Opret en fil med navnet `.env` i samme mappe som `App.js`. Kopiér indholdet af `.env.example` ind i filen, og udfyld værdierne fra `firebaseConfig`:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=værdien-fra-apiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=værdien-fra-authDomain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=værdien-fra-projectId
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=værdien-fra-storageBucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=værdien-fra-messagingSenderId
EXPO_PUBLIC_FIREBASE_APP_ID=værdien-fra-appId
```

Disse er web-appens konfigurationsværdier og bliver inkluderet i appen. Databaseadgangen styres af Firestore-reglerne. Brug aldrig en servicekonto eller privat nøgle her.

## 5. Start og afprøv

Kør i projektets terminal på Windows:

```powershell
npm.cmd install
npx.cmd expo start --clear
```

Åbn appen i Expo Go eller din udviklingsbuild. Opret en konto, og opret en løbetur. Kontrollér, at turen vises under **Mine runs**, og dokumentet under **Firestore Database → Data → runs**. Genindlæs appen: brugeren og løbeturen skal stadig være der.

Log ud, opret en anden konto, og tilmeld den til første brugers tur. Den skal nu vises under **Tilmeldte runs**, og deltagerantallet skal stige fra 1 til 2. Genstart eller log ind på en anden enhed med samme konto: tilmeldingen skal stadig være der. Afmeld turen, og kontrollér, at den forsvinder fra **Tilmeldte runs**, og antallet igen er 1. Arrangøren tæller som første deltager og kan ikke afmelde sin egen tur.

Hvis appen melder fejl, kontrollér `.env`, genstart Expo, kontrollér at Email/Password er aktiveret, og at de opdaterede regler er publiceret i det samme projekt. Tilmelding og afmelding kræver internet. Ved manglende internet kan oprettelse blive stående på “Gemmer…” indtil forbindelsen er tilbage.

## Hvad denne version omfatter

Alle appens løbeskærme kræver login. Fanerne **Find runs**, **Mine runs**, **Tilmeldte** og **Opret** ligger fast øverst. **Mine runs** viser ture med dit arrangør-id. **Tilmeldte runs** viser de andre brugeres ture, du aktivt har tilmeldt dig. Tilmeldinger gemmes i `users/{bruger-id}/joinedRuns/{tur-id}`; kun brugeren selv kan læse sine tilmeldinger. Der er ikke brug for et separat profil-dokument i Firestore, da kontoen og navnet ligger i Authentication.

Oprettelse, oversigter og tilmeldinger bruger Firestore. Formularen bruger kalender og tidsvælger samt tempovalg. Distance og aktivitet efter løbet indtastes som fri tekst. Dato, distance og tempo gemmes fortsat som tekst, så de fungerer med eksisterende løbeture og Firestore-regler.

Officiel dokumentation: [Firebase-opsætning](https://firebase.google.com/docs/web/setup), [e-mail-login](https://firebase.google.com/docs/auth/web/password-auth), [gem data](https://firebase.google.com/docs/firestore/manage-data/add-data), [liveopdateringer](https://firebase.google.com/docs/firestore/query-data/listen).
