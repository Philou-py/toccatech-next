import Head from "next/head";
import { Container } from "../components";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <Head>
        <title>Erreur 404 - Page non trouvée</title>
      </Head>
      <h1 className="pageTitle textCenter">Erreur 404 ! 😢</h1>
      <h2 className="textCenter">Désolé, cette page n&rsquo;existe pas !</h2>
      <h4 className="textCenter">
        Pourquoi ne pas revenir sur la <Link href="/">page d&rsquo;accueil</Link> ?
      </h4>
    </Container>
  );
}
