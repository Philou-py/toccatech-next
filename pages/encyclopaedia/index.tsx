import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Button, Card, CardHeader, CardContent, CardActions } from "../../components";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";
import cn from "classnames";
import { GetServerSideProps } from "next";
import client from "../../apollo-client";
import { gql } from "@apollo/client";

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

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: composers } = await client.query({
    query: gql`
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
    `,
  });

  return {
    props: {
      rawComposers: composers.queryComposer,
    },
  };
};

export default function Encyclopaedia({ rawComposers }: { rawComposers: RawComposer[] }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);

  const [composers, setComposers] = useState(() => {
    // console.log("Composers initialised!");
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
      <div className={cn("heading", cbp)}>
        <h1 className="pageTitle">Encyclopédie</h1>
        <Link href="/encyclopaedia/new-composer" passHref>
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
              <Link href={`/encyclopaedia/${composer.id}`} passHref>
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
