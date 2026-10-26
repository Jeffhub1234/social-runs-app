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

## Demovideo

Demovideo: youtube.com/shorts/ssJa7kzU8b0?feature=share
