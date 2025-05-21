import { NextRequest, NextResponse } from "next/server";

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
  console.log(JSON.stringify(body, null, 2));

  // check event type
  if (body.type !== "page.properties_updated") {
    console.log("Not a page.properties_updated event, no action");
    return NextResponse.json({ message: "Not a page.properties_updated event, no action" }, { status: 200 });
  }

  // get metadat of file, name and job_position

  // request Notion to create a page


  return NextResponse.json({ message: JSON.stringify(body) }, { status: 200 });
}