# Frontend ControleMenageSNCF

Interface React + Vite de l'application interne SNCF de controle de nettoyage.

## Perimetre

Le frontend couvre :

- la connexion utilisateur
- l'acceptation des conditions d'utilisation
- l'acces a la Power Apps de controle
- la navigation selon le role utilisateur
- les ecrans d'administration des habilitations
- l'acces administrateur au rapport Power BI

## Stack technique

- React 19
- React Router
- Vite
- TypeScript
- CSS global maison dans `src/index.css`

## Structure utile

```text
src/
  layouts/
    PageLayout.tsx
  pages/
    login.tsx
    reset-password.tsx
    update-password.tsx
    mainPage.tsx
    statistics.tsx
    addAuthorization.tsx
    manageAuthorization.tsx
  App.tsx
  index.css
```

## Routes

- `/login`
- `/reset-password`
- `/update-password`
- `/mainPage`
- `/statistics` : admin uniquement
- `/addAuthorization` : admin uniquement
- `/manageAuthorization` : admin uniquement

## Configuration

Fichier attendu :

- `.env`

Exemple :

```env
VITE_API_URL=http://localhost:3000
```

Pour un test sur telephone, remplacer `localhost` par l'IP locale du Mac.

## Installation

```bash
npm install
```

## Lancement

### Sur le poste local

```bash
npm run dev
```

Application disponible sur :

```text
http://localhost:5173/login
```

### Sur le reseau local

```bash
npm run dev -- --host 0.0.0.0
```

Puis ouvrir depuis un autre appareil :

```text
http://IP_DU_MAC:5173/login
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Particularites UX

- le layout centralise maintenant le controle d'acces des pages protegees
- le menu lateral adapte les entrees visibles selon le role
- Power Apps et Power BI gardent toujours un bouton d'ouverture externe
- hors `localhost`, l'application affiche un fallback propre si l'embed Microsoft refuse l'iframe

## Validation

Derniere verification effectuee :

```bash
npm run lint
npm run build
```
