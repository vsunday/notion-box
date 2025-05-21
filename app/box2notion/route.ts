import { type NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { insertDatabase, queryDatabase, getPageProp, getBlockChildren, appendBlockChildren } from '@/app/box2notion/test';

// sample implentation of a router of api router in Next.js
export async function GET(req: NextApiRequest) {
  // Test the environment variables

  // const res = await getPageProp();
  // const res = await queryDatabase();
  // const res = await getPageProp();
  // const res = await getBlockChildren();
  const res = await insertDatabase();
  const appended = await appendBlockChildren(res.id);
  return NextResponse.json({ message: appended }, {status: 200});
}