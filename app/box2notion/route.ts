import { NextResponse } from 'next/server';
import { insertDatabase, appendBlockChildren } from '@lib/notion';
import { createSharedLink, getResumeMetadata } from '@lib/box';

type BoxWebhookBody = {
  source: {
    id: string;
  }
}

// sample implentation of a router of api router in Next.js
export async function POST(req: Request) {
  // get webhook body
  const body = (await req.json()) as BoxWebhookBody;
  const file_id = body.source.id;

  // extract metadata from file
  const {name, job_position} = await getResumeMetadata(file_id);

  // create shared link
  const sharedFile = await createSharedLink(file_id);

  // create a page in Notion DB
  const notionRes = await insertDatabase(name, job_position, file_id);
  const page_id = notionRes.id;

  // add block to the page
  const appended = await appendBlockChildren(page_id, sharedFile.sharedLink?.url as string);

  return NextResponse.json({ message: body }, {status: 200});
}