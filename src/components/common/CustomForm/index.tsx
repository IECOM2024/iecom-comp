import { FormControl } from "@chakra-ui/react";
import { DateInputProps } from "./DateInput";
import { FileInputProps } from "./FileInput";
import { TimeInputProps } from "./TimeInput";

interface TextInputProps {
  title: string;
  registerAs: string;
}
interface ButtonProps {
  text: string;
  onClick: () => void | Promise<void>;
}

type CustomFormValuesType = {
  [key in string]: {
    type:
      | "string"
      | "number"
      | "date"
      | "file"
      | "time"
      | "select"
      | "checkbox"
      | "radio"
      | "textarea"
      | "switch"
      | "slider"
      | "range"
      | "hidden"
      | "button"
      | "reset"
      | "submit"
      | "color"
      | "search"
      | "tel"
      | "url"
      | "email"
      | "password"
      | "datetime-local"
      | "month"
      | "week"
      | "text";
    value: number | string | Date | File | null | undefined;
  }[];
};
export interface CustomFormType<T extends CustomFormValuesType> {
  title: string;
  inputFields: (
    | TextInputProps
    | DateInputProps
    | FileInputProps
    | TimeInputProps
  )[];
  onSubmit: (data: T) => void | Promise<void>;
}

/** 
 * CustomForm (Nanti dulu, belum beres)
 * @param title: string
 * @param inputFields: TextInputProps[] | DateInputProps[] | FileInputProps[] | TimeInputProps[]
 * @param onSubmit: (data: T) => void | Promise<void>
 */
export const CustomForm = <T extends CustomFormValuesType>({
  title,
  inputFields,
  onSubmit,
}: CustomFormType<T>) => {
  return (
    <form>
      <FormControl></FormControl>
    </form>
  );
};
