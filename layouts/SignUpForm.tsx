import { memo, useCallback, useContext, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Form,
  InputField,
  Button,
  Spacer,
} from "../components";

interface ConnexionFormProps {
  alreadyAnAccountFunc?: () => void;
}

function SignUpForm({ alreadyAnAccountFunc }: ConnexionFormProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | "">("");

  const buttonTitle = !isFormValid ? "Le formulaire n'est pas valide !" : undefined;

  const handleSubmit = useCallback(() => {
    console.log("Inscription...");
  }, []);

  return (
    <Card>
      <CardHeader title={<h3>Inscription</h3>} centerTitle />
      <CardContent>
        <Form getFormValidity={setIsFormValid}>
          <InputField
            type="text"
            label="Nom"
            prependIcon="face"
            isRequired
            fullWidth
            value={name}
            setValue={setName}
          />
          <InputField
            type="email"
            value={email}
            setValue={setEmail}
            label="Adresse email"
            prependIcon="account_circle"
            placeholder="vous@domaine.tld"
            fullWidth
            isRequired
          />
          <InputField
            type="password"
            value={pwd}
            setValue={setPwd}
            label="Mot de passe"
            prependIcon="lock"
            minLength={4}
            fullWidth
            isRequired
          />
          <InputField
            type="file"
            value={file === "" ? file : file.name}
            setValue={setFile}
            label="Télécharger votre avatar"
            prependIcon="image"
            fullWidth
            isRequired
          />
        </Form>
      </CardContent>
      <CardActions>
        {alreadyAnAccountFunc && <a onClick={alreadyAnAccountFunc}>Pas de compte ?</a>}
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
