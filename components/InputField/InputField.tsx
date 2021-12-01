import {
  useState,
  MouseEvent,
  FormEvent,
  useEffect,
  useRef,
  CSSProperties,
  useCallback,
  memo,
} from "react";
import inputFieldStyles from "./InputField.module.scss";
import cn from "classnames";
import Ripple from "../Ripple";
import Icon from "../Icon";
import useValidation from "./useValidation";

interface InputFieldProps {
  value: string;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  prependIcon?: string;
  width?: string;
  fullWidth?: boolean;
  setFieldsValidity?: (newValue: object | ((oldValue: object) => object)) => void;
  maxLength?: number;
  minLength?: number;
  isRequired?: boolean;
  customValidationRules?: ((value: string) => true | string)[];
  className?: string;

  // Events handlers from parent
  onPrependIconClick?: (event: MouseEvent<HTMLSpanElement>) => void;
}

interface TextInputProps extends InputFieldProps {
  type: "text" | "email" | "password" | "date";
  setValue: (newValue: string) => void;
}

interface TextAreaProps extends InputFieldProps {
  type: "textarea";
  setValue: (newValue: string) => void;
  nbRows?: number;
  nbCols?: number;
}

interface SelectInputProps extends InputFieldProps {
  type: "select";
  setValue: (newValue: string) => void;
  selectItems: string[];
  defaultSelection?: string;
  onSelect?: (event: MouseEvent<HTMLLIElement>, item: string) => void;
}

interface FileInputProps extends InputFieldProps {
  type: "file";
  setValue: (newValue: File | "") => void;
  acceptTypes?: string;
}

interface CustomCSSProperties extends CSSProperties {
  "--offset-width": string;
}

function InputField(props: TextInputProps | TextAreaProps | SelectInputProps | FileInputProps) {
  console.log("Input Field rendered!");
  const {
    value,
    label,
    placeholder,
    isDisabled,
    prependIcon,
    width,
    fullWidth = true,
    setFieldsValidity,
    maxLength,
    minLength,
    isRequired = false,
    customValidationRules = [],
    className,

    // Event handlers from parent
    onPrependIconClick,
  } = props;

  const [id, setId] = useState<string>("input-field");
  const { isValid, message, validateInput } = useValidation(
    value,
    props.type,
    { isRequired, maxLength, minLength },
    customValidationRules
  );
  const [isActive, setIsActive] = useState<boolean>(props.type === "date" ? true : false);
  const [isFocused, setIsFocused] = useState(false);
  const [computedPlaceholder, setComputedPlaceholder] = useState<string | undefined>(
    placeholder && !label ? placeholder : undefined
  );
  const [inputUid] = useState(() => "uid-" + Math.round(Math.random() * 100));
  const [selectActive, setSelectActive] = useState(false);
  const inputFieldRef = useRef<HTMLDivElement>(null);

  // Watchers
  // Compute the id of the input for the label
  useEffect(() => {
    const genId = (val: string) =>
      val.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 100);
    if (label) {
      setId(genId(label));
    } else if (placeholder) {
      setId(genId(placeholder));
    }
  }, [label, placeholder]);

  // Set input to always be active when the type is date
  useEffect(() => {
    if (props.type === "date") {
      setIsActive(true);
    }
  }, [props.type]);

  useEffect(() => {
    if (props.type == "select") {
      // Event listener to detect if the input field was clicked in order to
      // open the drop-down menu, or if the rest of the body to close it
      let handleClickBody = (event: globalThis.MouseEvent) => {
        let inputField = inputFieldRef.current!;
        let clickedElem = event.target as HTMLElement;
        if (inputField && inputField.contains(clickedElem) && !selectActive) {
          setSelectActive(true);
          setIsActive(true);
          setIsFocused(true);
        } else {
          setSelectActive(false);
          setIsFocused(false);
        }
      };
      document.addEventListener("click", handleClickBody);

      // Define default selection of the select input
      if (props.defaultSelection) {
        // See: https://github.com/facebook/react/issues/16265#issuecomment-517518539
        props.setValue.call(undefined, props.defaultSelection);
      } else if (!label) {
        props.setValue.call(undefined, props.selectItems[0]);
      }

      // Remove event listener on unmount
      return () => {
        console.log("Body click event listener removed!");
        document.removeEventListener("click", handleClickBody);
      };
    }
    // eslint-disable-next-line
  }, [props.type, props.setValue]);

  // Lift or reset label according to the content of the input field
  useEffect(() => {
    if (value) {
      setIsActive(true);
    } else if (!isFocused && props.type !== "date") {
      setIsActive(false);
    }
  }, [value, isFocused, props.type]);

  // Set or remove the computed placeholder accordingly
  useEffect(() => {
    if (placeholder) {
      if (label) {
        if (isActive) {
          setComputedPlaceholder(placeholder);
        } else {
          setComputedPlaceholder(undefined);
        }
      } else {
        setComputedPlaceholder(placeholder);
      }
    } else {
      setComputedPlaceholder(undefined);
    }
  }, [isActive, placeholder, label]);

  useEffect(() => {
    if (setFieldsValidity) {
      setFieldsValidity((prev) => ({ ...prev, [inputUid]: isValid }));
    }
  }, [isValid, setFieldsValidity, inputUid]);

  // Event handlers
  const handleFocus = useCallback(() => {
    setIsActive(true);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (value && props.type !== "date") {
      setIsActive(false);
      setIsFocused(false);
    } else {
      setIsFocused(false);
    }
  }, [value, props.type]);

  const handleInput = useCallback(
    (event: FormEvent) => {
      if (props.type !== "file") {
        props.setValue.call(undefined, (event.target as HTMLInputElement).value);
      } else {
        if ((event.target as HTMLInputElement).files!.length > 0) {
          props.setValue.call(undefined, (event.target as HTMLInputElement).files![0]);
        } else {
          props.setValue.call(undefined, "");
        }
      }
    },
    [props.type, props.setValue]
  );

  const handleFileInput = useCallback((event: FormEvent<HTMLInputElement>) => {}, []);

  // Templates
  const prependTemplate = prependIcon ? (
    <div className={inputFieldStyles.prepend}>
      <Icon
        iconName={prependIcon}
        className={inputFieldStyles.prependIcon}
        onClick={onPrependIconClick}
      />
    </div>
  ) : (
    false
  );

  let inputTemplate;
  if (props.type !== "textarea" && props.type !== "select") {
    inputTemplate = (
      <input
        type={props.type === "file" ? "text" : props.type}
        disabled={props.type == "file" || isDisabled}
        id={id}
        placeholder={computedPlaceholder}
        required={isRequired}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
      />
    );
  } else if (props.type === "select") {
    inputTemplate = (
      <>
        <div className={inputFieldStyles.selectionContainer}>{isActive && value}</div>
        <Icon iconName="arrow_drop_down" className={inputFieldStyles["arrow-container"]} />
        {selectActive && (
          <ul className={inputFieldStyles["drop-down"]}>
            {props.selectItems!.map((item) => (
              <Ripple key={item}>
                <li
                  onClick={(event) => {
                    props.setValue(item);
                    if (props.onSelect) {
                      props.onSelect(event, item);
                    }
                    setSelectActive(false);
                  }}
                >
                  {item}
                </li>
              </Ripple>
            ))}
          </ul>
        )}
      </>
    );
  } else if (props.type === "textarea") {
    inputTemplate = (
      <textarea
        disabled={isDisabled}
        id={id}
        placeholder={computedPlaceholder}
        required={isRequired}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        rows={props.nbRows}
        cols={props.nbCols}
      ></textarea>
    );
  }

  let fileInputTemplate;
  if (props.type === "file") {
    fileInputTemplate = (
      <input type="file" accept={props.acceptTypes} onChange={handleInput} disabled={isDisabled} />
    );
  }

  return (
    <div
      className={cn(inputFieldStyles.inputField, className, {
        [inputFieldStyles.disabled]: isDisabled,
        [inputFieldStyles.focused]: isFocused,
        [inputFieldStyles.active]: isActive,
        [inputFieldStyles.emtpy]: value === "",
        [inputFieldStyles.emptyAndRequired]: value === "" && isRequired,
        [inputFieldStyles.valid]: isValid,
        // Show invalidity only if the field is not empty and required
        [inputFieldStyles.invalid]: !isValid && !(value === "" && isRequired),
        [inputFieldStyles.select]: props.type === "select",
      })}
      ref={inputFieldRef}
      style={
        {
          maxWidth: width ? width : fullWidth ? undefined : "300px",
          "--offset-width": prependIcon ? "30px" : "0px",
        } as CustomCSSProperties
      }
    >
      {prependTemplate}
      {label && (
        <label htmlFor={id} className={cn({ [inputFieldStyles["shift-label"]]: prependIcon })}>
          {label}
        </label>
      )}
      <div className={inputFieldStyles.content}>
        {inputTemplate}
        {fileInputTemplate}
        <div className={inputFieldStyles.line}></div>
        <div className={inputFieldStyles.hints}>
          <div className={inputFieldStyles.message}>{message}</div>
          {maxLength && (
            <div className={inputFieldStyles.counter}>
              {value.length} / {maxLength}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(InputField);
