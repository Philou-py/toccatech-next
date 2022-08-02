import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { Container, Button, Card, CardHeader, CardContent, CardActions } from "../../components";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";
import cn from "classnames";
import { GetServerSideProps } from "next";
import axios from "axios";

interface RawComposer {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  photoURL: string;
  musicalStyles: string;
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

const QUERY_COMPOSERS = `
  query {
    queryComposer(filter: { isDeleted: false }) {
      id
      name
      birthDate
      deathDate
      photoURL
      musicalStyles
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const DGRAPH_URL =
    req.headers.host === "toccatech.fr"
      ? "http://dgraph.toccatech.fr/graphql"
      : "https://dgraph.toccatech.com/graphql";

  const { data } = await axios.post(DGRAPH_URL, { query: QUERY_COMPOSERS });
  return { props: { rawComposers: data.data.queryComposer } };
};

export default function Encyclopaedia({ rawComposers }: { rawComposers: RawComposer[] }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);

  const [composers] = useState(() => {
    return rawComposers.map((rawComposer) => {
      const isDead = !!rawComposer.deathDate;
      let parsedData: Partial<Composer> = {
        birthDate: new Date(rawComposer.birthDate),
        deathDate: isDead ? new Date(rawComposer.deathDate) : undefined,
      };
      const yearInMiliseconds = 1000 * 60 * 60 * 24 * 365;
      if (!isDead) {
        const now = new Date();
        const age = (now.getTime() - parsedData.birthDate!.getTime()) / yearInMiliseconds;
        parsedData.age = Math.floor(age);
      } else {
        const age =
          (parsedData.deathDate!.getTime() - parsedData.birthDate!.getTime()) / yearInMiliseconds;
        parsedData.age = Math.floor(age);
      }
      return { ...rawComposer, ...parsedData };
    }) as Composer[];
  });

  return (
    <Container narrow className="encyclopaedia">
      <Head>
        <title>Encyclopédie - Toccatech</title>
        <meta
          name="description"
          content="L'encyclopédie Toccatech, constamment enrichie par la communauté, regroupe des informations sur de nombreux compositeurs de différents styles musicaux."
        />
      </Head>
      <div className={cn("heading", cbp)}>
        <h1 className="pageTitle">Encyclopédie</h1>
        <Link href="/encyclopaedia/new-composer">
          <a>
            <Button className="blue-grey newComposer">Nouveau Compositeur</Button>
          </a>
        </Link>
      </div>
      <div className={cn("composersGrid", cbp)}>
        {composers.map((composer) => (
          <Card
            key={composer.id}
            media={
              <Image
                src={composer.photoURL}
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                alt="Composer Avatar"
              />
            }
            mediaPosition={cbp === "xs" ? "top" : "right"}
            mediaClassName="composerMedia"
            mainContentClassName="composerInfo"
            className="composerCard"
          >
            <CardHeader title={<h5>{composer.name}</h5>} centerTitle />
            <CardContent>
              <ul style={{ margin: 0, paddingLeft: 0, listStylePosition: "inside" }}>
                <li>Date de naissance : {composer.birthDate.toLocaleDateString()}</li>
                {composer.deathDate && (
                  <li>
                    Date de décès : {composer.deathDate.toLocaleDateString()} (décédé(e) à{" "}
                    {composer.age} ans)
                  </li>
                )}
                {!composer.deathDate && <li>Âge : {composer.age} ans</li>}
                <li>Styles musicaux : {composer.musicalStyles}</li>
              </ul>
            </CardContent>
            <CardActions>
              <Link href={`/encyclopaedia/${composer.id}`}>
                <a style={{ width: "100%" }}>
                  <Button className="indigo darken-1" isFullWidth>
                    En savoir plus...
                  </Button>
                </a>
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
}
