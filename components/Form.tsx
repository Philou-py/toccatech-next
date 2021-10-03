import {
  useEffect,
  useState,
  FormEvent,
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  Dispatch,
  SetStateAction,
  isValidElement,
} from "react";

interface FormProps {
  setFormValidity: Dispatch<SetStateAction<boolean>>;
  action?: string;
  method?: string;
  onSubmit?: (event: FormEvent) => void;
  preventDefault?: boolean;
  children: ReactNode;
}

export default function Form({
  action,
  method,
  preventDefault,
  onSubmit,
  children,
  setFormValidity,
}: FormProps) {
  const handleSubmit = (event: FormEvent) => {
    if (preventDefault) event.preventDefault();
    if (onSubmit) onSubmit(event);
  };

  const [fieldsValidity, setFieldsValidity] = useState<object>({});

  useEffect(() => {
    setFormValidity(Object.values(fieldsValidity).includes(false) ? false : true);
  }, [fieldsValidity, setFormValidity]);

  return (
    <form action={action} method={method} onSubmit={handleSubmit}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            setInputValidity: setFieldsValidity,
          });
        }
      })}
    </form>
  );
}
