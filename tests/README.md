# Firebase-tests

Testene kontrollerer Firestore-reglerne og den rigtige kode i `data/runRepository.js`: login, private tilmeldinger, arrangør, atomiske deltagerantal, gentagne tryk og samtidige tilmeldinger/afmeldinger.

De bruger kun Firestore-emulatoren på `127.0.0.1:8088` med projektet `demo-social-runs-tests`. Firebase-konfigurationen og `.env` bliver ikke læst. Ingen produktionsdatabase bliver kontaktet eller ændret. Firebase-importen i repository-koden erstattes i testen med de isolerede emulatorbrugere.

## Opsætning

Kræver Node.js 20+ og Java 21+. Kør fra projektmappen i PowerShell:

```powershell
npm.cmd install --prefix .expo/rules-tests --cache .expo/rules-tests/npm-cache --no-audit --no-fund --legacy-peer-deps firebase-tools@15.33.0 @firebase/rules-unit-testing@5.0.2 firebase@12.10.0
```

Afhængigheder, emulator, logs og lokal CLI-konfiguration placeres i `.expo/rules-tests`, som er ignoreret af Git. Appens `package.json` ændres ikke. Den første testkørsel downloader Firestore-emulatoren, hvis den mangler.

På denne computer ligger en separat Java 21-runtime i `.expo/rules-tests/java`; testscriptet bruger den automatisk. På andre computere skal Java 21+ være på `PATH` (eller læg en separat runtime med `bin/java.exe` under `.expo/rules-tests/java`).

## Kørsel

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/run-firebase-tests.ps1
```

Scriptet kopierer de aktuelle regler ind i emulatorens arbejdsmappe, starter emulatoren, kører `tests/firebase-rules.test.mjs` og stopper emulatoren. Det returnerer en fejlkode, hvis en test fejler. Port 8088 samt emulatorens hjælpeporte 4400, 4500 og 9150 skal være ledige.

Forventet resultat: 8 tests bestået. `PERMISSION_DENIED`-linjer er forventede, når testen bekræfter, at ugyldige handlinger afvises.
