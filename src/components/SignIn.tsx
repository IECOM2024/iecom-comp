import { api } from "~/utils/api";
import { FormEvent, FormEventHandler, useState } from "react";
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import { useToaster } from "~/utils/hooks/useToaster";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { PasswordInput } from "~/utils/elements/PasswordInput";

interface SignInProps {
  csrfToken: string;
}

export const SignIn = ({ csrfToken }: SignInProps) => {
  const toaster = useToaster();
  const router = useRouter();

  const {data: session} = useSession()

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const createUserMutation = api.user.createUser.useMutation();

  const credentialSignIn = (email: string, password: string) => {
    toaster(signIn("credentials", { email, password, redirect: true, csrfToken })
    );
  };

  const googleSignIn = () => {
    toaster(signIn("google", { redirect: true, csrfToken }));
  };

  const onSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    credentialSignIn(emailInput, passwordInput);
  };

  return (
      <Flex justifyContent="center">
        <Flex
          flexDirection="column"
          border="1px solid black"
          borderRadius="10px"
          p="1em"
          w="min(30em,95%)"
          mt="1em"
        >
          <Text textAlign="center" fontSize="3xl" color="blue" fontWeight="bold">Sign In</Text>
          <form onSubmit={onSignIn}>
            <FormControl>
              <Input
                mt="1em"
                w="100%"
                value={emailInput}
                onChange={emailChangeHandler}
                placeholder="Email"
                id="EmailInput"
              />

              <PasswordInput
                mt="1em"
                w="100%"
                value={passwordInput}
                type="password"
                onChange={passwordChangeHandler}
                placeholder="Password"
              />

              <Flex w="100%" flexDir="column" mt="1em">
                <Button type="submit" w="50%" m="auto">
                  Sign In
                </Button>
              </Flex>
            </FormControl>
          </form>
        </Flex>
      </Flex>
  );
};
