// External libraries
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Dialog,
  KeyboardInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import CheckEmailDialog from "@components/dialogs/account/CheckEmail";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { DialogComponent } from "@utils/types/common";

const ForgotPasswordDialog: DialogComponent<{ inputEmail?: string }> = ({
  show,
  onClose,
  inputEmail,
}) => {
  const { t } = useTranslation("account");

  const [email, setEmail] = useState<string>(inputEmail || "");

  const [loading, toggleLoading] = useToggle();

  // Dialog control
  const [showCheckEmail, toggleShowCheckEmail] = useToggle();

  return (
    <>
      <Dialog
        type="regular"
        label="forgot-password"
        title={t("dialog.forgotPassword.title")}
        icon={<MaterialIcon icon="lock_open" />}
        supportingText={t("dialog.forgotPassword.supportingText")}
        show={show}
        actions={[
          { name: t("dialog.forgotPassword.action.cancel"), type: "close" },
          {
            name: t("dialog.forgotPassword.action.send"),
            type: "submit",
            disabled: !email || loading,
          },
        ]}
        onClose={onClose}
        onSubmit={async () => {
          if (!email) return;
          toggleLoading();
          const { data, error } = await supabase.auth.resetPasswordForEmail(
            email
          );
          if (data) toggleShowCheckEmail();
          if (error) {
            console.error(error);
            toggleLoading();
          }
        }}
      >
        <KeyboardInput
          name="email"
          type="email"
          label={t("logIn.form.email")}
          helperMsg={t("logIn.form.email_helper")}
          errorMsg={t("logIn.form.email_error")}
          useAutoMsg
          onChange={setEmail}
          defaultValue={inputEmail}
        />
      </Dialog>

      {/* Dialogs */}
      <CheckEmailDialog
        show={showCheckEmail}
        onClose={() => {
          toggleShowCheckEmail();
          onClose();
        }}
        email={email}
      />
    </>
  );
};

export default ForgotPasswordDialog;
