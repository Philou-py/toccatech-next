import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Button, Card, CardHeader, CardContent, CardActions } from "../../components";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";
import cn from "classnames";
import dbSocket from "../../helpers/db-socket";
import { GetServerSideProps } from "next";

interface RawComposer {
  _id: string;
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

export const getServerSideProps: GetServerSideProps = async () => {
  const url = "https://mongodb-server.toccatech.com/db/find?collectionName=composers";
  const response = await fetch(url);
  const composers: RawComposer[] = (await response.json()).data;

  return {
    props: {
      rawComposers: composers,
    },
  };
};

export default function Encyclopaedia({ rawComposers }: { rawComposers: RawComposer[] }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const [composers, setComposers] = useState(() => {
    console.log("Composers initialised!");
    return rawComposers.map((rawComposer) => {
      const isDead = !!rawComposer.deathDate;
      let parsedData: Partial<Composer> = {
        birthDate: new Date(rawComposer.birthDate),
        deathDate: isDead ? new Date(rawComposer.deathDate) : undefined,
      };
      if (!isDead) {
        const now = new Date();
        const yearInMiliseconds = 1000 * 60 * 60 * 24 * 365;
        const age = (now.getTime() - parsedData.birthDate!.getTime()) / yearInMiliseconds;
        parsedData.age = Math.floor(age);
      }
      return { ...rawComposer, ...parsedData };
    }) as Composer[];
  });

  return (
    <Container narrow className="encyclopaedia">
      <div className={cn("heading", cbp)}>
        <h1 className="pageTitle">Encyclopédie</h1>
        <Button className="blue-grey newComposer">Nouveau Compositeur</Button>
      </div>
      <div className={cn("composersGrid", cbp)}>
        {composers.map((composer) => (
          <Card
            key={composer._id}
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
                    Date de décès : {composer.deathDate.toLocaleDateString()} (mort à {composer.age}{" "}
                    ans)
                  </li>
                )}
                {!composer.deathDate && <li>Âge : {composer.age} ans</li>}
                <li>Styles musicaux : {composer.musicalStyles}</li>
              </ul>
            </CardContent>
            <CardActions>
              <Link href={`/encyclopaedia/${composer._id}`} passHref>
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
