import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { BiUserCircle } from "react-icons/bi";
import { useEffect, useState } from "react";
import { AuthorizedRoleLayout } from "~/components/layout/AuthorizedRoleLayout";
import { FlagStatus } from "@prisma/client";
import moment from "moment";
import { ExamGate } from "~/components/exam/ExamGate";

const ExamPageComponent = () => {
  const router = useRouter();
  const examId =
    typeof router.query.examId === "string"
      ? router.query.examId
      : router.query.examId?.[0];

  return (
    <Box height="100vh" overflow="hidden">
      <Flex justifyContent="center" alignItems="center" padding="0.3em">
        <Heading fontSize="2rem" color="blue" fontFamily="Arial">
          IECOM - Preliminary
        </Heading>
      </Flex>
      {examId ? <ExamGate examId={examId}/> : "Loading..."}
    </Box>
  );
};

export default function ExamPageById() {
  return (
    <AuthorizedRoleLayout>
      <ExamPageComponent />
    </AuthorizedRoleLayout>
  );
}
