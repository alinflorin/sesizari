import { useTranslation } from "react-i18next";
import useComplaints from "../hooks/useComplaints";
import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";
import { useCallback, useEffect, useState } from "react";
import { Complaint } from "../models/complaint";
import { DocumentSnapshot } from "firebase/firestore";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Link,
  makeStyles,
  Option,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import { stringToHexColor } from "../helpers/color-helpers";
import { ChevronLeftRegular, ChevronRightRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    height: "100%",
  },
  table: {
    flex: "auto",
  },
  innerTable: {
    minWidth: "600px",
  },
  wb: {
    wordBreak: "break-all",
  },
  pagination: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pages: {
    display: "flex",
    alignItems: "center",
  },
  dd: {
    minWidth: "70px",
    width: "70px",
  },
});

export default function TenantAdmin() {
  const { t } = useTranslation();
  const { getComplaintsForAdmin } = useComplaints();
  const { tenant } = useOutletContext<{
    tenant: Tenant | undefined;
  }>();
  const [complaints, setComplaints] = useState<Complaint[] | undefined>();
  const [tenantId, setTenantId] = useState<string | undefined>();
  const [previousDocs, setPreviousDocs] = useState<DocumentSnapshot[]>([]);
  const [rightDoc, setRightDoc] = useState<DocumentSnapshot | undefined>();
  const [startAt, setStartAt] = useState<DocumentSnapshot | undefined>();
  const [elementsPerPage, setElementsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!tenant || tenantId) {
      return;
    }
    setTenantId(tenant.id!);
  }, [tenant, tenantId]);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    (async () => {
      const result = await getComplaintsForAdmin(
        tenantId,
        elementsPerPage,
        startAt
      );
      setComplaints(result.data);
      setRightDoc(result.rightElement);
      setTotalCount(result.count);
    })();
  }, [tenantId, getComplaintsForAdmin, elementsPerPage, startAt]);

  const classes = useStyles();

  const navBack = useCallback(() => {
    setStartAt(previousDocs[previousDocs.length - 2]);
    previousDocs.splice(previousDocs.length - 1, 1);
    setPreviousDocs(previousDocs)
  }, [previousDocs]);

  const navFwd = useCallback(() => {
    setStartAt(rightDoc);
    setPreviousDocs([...previousDocs, rightDoc!]);
  }, [rightDoc, previousDocs]);

  return (
    <div className={classes.container}>
      <div className={classes.table}>
        <Table className={classes.innerTable}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("ui.routes.tenantAdmin.id")}</TableHeaderCell>
              <TableHeaderCell>
                {t("ui.routes.tenantAdmin.date")}
              </TableHeaderCell>
              <TableHeaderCell>
                {t("ui.routes.tenantAdmin.status")}
              </TableHeaderCell>
              <TableHeaderCell>
                {t("ui.routes.tenantAdmin.category")}
              </TableHeaderCell>
              <TableHeaderCell>
                {t("ui.routes.tenantAdmin.author")}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints && (
              <>
                {complaints.map((c) => (
                  <TableRow key={c.id!}>
                    <TableCell>
                      <TableCellLayout>
                        <Link
                          className={classes.wb}
                        >
                          {c.id!}
                        </Link>
                      </TableCellLayout>
                    </TableCell>
                    <TableCell>
                      <TableCellLayout>
                        {c.submissionDate!.toDate().toLocaleString()}
                      </TableCellLayout>
                    </TableCell>
                    <TableCell>
                      <TableCellLayout>
                        <b>{t("ui.routes.tenantAdmin.statuses." + c.status)}</b>
                      </TableCellLayout>
                    </TableCell>
                    <TableCell>
                      <TableCellLayout
                        media={
                          <Badge
                            shape="square"
                            style={{
                              background: stringToHexColor(c.category),
                            }}
                            size="extra-small"
                          />
                        }
                      >
                        {c.category}
                      </TableCellLayout>
                    </TableCell>
                    <TableCell>
                      <TableCellLayout
                        media={
                          <Avatar
                            name={c.authorName}
                            badge={{
                              status: "unknown",
                            }}
                          />
                        }
                      >
                        {c.authorName}
                      </TableCellLayout>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={classes.pagination}>
        <div className={classes.pages}>
          <Button
            disabled={previousDocs.length === 0}
            onClick={navBack}
            icon={<ChevronLeftRegular />}
          />
          <Button
            disabled={!rightDoc || ((previousDocs.length + 1 * elementsPerPage) >= totalCount)}
            onClick={navFwd}
            icon={<ChevronRightRegular />}
          />
          <div>&nbsp;&nbsp;</div>
          <Dropdown
            value={elementsPerPage + ""}
            selectedOptions={[elementsPerPage + ""]}
            onOptionSelect={(_, d) => setElementsPerPage(+d.optionValue!)}
            className={classes.dd}
            placeholder={t("ui.routes.tenantAdmin.pageSize")}
          >
            {[10, 20, 50, 100, 500].map((p) => (
              <Option key={p + ""} value={p + ""}>
                {p + ""}
              </Option>
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
