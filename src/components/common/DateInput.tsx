import { type ChakraProps, Input } from '@chakra-ui/react';

interface DateInputProps extends ChakraProps {
  dateState: Date | undefined;
  setDateState: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const DateInput = ({
  dateState,
  setDateState,
  ...rest
}: DateInputProps) => {
  const getDateFormat = (date: Date) => {
    const month = (date.getMonth() || 0) + 1;
    const day = date.getDate() || 1;
    return `${date.getFullYear() || '2023'}-${
      month > 9 ? month : '0' + month.toString()
    }-${day > 9 ? day : '0' + day.toString()}`;
  };

  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const format = e.target.value;

    setDateState(new Date(`${format}T07:00:00`));
  };

  return (
    <Input
      {...rest}
      type='date'
      value={dateState && getDateFormat(dateState ?? new Date())}
      onChange={dateChangeHandler}
      color='white'
    />
  );
};
