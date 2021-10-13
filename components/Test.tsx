import { memo, useState } from "react";
import InputField from "./InputField";

function Test() {
  const [myTestValue, setMyTestValue] = useState("");
  return <InputField value={myTestValue} setValue={setMyTestValue} label="My Test Input Field" />;
}

export default memo(Test);
