import { NextRequest, NextResponse } from "next/server";
import { getFileIdFromNotes, getPagePropStatus } from "@lib/notion";
import { deleteFile } from "@lib/box";
import { RecruitmentStatus, NotionWebhookEvent } from "@lib/consts";

type NotionWebhookBody = {
  entity: {
    id: string;
    type: string;
  }
  type: string;
  data: {
    parent: {
      id: string;
      type: string;
    }, updated_properties: string[];
  }
}

export async function POST(req: NextRequest) {
  // get webhook body
  const body = (await req.json()) as NotionWebhookBody;
  console.log("Webhook body:", JSON.stringify(body, null, 2));

  // check event type
  if (body.type !== NotionWebhookEvent.PAGE_PROPERTIES_UPDATED) {
    console.log("Not a page.properties_updated event, no action");
    return NextResponse.json({ message: "Not a page.properties_updated event, no action" }, { status: 200 });
  }

  // check page status, if stauts is OK then delete filr on Box
  const pagePropStatus = await getPagePropStatus(body.entity.id);
  if (pagePropStatus.status?.name === RecruitmentStatus.OFFERED || pagePropStatus.status?.name === RecruitmentStatus.CLOSED) {
    console.log("Page status is OFFERED/CLOSED, delete file on Box");

    try {
      const file_id = await getFileIdFromNotes(body.entity.id);
      await deleteFile(file_id);
    } catch (error) {
      console.error(error);
      // return status 200 to stop webhook retry
      return NextResponse.json({ message: "error deleting file" }, { status: 200 });
    }
  }

  return NextResponse.json({ message: "file deleted" }, { status: 200 });
}