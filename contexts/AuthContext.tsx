import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
  useCallback,
  useContext,
} from "react";
import Modal from "../components/Modal";
import ConnexionForm from "../layouts/ConnexionForm";
import SignUpForm from "../layouts/SignUpForm";
import client from "../apollo-client";
import { gql } from "@apollo/client";
import { SnackContext } from "./SnackContext";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  userProfileId: string;
  email: string;
  username: string;
  avatarURL?: string;
  authToken: string;
}

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  currentUser?: User;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  signOut: () => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setCurrentUser: () => {},
  setModalOpen: () => {},
  signOut: () => {},
});

function getCookie(cookieName: string) {
  const name = cookieName + "=";
  const decoded = decodeURIComponent(document.cookie);
  const cookies = decoded.split("; ");
  let res = "";
  cookies.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}

async function fetchCurrentUser(authToken: string) {
  const { data: user } = await client.query({
    query: gql`
      query {
        queryUser {
          id
          email
          userProfile {
            id
            username
            avatarURL
          }
        }
      }
    `,
    context: {
      headers: {
        "X-Toccatech-Auth": authToken,
      },
    },
  });

  if (user.queryUser.length !== 0) {
    const firstUser = user.queryUser[0];
    return {
      id: firstUser.id,
      userProfileId: firstUser.userProfile.id,
      email: firstUser.email,
      username: firstUser.userProfile.username,
      avatarURL: firstUser.userProfile.avatarURL,
      authToken: authToken,
    } as User;
  } else {
    return null;
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { haveASnack } = useContext(SnackContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showConnexion, setShowConnexion] = useState(true);

  const swapFormDisplay = useCallback(() => {
    setShowConnexion((oldValue) => !oldValue);
  }, []);

  const signOut = useCallback(async () => {
    console.log("Déconnexion...");
    try {
      const response = await fetch("http://surface-laptop3-philippe:3003/signout", {
        credentials: "include",
      });
      if (response.status == 200) {
        haveASnack("success", <h6>Vous êtes à présent déconnecté !</h6>);
        setIsAuthenticated(false);
      } else {
        haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
      }
    } catch (error) {
      haveASnack("error", <h6>Oh non, le serveur d&rsquo;authentification est inaccessible !</h6>);
    }
  }, [haveASnack]);

  const onCompleted = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    const authToken = getCookie("X-Toccatech-Auth");
    fetchCurrentUser(authToken).then((data) => {
      if (data) {
        console.log("User authenticated!", data);
        setIsAuthenticated(true);
        setCurrentUser(data);
      } else {
        console.log("User not authenticated!");
        setIsAuthenticated(false);
        setCurrentUser(undefined);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setIsAuthenticated,
        setCurrentUser,
        setModalOpen,
        signOut,
      }}
    >
      <Modal showModal={modalOpen} closeFunc={setModalOpen}>
        {showConnexion ? (
          <ConnexionForm noAccountFunc={swapFormDisplay} onCompleted={onCompleted} />
        ) : (
          <SignUpForm alreadyAnAccountFunc={swapFormDisplay} onCompleted={onCompleted} />
        )}
      </Modal>
      {children}
    </AuthContext.Provider>
  );
}
