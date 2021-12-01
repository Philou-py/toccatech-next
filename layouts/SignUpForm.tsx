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
  alreadyAnAccountFunc?: () => void;
}

function SignUpForm({ alreadyAnAccountFunc }: ConnexionFormProps) {
  console.log("SignUpForm rendered!");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    isValid: isFormValid,
    register,
  } = useForm({
    name: "",
    email: "",
    pwd: "",
    file: "",
  });

  const buttonTitle = !isFormValid ? "Le formulaire n'est pas valide !" : undefined;

  const handleSubmit = useCallback(() => {
    console.log("Inscription...");
  }, []);

  return (
    <Card>
      <CardHeader title={<h3>Inscription</h3>} centerTitle />
      <CardContent>
        <Form>
          <InputField
            type="text"
            label="Nom"
            prependIcon="face"
            isRequired
            fullWidth
            {...register("name")}
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
            minLength={4}
            fullWidth
            isRequired
            {...register("pwd")}
          />
          <InputField
            type="file"
            label="Télécharger votre avatar"
            prependIcon="image"
            fullWidth
            isRequired
            {...register("file", data.file)}
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
