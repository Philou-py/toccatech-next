# Description fonctionnelle

Toccatech est une application Internet à l'usage des musiciens qui souhaitent disposer d'une partothèque numérique et avoir accès à des renseignements sur les principaux compositeurs de la musique classique. Elle est accessible via le lien [toccatech.com](https://toccatech.com). Le contenu public de l'application présente des informations sur les compositeurs, regroupées dans une encyclopédie musicale. Le contenu personnalisé devient accessible après la création d'un compte. L'utilisateur peut référencer les œuvres musicales de son répertoire et a la possibilité de déposer sur le serveur de l'application une copie numérique de ses partitions. Celle-ci restera à l'usage strictement personnel de l'utilisateur dans le respect du droit à la copie.

> Note: Le code de ce dépôt Git correspond à une version totalement réécrite de l'ancienne version de Toccatech (dont le code est basé sur le framework web python [Django](https://www.djangoproject.com/) côté serveur et [Materialize](https://materializecss.com/) comme librairie CSS). Le code, le design et les fonctionnalités sont différents, mais l'esprit de la boîte à outil musicale à destination des musiciens a été conservé. Il est encore disponible en utilisant l'adresse IP à l'adresse suivante : [89.159.201.89](http://89.159.201.89/), mais comporte de nombreux bugs et les fonctionnalités sont loin d'être complètes.

Je vais à présent vous présenter les fonctionnalités de chaque page de l'application Toccatech.

## Page d'accueil

Tout d'abord, la page d'accueil Toccatech présente les différents avantages d'utiliser cette application, c'est-à-dire ce qu'elle peut apporter à un musicien. La dernière image, présentant la grande salle de l'Arsenal de Metz, est cliquable et redirige vers le site internet de l'Arsenal pour en savoir plus sur cette salle.

Le bouton `C'est parti` présent en haut de la page fait dérouler la page jusqu'à un formulaire de connexion ou d'inscription si l'utilisateur n'est pas déjà connecté. Celui-ci n'est visible seulement si l'utilisateur n'est pas connecté. Dans le cas contraire, ce bouton redirige vers la page de la partothèque personnelle.

## Encyclopédie

La page de l'encyclopédie Toccatech liste tous les compositeurs répertoriés dans la base de données Toccatech. Cette base de données peut être enrichie par n'importe quel utilisateur, du moment qu'il est connecté en cliquant sur le bouton "Nouveau Compositeur". Si l'utilisateur n'est pas connecté, ce bouton est désactivé et affiche un message lorsque la souris de l'utilisateur reste un moment immobile au dessus de ce bouton.

Les compositeurs sont présentés sous forme de cartes dans lesquelles un résumé des informations du compositeur est affiché. L'âge du compositeur Les informations complètes sur un compositeur en particulier peuvent être affichées en cliquant sur le bouton "En savoir plus...".

A partir des détails d'un compositeur, on peut également voir la liste des morceaux de ce compositeur joués par les utilisateurs de Toccatech, s'il y en a au moins un. Les partitions associées à chaque morceau ne sont pas affichées, elles restent strictement personnelles.

La page des détails d'un compositeur permet également, pour les utilisateurs connectés, de contribuer et modifier ces informations pour apporter ou corriger des informations. Afin de modifier les informations d'un compositeur, un formulaire comportant plusieurs champs est affiché. Tous les champs sont requis, pour que l'encyclopédie soit la plus riche possible. Pour la sélection d'une photo d'un compositeur, deux options se présentent : l'utilisateur peut soit utiliser une URL d'une photo provenant d'un site web externe, ou télécharger une photo à partir de son ordinateur sur le serveur de l'application. Dans les deux cas, si l'image est valide, un aperçu en temps réel apparaît à côté du nom du compositeur.

Si la photo du compositeur voulue est accessible via une URL provenant d'un autre site web, le champ photo URL doit être utilisé. Celui-ci effectue une validation de l'URL grâce à une requête HTTP pour tester si l'image existe réellement. Cette validation est déclenchée à chaque modification du champ URL. Par contre, si l'image est protégée par le ["Cross-origin resource sharing" (CORS)](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS) bien qu'elle existe, le formulaire ne validera pas cette photo, et il faudra alors d'abord télécharger l'image et ensuite la sélectionner depuis son ordinateur via l'autre champ de formulaire ("Sélectionner une photo..."). Cela est dû à l'utilisation de la [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), qui prend en compte la validation CORS.

La case à cocher "Valider sélection photo" rend les deux champs pour choisir l'image du compositeur non modifiables. Dans le cas d'une sélection d'une photo à partir de son ordinateur, le fichier est téléchargé sur le serveur Toccatech à l'activation de cette case à cocher. Une fois cette opération réussie, le lien vers la photo se trouvant cette fois-ci sur le serveur de l'application est automatiquement ajouté dans le champ "Photo du compositeur (URL)" et vide l'autre champ. La désactivation de la case à cocher supprime automatiquement l'image si elle est stockée sur le serveur Toccatech et vide le champ URL.

Dans tous les cas, la sélection de cette case à cocher est nécessaire pour envoyer le formulaire. Sa désélection permet de modifier à nouveau la photo du compositeur.

Afin de communiquer l'état de validation de chaque champ de formulaire à l'utilisateur, un code couleur est utilisé. Le rouge est utilisé pour un champ non valide, le vert pour un champ valide et le rouge foncé (le même rouge que la barre de navigation) et utilisé pour informer l'utilisateur que le champ en question est requis, mais vide.

## Ma Partothèque

Toccatech met à disposition des utilisateurs de l'application une partothèque personnelle, qui permet d'enregistrer ses morceaux ainsi que de télécharger ses partitions personnelles. Chaque morceau possède un titre qui est associé à un compositeur. Celui-ci doit forcément déjà exister dans la base de données de compositeurs. S'il n'existe pas, il est obligatoire de le créer d'abord à partir de la page de l'encyclopédie. Les morceaux ajoutés dans sa partothèque personnelles sont visibles publiquement dans la page des détails du compositeur associé à chaque morceau.

## Barre de navigation et autres fonctionnalités

La barre de navigation, présente sur toutes les pages, permet de naviguer facilement entre les pages principales de l'application, c'est-à-dire les pages "Ma Partothèque" et "Encyclopédie". Si l'utilisateur n'est pas connecté, un bouton supplémentaire est affiché qui permet d'ouvrir une popup de connexion ou d'inscription.

Toutes les pages de l'application sont réactives grâce à un changement de l'interface utilisateur en fonction de la taille de l'écran, ce qui signifie que Toccatech peut aussi bien être utilisé sur un ordinateur, sur une tablette ou encore sur un smartphone.

Le système d'authentification implémenté dans l'application vérifie également à chaque fois que l'utilisateur entre sur une page qu'il a la permission de l'afficher. Des restrictions s'appliquent seulement pour les utilisateurs non connectés. Si un utilisateur non connecté tente effectivement d'accéder à une page nécessitant la connexion (il s'agit des pages de modification d'un compositeur, d'ajout d'un compositeur ainsi que celle de la partothèque personnelle), il est redirigé vers la page d'accueil.

Toutes les données provenant de la base de données Toccatech sont mises à jour en temps réel, ce qui signifie qu'un utilisateur n'a jamais besoin de rafraichir la page pour actualiser les données ; ce processus se fait automatiquement lorsque la base de données est modifiée.

# Description technique

## Outils techniques utilisés

### Vue.js et ses plugins

Toccatech repose sur la version 2 de [Vue.js](https://fr.vuejs.org/index.html), un Framework JavaScript évolutif. Cette application est construite avec une architecture basée sur des composants Vue (que j'ai intégralement écrits), qui contiennent chacun un code HTML (template), un script et du style. Ils deviennent donc réutilisables dans plusieurs endroits de l'application. Pour plus de lisibilité, Vue permet de les écrire dans des fichiers individuels qui possèdent une extension '.vue'. Comme ces fichiers ne peuvent pas être interprétés par un navigateur web, Vue se charge de les traduire en du code HTML, JavaScript, et CSS à la compilation de l'application.

Les applications créées avec Vue ne se composent que d'une seule page HTML, dont seul le contenu est dynamiquement changé en fonction de la navigation de l'utilisateur dans l'application. Ce genre d'application web se nomme une [Single Page Application (SPA)](https://fr.wikipedia.org/wiki/Application_web_monopage).

Le fichier contenant l'initialisation de l'application Vue est `main.ts` dans le dossier `src`. C'est dans ce fichier que les plugins sont également initialisés. L'application Toccatech utilise deux plugins : [Vue Meta](https://vue-meta.nuxtjs.org/) et [Vue MQ](https://github.com/AlexandreBonaventure/vue-mq). Parlons d'abord de Vue Meta. Ce plugin permet d'indiquer les méta-données des différents écrans comme leur titre ou leur description. Une fois l'application déployée, ces méta-données servent ensuite aux moteurs de recherche qui peuvent ainsi indexer Toccatech l'afficher lors de recherches correspondant aux mots clés se trouvant dans la description de la page.  
Le second plugin utilisé pour ce projet est Vue MQ (Vue Media Queries). Il permet de modifier l'interface utilisateur de l'application en fonction de la taille et du type de l'écran utilisé par l'utilisateur. Pour être concret, Vue MQ met à disposition la variable globale `$mq`, qui contient le nom de la taille de l'écran actuelle. Selon la configuration passée à l'initialisation du plugin, les différentes tailles de l'écran dans l'ordre croissant sont donc les suivantes : `xs`, `sm`, `md`, `lg` et `xl`. Les tailles d'écran correspondantes sont indiquées en commentaire dans le fichier `main.ts`. Cette variable globale peut ensuite être utilisée pour afficher un certain contenu seulement sur les petits écrans par exemple en testant si elle contient soit la valeur `xs` ou `sm`. Ce principe est donc utilisé afin de garantir une bonne expérience pour l'utilisateur qu'il visite l'application sur son téléphone, sur un ordinateur, ou bien encore sur une tablette.

### Firebase

L'application est construite côté serveur grâce à [Firebase](https://firebase.google.com), un service cloud de Google. Elle utilise plus précisément la base de données en temps réel Firestore, le service d'authentification Firebase Authentication, le service de stockage de fichiers Firebase Storage ainsi que Firebase Hosting pour l'hébergement du site. Firestore est une base de données non relationnelle (NoSQL) s'organisant en collection de documents. Les collections représentent un ensemble de documents identifiés par une chaîne de caractères, le plus souvent générée aléatoirement. Ces documents sont constitués de paires clé / valeur ne suivant pas de schéma particulier, contrairement à une base de données relationnelle. Ils peuvent également contenir des sous-collections, permettant ainsi une imbrication des données. Le stockage des données est donc très flexible.

Le SDK Firebase pour le web, n'étant pas un plugin Vue, mais une librairie JavaScript, s'initialise et se configure dans un fichier dédié : `src/firebase.ts`. Chaque composant nécessitant d'interagir avec Firebase fait donc appel à ce fichier pour importer certains services de Firebase.

### Git et GitHub

Pour mon projet, j'ai également utilisé un [système de gestion de versions](https://fr.wikipedia.org/wiki/Gestion_de_versions) très populaire qui se nomme [Git](https://fr.wikipedia.org/wiki/Git). Il permet essentiellement de garder un historique de chaque changement effectué au projet, grâce à des points de repère dans le temps appelés `commits`. Ces commits contiennent un titre décrivant le but du commit, une description optionnelle ainsi que les changements effectués.

Les commits ont été écrits pour les plus récents grâce à [Gitmoji](https://gitmoji.dev/), un outil permettant d'utiliser des émojis pour décrire le type de commit voulu. Les conventions dans l'écriture des commits tente de suivre le standard des [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/) afin d'avoir un historique de commits clair.

L'initialisation de `Git` dans un dossier fait de ce-dernier ce que l'on appelle un dépôt Git. `Git` enregistre à chaque commit les changements effectués et les stocke dans un dossier caché `.git`, à la racine du projet. Ce dossier est donc très important et ne doit jamais être supprimé. Une autre fonctionnalité de `Git` très utile est l'utilisation de ce qui se nomme les branches `Git`. Celles-ci permettent de séparer le workflow du projet, pour pouvoir travailler et faire des `commits` sans impacter une autre partie de l'application. Ces branches contiennent donc un historique de commits spécifique à la branche ainsi que tout le code qui résulte de l'ensemble des commits de la branche.

Au fur et à mesure du développement de l'application, certaines branches sont destinées à être fusionnées entre elles pour ne former plus qu'une seule version finale de l'application. La branche par défaut créée par `Git` se nomme `main`. Elle est souvent considérée comme étant la branche contenant des versions stables de l'application. C'est le cas dans Toccatech : la branche `main` contient les versions du projet destinées à un environnement de production, alors que la branche `develop` est destinée aux autres versions, encore en développement.

Après avoir expliqué `Git` en théorie, passons à la pratique. Ce logiciel s'utilise dans un terminal en lignes de commandes. Il peut être installé à partir du [site officiel](https://git-scm.com/). L'installateur Windows propose différentes options personnalisables, mais les paramètres par défaut sont tout à fait corrects. On peut toutefois changer l'éditeur par défaut pour utiliser VS Code comme éditeur de commits : soit en choisissant l'option correspondante à l'installation, soit grâce à la commande suivante à exécuter dans un terminal : `git config --global core.editor "code --wait"`.

En plus d'utiliser `Git`, le code source de Toccatech est hébergé sur GitHub, une plateforme permettant de parcourir et de stocker des dépôts Git. L'historique de commits peut donc se voir sur cette plateforme, en cliquant sur le lien indiquant le nombre de commits. Par exemple, pour voir les commits de la branche `main`, ce bouton mène à [ce lien](https://github.com/Philou-py/toccatech-next/commits/main). Le code de chaque fichier de cette branche est également accessible. Pour aller sur la branche `develop`, il suffit de cliquer sur le bouton indiquant la branche actuelle. Sélectionner ensuite `develop` permet d'accéder au code ainsi qu'aux commits réalisés sur cette branche. Le détail de chaque commit peut être visualisé en cliquant sur son titre. Les différentes modifications effectuée entre ce commit et le dernier sont affichées.

Etant un système de gestion de versions décentralisé, chaque dépôt `Git` doit être « cloné » pour être utilisé et modifié en local. Cette action peut se faire grâce à la commande suivante (dans un terminal) : `git clone <url du dépôt>`. Pour Toccatech, le clonage se réalise donc grâce à cette commande : `git clone https://github.com/Philou-py/toccatech-next.git`. Pour naviguer dans le dossier grâce au terminal, on utilise la commande `cd toccatech-next\`. A ce point là, pour naviguer entre les branches, on utilise la commande suivante : `git checkout <nom de la branche>`. Par exemple, pour se déplacer sur la branche `develop`, la commande suivante serait adaptée : `git checkout develop`. Et pour revenir sur la branche `main` : `git checkout main`. Pour savoir sur quelle branche on se situe, on peut taper : `git branch`. Le nom de la branche actuelle est précédé d'une astérisque. Lorsque l'on change de branche, tout le code source de l'application est mis à jour. Mais attention ! Le changement de branche est souvent impossible si des modifications aux fichiers ont été apportées depuis le dernier commit.  
La réalisation de commits se fait en deux étapes : on ajoute d'abord les fichiers destinés à faire partie du commit : `git add <fichier1.html> <fichier2.css>` ou plus simplement (si l'on se trouve à la racine du projet) : `git add .`. Puis, le commit se réalise avec la commande suivante : `git commit -m "Voici un message de commit"` en changeant bien sûr le message en fonction des changements apportés.

### Vue CLI et npm

Afin de simplifier le développement d'applications Vue, il existe un programme de commande qui a été conçu pour permettre facilement la création d'un projet Vue, son exécution ainsi que sa compilation pour un environnement de production. Il s'agit de [Vue CLI](https://cli.vuejs.org/). Il peut être installé grâce à [npm](https://www.npmjs.com/) avec la commande suivante dans un terminal : `npm install -g @vue/cli`. L'installation de npm se fait en même temps que celle de [Node.js](https://nodejs.org/en/), un programme permettant d'exécuter du JavaScript indépendamment d'un navigateur.

Pour créer des applications Vue, Vue CLI utilise donc `npm`, un gestionnaire de dépendances. L'utilisation de `npm` permet également d'ajouter des plugins ou des librairies externes comme Firebase, par exemple, qui sont hébergées sur le serveur de `npm`. Ces dépendances sont installées par `npm` dans le dossier `nodes_modules` à la racine du projet. Cependant, elles ne sont pas incluses par Git lors des commits : compte tenu du nombre de dépendances habituellement requises, le code de l'application deviendrait beaucoup trop volumineux. Toutes les dépendances du projet sont listées dans le fichier `package.json`, dans lequel on peut également trouver les versions exactes ou les plages de versions souhaitées. Par exemple, la ligne `"firebase": "^8.4.2"` signifie que toutes les versions modifiant seulement les deux derniers digits sont susceptibles d'être installées, mais les nouvelles versions majeures sont ignorées. Après le clonage d'un dépôt Git utilisant `npm` et avant de pouvoir exécuter l'application Vue en local, il faut installer les dépendances du projet avec la commande `npm install` exécutée dans un terminal à la racine du dossier de l'application. Cette commande créera le dossier `node_modules` avec toutes les dépendances du projet.

Grâce à Vue CLI, j'ai donc créé l'application Vue grâce à la commande suivante (exécutée à l'endroit désiré dans un terminal) : `vue create toccatech`. Afin d'exécuter le projet en local pour le développement, la commande suivante est nécessaire (à exécuter à la racine du dossier de l'application dans un terminal) : `npm run serve`. Cette commande lance un serveur de développement qui recompile le projet à chaque modification du code source, ce qui est très pratique. La compilation pour le déploiement se fait ainsi : `npm run build`. Les fichiers compilés se trouvent dans le dossier `dist` de l'application. C'est ce dossier qui a été déployé sur Firebase Hosting.

### Vue Router

[Vue Router](https://router.vuejs.org/) est un plugin officiel de Vue.js qui permet de gérer la navigation entre les écrans de l'application, tout en changeant l'url dans la barre d'adresse. Les routes de l'application sont définies dans le fichier `src/router/index.ts`. Elles associent un chemin dans la barre d'adresse à un composant de l'application. Pour Toccatech, chacun de ces composants se trouvent dans le dossier `views`, pour les différencier des autres composants.

Comme les applications contruites avec Vue.js sont des Single Pages Applications, la navigation entre les routes de l'application se fait par un changement dynamique du contenu ainsi qu'une modification de l'url, mais la page HTML reste toujours la même. Ce principe mène à une navigation entre les différents écrans très rapide et fluide pour l'utilisateur.

### Vue CLI Plugin PWA

Grâce au plugin [cli-plugin-pwa de Vue CLI](https://cli.vuejs.org/core-plugins/pwa.html), l'application web Toccatech peut être installée à partir d'un navigateur (sur ordinateur ou smartphone) comme Progressive Web App (PWA) pour être exécutée hors-ligne et pour bénéficier d'une expérience similaire à celle d'une application native. Les navigateurs supportant les PWA incluent Google Chrome, Microsoft Edge ou encore Safari, mais pas Opera ni Firefox. La fonctionnalité hors-ligne est également rendue possible grâce à Firebase, qui permet de mettre en cache toutes les requêtes vers la base de données afin de pouvoir les réexécuter sans forcément de connexion internet.

### Police de caractère et icônes

Pour personnaliser encore plus le design de l'application, une police de caractère personnalisée a été choisie. Il s'agit de la police [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) provenant de [Google Fonts](https://fonts.google.com/). Enfin, des icônes sont également été utilisées : les `Material Icons`. Ces icônes ont également été créées par Google et peuvent être trouvées sur le site Google Fonts à [cette adresse](https://fonts.google.com/icons). Elles sont intégrées à l'application dans le fichier `src/public/index.html` en les chargeant depuis un CDN.

## Architecture

### Arborescence des fichiers du projet

- `src/` : Ce dossier contient tous les fichiers les plus importants de l'application.

  - `assets/` : Tous les fichiers de style externes ainsi que les images de l'application
  - `components/` : Les fichiers de composants Vue

    - `layouts/` : Les composants formant une partie de l'interface utilisateur assez significative
    - `ui-components/` : Composants représentant des petits éléments stylisés et personnalisé de l'interface utilisateur

  - `router/` : Fichiers de configuration de Vue Router (pour naviguer entre les pages de l'application)
  - `views/` : Equivalents de pages web complètes, mais sous forme de composants
  - `main.ts` : Fichier principal où se trouve l'initialisation de Vue et des plugins de l'application
  - `firebase.ts` : Fichier d'initialisation de Firebase et ses services
  - `...` : Autres fichiers divers servant par exemple à indiquer les types des classes des modules externes à TypeScript

- `public/` : Fichiers publics

  - `index.html` : Seul fichier HTML de l'application contenant seulement des informations de base ainsi que le chargement des `Material Icons`
  - `favicon.ico` : Favicône Toccatech
  - `img/icons/` : Dossier des icônes Toccatech dans différentes tailles - Cela est nécessaire pour que l'application soit une PWA.

- `dist/` : Fichiers compilés pour la production (ce dossier n'apparaît qu'après avec exécuté `npm run build`)
- `nodes_modules/` : Ce dossier contient tous les packages npm
- `README.md` : Documentation du projet
- `package.json` : Fichier listant les dépendances `npm` du projet
- `package-lock.json` : Fichier indiquant les versions exactes de chaque package installé localement
- `vue.config.json` : Fichier de configuration de Vue et de ses plugins
- `...` : Autres fichiers divers pour le déploiement de l'application par exemple

### La base de données Firestore

Passons à présent à l'architecture de la base de données Firestore. Les deux collections se trouvant à la racine de la base de données regroupent les utilisateurs de l'application ainsi que des compositeurs, participant à la formation d'une encyclopédie. Les utilisateurs sont déjà répertoriés dans Firebase Authentication, mais cette collection permet le stockage futur d'un potentiel avatar, par exemple. La collection `compositeurs` répertorie différents compositeurs dans des documents ayant plusieurs champs permettant d'enregistrer un maximum d'informations. Ils sont les suivants :

- `nom`
- `âge`
- `date_naissance`
- `date_décès`
- `photo`
- `est_mort`
- `biographie`

Chaque compositeur peut également posséder une sous-collection `oeuvres` qui permet de stocker des œuvres jouées par ce compositeur. Ces œuvres répliquent certaines des données du compositeur (le nom et l'url de la photo) dans le but de faciliter la récupération des œuvres et permettre le tri des œuvres par compositeur. Afin de pouvoir effectuer une requête sélectionnant toutes les œuvres de tous les compositeurs, le système des _collection group queries_ que Firestore permet, a été utilisé. Ce type de requête récupère tous les documents de toutes les collections ayant l'identifieur `œuvres`. Des indexes ont donc du être créés dans la [console Firebase](https://console.firebase.google.com/u/0/project/toccatech-f8369/firestore/indexes).

### Les routes de l'application

Chaque route de l'application est identifiée non seulement par une url dans la barre d'adresse, mais aussi grâce à un nom que l'on peut leur donner afin de pouvoir changer ultérieurement l'url sans avoir à modifier le reste de l'application dirigeant vers cette route. Voici les différentes routes de l'application Toccatech :

| Chemin de l'url             | Nom                        | Requiert l'authentification | Description                                                                                                         |
| --------------------------- | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `/`                         | `Accueil`                  | Non                         | Page d'accueil de l'application                                                                                     |
| `/encyclopedie`             | `Encyclopédie`             | Non                         | Encyclopédie Toccatech où sont répertoriés les compositeurs                                                         |
| `/compositeur/:id`          | `DétailsCompositeur`       | Non                         | Détails d'un compositeur en particulier. `:id` permet d'indiquer un paramètre dans l'url.                           |
| `/compositeur/:id/modifier` | `ModifierInfosCompositeur` | Oui                         | Modifier les informations d'un compositeur, si elles sont incomplètes ou fausses par exemple                        |
| `/nouveau-compositeur`      | `NouveauCompositeur`       | Oui                         | Enregistrer un nouveau compositeur dans l'application, visible publiquement                                         |
| `/:catchAll(.*)`            | `NonTrouvé`                | Non                         | Equivalent d'une page d'erreur 404 - cette route est utilisée si l'url ne renvoie vers aucune page de l'application |

## Principes de programmation

### La programmation avec Vue

Les paragraphes qui suivent ne décrivent seulement certains aspects de Vue. Pour apprendre Vue plus en détails, je recommande [le tutoriel de _The Net Ninja_ sur Youtube](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1) que j'ai utilisé comme point de départ pour la programmation avec Vue. Même s'il permet d'apprendre la version 3 de Vue.js, les syntaxes expliquées sont presque identiques dans Vue 2. La [documentation officielle de Vue.js](https://fr.vuejs.org/index.html) est également de très bonne qualité.

#### Le système de composants

Pour une meilleure organisation, la plupart des applications Vue utilise des composants individuels écrits dans des fichiers séparés. C'est également le cas pour Toccatech. Les composants peuvent représenter un certain élément de l'interface utilisateur comme un champ de texte ou un bouton, mais il peut aussi bien contenir toute une page. La séparation du code en composant est donc arbitraire, et n'est utile que pour pouvoir réutiliser les composants à plusieurs endroits dans l'application.

Les composants Vue personnalisés ont été écrits en HTML, [Sass](https://sass-lang.com/) avec la syntaxe SCSS pour le style et [TypeScript](https://www.typescriptlang.org/) pour le script. Aucune bibliothèque CSS n'est utilisée ; la stylisation de Toccatech s'inspire des spécifications [Material Design de Google](https://material.io/design).

Je vais donc à présent décrire brièvement les bases de ces outils, afin de mieux comprendre leur utilisation dans l'application. Toutes les principes de programmation utilisés dans Toccatech ne sont néanmoins pas expliqués.

#### Les syntaxes de Vue dans le Template

La partie `template` de chaque composant Vue contient du code HTML que Vue rend plus puissant grâce à des syntaxes particulières et des attributs que l'on peut rajouter à des balises HTML normales, qui font communiquer le script du composant avec le `template` de façon à rendre le contenu de l'application dynamique très facilement. Vue permet par exemple d'afficher le contenu de variables JavaScript très facilement dans le code HTML : pour afficher une variable `message`, on écrirait : `{{ message }}`. Entre deux accolades dans le `template`, on peut donc écrire du code JavaScript afin d'afficher des variables avec un affichage particulier. Les principales syntaxes les plus utiles que l'on peut utiliser dans le `template` grâce à Vue sont les suivants : `v-for`, `v-if`, `v-bind` et `v-on`. Je vais donc maintenant vous les décrire brièvement.

Tout d'abord, `v-for` permet de faire une boucle sur une certaine variable (qui doit être itérable), afin de répéter plusieurs fois du code HTML en fonction du contenu de cette variable. Prenons un exemple concret : après avoir déclaré la variable `listeCompositeurs` de type `Array` contenant des chaînes de caractères représentant le nom de chaque compositeur, on pourrait vouloir afficher chaque élément de ce tableau sous forme d'une liste non ordonnée dans le `template`. Pour cela, on écrirait le code HTML suivant :

```html
<ul>
  <li v-for="compositeur in listeCompositeurs">{{ compositeur }}</li>
</ul>
```

Dans l'attribut `v-for` se place la variable `compositeur` qui va contenir chaque élément individuel de la liste `listeCompositeurs` en fonction de chaque itération. La balise possédant l'attribut `v-for` (`li` dans ce cas) est donc répétée le même nombre de fois que la variable `listeCompositeurs` possède d'éléments. Chaque élément `li` a accès à la variable `compositeur` qui peut être ensuite affichée à l'intérieur de ces balises grâce aux doubles accolades.

Observons maintenant l'attribut `v-if` que Vue permet d'utiliser. Cet attribut fait office de condition, qui n'affiche l'élément HTML possédant cet attribut que si la condition est évaluée à `true`. Dans l'attribut `v-if` se place donc du code JavaScript. Imaginons que l'on ait déclaré une variable `chargementTerminé`. On pourrait utiliser une condition avec `v-if` pour afficher un certain contenu en fonction de cette variable :

```html
<p v-if="!chargementTerminé">Chargement...</p>
```

L'attribut `v-else`, placé après un élément possédant l'attribut `v-if`, permet d'afficher une alternative au premier contenu. Par exemple :

```html
<p v-if="!chargementTerminé">Chargement...</p>
<p v-else>Voici la page d'accueil !</p>
```

Vue permet également de préfixer n'importe quel attribut HTML existant avec la syntaxe suivante : `v-bind:mon-attribut="duCodeJavaScript"`. Cela permet de passer à un attribut HTML du code JavaScript comme une variable à la place d'une valeur fixe. Par exemple, si l'on a défini une variable `titre` possédant la valeur `Page d'accueil`, on peut définir
l'attribut title d'un élément `a` en lui passant cette variable grâce à `v-bind` :

```html
<a v-bind:title="titre">Allez sur la page d'accueil !</a>
```

Un raccourci de cette syntaxe consiste à préfixer les attributs HTML seulement par `:`. On peut donc définir des attributs avec `v-bind` comme ceci : `:title="titre"`.

La dernière syntaxe très utilisée dans les composants Vue de l'application est `v-on`. Cette syntaxe permet d'écouter très facilement les événements du DOM en déclarant l'écouteur d'événements directement dans le `template`. Afin d'écouter un événement spécifique, on ajoute l'attribut HTML `v-on` auquel on rajoute le nom de l'événement, après `:`. Le contenu de l'attribut contient du code JavaScript exécuter lorsque l'événement en question survient. Par exemple, pour appeler une méthode que l'on aurait nommée `gérerClic` lorsque l'utilisateur clique sur un bouton, on utiliserait le code suivant :

```html
<button v-on:click="gérerClic()">Bouton</button>
```

Comme pour `v-bind`, il existe un raccourci de la syntaxe `v-on`, qui est l'arobase. Le code précédent peut donc être écrit comme cela :

```html
<button @click="gérerClic()">Bouton</button>
```

Pour en savoir plus sur les syntaxes de Vue dans le template des composants, voir [la documentation officielle](https://fr.vuejs.org/v2/guide/syntax.html).

#### Les options de la classe Vue

Dans le script de chaque composant Vue est instancié une classe Vue, qui contient des options spécifiques au composant. Ces options se passent en paramètre de la classe `Vue.extend`, sous forme d'un objet JavaScript. Cet objet peut posséder plusieurs propriétés qui renseignent soit des variables, des méthodes, des `computed properties`, ou encore des fonctions exécutées à différentes étapes de l'exécution du composant.

Les variables se placent dans un objet renvoyé par la fonction `data`. Après avoir été déclarées, ces variables sont accessibles dans tout le composant par leur nom précédé de `this.` si elles sont utilisées dans le script, ou simplement par leur nom dans le template. Le grand avantage que Vue offre est la réactivité de chaque variable initialisée dans la fonction `data`. Cela signifie que dès que ces variables changent, tous les affichages de cette variable donc toute la partie du `template` qui en dépend est actualisée dynamiquement et automatiquement.

Cependant, certaines variables dépendent d'autres variables du composant, et celles-ci ne peuvent pas être déclarées dans la fonction `data`. Elles sont en revanche déclarées comme `computed properties` dans l'option `computed` de l'objet comme paramètre à la classe `Vue.extend`. Ces `computed properties` peuvent être utilisées comme des variables qui ne changent seulement si les variables auxquelles elles dépendent elles-mêmes changent.

Un composant peut également posséder des méthodes qui peuvent ensuite être appelées pour réagir à un événement par exemple. Celles-ci sont déclarées dans la propriété `methods` de l'objet des options Vue.

Pour finir, parlons des `hooks` de cycle de vie qui sont exécutés automatiquement à certaines phases d'initialisation de la classe Vue. La plus utilisée dans mon projet est `mounted`. Cette fonction est appelée lorsque le composant est complètement initialisé, c'est-à-dire lorsque que les variables ainsi que le `template` sont prêts à être utilisés.

Ces principes ne sont que le début de la programmation avec Vue. Je conseille donc, pour en savoir davantage, d'aller visiter la très bonne [documentation de Vue ](https://fr.vuejs.org/index.html).

### La stylisation avec Sass

J'ai choisi [Sass](https://sass-lang.com/) (Syntactically Awesome Style Sheets) comme langage de stylisation pour permettre une stylisation plus lisible et puissante. Ce langage est très similaire à CSS : la différence majeure repose dans l'imbrication des style. En Sass, on peut en effet placer des sélecteurs dans d'autres pour faciliter l'écriture des sélecteurs. Prenons comme exemple le code suivant :

```scss
.accueil {
  font-size: 18px;

  a {
    color: blue;
  }
}
```

Ce code est équivalent en CSS à :

```css
.accueil {
  font-size: 18px;
}

.accueil a {
  color: blue;
}
```

Pour rendre les sélecteurs imbriqués encore plus spécifiques, on peut utiliser le symbole `&` pour désigner le sélecteur parent. Exemples :

```scss
button {
  font-size: 18px;

  &:hover a {
    color: purple;
  }

  &.valide {
    color: green;

    &-vide {
      color: lightgreen;
    }
  }

  & > div {
    color: blue;
  }
}
```

Ce code serait converti en CSS comme suit :

```css
button {
  font-size: 18px;
}

button:hover a {
  color: purple;
}

button.valide {
  color: green;
}

button.valide-vide {
  color: lightgreen;
}

button > div {
  color: blue;
}
```

Sass, étant un véritable langage de programmation et non seulement de stylisation, permet également l'utilisation de variables permettant de stocker de très nombreux types de données. On peut en utiliser pour stocker des couleurs, par exemple. Pour déclarer et initialiser une variable, on précède le nom de la variable par le symbole `$`, et on indique sa valeur après le symbole `:`. Exemple : `$couleur-primaire: #1ce`. On peut ensuite utiliser cette variable :

```scss
p {
  color: $couleur-primaire;
}
```

Un autre avantage de Sass est qu'il permet l'utilisation de `mixins`. Celles-ci se comportent comme des fonctions qui retournent du code sass, et qui sont donc réutilisables. Par exemple, une mixin nommée `changerThème` peut être utilisée dans un champ de texte pour changer les couleurs en fonction de l'état de validité :

```scss
@mixin changerThème($couleur-thème) {
  input,
  textarea,
  .container-selection {
    caret-color: $couleur-thème;
    border-color: $couleur-thème;
  }

  .icone-devant,
  label {
    color: $couleur-thème;
  }

  &:hover {
    input,
    textarea {
      border-color: darken($couleur-thème, 10%);
    }

    .ligne {
      background-color: darken($couleur-thème, 10%);
    }
  }
}
```

### Le script avec TypeScript

[TypeScript](https://www.typescriptlang.org/) est un langage créé par Microsoft construit sur le JavaScript, lui ajoutant d'autres fonctionnalités tout en conservant une compatibilité totale avec le JavaScript pur. La fonctionnalité la plus importante de TypeScript utilisée dans Toccatech est l'inférence et la déclaration de types de variables. En effet, à l'instanciation d'une variable ou d'une propriété, TypeScript infère son type afin d'assurer une cohérence avec les méthodes ou fonctions utilisées.

Pour apprendre le TypeScript, je recommande [l'excellent tutoriel de _The Net Nina_ sur Youtube](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI) !

Cependant, la déclaration explicite du type `any` est parfois nécessaire, lorsque la valeur contenue par la variable est inconnue ou que cette variable pourrait posséder n'importe quel type. Enfin, le point d'exclamation est parfois utilisé après l'appel d'une variable pour indiquer à TypeScript que cette variable ne peut pas avoir le type `null`.

