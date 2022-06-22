import { memo, useCallback, useContext, useState } from "react";
import { SnackContext } from "../contexts/SnackContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Form,
  useForm,
  InputField,
  Button,
  Spacer,
} from "../components";
import { AuthContext } from "../contexts/AuthContext";

interface ConnexionFormProps {
  alreadyAnAccountFunc?: () => void;
  onCompleted?: () => void;
}

function SignUpForm({ alreadyAnAccountFunc, onCompleted }: ConnexionFormProps) {
  console.log("SignUpForm rendered!");
  const { setCurrentUser, setIsAuthenticated } = useContext(AuthContext);
  const { haveASnack } = useContext(SnackContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: newUser,
    isValid: isFormValid,
    register,
  } = useForm({
    username: "",
    email: "",
    pwd: "",
    file: "",
  });

  const buttonTitle = !isFormValid ? "Le formulaire n'est pas valide !" : undefined;

  const uploadImage = useCallback(async () => {
    const formData = new FormData();
    formData.append("file", newUser.file);
    formData.append("visibility", "unlisted");
    formData.append("category", "userAvatars");
    try {
      const response = await fetch("https://file-server.toccatech.com/files/upload", {
        method: "POST",
        body: formData,
      });
      const { file, error } = await response.json();
      if (error) {
        console.log(error);
      } else {
        console.log(file);
        const newURL = `https://file-server.toccatech.com/files/${file._id}`;
        return newURL;
      }
    } catch (error) {
      console.log(error);
      haveASnack("error", <h6>Oh non, le serveur de fichiers est inaccessible !</h6>);
    }
  }, [newUser.file, haveASnack]);

  const handleSubmit = useCallback(async () => {
    console.log("Inscription...");
    let avatarURL = "";
    if (newUser.file) {
      let result = await uploadImage();
      if (result) avatarURL = result;
    }
    try {
      const response = await fetch("https://auth-server.toccatech.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.pwd,
          username: newUser.username,
          avatarURL,
        }),
      });
      const result = await response.json();
      if (response.status == 400) {
        console.log("Erreur de validation !");
        haveASnack("error", <h6>Données saisies invalides !</h6>);
      } else if (response.status == 406) {
        console.log("Le nom choisi est déjà utilisé par un autre utilisateur !");
        haveASnack("error", <h6>Le nom choisi est déjà utilisé par un autre utilisateur !</h6>);
      } else if (response.status == 500) {
        console.log("Erreur serveur !");
        haveASnack("error", <h6>Oh non, une erreur non identifiée est survenue !</h6>);
      } else if (response.status == 201) {
        console.log("Succès !");
        haveASnack("success", <h6>Bienvenue, {result.user.username} !</h6>);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        if (onCompleted) onCompleted();
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      haveASnack("error", <h6>Oh non, le serveur d&rsquo;authentification est inaccessible !</h6>);
    }
  }, [uploadImage, newUser, haveASnack, setCurrentUser, setIsAuthenticated, onCompleted]);

  return (
    <Card cssWidth={alreadyAnAccountFunc ? "clamp(300px, 40%, 600px)" : ""}>
      <CardHeader title={<h3>Inscription</h3>} centerTitle />
      <CardContent>
        <Form>
          <InputField
            type="text"
            label="Nom d&rsquo;utilisateur"
            prependIcon="face"
            isRequired
            fullWidth
            {...register("username")}
          />
          <InputField
            type="email"
            label="Adresse email"
            prependIcon="account_circle"
            placeholder="vous@domaine.tld"
            fullWidth
            isRequired
            {...register("email")}
          />
          <InputField
            type="password"
            label="Mot de passe"
            prependIcon="lock"
            minLength={6}
            fullWidth
            isRequired
            {...register("pwd")}
          />
          <InputField
            type="file"
            label="Télécharger votre avatar"
            prependIcon="image"
            acceptTypes="image/*"
            fullWidth
            {...register("file", newUser.file)}
          />
        </Form>
      </CardContent>
      <CardActions>
        {alreadyAnAccountFunc && <a onClick={alreadyAnAccountFunc}>Déjà un compte ?</a>}
        <Spacer />
        <Button
          className="blue darken-3"
          isDisabled={!isFormValid || isLoading}
          title={buttonTitle}
          onClick={handleSubmit}
        >
          {isLoading ? "Chargement..." : "Valider"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default memo(SignUpForm);
