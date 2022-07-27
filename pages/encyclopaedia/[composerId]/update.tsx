import { useCallback, useMemo, useContext, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import axios from "axios";
import { BreakpointsContext } from "../../../contexts/BreakpointsContext";
import { SnackContext } from "../../../contexts/SnackContext";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  Container,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  InputField,
  Form,
  useForm,
} from "../../../components";
import cn from "classnames";

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
  }[];
}

const DGRAPH_URL = "https://dgraph.toccatech.com/graphql";

const UPDATE_INFO = `
  mutation UpdateComposer($updateComposerInput: UpdateComposerInput!) {
    updateComposer(input: $updateComposerInput) {
      composer {
        id
        name
        birthDate
        deathDate
        photoURL
        biography
        musicalStyles
        contributors {
          id
        }
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
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data } = await axios.post(DGRAPH_URL, {
    query: GET_COMPOSER,
    variables: { composerId: params!.composerId },
  });

  return {
    props: { rawComposer: data.data.getComposer },
    notFound: data.data.getComposer.length === 0,
  };
};

export default function ModifyComposerInfo({ rawComposer }: { rawComposer: RawComposer }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const { haveASnack } = useContext(SnackContext);
  const { isAuthenticated, currentUser } = useContext(AuthContext);

  const router = useRouter();

  const {
    data: rawNewComposer,
    isValid: isFormValid,
    register,
    setData,
  } = useForm({
    name: rawComposer.name,
    birthDate: rawComposer.birthDate,
    deathDate: rawComposer.deathDate !== null ? rawComposer.deathDate : "",
    musicalStyles: rawComposer.musicalStyles,
    photoURL: rawComposer.photoURL,
    photoFile: "",
    biography: rawComposer.biography,
  });

  const [photoSelectDone, setPhotoSelectDone] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [photoToShow, setPhotoToShow] = useState(rawComposer.photoURL);
  const [previewSrc, setPreviewSrc] = useState("");

  // Avoid uselessly re-rendering the Photo URL Input Field by memoizing the validation rules array
  const urlValidationRules = useMemo(() => {
    return [
      (value: string) =>
        value ? (/^(http|https):\/\/[^ "]+$/.test(value) ? true : "URL non valide") : true,
    ];
  }, []);

  const uploadImage = useCallback(async () => {
    // Delete old picture
    if (rawComposer.photoURL.slice(0, 33) == "https://file-server.toccatech.com") {
      try {
        const response = await fetch(rawComposer.photoURL, {
          method: "DELETE",
          credentials: "include",
        });
        const { msg, error } = await response.json();
        if (error) {
          console.log(error);
        } else {
          console.log(msg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log("Uploading image!");
    const formData = new FormData();
    formData.append("file", rawNewComposer.photoFile);
    formData.append("isPublic", "true");
    formData.append("sharedWith", "[]");
    formData.append("resource", "composerPhotos");
    try {
      const response = await fetch("https://file-server.toccatech.com/files/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const { fileId, error } = await response.json();
      if (error) {
        console.log(error);
      } else {
        const newURL = `https://file-server.toccatech.com/files/${fileId}`;
        return newURL;
      }
    } catch (error) {
      console.log(error);
    }
  }, [rawNewComposer.photoFile, rawComposer.photoURL]);

  const showImage = useCallback(async () => {
    let shouldRemoveListener = false;
    let reader = new FileReader();
    const handleLoad = () => {
      setPreviewSrc(reader.result as string);
      if (rawNewComposer.photoURL) {
        setData((prev) => ({
          ...prev,
          photoURL: "",
        }));
        setPhotoToShow("");
      }
    };
    if (rawNewComposer.photoFile) {
      reader.addEventListener("load", handleLoad);
      reader.readAsDataURL(rawNewComposer.photoFile as unknown as Blob);
      shouldRemoveListener = true;
    } else if (rawNewComposer.photoURL) {
      setPhotoToShow(rawNewComposer.photoURL);
    } else {
      setPhotoToShow("");
    }
    return () => {
      if (shouldRemoveListener) {
        reader.removeEventListener("load", handleLoad);
      }
    };
  }, [rawNewComposer.photoFile, rawNewComposer.photoURL, setData]);

  const sendUpdateInfo = useCallback(
    async (photoURL: string) => {
      const response = await fetch("https://dgraph.toccatech.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Toccatech-Auth": isAuthenticated ? currentUser!.authToken : "",
        },
        body: JSON.stringify({
          query: UPDATE_INFO,
          variables: {
            updateComposerInput: {
              filter: {
                id: rawComposer.id,
              },
              set: {
                name: rawNewComposer.name,
                birthDate: rawNewComposer.birthDate,
                deathDate: rawNewComposer.deathDate,
                photoURL: photoURL,
                biography: rawNewComposer.biography,
                musicalStyles: rawNewComposer.musicalStyles,
                contributors: {
                  id: currentUser!.userProfileId,
                },
              },
            },
          },
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        haveASnack(
          "success",
          <h6>La biographie de {rawNewComposer.name} a bien été mise à jour !</h6>
        );
        router.push(`/encyclopaedia/${rawComposer.id}`);
      } else {
        console.error("Could not update composer info", result);
        setIsLoading(false);
        haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
      }
    },
    [currentUser, isAuthenticated, rawComposer.id, rawNewComposer, haveASnack, router]
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    let newURL = rawNewComposer.photoURL;

    if (rawNewComposer.photoFile) {
      let result = await uploadImage();
      if (result) {
        newURL = result;
        console.log(newURL);
      } else {
        // An error occurred
        return;
      }
    }

    console.log("Sending composer updated info!");

    sendUpdateInfo(newURL);
  }, [rawNewComposer, sendUpdateInfo, uploadImage]);

  return (
    <Container className="mt-4">
      <NextSeo
        title={`${rawComposer.name} - Contribuer - Toccatech`}
        description={`${rawComposer.biography.slice(0, 50)}... - Enrichissez la biographie de ${
          rawComposer.name
        } !`}
      />
      <Card className="modifyComposerInfo">
        <CardHeader
          title={
            <div className={cn("heading", cbp)}>
              <h1 className={cbp}>
                {rawNewComposer.name}
                {rawNewComposer.name && " - "}Contribuer
              </h1>
              {(previewSrc || photoToShow) && (
                <div className={cn("photoContainer", cbp)}>
                  <Image
                    src={previewSrc || photoToShow}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top"
                    alt="Composer Avatar"
                  />
                </div>
              )}
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
                customValidationRules={urlValidationRules}
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
                  onChange={(event) => {
                    console.log("Checkbox clicked!");
                    setPhotoSelectDone((prev) => !prev);
                    if (!event.currentTarget.checked) {
                      if (previewSrc) {
                        setPreviewSrc("");
                        setData((prev) => ({
                          ...prev,
                          photoFile: "",
                        }));
                      }
                    } else {
                      showImage();
                    }
                  }}
                />
              </div>
              <InputField
                type="textarea"
                nbRows={10}
                label="Biographie du compositeur"
                maxLength={2000}
                isRequired
                {...register("biography")}
              />
            </div>
          </Form>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Link href={`/encyclopaedia/${rawComposer.id}`} passHref>
            <a>
              <Button className="red--text" type="outlined">
                Annuler
              </Button>
            </a>
          </Link>
          <span style={{ width: "10px", display: "inline-block" }}></span>
          <Button
            className="purple"
            isDisabled={
              !isAuthenticated ||
              !photoSelectDone ||
              !isFormValid ||
              (photoSelectDone && !rawNewComposer.photoURL && !rawNewComposer.photoFile) ||
              isLoading
            }
            onClick={handleSubmit}
            title={!isAuthenticated ? "Connectez-vous pour contribuer!" : ""}
          >
            {!isLoading ? "Valider" : "Chargement..."}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
