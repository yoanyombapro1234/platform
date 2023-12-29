import { BackendError } from "@solomon-ai/component-library";

export interface ErrorState {
  message: BackendError;
  statusCode: number;
}

export const InitialErrorState: ErrorState = {
  message: {} as BackendError,
  statusCode: 0,
};
