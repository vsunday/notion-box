import env from '@/app/env';
import { Client, CreatePageParameters } from '@notionhq/client';
import { PropertyItemPropertyItemListResponse, RichTextPropertyItemObjectResponse, StatusPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notionClient = new Client({ auth: env.NOTION_TOKEN });

export async function getDatabase() {
  // Test the environment variables

  const res = await notionClient.databases.retrieve({
    database_id: env.NOTION_DATABASE_ID,
  });
  console.log('Notion API response:', res);
  return res;

}

export async function queryDatabase() {
  const res = await notionClient.databases.query({
    database_id: env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      status: {
        equals: 'Not Started',
      },
    }
  })
  console.log('Notion API response:', JSON.stringify(res.results, null, 2));
  return res;
};

export async function insertDatabase(name: string, job_position: string, file_id: string) {
  const res = await notionClient.pages.create({
    parent: { database_id: env.NOTION_DATABASE_ID },
    icon: {
      type: "external",
      external: {
        "url": "https://www.notion.so/icons/checklist_gray.svg"
      }
    },
    properties: formatCandidateProp(name, job_position, file_id),
  } satisfies CreatePageParameters);
  return res;
}

export async function getPageProp(page_id: string) {
  const res = await notionClient.pages.retrieve({
    page_id: page_id,
  });
  return res;
}

export async function getPagePropStatus(page_id: string) {
  const res = await notionClient.pages.properties.retrieve({
    page_id: page_id,
    property_id: "Status"
  });
  return res as StatusPropertyItemObjectResponse;
}

export async function getPagePropNotes(page_id: string) {
  const res = await notionClient.pages.properties.retrieve({
    page_id: page_id,
    property_id: "Notes"
  }) as PropertyItemPropertyItemListResponse;
  // const notes = res.results as RichTextPropertyItemObjectResponse[]
  return res.results as RichTextPropertyItemObjectResponse[]
}

// get file_id from page. 
export async function getFileIdFromNotes(page_id: string) {
  const pageNotes = await getPagePropNotes(page_id);
  if (pageNotes.length === 0) {
    throw new Error("No notes found in the page");
  }
  return pageNotes[0].rich_text.plain_text;
}

function formatCandidateProp(name: string, job_position: string, file_id: string) {
  const formattedProp = {
    Candidate: {
      type: 'rich_text',
      rich_text: [
        {
          type: 'text',
          text: {
            content: name
          }
        }
      ]
    },
    "Job Position": {
      type: 'select',
      select: {
        name: job_position
      }
    },
    Notes: {
      type: "rich_text",
      rich_text: [
        {
          type: 'text',
          text: {
            content: file_id
          }
        }
      ] 
    },
    Priority: {
      type: 'select',
      select: {
        name: "Medium"
      }
    },
    "Task Name": {
      type: 'title',
      title: [
        {
          type: 'text',
          text: { content: `${name}: ${job_position}`, link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default"
          }
        },
      ],
    }
  } as CreatePageParameters["properties"];

  return formattedProp;
}

export async function getBlockChildren() {
  const blockId = "xxx"

  const res = await notionClient.blocks.children.list({
    block_id: blockId,
  });
  console.log('Notion API response:', JSON.stringify(res, null, 2));
  return res;
}

// update page with file_id
export async function appendBlockChildren(block_id: string, box_shared_link: string) {
  const res = await notionClient.blocks.children.append({
    block_id: block_id,
    children: [
       {
        paragraph: {
          rich_text: [
            {
              text: {
                content: `Resume: ${box_shared_link}`,
                link: {
                  url: box_shared_link
                }
              }
            }
          ]
        }
      }
    ]
  })
  return res;
}

