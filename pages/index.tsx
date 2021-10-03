import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { BreakpointsContext } from "../contexts/BreakpointsContext";
import Container from "../components/Container";
import Button from "../components/Button";
import Card, { CardHeader, CardContent, CardActions } from "../components/Card";
import Spacer from "../components/Spacer";
import InputField from "../components/InputField";
import Form from "../components/Form";
import Ripple from "../components/Ripple";
import axios from "axios";

export default function Home() {
  const { breakpoints, currentBreakpoint } = useContext(BreakpointsContext);
  const matchingList = Object.keys(breakpoints).map((media) => (
    <li key={media}>
      {media} ---- {breakpoints[media] ? "Yes" : "No"}
    </li>
  ));
  const [myValue, setMyValue] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  // useEffect(() => {
  //   console.log("hello");
  //   axios
  //     .post(
  //       "http://localhost:3001/signin",
  //       {
  //         email: "shaun@google.com",
  //         password: "test1234",
  //       },
  //       { withCredentials: true }
  //     )
  //     .then((data) => console.log(data))
  //     .catch((error) => console.log(error));
  //   // fetch("http://localhost:3001/signin", {
  //   //   method: "POST",
  //   //   body: JSON.stringify({ email: "shaun@google.com", password: "test1234" }),
  //   //   headers: { "Content-Type": "application/json" },
  //   //   credentials: "include",
  //   // })
  //   //   .then((res) => res.json())
  //   //   .then((data) => console.log(data))
  //   //   .catch((error) => console.log(error));
  // }, []);

  return (
    <div className="home">
      <Container>
        <ul>{matchingList}</ul>
        <p>Currently, your screen corresponds to the {currentBreakpoint} breakpoint.</p>
        {/* <div className="div-image-bg-coffee"> */}
        {/*   <Image */}
        {/*     src="/images/bg-coffee.jpg" */}
        {/*     alt="Image de la page d'accueil Toccatech" */}
        {/*     width={1024} */}
        {/*     height={656} */}
        {/*   /> */}
        {/* </div> */}
        <Button className="blue--text">I am a button!</Button>
        <Button className="red--text">Buttonbuttonbutton!</Button>
        <Button className="purple--text" prependIcon="favorite">
          I have an icon!
        </Button>
        <Button className="blue lighten-2" trailingIcon="send">
          I have a trailing icon!
        </Button>
        <Button className="blue lighten-2 red--text" isIconButton icon="favorite" isText />
        <Button className="blue darken-3 red--text" isIconButton icon="favorite" />
        <Button isIconButton icon="favorite" size="large" className="orange yellow--text" />
        <span>Hello, world</span>
        <Button className="green--text" isText>
          Click me!
        </Button>
        <Button className="orange--text" isText>
          Click me!
        </Button>
        <Button className="purple--text" isText>
          Click me!
        </Button>
        <Button isText>Test</Button>
        <Button className="orange lighten-3">I am also a button!</Button>
        <Button isDisabled>I am disabled!</Button>
        <Button size="large">I am a large button!</Button>
        <Button>Hello world!</Button>
        <Card>
          {/* <h3 className="card-title">I am the title of the card</h3> */}
          {/* <div className="card-content"> */}
          {/*   <p> */}
          {/*     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quia atque, totam */}
          {/*     assumenda autem molestiae voluptatum quidem unde excepturi minima, accusamus fugiat */}
          {/*     non deleniti rem amet adipisci inventore earum itaque? */}
          {/*   </p> */}
          {/* </div> */}
          {/* <div className="card-actions"> */}
          {/*   <Spacer /> */}
          {/*   <Button className="green" onClick={() => console.log("Button clicked!")}> */}
          {/*     Valider */}
          {/*   </Button> */}
          {/* </div> */}
          <CardHeader
            title={
              <Ripple>
                <h5>My First Card</h5>
              </Ripple>
            }
            subtitle={<p>My First Subtitle</p>}
            action={<Button isIconButton className="red" icon="delete" size="large" />}
          />
          <CardContent>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore facere velit
              dolore, rerum magni assumenda voluptatibus, exercitationem corporis, et ad in nihil!
              Doloremque ratione facere sunt exercitationem nulla, soluta harum!
            </p>
          </CardContent>
          <CardActions>
            <Spacer />
            <Button className="green">Submit</Button>
          </CardActions>
        </Card>
        <Form setFormValidity={setIsFormValid}>
          <InputField
            value={myValue}
            setValue={(newValue) => {
              setMyValue(newValue);
            }}
            label="My First Input Field"
            placeholder="Enter your name"
            prependIcon="favorite"
            maxLength={20}
            isRequired
            fullWidth
          />
          <InputField
            value={myValue}
            setValue={(newValue) => {
              setMyValue(newValue);
            }}
            label="My best input field!"
          />
          <InputField
            value={myValue}
            setValue={(newValue) => {
              setMyValue(newValue);
            }}
            placeholder="No label"
            width="200px"
          />
          <InputField
            type="select"
            value={myValue}
            setValue={setMyValue}
            selectItems={["Marion", "Moummy", "Douddy", "Filou"]}
            label="My First Select!"
            width="50%"
          />
          <InputField
            type="textarea"
            value={myValue}
            setValue={setMyValue}
            label="My First Text Area!"
            maxLength={1000}
            nbRows={6}
            isRequired
            fullWidth
          />
          <Button isDisabled={!isFormValid}>Submit</Button>
        </Form>
      </Container>
    </div>
  );
}
