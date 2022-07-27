import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { BreakpointsContext } from "../contexts/BreakpointsContext";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Button, Icon } from "../components";
import ConnexionForm from "../layouts/ConnexionForm";
import SignUpForm from "../layouts/SignUpForm";
import bgCoffeeImage from "../public/images/bg-coffee.jpg";
import bgPianoImage from "../public/images/bg-piano.jpg";
import bgArsenalImage from "../public/images/bg-arsenal.jpg";
import WavesSVG from "./svgs/Waves";
import Waves2 from "./svgs/Waves2";
import LayeredWaves from "./svgs/LayeredWaves";
import PeakWaves from "./svgs/PeakWaves";
import SmallWaves from "./svgs/SmallWaves";
import cn from "classnames";

export default function Home() {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className={cn("home", cbp)}>
      <Head>
        <title>Page d&rsquo;accueil - Toccatech</title>
        <meta
          name="description"
          content="Toccatech fournit aux musiciens des outils simples et pratiques. Il permet de créer et de gérer une partothèque personnelle en lien avec une encyclopédie musicale collaborative. Il permet également d'y déposer ses propres partitions."
        />
      </Head>
      <div className="getStarted">
        <Image
          src={bgCoffeeImage}
          className="coffeeBgImage"
          alt="Image de la page d'accueil"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <Container large className="container">
          <h1 className="title">Votre boîte à outils musicale... découvrez la vite !</h1>
          {!isAuthenticated && (
            <a href="#authSection">
              <Button className="blue-grey" size="x-large">
                C&rsquo;est parti !
              </Button>
            </a>
          )}
          {isAuthenticated && (
            <Link href="/score-library">
              <Button className="blue-grey" size="x-large">
                C&rsquo;est parti !
              </Button>
            </Link>
          )}
        </Container>
        <div className="waves">
          <WavesSVG />
        </div>
      </div>
      <Container className={cn("useCases", cbp)}>
        <div>
          <Icon iconName="library_music" className="icon" />
          <h4>Une partothèque personnelle</h4>
          <p>
            Vous êtes musicien professionnel, étudiant ou simplement amateur. Votre répertoire
            musical s&rsquo;étoffe de jour en jour. Vous perdez vos partitions ? Vous oubliez le
            titre des oeuvres que vous avez appris à jouer ? Créez ici votre partothèque personnelle
            ! Quelques clics suffiront pour enregistrer et lister vos titres préférés !
          </p>
        </div>
        <div>
          <Icon iconName="library_books" className="icon" />
          <h4>Une bibliothèque de données musicales</h4>
          <p>
            Découvrez les fiches de synthèse relatives aux compositeurs. Vous ne trouvez pas votre
            compositeur favori ? Ajoutez le et contribuez ainsi à la création d&rsquo;une véritable
            encyclopédie musicale partagée !
          </p>
        </div>
        <div>
          <Icon iconName="auto_stories" className="icon" />
          <h4>Un archivage de vos partitions personnelles</h4>
          <p>
            Vos partitions sont riches d&rsquo;annotations personnelles précieuses que vous ne
            voulez pas perdre. Numérisez vos documents et archivez les ici. Des années après, vous
            apprécierez de pouvoir rejouer les morceaux de votre jeunesse !
          </p>
        </div>
      </Container>
      <div className={cn("easyTools", cbp)}>
        <div className="peakWaves">
          <PeakWaves />
        </div>
        <Image
          src={bgPianoImage}
          className={cn("pianoBgImage")}
          alt="Image d'un piano de la page d'accueil"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <h2>Des outils simples et efficaces au service de votre passion !</h2>
        <div className="waves2">
          <Waves2 />
        </div>
      </div>
      <div className={cn("contact", cbp)}>
        <Container>
          <h3>Contact</h3>
          <p>
            En cas de problème, je peux vous aider ! N&rsquo;hésitez pas à m&rsquo;écrire à
            l&rsquo;adresse suivante&nbsp;:&nbsp;
            <a href="mailto:contact@toccatech.com">contact@toccatech.com</a>. Je vous répondrai dans
            les meilleurs délais. Toutes vos remarques ou suggestions seront les bienvenues
            également car, n&rsquo;oubliez pas, ce site est fait pour vous !
          </p>
        </Container>
      </div>
      <div className="arsenalRoom">
        <a
          href="https://www.citemusicale-metz.fr/la-cite-musicale/les-salles/larsenal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="layeredWaves">
            <LayeredWaves />
          </div>
          <Image
            src={bgArsenalImage}
            className={cn("arsenalBgImage")}
            alt="Image de la salle de l'Arsenal de Metz"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <Container className="container">
            <h2>Art, culture et nouvelles technologies !</h2>
          </Container>
          <div className="smallWaves">
            <SmallWaves />
          </div>
        </a>
      </div>
      {!isAuthenticated && (
        <div className={cn("authSection", cbp)} id="authSection">
          <ConnexionForm />
          <SignUpForm />
        </div>
      )}
    </div>
  );
}
