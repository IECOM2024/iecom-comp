import { z } from "zod";
import { FolderEnum } from "~/utils/file";

export const zodStorageFolderLiteral = () =>
  z.union([
    z.literal(FolderEnum.PROFILE),
    z.literal(FolderEnum.DOCUMENT),
    z.literal(FolderEnum.COLOR_RUN_PROOF),
    z.literal(FolderEnum.CASE_COMP_FILES),
    z.literal(FolderEnum.CASE_COMP_PROOF),
    z.literal(FolderEnum.ESSAY_COMP_FILES),
    z.literal(FolderEnum.ESSAY_COMP_PROOF),
    z.literal(FolderEnum.ESSAY_COMP_SUBMISSION),
  ]);
