import {
  useEffect,
  useState,
  FormEvent,
  Children,
  cloneElement,
  ReactNode,
  Dispatch,
  SetStateAction,
  isValidElement,
  useCallback,
  memo,
} from "react";

interface FormProps {
  getFormValidity: Dispatch<SetStateAction<boolean>>;
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
  getFormValidity: getFormValidity,
}: FormProps) {
  const [fieldsValidity, setFieldsValidity] = useState<object>({});

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      if (preventDefault) event.preventDefault();
      if (onSubmit) onSubmit(event);
    },
    [preventDefault, onSubmit]
  );

  useEffect(() => {
    getFormValidity(Object.values(fieldsValidity).includes(false) ? false : true);
  }, [fieldsValidity, getFormValidity]);

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
