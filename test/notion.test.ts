import { getPagePropNotes, getPageProp } from "@lib/notion";

async function test() {
  const response = await getPagePropNotes(process.env.PAGE_ID as string);
  console.log("Page properties:", JSON.stringify(response[0].rich_text.plain_text,null, 2));
}

async function getPagePropTest() {
  const response = await getPageProp(process.env.PAGE_ID as string);
  console.log("Page properties:", JSON.stringify(response, null, 2));
}

(async () => {
  await getPagePropTest();
}
)();