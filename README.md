# Frontend de l'Application de Gestion de Magasin

Ce frontend est conçu pour être utilisé avec l'API NestJS pour la gestion de magasin, fournissant une interface utilisateur conviviale pour interagir avec les fonctionnalités de gestion des articles, des caisses et des transactions.

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.
3. Exécutez `npm install` pour installer les dépendances.
4. Assurez-vous que le backend de l'application est en cours d'exécution et que l'URL de l'API est correctement configurée dans le fichier d'environnement (`API_URL`).

   Assurez-vous également de configurer les paramètres de connexion appropriés dans le fichier d'environnement pour les utilisateurs, en particulier pour les variables d'environnement telles que `DATABASE_URL`.

5. Exécutez `npm run dev` pour démarrer le serveur de développement.

## Fonctionnalités Principales

### Tableau de Bord

- Affiche un résumé des données clés de l'application, telles que le nombre total d'articles, le montant du solde de caisse, etc.

### Page des Articles

- Affiche une liste des articles disponibles.
- Permet le réapprovisionnement du stock des articles existants.

### Page d'Ajout d'un Article

- Permet aux utilisateurs d'ajouter de nouveaux articles à la base de données avec toutes les informations nécessaires telles que le nom, le prix de vente, la quantité en stock, etc.

### Page de Vente des Articles

- Permet aux utilisateurs de vendre des articles en sélectionnant l'article à vendre, en spécifiant la quantité et le client, puis en validant la transaction.
- Permet aux utilisateurs d'export la facture en pdf.

### Page de Caisse

- Affiche une liste des transactions effectuées, le montant du solde de caisse.
- Permet la recherche et le filtrage des transactions par date.
- Permet l'export des transactions par date.

### Page d'Opération dans la Caisse

- Permet aux utilisateurs d'effectuer des opérations de dépôt ou de retrait dans la caisse en spécifiant le montant et une note optionnelle.

## Utilisation

L'interface utilisateur fournit une navigation intuitive pour accéder à chaque fonctionnalité de l'application. Voici les principales pages accessibles :

- `/`: Accède au tableau de bord de l'application.
- `/articles`: Affiche la liste des articles avec des fonctionnalités de réapprovisionnement de stock et d'ajout d'articles.
- `/articles/sell`: Permet la vente des articles en spécifiant les détails de la transaction.
- `/cashdesk`: Affiche la liste des transactions associées à une caisse spécifique.
- `/cashdesk/operation`: Permet d'effectuer des opérations de dépôt ou de retrait dans la caisse.

Pour plus d'informations sur l'utilisation de chaque fonctionnalité ou pour obtenir de l'aide, veuillez contacter le support technique.
