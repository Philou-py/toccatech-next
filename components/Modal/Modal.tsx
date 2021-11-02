import { ReactElement, useCallback, useRef, MouseEvent, Dispatch, SetStateAction } from "react";
import modalStyles from "./Modal.module.scss";
import { CSSTransition } from "react-transition-group";

interface ModalProps {
  showModal: boolean;
  children: ReactElement;
  closeFunc: (isOpen: boolean) => void;
}

export default function Modal({ showModal = false, closeFunc, children }: ModalProps) {
  const modalBgRef = useRef(null);

  const handleBgClick = useCallback(
    (event: MouseEvent) => {
      if ((event.target as HTMLDivElement).isSameNode(modalBgRef.current)) {
        closeFunc(false);
      }
    },
    [closeFunc]
  );

  return (
    <div className={modalStyles.modal}>
      <CSSTransition
        in={showModal}
        timeout={300}
        mountOnEnter
        unmountOnExit
        classNames={{
          enter: modalStyles.tBgEnter,
          enterActive: modalStyles.tBgEnterActive,
          exit: modalStyles.tBgExit,
          exitActive: modalStyles.tBgExitActive,
        }}
      >
        <div className={modalStyles.bg} ref={modalBgRef} onClick={handleBgClick}>
          <CSSTransition
            in={showModal}
            timeout={300}
            appear
            classNames={{
              appear: modalStyles.tModalAppear,
              appearActive: modalStyles.tModalAppearActive,
              enter: modalStyles.tModalEnter,
              enterActive: modalStyles.tModalEnterActive,
              exit: modalStyles.tModalExit,
              exitActive: modalStyles.tModalExitActive,
            }}
          >
            <>{children}</>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  );
}
