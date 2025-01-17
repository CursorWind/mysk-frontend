// External libraries
import { parse } from "csv-parse";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  FileInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const OptionalIcon = () => (
  <div className="text-xl text-tertiary">
    <MaterialIcon icon="help_outline" allowCustomSize />
  </div>
);

const ImportDataDialog = ({
  show,
  onClose,
  onSubmit,
  columns,
}: DialogProps & {
  onSubmit: (e: any) => void;
  columns: {
    name: string;
    type: string;
    optional?: boolean;
  }[];
}): JSX.Element => {
  const { t } = useTranslation(["admin", "common"]);

  const [csvFile, setCSVFile] = useState<File | null>();
  const [csvData, setCSVData] = useState<any[]>();
  const [hasHeader, setHasHeader] = useState<boolean>(true);

  function validate(): boolean {
    // Check if file exists
    if (!csvFile) return false;

    // Check if file has content
    if (!csvData) return false;

    // Check if file type is CSV
    if (!csvFile.name.match(/.csv$/)) return false;

    return true;
  }

  async function parseCSV() {
    if (!csvFile) return;

    const fileContent: string | ArrayBuffer = await new Promise(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) =>
          e.target?.result ? resolve(e.target.result) : reject();
        reader.onerror = (e) => reject(e);
        reader.readAsText(csvFile);
      }
    );

    if (!fileContent) return;
    if (typeof fileContent !== "string") return;

    parse(
      fileContent,
      {
        columns: columns.map((c) => c.name),
        delimiter: ",",
        skip_empty_lines: true,
        cast: true,
        relax_column_count: true,
        trim: true,
        from: hasHeader ? 2 : 1,
      },
      (err, result) => {
        if (err) {
          console.error(err);
          return;
        } else if (!result) {
          console.error("No data");
          return;
        }

        setCSVData(result);
      }
    );
  }

  useEffect(() => setCSVFile(null), [show]);

  useEffect(() => {
    if (csvFile) parseCSV();
  }, [csvFile]);

  return (
    <Dialog
      type="large"
      label="import-data"
      title={t("dialog.importData.title")}
      actions={[
        {
          name: t("dialog.importData.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.importData.action.import"),
          type: "submit",
          disabled: !validate(),
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={() => onSubmit(csvData)}
    >
      <DialogSection name="columns">
        <h2 className="sr-only">{t("dialog.importData.columns.title")}</h2>
        <p>{t("dialog.importData.columns.info")}</p>
        <p className="flex flex-row flex-wrap items-center gap-x-1">
          <Trans i18nKey="dialog.importData.columns.optionalNote" ns="admin">
            <span className="font-display">Note:</span>
            <OptionalIcon />
            means optional.
          </Trans>
        </p>
        <div
          className="mb-4 h-72 resize-y overflow-y-scroll rounded-t-sm
            border-b-2 border-inverse-surface bg-surface-2
            p-2 text-on-surface sm:h-40"
        >
          <div className="flex flex-col gap-1" translate="no">
            {columns.length > 0
              ? columns.map((column) => (
                  <div
                    key={column.name}
                    className="flex flex-row items-center gap-1"
                  >
                    {column.optional && <OptionalIcon />}
                    <div className="leading-none">
                      <h3 className="inline align-middle !text-base">
                        {column.name}
                        {": "}
                      </h3>
                      <span className="align-middle text-sm">
                        {column.type}
                      </span>
                    </div>
                  </div>
                ))
              : t("dialog.importData.columns.noColumns")}
          </div>
        </div>
      </DialogSection>

      <DialogSection name="upload" title={t("dialog.importData.upload.title")}>
        <div className="sm:grid sm:grid-cols-2 sm:gap-x-6">
          <div>
            <FileInput
              name="file"
              label={t("dialog.importData.upload.file")}
              noneAttachedMsg={t("input.none.noFilesAttached", {
                ns: "common",
              })}
              onChange={(e) => setCSVFile(e)}
              attr={{ accept: ".csv, text/csv" }}
            />
            <div className="flex flex-row gap-2">
              <input
                id="has-header"
                name="has-header"
                type="checkbox"
                onChange={(e) => setHasHeader(e.target.checked)}
                checked={hasHeader}
              />
              <label htmlFor="has-header">
                {t("dialog.importData.upload.hasHeader")}
              </label>
            </div>
          </div>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default ImportDataDialog;
