import { useContext, useMemo, useCallback, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  Container,
  DataTable,
  Button,
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Spacer,
  InputField,
  Form,
  useForm,
} from "../components";
import { BreakpointsContext } from "../contexts/BreakpointsContext";
import { AuthContext } from "../contexts/AuthContext";
import { SnackContext } from "../contexts/SnackContext";
import cn from "classnames";
import axios from "axios";

interface TableHeader {
  text: string;
  value: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  alignContent?: "start" | "center" | "end";
  unitSuffix?: string;
  cssWidth?: string;
}

interface Composer {
  id: string;
  name: string;
}

const QUERY_COMPOSERS = `
  query QueryComposers {
    queryComposer(filter: { isDeleted: false }) {
      id
      name
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const DGRAPH_URL =
    req.headers.host === "toccatech.fr"
      ? "http://dgraph.toccatech.fr/graphql"
      : "https://dgraph.toccatech.com/graphql";

  const { data } = await axios.post(DGRAPH_URL, { query: QUERY_COMPOSERS });
  return { props: { composers: data.data.queryComposer } };
};

const ADD_PIECE = `
  mutation AddPiece($addPieceInput: [AddPieceInput!]!) {
    addPiece(input: $addPieceInput) {
      piece {
        id
        title
        scoreURL
        composer {
          id
          name
          photoURL
        }
        userProfile {
          username
        }
      }
    }
  }
`;

const DELETE_PIECE = `
  mutation DeletePiece($deletePieceFilter: PieceFilter!) {
    deletePiece(filter: $deletePieceFilter) {
      piece {
        id
        title
      }
    }
  }
`;

const UPDATE_PIECE = `
  mutation UpdatePiece($updatePieceInput: UpdatePieceInput!) {
    updatePiece(input: $updatePieceInput) {
      piece {
        id
        title
        scoreURL
        composer {
          id
          name
          photoURL
        }
        userProfile {
          username
        }
      }
    }
  }
`;

export default function ScoreLibrary({ composers }: { composers: Composer[] }) {
  const { currentBreakpoint: cbp } = useContext(BreakpointsContext);
  const { isAuthenticated, currentUser, setCurrentUser } = useContext(AuthContext);
  const { haveASnack } = useContext(SnackContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingPiece, setIsAddingPiece] = useState(true);
  const [pieceId, setPieceId] = useState("");
  const {
    data: editablePiece,
    setData,
    isValid,
    register,
  } = useForm({ title: "", composerId: "", scoreFile: "" });

  const composersForSelect = useMemo(
    () => composers.map((composer) => [composer.name, composer.id]),
    [composers]
  );

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleDeleteScore = useCallback(
    async (scoreURL: string) => {
      try {
        let scoreToDelete = scoreURL;
        if (window.location.hostname === "toccatech.fr") {
          scoreToDelete = "http://file-server.toccatech.fr" + scoreToDelete.slice(33);
        }
        const response = await fetch(scoreToDelete, { method: "DELETE", credentials: "include" });
        if (response.status === 200) console.log("Score successfully deleted!");
        else if (response.status === 400) console.log("This score does not exist!");
        return "Ok!";
      } catch (error) {
        console.log(error);
        haveASnack("error", <h6>Oh non, le serveur de fichiers est inaccessible !</h6>);
        return "Bad, bad, bad...";
      }
    },
    [haveASnack]
  );

  const handleDeletePiece = useCallback(
    async (pieceId: string, scoreURL?: string) => {
      if (scoreURL) {
        const scoreDeletionRes = await handleDeleteScore(scoreURL);
        if (scoreDeletionRes === "Bad, bad, bad...") {
          return;
        }
      }

      const DGRAPH_URL =
        window.location.hostname === "toccatech.fr"
          ? "http://dgraph.toccatech.fr/graphql"
          : "https://dgraph.toccatech.com/graphql";

      const response = await fetch(DGRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Toccatech-Auth": currentUser!.authToken },
        body: JSON.stringify({
          query: DELETE_PIECE,
          variables: { deletePieceFilter: { id: pieceId } },
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        setCurrentUser((prev) => {
          if (prev) {
            return { ...prev, pieces: prev.pieces.filter((piece) => piece.id !== pieceId) };
          }
        });
        haveASnack(
          "success",
          <h6>Le morceau {result.data.deletePiece.piece.title} a bien été supprimé !</h6>
        );
      } else {
        haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
      }
    },
    [haveASnack, currentUser, handleDeleteScore, setCurrentUser]
  );

  const uploadFile = useCallback(async () => {
    const FS_BASE_URL =
      window.location.hostname === "toccatech.fr"
        ? "http://file-server.toccatech.fr"
        : "https://file-server.toccatech.com";

    const formData = new FormData();
    formData.append("file", editablePiece.scoreFile);
    formData.append("isPublic", "false");
    formData.append("sharedWith", "[]");
    formData.append("resource", "userScores");

    try {
      const response = await fetch(`${FS_BASE_URL}/files/upload`, {
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
      haveASnack("error", <h6>Oh non, le serveur de fichiers est inaccessible !</h6>);
    }
  }, [editablePiece.scoreFile, haveASnack]);

  const handleSubmit = useCallback(
    async (updatePieceId?: string) => {
      const DGRAPH_URL =
        window.location.hostname === "toccatech.fr"
          ? "http://dgraph.toccatech.fr/graphql"
          : "https://dgraph.toccatech.com/graphql";

      const inputPiece = {
        title: editablePiece.title,
        scoreURL: editablePiece.scoreFile && (await uploadFile()),
        composer: {
          id: editablePiece.composerId,
        },
        userProfile: {
          id: currentUser!.userProfileId,
        },
      };
      const response = await fetch(DGRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Toccatech-Auth": currentUser!.authToken },
        body: JSON.stringify(
          isAddingPiece
            ? {
                query: ADD_PIECE,
                variables: {
                  addPieceInput: [inputPiece],
                },
              }
            : {
                query: UPDATE_PIECE,
                variables: { updatePieceInput: { set: inputPiece, filter: { id: updatePieceId } } },
              }
        ),
      });
      const result = await response.json();
      const newPiece = isAddingPiece
        ? result.data.addPiece.piece[0]
        : result.data.updatePiece.piece[0];
      setModalOpen(false);
      haveASnack("success", <h6>Ce morceau a bien été enregistré !</h6>);
      setCurrentUser((prev) => {
        if (prev) {
          return {
            ...prev,
            pieces: [...prev.pieces.filter((p) => p.id !== updatePieceId), newPiece],
          };
        }
      });
    },
    [editablePiece, uploadFile, haveASnack, setCurrentUser, currentUser, isAddingPiece]
  );

  const dataTableHeaders = useMemo<TableHeader[]>(
    () => [
      { value: "composer", text: "Compositeur", align: "center" },
      { value: "piece-title", text: "Nom du morceau", align: "center" },
      {
        value: "actions",
        text: "Actions",
        align: "center",
        alignContent: "center",
        isSortable: false,
      },
    ],
    []
  );

  const dataTableItems = useMemo(() => {
    if (isAuthenticated && currentUser && currentUser.pieces) {
      return currentUser.pieces.map((piece) => ({
        composer: {
          rawContent: piece.composer.name,
          content: [
            <div
              key={piece.id + "-" + piece.composer.id + "-image"}
              className={cn("imgContainer", cbp)}
            >
              <Image
                src={piece.composer.photoURL}
                alt="Composer Avatar"
                layout="fill"
                objectFit="cover"
                objectPosition="top"
              />
            </div>,
            <div key={piece.id + "-" + piece.composer.id + "-name"}>{piece.composer.name}</div>,
          ],
        },
        "piece-title": { rawContent: piece.title },
        actions: {
          rawContent: "",
          content: [
            piece.scoreURL ? (
              <a href={piece.scoreURL + "?attachment=true"} key={piece.id + "-download"}>
                <Button type="icon" iconName="cloud_download" className="green--text" isFlat />
              </a>
            ) : (
              <Button
                type="icon"
                iconName="cloud_download"
                className="grey--text"
                key={piece.id + "-download-disabled"}
                isFlat
                isDisabled
              />
            ),
            <Button
              type="icon"
              iconName="edit"
              className="orange--text"
              key={piece.id + "-edit"}
              onClick={() => {
                setIsAddingPiece(false);
                setPieceId(piece.id);
                setData({ title: piece.title, scoreFile: "", composerId: piece.composer.id });
                handleModalOpen();
              }}
              isFlat
            />,
            <Button
              type="icon"
              iconName="delete"
              className="red--text ml-1"
              key={piece.id + "-delete"}
              onClick={() => {
                handleDeletePiece(piece.id, piece.scoreURL);
              }}
              isFlat
            />,
          ],
        },
        key: { rawContent: piece.id },
      }));
    } else {
      return [];
    }
  }, [cbp, currentUser, isAuthenticated, handleDeletePiece, handleModalOpen, setData]);

  return (
    <Container className="scoreLibrary">
      <Head>
        <title>Ma Partothèque - Toccatech</title>
        <meta
          name="description"
          content="Construisez votre partothèque personnelle et sauvegardez vos partitions pour garder une trace de chaque morceau que vous jouez."
        />
      </Head>
      {!isAuthenticated && (
        <h3 className="pageTitle textCenter">
          Découvrez votre partothèque personnelle... Mais avant, connectez-vous !
        </h3>
      )}
      {isAuthenticated && (
        <>
          <h1 className="pageTitle textCenter">Ma Partothèque Personnelle</h1>
          <div className="textCenter" style={{ margin: "30px 0 30px" }}>
            <Button
              className="indigo darken-1"
              onClick={() => {
                setIsAddingPiece(true);
                setPieceId("");
                setData({ title: "", composerId: "", scoreFile: "" });
                setModalOpen(true);
              }}
            >
              Ajouter un morceau
            </Button>
          </div>
          {currentUser!.pieces && (
            <DataTable headers={dataTableHeaders} items={dataTableItems} className="piecesTable" />
          )}
          {!currentUser!.pieces && (
            <h4 className="textCenter">Vous n&rsquo;avez renseigné encore aucun morceau !</h4>
          )}
        </>
      )}
      <Modal showModal={modalOpen} closeFunc={handleModalClose}>
        <Card cssWidth="clamp(50px, 500px, 95%)">
          <CardHeader
            title={<h2>{isAddingPiece ? "Ajouter un morceau" : "Modifier un morceau"}</h2>}
            centerTitle
          />
          <CardContent>
            <Form>
              <InputField
                type="select"
                label="Compositeur"
                prependIcon="face"
                selectItems={composersForSelect}
                {...register("composerId")}
              />
              <InputField
                type="text"
                label="Titre du morceau"
                prependIcon="badge"
                fullWidth
                {...register("title")}
              />
              <InputField
                type="file"
                label="Télécharger votre partition"
                prependIcon="music_note"
                acceptTypes="image/*,application/pdf"
                {...register("scoreFile", editablePiece.scoreFile)}
              />
            </Form>
          </CardContent>
          <CardActions>
            <Spacer />
            <Button className="red--text mr-4" type="outlined" onClick={handleModalClose}>
              Annuler
            </Button>
            <Button
              className="blue darken-3"
              isDisabled={!isValid}
              onClick={() => {
                handleSubmit(pieceId);
              }}
            >
              Valider
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </Container>
  );
}
