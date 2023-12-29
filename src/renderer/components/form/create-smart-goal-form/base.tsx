import { Dispatch, SetStateAction } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  MelodyFinancialContext,
  UserAccountClass,
} from "@solomon-ai/component-library";
import { OpenAIModel } from "src/components/ask-solomon-ai";
import { MultiStepVariant } from "../multi-step-variant/multi-step-variant";

export interface BaseFormProps<T extends FieldValues> {
  setStep: Dispatch<SetStateAction<number>>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<T, any, undefined>;
  className?: string;
  variant: MultiStepVariant;
  userAccount: UserAccountClass;
  globalContext: MelodyFinancialContext;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  specificContext: ContextHashMap<string> | any;
  userId: string;
  userName: string;
  instrumentationCallback?: () => void;
  apiToken: string;
  model: OpenAIModel;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
}

export interface BaseFieldProps<T extends FieldValues> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<T, any, undefined>;
  userAccount: UserAccountClass;
  globalContext: MelodyFinancialContext;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  specificContext: ContextHashMap<string> | any;
  enableGlobalContext?: boolean;
  userId: string;
  userName: string;
  financialContext: MelodyFinancialContext;
  instrumentationCallback?: () => void;
  apiToken: string;
  model: OpenAIModel;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
}

export interface ContextHashMap<T> {
  [key: string]: T;
}
