import type { ReactNode } from "react";
import { isApproved, type ClaimId } from "../content/claims";

export function Claim({ id, children }: { id: ClaimId; children: ReactNode }) {
  return isApproved(id) ? <>{children}</> : null;
}
