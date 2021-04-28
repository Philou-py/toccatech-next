# Description fonctionnelle

Toccatech est une application Internet à l'usage des musiciens qui souhaitent disposer d'une partothèque numérique. Elle est accessible via le lien [next.toccatech.com](https://next.toccatech.com). Le contenu public de l'application présente des informations sur les compositeurs. Le contenu personnalisé devient accessible après la création d'un compte (connexion sécurisée). L'utilisateur peut référencer les oeuvres musicales de son répertoire et a la possibilité de déposer sur le serveur de l'application une copie numérique de ses partitions. Celle-ci restera à l'usage strictement personnel de l'utilisateur dans le respect du droit à la copie.

> Note: Le code de ce dépôt Git correspond à une version totalement réécrite de toccatech.com (dont le code est basé sur Django côté serveur et Materialize comme librairie CSS). Le code, le design et les fonctionnalités sont différents, mais l'esprit de la boîte à outil musicale à destination des musiciens a été conservé.

## Page d'accueil

## Encyclopédie

## Ma Partothèque

# Comment utiliser le code de l'application

# Description technique

## Architecture

### Frameworks / librairies utilisés

Toccatech repose sur la version 2 de Vue.js qui est un framework JavaScript évolutif. Cette application est construite avec une architecture basée sur des composants Vue (que j'ai intégralement écrits), qui contiennent chacun un code HTML (template), un script et du style. Ils deviennent donc réutilisables dans plusieurs endroits de l'application. Pour plus de lisibilité, Vue permet de les écrire dans des fichiers individuels qui possèdent une extension '.vue'.

L'application est construite côté serveur grâce à [Firebase](https://firebase.google.com), un service cloud de Google. Elle utilise plus précisément la base de données en temps réel Firestore, le service d'authentification Firebase Auth, le service de stockage de fichiers Firebase Storage ainsi que Firebase Hosting pour l'hébergement du site. Firestore est une base de données non relationnelle NoSQL s'organisant en collection de documents. Les collections représentent un ensemble de documents identifiés par une chaîne de caractères, le plus souvent générée aléatoirement. Ces documents sont constitués de paires clé / valeur ne suivant pas de schéma particulier, contrairement à une base de données relationnelle. Ils peuvent également contenir des sous-collections, permettant ainsi une imbrication des données.

Grâce au plugin [cli-plugin-pwa de Vue CLI](https://cli.vuejs.org/core-plugins/pwa.html), l'application web Toccatech peut être installée à partir d'un navigateur (sur ordinateur ou smartphone) comme Progressive Web App (PWA) pour être exécutée hors-ligne et pour bénéficier d'une expérience similaire à celle d'une application native. Les navigateurs supportant les PWA incluent Google Chrome, Microsoft Edge ou encore Safari, mais pas Opera ni Firefox. La fonctionnalité hors-ligne est offerte également grâce à Firebase, qui permet de mettre en cache toutes les requêtes vers la base de données afin de pouvoir les réexécuter sans forcément de connexion internet.

### La base de données Firestore

Passons à présent à l'architecture de la base de données Firestore. Les deux collections se trouvant à la racine de la base de données regroupent les utilisateurs de l'application ainsi que des compositeurs, participant à la formation d'une encyclopédie. Les utilisateurs sont déjà répertoriés dans Firebase Authentication, mais cette collection permet le stockage futur d'un potentiel avatar, par exemple. La collection `compositeurs` répertorie différents compositeurs dans des documents ayant plusieurs champs permettant d'enregistrer un maximum d'informations. Ils sont les suivants :

- `nom`
- `âge`
- `date_naissance`
- `date_décès`
- `photo`
- `est_mort`
- `biographie`

Chaque compositeur peut également posséder une sous-collection `oeuvres` qui permet de stocker des oeuvres jouées par ce compositeur. Ces oeuvres répliquent certaines des données du compositeur (le nom et l'url de la photo) dans le but de faciliter la récupération des oeuvres et permettre le tri des oeuvres par compositeur. Afin de pouvoir effectuer une requête sélectionnant toutes les oeuvres de tous les compositeurs, le système des _collection group queries_ que Firestore permet, a été utilisé. Ce type de requête récupère tous les documents de toutes les collections ayant l'identifieur `oeuvres`. Des indexes ont donc du être créés dans la [console Firebase](https://console.firebase.google.com/u/0/project/toccatech-f8369/firestore/indexes).

## Principes de programmation

### Les composants Vue

Les composants Vue personnalisés ont été écrits en HTML, Sass avec la syntaxe SCSS (pour le style) et TypeScript (pour le script). Aucune bibliothèque CSS n'est utilisée. Lors de la compilation du projet, ces languages sont traduits et minifiés dans des fichiers contenant du CSS et du JavaScript, compréhensibles par le navigateur.

Vue.js permet de créer des sites web ne se composant que d'une seule page, dont seul le contenu est dynamiquement changé en fonction de la navigation de l'utilisateur dans l'application. Ce genre d'application web se nomme une Single Page App (SPA). A la compilation, toute l'application est donc injectée par Vue dans un seul fichier HTML, se trouvant dans le dossier `public` et se nommant `index.html`. Ce fichier contient essentiellement une balise `div` avec l'id `app`. Le fichier contenant l'initialisation de l'application Vue est `main.ts` dans le dossier `src`. C'est dans ce fichier que les plugins sont également initialisés : l'application Toccatech utilise VueMeta pour indiquer les méta-données des différents écrans (pour ne pas dire 'pages') comme leur titre ainsi que leur description (celle-ci n'est présente qu'une fois dans le composant `App.vue`). Firebase, n'étant pas un plugin Vue, mais une librairie JavaScript pour le web, s'initialise et se configure dans un fichier dédié : `src/firebase.ts`. Chaque composant nécessitant d'intéragir avec Firebase fait donc appel à ce fichier pour importer certains services de Firebase.

### La stylisation avec Sass

J'ai choisi Sass comme language de stylisation pour permettre une stylisation plus lisible et puissante. Ce language est très similaire à CSS : la différence majeure repose dans l'imbrication des style. En Sass, on peut en effet placer des sélecteurs dans d'autres pour faciliter l'écriture des sélecteurs. Prenons comme exemple le code suivant :

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

button > div {
  color: blue;
}
```

Sass, étant un véritable language de programmation et non seulement de stylisation, permet également l'utilisation de variables permettant de stocker de très nombreux types de données. On peut en utiliser pour stocker des couleurs, par exemple. Pour déclarer et initialiser une variable, on précède le nom de la variable par le symbole `$`, et on indique sa valeur après le symbole `:`. Exemple : `$couleur-primaire: #1ce`. On peut ensuite utiliser cette variable :

```scss
p {
  color: $couleur-primaire;
}
```

<!-- inspirés des [standards Material Design](https://material.io/design/introduction), -->

### Le script avec TypeScript

TypeScript est un language construit sur le JavaScript, lui ajoutant d'autres fonctionnalités tout en conservant une compatibilité totale avec le JavaScript pur. La fonctionnalité la plus importante de TypeScript utilisée dans Toccatech est l'inférence et la déclaration de types de variables. En effet, à l'instanciation d'une variable ou d'une propriété, TypeScript infère son type afin d'assurer une cohérence avec les méthodes ou fonctions utilisées.
Cependant, la déclaration explicite du type `any` est parfois nécessaire, lorsque la valeur contenue par la variable est inconnue. Enfin, le point d'exclamation est parfois utilisé après l'appel d'une variable pour indiquer à TypeScript que cette variable ne peut pas avoir le type `null`.

## Exemples de code

### Exemples de styles SCSS personnalisés

1. Barre de navigation  
   `.barre-navigation { position: fixed; width: 100%; top: 0; z-index: 9999; box-shadow: 0 2px 4px 0 darkgrey; }`

2. Couleurs
3. blabla

### Exemples de composant Vue personnalisés

1. Composant un
   `.barre-navigation { position: fixed; width: 100%; top: 0; z-index: 9999; box-shadow: 0 2px 4px 0 darkgrey; }`
