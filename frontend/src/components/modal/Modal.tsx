import { Button } from "@components/ui/button";
import React from "react";

import { createPortal } from "react-dom";

interface ModalProps {
  title?: string;
  onClose: () => void;
  onSubmit?: () => any;
  show?: boolean;
  children?: React.ReactNode;
}

export default function Modal({
  show = false,
  title = "Modal",
  onClose,
  onSubmit,
  children,
}: ModalProps) {
  return createPortal(
    <div className={`modal ${show ? "show" : ""}`} onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title"> {title} </h4>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <Button onClick={onClose} variant="danger" className="modal-button">
            Close
          </Button>
          {onSubmit ? (
            <Button
              variant="success"
              onClick={onSubmit}
              className="modal-button"
            >
              Submit
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
}
