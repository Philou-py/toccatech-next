import { useCallback, useContext, useEffect, useState } from "react";
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
  InputField,
  Form,
} from "../../../components";
import useForm from "../../../components/Form/useForm";
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

export default function ModifyComposerInfo({ rawComposer }: { rawComposer: RawComposer }) {
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

  const {
    data: rawNewComposer,
    isValid: isFormValid,
    register,
  } = useForm({
    name: "",
    birthDate: "",
    deathDate: "",
    musicalStyles: "",
    photoURL: "",
    photoFile: "",
    biography: "",
  });

  const [photoSelectDone, setPhotoSelectDone] = useState(true);

  const uploadImage = useCallback(async () => {
    console.log("hello");
    if (rawNewComposer.photoFile) {
      console.log("hello, world!");
      const formData = new FormData();
      formData.append("file", rawNewComposer.photoFile);
      formData.append("visibility", "unlisted");
      formData.append("category", "avatars");
      try {
        const response = await fetch("https://file-server.toccatech.com/files/upload", {
          method: "POST",
          body: formData,
        });
        const { file } = await response.json();
        console.log(file);
      } catch (error) {
        console.log(error);
      }
    } else if (rawNewComposer.photoURL) {
      console.log(rawNewComposer.photoURL);
    }
  }, [rawNewComposer.photoFile, rawNewComposer.photoURL]);

  return (
    <Container className="mt-4">
      <Card className="modifyComposerInfo">
        <CardHeader
          title={
            <div className={cn("heading", cbp)}>
              <h1 className={cbp}>
                {composer.name}
                {composer.name && " - "}Contribuer
              </h1>
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
        <CardContent>
          <Form className={cn("form", cbp)}>
            <div className="column">
              <InputField
                type="text"
                prependIcon="face"
                label="Nom du compositeur"
                isRequired
                {...register("name")}
              />
              <InputField
                type="date"
                prependIcon="today"
                label="Date de naissance"
                isRequired
                {...register("birthDate")}
              />
              <InputField
                type="date"
                prependIcon="event"
                label="Date de décès (si le compositeur est décédé)"
                {...register("deathDate")}
              />
              <InputField
                type="text"
                prependIcon="music_note"
                label="Styles musicaux"
                isRequired
                {...register("musicalStyles")}
              />
            </div>
            <div className="verticalSep"></div>
            <div className="column">
              <InputField
                type="text"
                prependIcon="link"
                label="Photo du compositeur (URL)"
                maxLength={600}
                isDisabled={photoSelectDone}
                customValidationRules={[
                  (value) =>
                    value
                      ? /^(http|https):\/\/[^ "]+$/.test(value)
                        ? true
                        : "URL non valide"
                      : true,
                ]}
                {...register("photoURL")}
              />
              <span>OU</span>
              <InputField
                type="file"
                label="Sélectionner une photo"
                acceptTypes="image/*"
                prependIcon="image"
                isDisabled={photoSelectDone}
                {...register("photoFile", rawNewComposer.photoFile)}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                  position: "relative",
                }}
              >
                <label htmlFor="photoValidate">Valider sélection photo</label>
                <input
                  id="photoValidate"
                  type="checkbox"
                  checked={photoSelectDone}
                  onChange={() => {
                    setPhotoSelectDone((prev) => !prev);
                    uploadImage();
                  }}
                />
              </div>
              <InputField
                type="textarea"
                label="Biographie du compositeur"
                maxLength={2000}
                isRequired
                {...register("biography")}
              />
            </div>
          </Form>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button className="red">Annuler</Button>
          <span style={{ width: "10px", display: "inline-block" }}></span>
          <Button className="purple">Valider</Button>
        </CardActions>
      </Card>
    </Container>
  );
}
