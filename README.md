# ARIELBOT 2.0

Bot WhatsApp bilingue français/anglais basé sur Baileys.

## Installation
1. Installer Node.js 20 ou supérieur.
2. Extraire le ZIP puis ouvrir un terminal dans le dossier.
3. Copier `.env.example` vers `.env` et renseigner `OWNER_NUMBER` (sans `+`).
4. `npm install`
5. `npm start`
6. Scanner le QR affiché avec WhatsApp > Appareils connectés.

Sur un hébergeur, conserver le dossier `auth_info_baileys` entre les redémarrages. Ne jamais partager ce dossier ni le fichier `.env`.

## Commandes de base
`.menu`, `.ping`, `.uptime`, `.owner`, `.stats`, `.setprefix .`, `.setlang fr|en`, `.public`, `.private`.

## Groupes
`.groupinfo`, `.tagall`, `.tagadmin`, `.hidetag`, `.kick @membre`, `.promote @membre`, `.demote @membre`, `.mute`, `.unmute`, `.gclink`, `.antilink on|off`, `.poll Question | choix 1 | choix 2`, `.warn @membre`.

## Outils et divertissement
`.calc 12*(3+2)`, `.time`, `.date`, `.choose choix1 | choix2`, `.coin`, `.dice`, `.quote`, `.animequote`, `.quiz`, `.answer HTML`, `.riddle`, `.joke`, `.profile`.

## État des intégrations
Les commandes nécessitant des API externes (IA, météo, traduction, téléchargement, lecture audio, génération d'images, QR et traitement média) sont identifiées mais restent désactivées tant que leurs fournisseurs/API et dépendances ne sont pas configurés. Le bot ne prétend pas les exécuter.

## Limites de sécurité
Les commandes de perturbation, de plantage et d'expulsion massive de l'archive ont été exclues. Les actions de modération disponibles sont individuelles et vérifient les droits. Le mode par défaut est privé.

## À savoir
Le projet fourni ne contenait pas le point d'entrée `Ariel/bot.js` ni plusieurs modules importés par son gestionnaire. Le dossier `legacy_reference/` conserve des extraits pour référence, pas pour exécution. Les fichiers obfusqués de `CrewX/`, les secrets intégrés et les données de session ne sont pas repris.
