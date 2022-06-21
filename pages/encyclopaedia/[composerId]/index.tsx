import { useContext, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreakpointsContext } from "../../../contexts/BreakpointsContext";
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
import client from "../../../apollo-client";
import { gql } from "@apollo/client";
import { AuthContext } from "../../../contexts/AuthContext";

interface RawComposer {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  photoURL: string;
  musicalStyles: string;
  biography: string;
  age: number;
}

type Modify<T, R> = Omit<T, keyof R> & R;

type Composer = Modify<
  RawComposer,
  {
    birthDate: Date;
    deathDate?: Date;
  }
>;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data: composer } = await client.query({
    query: gql`
      query {
        getComposer(id: "${params!.composerId}") {
          id
          name
          birthDate
          deathDate
          photoURL
          biography
          musicalStyles
        }
      }
    `,
  });

  return {
    props: {
      rawComposer: composer.getComposer,
    },
  };
};

export default function ComposerDetails({ rawComposer }: { rawComposer: RawComposer }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [composer] = useState(() => {
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
    return { ...rawComposer, ...parsedComposer } as Composer;
  });

  return (
    <Container className="mt-4">
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
