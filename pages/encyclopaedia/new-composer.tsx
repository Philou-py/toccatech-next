import { useCallback, useMemo, useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";
import { SnackContext } from "../../contexts/SnackContext";
import { AuthContext } from "../../contexts/AuthContext";
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
} from "../../components";
import cn from "classnames";
import { useRouter } from "next/router";

const CREATE_COMPOSER = `
  mutation AddComposer($newComposerInput: [AddComposerInput!]!) {
    addComposer(input: $newComposerInput) {
      composer {
        id
        name
        birthDate
        deathDate
        photoURL
        biography
        musicalStyles
      }
    }
  }
`;

export default function NewComposer() {
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
    name: "",
    birthDate: "",
    deathDate: "",
    musicalStyles: "",
    photoURL: "",
    photoFile: "",
    biography: "",
  });

  const [photoSelectDone, setPhotoSelectDone] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [photoToShow, setPhotoToShow] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  // Avoid uselessly re-rendering the Photo URL Input Field by memoizing the validation rules array
  const urlValidationRules = useMemo(() => {
    return [
      (value: string) =>
        value ? (/^(http|https):\/\/[^ "]+$/.test(value) ? true : "URL non valide") : true,
    ];
  }, []);

  const uploadImage = useCallback(async () => {
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
  }, [rawNewComposer.photoFile]);

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

  const sendCreateComposer = useCallback(
    async (photoURL: string) => {
      const response = await fetch("https://dgraph.toccatech.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Toccatech-Auth": isAuthenticated ? currentUser!.authToken : "",
        },
        body: JSON.stringify({
          query: CREATE_COMPOSER,
          variables: {
            newComposerInput: [
              {
                name: rawNewComposer.name,
                birthDate: rawNewComposer.birthDate,
                deathDate: rawNewComposer.deathDate,
                photoURL: photoURL,
                biography: rawNewComposer.biography,
                musicalStyles: rawNewComposer.musicalStyles,
                isDeleted: false,
                contributors: {
                  id: currentUser!.userProfileId,
                },
              },
            ],
          },
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        haveASnack(
          "success",
          <h6>La biographie de {rawNewComposer.name} a bien été enregistrée !</h6>
        );
        router.push(`/encyclopaedia`);
      } else {
        console.error("Could not create new composer", result);
        setIsLoading(false);
        haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
      }
    },
    [currentUser, isAuthenticated, haveASnack, rawNewComposer, router]
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

    sendCreateComposer(newURL);
  }, [rawNewComposer, sendCreateComposer, uploadImage]);

  return (
    <Container className="mt-4">
      <Head>
        <title>Nouveau Compositeur - Contribuer - Toccatech</title>
        <meta
          name="description"
          content="Contribuez à l'encyclopédie Toccatech en créant un nouveau compositeur !"
        />
      </Head>
      <Card className="modifyComposerInfo">
        <CardHeader
          title={
            <div className={cn("heading", cbp)}>
              <h1 className={cbp}>
                {rawNewComposer.name}
                {rawNewComposer.name && " - "}Contribuer
              </h1>
              {(previewSrc || photoToShow) && (
                <div className="photoContainer">
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
          <Link href={`/encyclopaedia`} passHref>
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
          >
            {!isLoading ? "Valider" : "Chargement..."}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
