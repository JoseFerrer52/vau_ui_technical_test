import "../style/Modal.css";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
}

export const Modal = ({ children, isOpen }: ModalProps) => {
  return (
    <article className={`modal ${isOpen ? "is-open" : ""}`}>
      <div className="modal-container">{children}</div>
    </article>
  );
};
