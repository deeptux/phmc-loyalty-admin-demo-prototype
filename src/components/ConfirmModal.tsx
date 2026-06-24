"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  danger?: boolean;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  isOpen,
  onClose,
  onConfirm,
  danger,
}: Props) {
  const state = useOverlayState({ isOpen, onOpenChange: (open) => !open && onClose() });

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-phmc-text-muted">{message}</p>
            </Modal.Body>
            <Modal.Footer className="gap-2">
              <Button variant="ghost" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant={danger ? "danger" : "primary"}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
