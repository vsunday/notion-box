import { BoxCcgAuth, CcgConfig, BoxClient } from "box-typescript-sdk-gen";
import env from "@/app/env";
import { AiExtractStructured, AiExtractStructuredFieldsField } from "box-typescript-sdk-gen/lib/schemas/aiExtractStructured.generated";
import { AiItemBase } from "box-typescript-sdk-gen/lib/schemas/aiItemBase.generated";
import { AddShareLinkToFileQueryParams, AddShareLinkToFileRequestBody, AddShareLinkToFileRequestBodySharedLinkAccessField, AddShareLinkToFileRequestBodySharedLinkField } from "box-typescript-sdk-gen/lib/managers/sharedLinksFiles.generated";

type ResumeMetadata = {
  name: string;
  job_position: "Software Engineer" | "Sales Representative";
}

type AiExtractStructuredRawData = {
  answer: ResumeMetadata;
  ai_agent_info: {
    processor: string;
    models: {
      name: string;
      provider: string;
    }
    created_at: string;
    completion_reason: string;
  }
}

const ccgConfig = new CcgConfig({
  clientId: env.BOX_CLIENT_ID,
  clientSecret: env.BOX_CLIENT_SECRET,
  enterpriseId: env.BOX_ENTERPRISE_ID
})

const ccgAuth = new BoxCcgAuth({ config: ccgConfig });

const boxClient = new BoxClient({
  auth: ccgAuth
});

// metadata extraction
export async function getResumeMetadata(file_id: string) {
  const params = {
    fields: [{
      key: "name",
      type: "string",
      description: "Cadidate name",
      prompt: "This document is a resume from a candidate. Please extract the candidate's name.",
    } satisfies AiExtractStructuredFieldsField,
    {
      key: "job_position",
      type: "enum",
      description: "Job position",
      prompt: "This document is a resume from a candidate. Please extract job position best suited for the candidate",
      options: [
        { key: "Software Engineer" },
        { key: "Sales Representative" },
      ]
    } satisfies AiExtractStructuredFieldsField,
    ],
    items: [new AiItemBase({ id: file_id })]
  } satisfies AiExtractStructured

  const metadata = await boxClient.ai.createAiExtractStructured(params);

  if (!metadata.rawData) {
    throw new Error("No raw data found in the response");
  }

  const rawData = metadata.rawData as AiExtractStructuredRawData;
  return rawData.answer;
}

// create share link
export async function createSharedLink(file_id: string) {
  const res = await boxClient.sharedLinksFiles.addShareLinkToFile(file_id, {
    sharedLink: {
      access: "collaborators" as AddShareLinkToFileRequestBodySharedLinkAccessField
    } satisfies AddShareLinkToFileRequestBodySharedLinkField,
  } as AddShareLinkToFileRequestBody, { fields: 'shared_link' } satisfies AddShareLinkToFileQueryParams)
  return res;
}

// create collab

// delete file
export async function deleteFile(file_id: string) {
  const res = await boxClient.files.deleteFileById(file_id);
  return res;
}

export async function test() {
  const user = await boxClient.users.getUserMe();
  return user;
}