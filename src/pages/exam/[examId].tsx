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

const ExamPageComponent = ({setTitle} : {
  setTitle: (title: string) => void
}) => {
  const router = useRouter();
  const examId =
    typeof router.query.examId === "string"
      ? router.query.examId
      : router.query.examId?.[0];

  return (
    <Box overflow="hidden">
      {examId ? <ExamGate examId={examId} setTitle={setTitle}/> : "Loading..."}
    </Box>
  );
};

export default function ExamPageById() {
  // state asf gr2 bodo
  const [title, setTitle] = useState<string>("");

  return (
    <AuthorizedRoleLayout title={title}>
      <ExamPageComponent setTitle={setTitle}/>
    </AuthorizedRoleLayout>
  );
}
