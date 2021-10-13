import {
  ReactNode,
  useState,
  ChangeEvent,
  MouseEvent,
  FocusEvent,
  FormEvent,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  CSSProperties,
  useCallback,
  memo,
} from "react";
import cn from "classnames";
import useValidation from "../hooks/useValidation";
import Ripple from "./Ripple";

interface InputFieldProps {
  type?: "text" | "email" | "password" | "date" | "textarea" | "select";
  value: string;
  setValue: (newValue: string) => void;
  label?: string;
  placeholder?: string;
  nbRows?: number;
  nbCols?: number;
  isDisabled?: boolean;
  prependIcon?: string;
  width?: string;
  fullWidth?: boolean;
  selectItems?: string[];
  defaultSelection?: string;
  setInputValidity?: Dispatch<SetStateAction<object>>;
  maxLength?: number;
  minLength?: number;
  isRequired?: boolean;
  customValidationRules?: ((value: string) => true | string)[];

  // Events handlers from parent
  onPrependIconClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  onSelect?: (event: MouseEvent<HTMLLIElement>, item: string) => void;
}

interface CustomCSSProperties extends CSSProperties {
  "--offset-width": string;
}

function InputField(props: InputFieldProps) {
  console.log("Input Field rendered!");
  const {
    type = "text",
    value = "",
    setValue,
    label,
    placeholder,
    nbRows,
    nbCols,
    isDisabled,
    prependIcon,
    width,
    fullWidth,
    selectItems,
    defaultSelection,
    setInputValidity,
    maxLength,
    minLength,
    isRequired = false,
    customValidationRules = [],

    // Event handlers from parent
    onPrependIconClick,
    onSelect,
  } = props;

  const [id, setId] = useState<string>("input-field");
  const { isValid, message, validateInput } = useValidation(
    value,
    type,
    { isRequired, maxLength, minLength },
    customValidationRules
  );
  const [isActive, setIsActive] = useState<boolean>(type === "date" ? true : false);
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
    if (type === "date") {
      setIsActive(true);
    }
  }, [type]);

  useEffect(() => {
    if (type == "select") {
      // Event listener to detect if the input field was clicked in order to
      // open the drop-down menu, or if the rest of the body to close it
      let handleClickBody = (event: globalThis.MouseEvent) => {
        let inputField = inputFieldRef.current!;
        let clickedElem = event.target as HTMLElement;
        if (inputField.contains(clickedElem) && !selectActive) {
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
      if (defaultSelection) {
        setValue(defaultSelection);
      } else if (!label) {
        setValue(selectItems![0]);
      }

      // Remove event listener on unmount
      return () => {
        console.log("Body click event listener removed!");
        document.removeEventListener("click", handleClickBody);
      };
    }
    // eslint-disable-next-line
  }, [type]);

  // Lift or reset label according to the content of the input field
  useEffect(() => {
    if (value) {
      setIsActive(true);
    } else if (!isFocused && type !== "date") {
      setIsActive(false);
    }
  }, [value, isFocused, type]);

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
    if (setInputValidity) {
      setInputValidity((prev) => ({ ...prev, [inputUid]: isValid }));
    }
  }, [isValid, setInputValidity, inputUid]);

  // Event handlers
  const handleFocus = useCallback(() => {
    setIsActive(true);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (!value && type !== "date") {
      setIsActive(false);
      setIsFocused(false);
    } else {
      setIsFocused(false);
    }
  }, [value, type]);

  const handleInput = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue((event.target as HTMLInputElement).value);
    },
    [setValue]
  );

  // Template
  const prependTemplate = prependIcon ? (
    <div className="prepend">
      <span className="material-icons prepend-icon" onClick={onPrependIconClick}>
        {prependIcon}
      </span>
    </div>
  ) : (
    false
  );

  let inputTemplate;
  if (type !== "textarea" && type !== "select") {
    inputTemplate = (
      <input
        type={type}
        disabled={isDisabled}
        id={id}
        placeholder={computedPlaceholder}
        required={isRequired}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
      />
    );
  } else if (type === "select") {
    inputTemplate = (
      <div className="input-container">
        <div className="selection-container">{isActive && value}</div>
        <span className="arrow-container material-icons">arrow_drop_down</span>
        {selectActive && (
          <ul className="drop-down">
            {selectItems!.map((item) => (
              <Ripple key={item}>
                <li
                  onClick={(event) => {
                    setValue(item);
                    if (onSelect) {
                      onSelect(event, item);
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
      </div>
    );
  } else if (type === "textarea") {
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
        rows={nbRows}
        cols={nbCols}
      ></textarea>
    );
  }

  return (
    <div
      className={cn("input-field", {
        disabled: isDisabled,
        focused: isFocused,
        active: isActive,
        emtpy: value === "",
        emptyAndRequired: value === "" && isRequired,
        valid: isValid,
        // Show invalidity only if the field is not empty and required
        invalid: !isValid && !(value === "" && isRequired),
        select: type === "select",
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
        <label htmlFor={id} className={cn({ "shift-label": prependIcon })}>
          {label}
        </label>
      )}
      <div className="content">
        {inputTemplate}
        <div className="line"></div>
        <div className="hints">
          <div className="message">{message}</div>
          {maxLength && (
            <div className="counter">
              {value.length} / {maxLength}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(InputField);
