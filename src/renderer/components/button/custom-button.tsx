import { Spinner } from "../spinner";
import { Button } from "../ui/button";

// Define the prop types for our component
interface CustomButtonProps {
  /**
   * A function to handle on click events.
   */
  onClickHandler: () => void;

  /**
   * Indicates if the button should be disabled, typically because an operation is in progress.
   */
  isLoading: boolean;

  /*
   * The label for the button.
   */
  label: string;
}

/**
 * `CustomButton` is a specialized button component that provides
 * an easy mechanism perform custom operation via click event handler.
 *
 * @param {CustomButtonProps} props The props to configure the button.
 * @returns {JSX.Element} The rendered button.
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  onClickHandler,
  isLoading,
  label,
}) => {
  return (
    <Button
      onClick={onClickHandler}
      disabled={isLoading}
      className="rounded-2xl bg-white text-black text-xs font-bold border hover:bg-black hover:text-white"
    >
      {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
};

export { CustomButton };
