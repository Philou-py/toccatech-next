import { ReactElement, useCallback, useRef, MouseEvent, cloneElement } from "react";
import modalStyles from "./Modal.module.scss";
import { CSSTransition } from "react-transition-group";

interface ModalProps {
  showModal: boolean;
  children: ReactElement;
  closeFunc: (isOpen: boolean) => void;
}

export default function Modal({ showModal = false, closeFunc, children }: ModalProps) {
  const modalBgRef = useRef(null);
  const transitionWrapperRef = useRef(null);

  const handleBgClick = useCallback(
    (event: MouseEvent) => {
      if (
        (event.target as HTMLDivElement).isSameNode(modalBgRef.current) ||
        (event.target as HTMLDivElement).isSameNode(transitionWrapperRef.current)
      ) {
        closeFunc(false);
      }
    },
    [closeFunc]
  );

  return (
    <div className={modalStyles.modal}>
      <CSSTransition
        nodeRef={modalBgRef}
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
            nodeRef={transitionWrapperRef}
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
            <div
              ref={transitionWrapperRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {children}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  );
}
