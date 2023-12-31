import { useForm, SubmitHandler } from "react-hook-form";
import { CreateAccountV2RequestClass } from "@solomon-ai/component-library";

type Inputs = {
  example: string;
  exampleRequired: string;
};
export const TestMultiStepCreateBusinessAccountForm: React.FC<{
  className?: string;
  callback: (data: CreateAccountV2RequestClass) => void;
  instrumentationCallback?: () => void;
}> = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);


  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="test" {...register("example")} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
};
