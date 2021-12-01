import { ReactNode, useCallback, DetailedHTMLProps, FormHTMLAttributes, FormEvent } from "react";

interface FormProps {
  onSubmit: (event: FormEvent) => void;
  preventDefault: boolean;
  otherProps: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
  children?: ReactNode;
}

export default function Form({ preventDefault, onSubmit, children, ...otherProps }: FormProps) {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      if (preventDefault) event.preventDefault();
      if (onSubmit) onSubmit(event);
    },
    [preventDefault, onSubmit]
  );

  return <form onSubmit={handleSubmit}>{children}</form>;
}
