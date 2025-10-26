import { useI18n } from "@/hooks/use-i18n";
import { Dialog } from "./dialog";

type ConfirmDialogProps = {
  isOpen: boolean;
  description: string;
  onClose: () => void;
  onExited?: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onExited,
  description,
  onConfirm,
}: ConfirmDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} onExited={onExited}>
      <Dialog.Header>{t("warning")}!</Dialog.Header>
      <Dialog.Content>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.CancelAction className="w-24">
          {t("cancel")}
        </Dialog.CancelAction>
        <Dialog.ConfirmAction
          variant="alert"
          onClick={onConfirm}
          className="w-24"
        >
          {t("confirm")}
        </Dialog.ConfirmAction>
      </Dialog.Footer>
    </Dialog.Root>
  );
};
