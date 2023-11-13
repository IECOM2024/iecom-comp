import { ChakraProps, Input } from '@chakra-ui/react';

export interface TimeInputProps extends ChakraProps {
  timeState: [number, number];
  setTimeState: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export const TimeInput = ({
  timeState,
  setTimeState,
  ...rest
}: TimeInputProps) => {
  const getTimeFormat = (timeState: [number, number]) => {
    const hour = timeState[0];
    const minute = timeState[1];
    return `${hour > 9 ? hour : '0' + hour.toString()}:${
      minute > 9 ? minute : '0' + minute.toString()
    }`;
  };

  const timeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const format = e.target.value.split(':');
    setTimeState([parseInt(format[0] ?? '0'), parseInt(format[1] ?? '0')]);
  };

  return (
    <Input
      {...rest}
      type='time'
      value={getTimeFormat(timeState)}
      onChange={timeChangeHandler}
      color='white'
    />
  );
};
