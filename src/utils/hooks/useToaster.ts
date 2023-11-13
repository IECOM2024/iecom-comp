import { useToast } from "@chakra-ui/react";

type voidFn = () => void | undefined;

export const useToaster = <T>() => {
  const toast = useToast();

  /* eslint-disable */
  const toaster = (
    pr: Promise<T>,
    fns?: {
      thenFn?: voidFn;
      catchFn?: voidFn;
      finnalyFn?: voidFn;
    } | null
  ) => {
    const { thenFn, catchFn, finnalyFn } = fns ?? {
      thenFn: null,
      catchFn: null,
      finnalyFn: null,
    };

    pr.then((res) => {
      toast({
        title: "Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      thenFn && thenFn();
    })
      .catch((err: Error) => {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        catchFn && catchFn();
      })
      .finally(() => {
        finnalyFn && finnalyFn();
      });
  };

  return toaster;
};
