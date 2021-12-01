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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const url = `https://mongodb-server.toccatech.com/db/findOneWithId?collectionName=composers&docId=${
    params!.composerId
  }`;
  const response = await fetch(url);
  const composer = (await response.json()).data;

  return {
    props: {
      rawComposer: composer,
    },
  };
};

export default function ComposerDetails({ rawComposer }: { rawComposer: RawComposer }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);

  const [composer] = useState(() => {
    const isDead = !!rawComposer.deathDate;
    let parsedComposer: Partial<Composer> = {
      birthDate: new Date(rawComposer.birthDate),
      deathDate: isDead ? new Date(rawComposer.deathDate) : undefined,
    };
    if (!isDead) {
      const now = new Date();
      const yearInMiliseconds = 1000 * 60 * 60 * 24 * 365;
      const age = (now.getTime() - parsedComposer.birthDate!.getTime()) / yearInMiliseconds;
      parsedComposer.age = Math.floor(age);
    }
    return { ...rawComposer, ...parsedComposer } as Composer;
  });

  return (
    <Container className="mt-4">
      <Card className="composerDetails">
        <CardHeader
          title={
            <div className="heading">
              <h1>{composer.name}</h1>
              <div className="photoContainer">
                <Image
                  src={composer.photoURL}
                  layout="fill"
                  objectFit="cover"
                  alt="Composer Avatar"
                />
              </div>
            </div>
          }
        />
        <CardContent className={cn("composerInfo", cbp)}>
          <div>
            <h3>Carte d&rsquo;identité</h3>
            <ul>
              <li>Date de naissance : {composer.birthDate.toLocaleDateString()}</li>
              {composer.deathDate && (
                <li>
                  Date de décès : {composer.deathDate.toLocaleDateString()} (mort à {composer.age}{" "}
                  ans)
                </li>
              )}
              {!composer.deathDate && <li>Âge : {composer.age}</li>}
              <li>Styles musicaux : {composer.musicalStyles}</li>
            </ul>
          </div>
          <div>
            <h3>Biographie</h3>
            <p style={{ textAlign: "justify" }}>{composer.biography}</p>
          </div>
        </CardContent>
        <CardActions>
          <Spacer />
          <Link href={`/encyclopaedia/${composer._id}/modify`} passHref>
            <a>
              <Button className="indigo darken-1">Envie de contribuer ?</Button>
            </a>
          </Link>
        </CardActions>
      </Card>
    </Container>
  );
}
