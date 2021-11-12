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
  noAccountFunc?: () => void;
}

function ConnexionForm({ noAccountFunc }: ConnexionFormProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const buttonTitle = !isFormValid ? "Le formulaire n'est pas valide !" : undefined;

  const handleSubmit = useCallback(() => {
    console.log("Connection...");
  }, []);

  return (
    <Card>
      <CardHeader title={<h3>Connexion</h3>} centerTitle />
      <CardContent>
        <Form getFormValidity={setIsFormValid}>
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
        </Form>
      </CardContent>
      <CardActions>
        {noAccountFunc && <a onClick={noAccountFunc}>Pas de compte ?</a>}
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

export default memo(ConnexionForm);
