📱  Réservation d'Activités

Cette application mobile développée en React Native (Expo) permet aux utilisateurs de consulter un catalogue d'activités de loisirs (Nautiques, Terrestres, etc.), de filtrer les résultats, de gérer un panier et d'effectuer des réservations.

🛠️ Technologies utilisées

Framework : React Native avec Expo

Navigation : Expo Router (Navigation par onglets / Tabs)

Gestion d'état (State Management) : Context API (AuthContext pour l'authentification, CartContext pour le panier)

Icônes : Phosphor Icons / Expo Vector Icons (Ionicons)

Backend / API : Serveur Laravel PHP local (http://webngo.sio.bts:8002/)

🚀 Installation et lancement

Prérequis

Avoir Node.js installé.

Avoir l'application Expo Go sur son smartphone (ou un émulateur iOS/Android configuré).

Avoir le serveur backend allumé sur le port 8002.

Étapes

Cloner le dépôt et se placer dans le dossier du projet.

Installer les dépendances :

npm install


Lancer le serveur de développement Expo :

npx expo start


Scanner le QR Code affiché dans le terminal avec l'application Expo Go (Android) ou l'appareil photo (iOS).

📋 État du projet (To-Do List)

✅ Ce qui est fait

[x] Catalogue d'activités (activities.tsx) : - Récupération et affichage dynamique des activités depuis l'API.

Carrousel des types d'activités (API).

Filtres fonctionnels (Prix max, Durée max, Durée min).

Modal de détails avec bouton de redirection vers la réservation.

[x] Système de Réservation (createReservation.tsx) :

Formulaire de sélection (Date, Heure, Participants).

Vérification des quotas et disponibilités en temps réel.

Calcul dynamique du prix total.

Auto-sélection de l'activité si redirigé depuis le catalogue.

[x] Gestion du Panier (cart.tsx) :

Ajout de créneaux au panier (via CartContext).

Affichage de la liste des items, du prix total et suppression des items.

[x] Authentification (login.tsx & signup.tsx) :

Formulaires de connexion et d'inscription avec validation des champs.

Intégration du contexte global (AuthContext).

[x] Design System (globalStyles.ts) : Centralisation des couleurs (Calanques Blue, Red, etc.) et des styles pour une UI cohérente.

🚧 Ce qui reste à faire



[ ] Gestion des Quotas

[ ] Gestion des roles (Admin, User)
