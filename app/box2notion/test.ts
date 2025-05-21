import env from '@/app/env';
import { Client, CreatePageParameters } from '@notionhq/client';

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

export async function insertDatabase() {
  const res = await notionClient.pages.create({
    parent: { database_id: env.NOTION_DATABASE_ID },
    icon: {
      type: "external",
      external: {
        "url": "https://www.notion.so/icons/checklist_gray.svg"
      }
    },
    properties: formatCandidateProp("Jan Doe", "Senior Software Engineer"),
  } satisfies CreatePageParameters);
  return res;
}

export async function getPageProp() {
  const pageId = "xxx"

  const res = await notionClient.pages.retrieve({
    page_id: pageId,
  });
  console.log('Notion API response:', JSON.stringify(res, null, 2));
  return res;
}

function formatCandidateProp(name: string, job_position: string) {
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

export async function appendBlockChildren(block_id: string) {
  const boxShareLink = "https://udemo1.box.com/folder/1234567890"

  const res = await notionClient.blocks.children.append({
    block_id: block_id,
    children: [
       {
        paragraph: {
          rich_text: [
            {
              text: {
                content: `Resume: ${boxShareLink}`,
                link: {
                  url: boxShareLink
                }
              }
            }
          ]
        }
      }
    ]
  })
}