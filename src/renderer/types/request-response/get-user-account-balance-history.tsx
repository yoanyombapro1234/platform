import { AccountBalanceHistory } from "@solomon-ai/component-library";
import { ErrorResponse } from "../error/error";

/**
 * Represents the response for getting user account balance history.
 */
export class GetUserAccountBalanceHistoryResponse extends ErrorResponse {
  /**
   * List of account balance history records.
   */
  historicalAccountBalance: AccountBalanceHistory[] = [];

  constructor(data: Partial<GetUserAccountBalanceHistoryResponse>) {
    super();
    if (data) {
      Object.assign(this, {
        ...data,
      });
    }
  }
}

/**
 * Represents the request for getting user account balance history.
 */
export class GetUserAccountBalanceHistoryRequest {
  /**
   * The user ID associated with the request.
   */
  userId: number;

  /**
   * The page number of the requested data.
   */
  plaidAccountId: string;

  /**
   * Creates a new instance of GetUserAccountBalanceHistoryRequest.
   * @param partialRequest Partial request object to initialize the GetUserAccountBalanceHistoryRequest.
   * @remarks You can use this constructor to create a partial instance of GetUserAccountBalanceHistoryRequest.
   *          You can later populate the additional properties manually if needed.
   */
  constructor(partialRequest: Partial<GetUserAccountBalanceHistoryRequest>) {
    this.userId = partialRequest.userId || 0;
    this.plaidAccountId = partialRequest.plaidAccountId || "";
  }
}
