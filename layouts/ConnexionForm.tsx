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
import useForm from "../components/Form/useForm";

interface ConnexionFormProps {
  noAccountFunc?: () => void;
}

function ConnexionForm({ noAccountFunc }: ConnexionFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { isValid, register } = useForm({
    email: "",
    pwd: "",
  });

  const buttonTitle = !isValid ? "Le formulaire n'est pas valide !" : undefined;

  const handleSubmit = useCallback(() => {
    console.log("Connection...");
  }, []);

  return (
    <Card>
      <CardHeader title={<h3>Connexion</h3>} centerTitle />
      <CardContent>
        <Form>
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
            minLength={4}
            fullWidth
            isRequired
            {...register("pwd")}
          />
        </Form>
      </CardContent>
      <CardActions>
        {noAccountFunc && <a onClick={noAccountFunc}>Pas de compte ?</a>}
        <Spacer />
        <Button
          className="blue darken-3"
          isDisabled={!isValid || isLoading}
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
