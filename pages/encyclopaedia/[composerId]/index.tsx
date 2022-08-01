import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { AuthContext } from "../../../contexts/AuthContext";
import { BreakpointsContext } from "../../../contexts/BreakpointsContext";
import { SnackContext } from "../../../contexts/SnackContext";
import {
  Container,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Spacer,
} from "../../../components";
import cn from "classnames";
import axios from "axios";

interface RawComposer {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  photoURL: string;
  musicalStyles: string;
  biography: string;
  age: number;
  contributors: {
    id: string;
    username: string;
  }[];
}

type Modify<T, R> = Omit<T, keyof R> & R;

type Composer = Modify<
  RawComposer,
  {
    birthDate: Date;
    deathDate?: Date;
  }
>;

const MARK_AS_DELETED = `
  mutation UpdateComposer($updateComposerInput: UpdateComposerInput!) {
    updateComposer(input: $updateComposerInput) {
      composer {
        id
      }
    }
  }
`;

const GET_COMPOSER = `
  query GetComposer($composerId: ID!) {
    getComposer(id: $composerId) {
      id
      name
      birthDate
      deathDate
      photoURL
      biography
      musicalStyles
      contributors {
        id
        username
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const DGRAPH_URL =
    req.headers.host === "toccatech.fr"
      ? "http://dgraph.toccatech.fr/graphql"
      : "https://dgraph.toccatech.com/graphql";

  const { data } = await axios.post(DGRAPH_URL, {
    query: GET_COMPOSER,
    variables: { composerId: params!.composerId },
  });

  return {
    props: { rawComposer: data.data.getComposer },
    notFound: data.data.getComposer.length === 0,
  };
};

export default function ComposerDetails({ rawComposer }: { rawComposer: RawComposer }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const { haveASnack } = useContext(SnackContext);
  const router = useRouter();

  const [composer] = useState(() => {
    const FS_BASE_URL =
      window.location.hostname === "toccatech.fr"
        ? "http://file-server.toccatech.fr"
        : "https://file-server.toccatech.com";

    const IS_LOCAL = FS_BASE_URL === "http://file-server.toccatech.fr";

    const isDead = !!rawComposer.deathDate;
    let parsedComposer: Partial<Composer> = {
      birthDate: new Date(rawComposer.birthDate),
      deathDate: isDead ? new Date(rawComposer.deathDate) : undefined,
    };
    const yearInMiliseconds = 1000 * 60 * 60 * 24 * 365;
    if (!isDead) {
      const now = new Date();
      const age = (now.getTime() - parsedComposer.birthDate!.getTime()) / yearInMiliseconds;
      parsedComposer.age = Math.floor(age);
    } else {
      const age =
        (parsedComposer.deathDate!.getTime() - parsedComposer.birthDate!.getTime()) /
        yearInMiliseconds;
      parsedComposer.age = Math.floor(age);
    }
    if (IS_LOCAL && parsedComposer.photoURL!.slice(0, 33) == "https://file-server.toccatech.com") {
      parsedComposer.photoURL = FS_BASE_URL + parsedComposer.photoURL!.slice(33);
    }
    return { ...rawComposer, ...parsedComposer } as Composer;
  });

  const handleDelete = useCallback(async () => {
    console.log("Deleting composer...");
    const DGRAPH_URL =
      window.location.hostname === "toccatech.fr"
        ? "http://dgraph.toccatech.fr/graphql"
        : "https://dgraph.toccatech.com/graphql";

    try {
      const response = await fetch(DGRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Toccatech-Auth": currentUser!.authToken },
        body: JSON.stringify({
          query: MARK_AS_DELETED,
          variables: {
            updateComposerInput: {
              filter: {
                id: rawComposer.id,
              },
              set: {
                isDeleted: true,
                contributors: {
                  id: currentUser!.userProfileId,
                },
              },
            },
          },
        }),
      });
      const result = await response.json();
      console.log(result);
      if (result.errors || result.data.updateComposer.length == 0) {
        console.log(result.errors, result.data.updateComposer);
        haveASnack(
          "error",
          <h6>Une erreur est survenue, nous n&rsquo;avons pas pu supprimer ce compositeur !</h6>
        );
      } else {
        haveASnack("success", <h6>Le compositeur {rawComposer.name} a bien été supprimé !</h6>);
        router.push(`/encyclopaedia`);
      }
    } catch (error) {
      console.log(error);
      haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
    }
  }, [currentUser, haveASnack, rawComposer, router]);

  const pageTitle = `${composer.name} - Toccatech`;
  const pageDescription = `${composer.biography
    .slice(0, 150)
    .replace("\n", " ")}... - Tout savoir sur ${composer.name} !`;

  return (
    <Container className="mt-4">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <Card className="composerDetails">
        <CardHeader
          title={
            <div className={cn("heading", cbp)}>
              <h1 className={cbp}>{composer.name}</h1>
              <div className={cn("photoContainer", cbp)}>
                <Image
                  src={composer.photoURL}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  alt="Composer Avatar"
                />
              </div>
            </div>
          }
        />
        <CardContent className={cn("composerInfo", cbp)}>
          <div>
            <h3 className={cbp}>Carte d&rsquo;identité</h3>
            <ul>
              <li>Date de naissance : {composer.birthDate.toLocaleDateString()}</li>
              {composer.deathDate && (
                <li>
                  Date de décès : {composer.deathDate.toLocaleDateString()} (décédé(e) à{" "}
                  {composer.age} ans)
                </li>
              )}
              {!composer.deathDate && <li>Âge : {composer.age}</li>}
              <li>Styles musicaux : {composer.musicalStyles}</li>
            </ul>
          </div>
          <div>
            <h3 className={cbp}>Biographie</h3>
            <p className="biography">{composer.biography}</p>
          </div>
        </CardContent>
        <CardActions>
          <Spacer />
          {isAuthenticated && (
            <Button className="red--text mr-4" type="outlined" onClick={handleDelete}>
              Supprimer
            </Button>
          )}
          {isAuthenticated && (
            <Link href={`/encyclopaedia/${composer.id}/update`} passHref>
              <a>
                <Button className="indigo darken-1" isDisabled={!isAuthenticated}>
                  Envie de contribuer ?
                </Button>
              </a>
            </Link>
          )}
          {!isAuthenticated && (
            <Button
              className="indigo darken-1"
              isDisabled={!isAuthenticated}
              title="Connectez-vous pour contribuer !"
            >
              Envie de contribuer ?
            </Button>
          )}
        </CardActions>
      </Card>
    </Container>
  );
}
