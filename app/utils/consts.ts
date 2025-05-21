// Example type definition for the provided JSON structure

type NotionRichText = {
  type: "text";
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
};

type NotionSelect = {
  id: string;
  name: string;
  color: string;
};

type NotionStatus = {
  id: string;
  name: string;
  color: string;
};

type NotionDate = {
  start: string;
  end: string | null;
  time_zone: string | null;
};

type NotionPeople = any[]; // You can define a more specific type if needed

type CandidateProp = {
  Candidate: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  Notes: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  "Job Position": {
    id: string;
    type: "select";
    select: NotionSelect;
  };
  Assignee: {
    id: string;
    type: "people";
    people: NotionPeople;
  };
  Status: {
    id: string;
    type: "status";
    status: NotionStatus;
  };
  "Due Date": {
    id: string;
    type: "date";
    date: NotionDate;
  };
  Priority: {
    id: string;
    type: "select";
    select: NotionSelect;
  };
  "Task Name": {
    id: string;
    type: "title";
    title: NotionRichText[];
  };
};