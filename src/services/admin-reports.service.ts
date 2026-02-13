import { useQuery } from "@tanstack/react-query";
import type {
  ChatReportDetails,
  ListingReportDetails,
  PaginatedReportsResponse,
  Report,
  ReportDetail,
  ReportFilterParams,
  ReportType,
  UserReportDetails,
} from "@/types/admin";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const createReporter = (
  id: string,
  name: string,
  avatar: string,
  options?: {
    isVerified?: boolean;
    isFlagged?: boolean;
    memberSince?: string;
    location?: string;
    lastSeen?: string;
    avgResponseTime?: string;
    prevReports?: number;
    totalSales?: number;
  },
) => ({
  id,
  name,
  avatar,
  isVerified: options?.isVerified,
  isFlagged: options?.isFlagged,
  memberSince: options?.memberSince,
  location: options?.location,
  lastSeen: options?.lastSeen,
  avgResponseTime: options?.avgResponseTime,
  prevReports: options?.prevReports,
  totalSales: options?.totalSales,
});

const listingReports: ListingReportDetails[] = [
  {
    id: "REP-4628",
    type: "listing",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(1),
    reporter: createReporter(
      "USR-3001",
      "Mohammad Al Semri",
      "https://i.pravatar.cc/150?img=67",
      { memberSince: "2012" },
    ),
    reportedUser: createReporter(
      "USR-3002",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { memberSince: "2012", prevReports: 12, totalSales: 0 },
    ),
    riskLevel: "Medium Risk",
    reasonTagDetail: "Scam or misleading information",
    description: "Seller reported for misleading listing information.",
    listing: {
      id: "LST-4628",
      title: "iPhone 11 Pro 256GB",
      image: "https://picsum.photos/seed/iphone-11-pro/500/600",
      seller: createReporter(
        "USR-3001",
        "Mohammad Al Semri",
        "https://i.pravatar.cc/150?img=67",
      ),
    },
    listingDetails: {
      price: 250,
      currency: "ILS",
      negotiable: true,
      status: "Active",
      category: "Phones",
      condition: "Excellent",
      listedAt: "Oct 24, 2023",
      description:
        "Selling my well-kept iPhone 11 Pro. No scratches, always in a case. Battery health 89%. Includes original box and unused cable.",
    },
    metrics: [
      { label: "Listing Views", value: "1,569" },
      { label: "Duration", value: "14 days" },
      { label: "Inquires", value: 15 },
    ],
    riskIndicators: [
      { label: "Warnings", count: 2 },
      { label: "Suspension", count: 0 },
      { label: "Ban", count: 0 },
    ],
  },
  {
    id: "REP-5841",
    type: "listing",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(2),
    reporter: createReporter(
      "USR-1102",
      "Olivia Adams",
      "https://i.pravatar.cc/150?img=11",
    ),
    description: "Seller asked for payment outside the platform.",
    evidence: [
      {
        id: "EV-1001",
        label: "Chat screenshot",
        url: "https://picsum.photos/seed/report-evidence-1/300/200",
      },
      {
        id: "EV-1002",
        label: "Listing screenshot",
        url: "https://picsum.photos/seed/report-evidence-2/300/200",
      },
    ],
    listing: {
      id: "LST-1201",
      title: "iPhone 14 Pro Max",
      image: "https://picsum.photos/seed/iphone-14/100/100",
      seller: createReporter(
        "USR-1001",
        "William Harris",
        "https://i.pravatar.cc/150?img=12",
        { isVerified: true },
      ),
    },
  },
  {
    id: "REP-5247",
    type: "listing",
    reason: "Suspicious behavior",
    status: "under-review",
    submittedAt: daysAgo(4),
    reporter: createReporter(
      "USR-1103",
      "Hannah Brooks",
      "https://i.pravatar.cc/150?img=13",
    ),
    description: "Multiple similar listings posted in a short time.",
    listing: {
      id: "LST-1202",
      title: "Dell XPS 15",
      image: "https://picsum.photos/seed/dell-xps/100/100",
      seller: createReporter(
        "USR-1002",
        "Benjamin Carter",
        "https://i.pravatar.cc/150?img=14",
      ),
    },
  },
  {
    id: "REP-3287",
    type: "listing",
    reason: "Prohibited item",
    status: "open",
    submittedAt: daysAgo(6),
    reporter: createReporter(
      "USR-1104",
      "Mason Reed",
      "https://i.pravatar.cc/150?img=15",
    ),
    description: "Listing appears to violate policy.",
    listing: {
      id: "LST-1203",
      title: "Headphones",
      image: "https://picsum.photos/seed/headphones/100/100",
      seller: createReporter(
        "USR-1003",
        "Nathaniel Hayes",
        "https://i.pravatar.cc/150?img=16",
      ),
    },
  },
  {
    id: "REP-1593",
    type: "listing",
    reason: "Inappropriate content",
    status: "open",
    submittedAt: daysAgo(9),
    reporter: createReporter(
      "USR-1105",
      "Ella Ruiz",
      "https://i.pravatar.cc/150?img=17",
    ),
    description: "Images include inappropriate content.",
    listing: {
      id: "LST-1204",
      title: "Nintendo Switch",
      image: "https://picsum.photos/seed/switch/100/100",
      seller: createReporter(
        "USR-1004",
        "Samuel Brooks",
        "https://i.pravatar.cc/150?img=18",
      ),
    },
  },
  {
    id: "REP-1293",
    type: "listing",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(12),
    reporter: createReporter(
      "USR-1106",
      "Grace Miller",
      "https://i.pravatar.cc/150?img=19",
    ),
    description: "Price seems too low and seller is unresponsive.",
    listing: {
      id: "LST-1205",
      title: 'iPad Pro 11"',
      image: "https://picsum.photos/seed/ipad-pro/100/100",
      seller: createReporter(
        "USR-1005",
        "Eleanor Vance",
        "https://i.pravatar.cc/150?img=20",
        { isFlagged: true },
      ),
    },
  },
  {
    id: "REP-1483",
    type: "listing",
    reason: "Prohibited item",
    status: "resolved",
    submittedAt: daysAgo(18),
    reporter: createReporter(
      "USR-1107",
      "Ava Coleman",
      "https://i.pravatar.cc/150?img=21",
    ),
    description: "Listing violates restricted items policy.",
    listing: {
      id: "LST-1206",
      title: "Dell Inspiron 15",
      image: "https://picsum.photos/seed/dell-inspiron/100/100",
      seller: createReporter(
        "USR-1006",
        "Charlotte Hayes",
        "https://i.pravatar.cc/150?img=22",
      ),
    },
  },
  {
    id: "REP-5591",
    type: "listing",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(22),
    reporter: createReporter(
      "USR-1108",
      "Logan Foster",
      "https://i.pravatar.cc/150?img=23",
    ),
    description: "Seller requested bank transfer only.",
    listing: {
      id: "LST-1207",
      title: "iPhone 13 Pro",
      image: "https://picsum.photos/seed/iphone-13/100/100",
      seller: createReporter(
        "USR-1007",
        "Jonathan Ford",
        "https://i.pravatar.cc/150?img=24",
      ),
    },
  },
  {
    id: "REP-1497",
    type: "listing",
    reason: "Inappropriate content",
    status: "under-review",
    submittedAt: daysAgo(35),
    reporter: createReporter(
      "USR-1109",
      "Sofia Nash",
      "https://i.pravatar.cc/150?img=25",
    ),
    description: "Inappropriate description and wording.",
    listing: {
      id: "LST-1208",
      title: "Dell XPS 15",
      image: "https://picsum.photos/seed/dell-xps-2/100/100",
      seller: createReporter(
        "USR-1008",
        "Charles Grant",
        "https://i.pravatar.cc/150?img=26",
      ),
    },
  },
  {
    id: "REP-3284",
    type: "listing",
    reason: "Scam",
    status: "dismissed",
    submittedAt: daysAgo(60),
    reporter: createReporter(
      "USR-1110",
      "Daniel Perry",
      "https://i.pravatar.cc/150?img=27",
    ),
    description: "Seller account appears suspicious.",
    listing: {
      id: "LST-1209",
      title: "Headphones",
      image: "https://picsum.photos/seed/headphones-2/100/100",
      seller: createReporter(
        "USR-1009",
        "Joseph Harper",
        "https://i.pravatar.cc/150?img=28",
        { isFlagged: true },
      ),
    },
  },
];

const userReports: UserReportDetails[] = [
  {
    id: "REP-1538",
    type: "user",
    reason: "Suspicious activity",
    status: "under-review",
    submittedAt: daysAgo(3),
    reporter: createReporter(
      "USR-3101",
      "Mohammad Al Semri",
      "https://i.pravatar.cc/150?img=68",
      { memberSince: "2012" },
    ),
    reportedUser: createReporter(
      "USR-3102",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      {
        memberSince: "May 2023",
        location: "Palestine",
        lastSeen: "Last seen 1 hour ago",
        avgResponseTime: "Avg. response within 10 hours",
        prevReports: 12,
        totalSales: 8,
        isFlagged: true,
      },
    ),
    description: "Reported for suspicious account activity.",
    riskLevel: "High Risk",
    reasonTagDetail: "Suspicious activity",
    metrics: [
      { label: "Listing Posted", value: 146 },
      { label: "Sales", value: 8 },
      { label: "Active Chats", value: 5 },
      { label: "Prev. Reports", value: 12 },
    ],
    trustIndicators: [
      { label: "Verified Phone", status: "verified", date: "Oct 22" },
      { label: "Verified Email", status: "unverified", date: "Oct 22" },
      { label: "Verified Identity", status: "unverified", date: "Oct 22" },
    ],
    riskIndicators: [
      { label: "Warnings", count: 1 },
      { label: "Suspension", count: 2 },
      { label: "Ban", count: 1 },
    ],
    accountHistory: [
      {
        label: "Report issued by lora_o87.",
        date: "Oct 22, 2023",
        reason: "Suspicious activity",
        iconType: "report",
      },
      {
        label: "Official Warning Issued.",
        date: "Oct 22, 2023",
        reason: "Spam",
        iconType: "warning",
      },
      {
        label: "Suspension Issued for 7 days.",
        date: "Oct 10, 2023",
        reason: "Impersonation",
        iconType: "suspension",
      },
    ],
  },
  {
    id: "REP-5841",
    type: "user",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(1),
    reporter: createReporter(
      "USR-1201",
      "Adam Fletcher",
      "https://i.pravatar.cc/150?img=31",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { isFlagged: true },
    ),
    description: "User is requesting payment outside the platform.",
    evidence: [
      {
        id: "EV-2001",
        label: "Conversation screenshot",
        url: "https://picsum.photos/seed/report-evidence-3/300/200",
      },
    ],
  },
  {
    id: "REP-3287",
    type: "user",
    reason: "Harassment",
    status: "open",
    submittedAt: daysAgo(3),
    reporter: createReporter(
      "USR-1203",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=33",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { isFlagged: true },
    ),
    description: "Messages contain abusive language.",
  },
  {
    id: "REP-1593",
    type: "user",
    reason: "Impersonation",
    status: "under-review",
    submittedAt: daysAgo(6),
    reporter: createReporter(
      "USR-1204",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=34",
    ),
    reportedUser: createReporter(
      "USR-1205",
      "Aidan Brooks",
      "https://i.pravatar.cc/150?img=35",
    ),
    description: "User is pretending to be someone else.",
  },
  {
    id: "REP-1259",
    type: "user",
    reason: "Fake account",
    status: "open",
    submittedAt: daysAgo(8),
    reporter: createReporter(
      "USR-1206",
      "Blake Reynolds",
      "https://i.pravatar.cc/150?img=36",
    ),
    reportedUser: createReporter(
      "USR-1207",
      "Austin Hayes",
      "https://i.pravatar.cc/150?img=37",
    ),
    description: "Account appears to be fake.",
  },
  {
    id: "REP-1293",
    type: "user",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(10),
    reporter: createReporter(
      "USR-1208",
      "Brandon Clark",
      "https://i.pravatar.cc/150?img=38",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { isFlagged: true },
    ),
    description: "User requested sensitive payment details.",
  },
  {
    id: "REP-1483",
    type: "user",
    reason: "Suspicious activity",
    status: "resolved",
    submittedAt: daysAgo(15),
    reporter: createReporter(
      "USR-1209",
      "Caleb Turner",
      "https://i.pravatar.cc/150?img=39",
    ),
    reportedUser: createReporter(
      "USR-1210",
      "Cameron Hale",
      "https://i.pravatar.cc/150?img=40",
    ),
    description: "User is sending repeated spam messages.",
  },
  {
    id: "REP-5591",
    type: "user",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(24),
    reporter: createReporter(
      "USR-1211",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=41",
    ),
    reportedUser: createReporter(
      "USR-1212",
      "Christian Porter",
      "https://i.pravatar.cc/150?img=42",
      { isFlagged: true },
    ),
    description: "User redirected to external payment links.",
  },
  {
    id: "REP-1497",
    type: "user",
    reason: "Harassment",
    status: "dismissed",
    submittedAt: daysAgo(40),
    reporter: createReporter(
      "USR-1213",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=43",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
    ),
    description: "Multiple reports from the same conversation.",
  },
  {
    id: "REP-3284",
    type: "user",
    reason: "Scam",
    status: "under-review",
    submittedAt: daysAgo(65),
    reporter: createReporter(
      "USR-1214",
      "Colin Whitaker",
      "https://i.pravatar.cc/150?img=44",
    ),
    reportedUser: createReporter(
      "USR-1215",
      "Connor Mitchell",
      "https://i.pravatar.cc/150?img=45",
      { isFlagged: true },
    ),
    description: "User requests payment upfront for delivery.",
  },
];

const chatReports: ChatReportDetails[] = [
  {
    id: "REP-1598",
    type: "chat",
    reason: "Harassment",
    status: "open",
    submittedAt: daysAgo(2),
    reporter: createReporter(
      "USR-3201",
      "Mohammad Al Semri",
      "https://i.pravatar.cc/150?img=69",
      { memberSince: "2012" },
    ),
    reportedUser: createReporter(
      "USR-3202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { memberSince: "2012", prevReports: 1, totalSales: 0 },
    ),
    chatId: "CHAT-1598",
    description: "Reported for harassment in chat.",
    riskLevel: "Low Risk",
    reasonTagDetail: "Harassment or abusive behavior",
    chatContext: {
      itemTitle: "Redmi Note 12",
      itemImage: "https://picsum.photos/seed/redmi-note-12/80/80",
      timestamp: "Oct 24, 2023 - 1:22 PM",
    },
    chatMessages: [
      {
        id: "MSG-1598-1",
        sender: createReporter(
          "USR-3202",
          "Eleanor Vance",
          "https://i.pravatar.cc/150?img=32",
        ),
        message: "Wow, you really don't know how to price things.",
        sentAt: "2023-10-24T09:24:00.000Z",
        time: "9:24",
        direction: "outgoing",
      },
      {
        id: "MSG-1598-2",
        sender: createReporter(
          "USR-3201",
          "Mohammad Al Semri",
          "https://i.pravatar.cc/150?img=69",
        ),
        message: "I'm open to discussion, but please keep it respectful.",
        sentAt: "2023-10-24T09:24:00.000Z",
        time: "9:24",
        direction: "incoming",
      },
      {
        id: "MSG-1598-3",
        sender: createReporter(
          "USR-3202",
          "Eleanor Vance",
          "https://i.pravatar.cc/150?img=32",
        ),
        message: "Maybe selling isn't for you.",
        sentAt: "2023-10-24T09:24:00.000Z",
        time: "9:24",
        direction: "outgoing",
      },
    ],
    conversationMetrics: [
      { label: "Total Messages", value: 12 },
      { label: "Duration", value: "14m" },
      { label: "Item Status", value: "Pending", valueTone: "success" },
    ],
    riskIndicators: [
      { label: "Warnings", count: 1 },
      { label: "Suspension", count: 0 },
      { label: "Ban", count: 0 },
    ],
  },
  {
    id: "REP-5841",
    type: "chat",
    reason: "Scam",
    status: "open",
    submittedAt: daysAgo(2),
    reporter: createReporter(
      "USR-1301",
      "Evan Morgan",
      "https://i.pravatar.cc/150?img=51",
    ),
    reportedUser: createReporter(
      "USR-1302",
      "Dylan Carter",
      "https://i.pravatar.cc/150?img=52",
      { isFlagged: true },
    ),
    chatId: "CHAT-1101",
    description: "Reported for attempting to move conversation off-platform.",
    chatMessages: [
      {
        id: "MSG-1",
        sender: createReporter(
          "USR-1302",
          "Dylan Carter",
          "https://i.pravatar.cc/150?img=52",
        ),
        message: "Can you pay me via bank transfer?",
        sentAt: daysAgo(2),
      },
      {
        id: "MSG-2",
        sender: createReporter(
          "USR-1301",
          "Evan Morgan",
          "https://i.pravatar.cc/150?img=51",
        ),
        message: "I'd prefer to use the platform payment.",
        sentAt: daysAgo(2),
      },
    ],
  },
  {
    id: "REP-3287",
    type: "chat",
    reason: "Suspicious activity",
    status: "open",
    submittedAt: daysAgo(4),
    reporter: createReporter(
      "USR-1303",
      "Ethan Sullivan",
      "https://i.pravatar.cc/150?img=53",
    ),
    reportedUser: createReporter(
      "USR-1304",
      "Abigail Turner",
      "https://i.pravatar.cc/150?img=54",
      { isFlagged: true },
    ),
    chatId: "CHAT-1102",
    description: "User keeps sending repeated promotional links.",
  },
  {
    id: "REP-1593",
    type: "chat",
    reason: "Scam",
    status: "under-review",
    submittedAt: daysAgo(7),
    reporter: createReporter(
      "USR-1305",
      "Finn Bennett",
      "https://i.pravatar.cc/150?img=55",
    ),
    reportedUser: createReporter(
      "USR-1306",
      "Charlotte Hale",
      "https://i.pravatar.cc/150?img=56",
    ),
    chatId: "CHAT-1103",
    description: "User offered a counterfeit product.",
  },
  {
    id: "REP-1259",
    type: "chat",
    reason: "Inappropriate content",
    status: "open",
    submittedAt: daysAgo(9),
    reporter: createReporter(
      "USR-1307",
      "Olivia Bennett",
      "https://i.pravatar.cc/150?img=57",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { isFlagged: true },
    ),
    chatId: "CHAT-1104",
    description: "Messages contain inappropriate language.",
  },
  {
    id: "REP-1293",
    type: "chat",
    reason: "Selling prohibited items",
    status: "open",
    submittedAt: daysAgo(12),
    reporter: createReporter(
      "USR-1308",
      "Amelia Harper",
      "https://i.pravatar.cc/150?img=58",
      { isFlagged: true },
    ),
    reportedUser: createReporter(
      "USR-1309",
      "Grace Montgomery",
      "https://i.pravatar.cc/150?img=59",
    ),
    chatId: "CHAT-1105",
    description: "User offered restricted items in chat.",
  },
  {
    id: "REP-1483",
    type: "chat",
    reason: "Scam",
    status: "resolved",
    submittedAt: daysAgo(20),
    reporter: createReporter(
      "USR-1310",
      "Sophia White",
      "https://i.pravatar.cc/150?img=60",
    ),
    reportedUser: createReporter(
      "USR-1311",
      "Gavin Harper",
      "https://i.pravatar.cc/150?img=61",
    ),
    chatId: "CHAT-1106",
    description: "Seller asked for payment in gift cards.",
  },
  {
    id: "REP-5591",
    type: "chat",
    reason: "Harassment",
    status: "open",
    submittedAt: daysAgo(27),
    reporter: createReporter(
      "USR-1312",
      "Madison Clark",
      "https://i.pravatar.cc/150?img=62",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
      { isFlagged: true },
    ),
    chatId: "CHAT-1107",
    description: "User sent repeated abusive messages.",
  },
  {
    id: "REP-1497",
    type: "chat",
    reason: "Scam",
    status: "dismissed",
    submittedAt: daysAgo(45),
    reporter: createReporter(
      "USR-1313",
      "Emily Prescott",
      "https://i.pravatar.cc/150?img=63",
    ),
    reportedUser: createReporter(
      "USR-1202",
      "Eleanor Vance",
      "https://i.pravatar.cc/150?img=32",
    ),
    chatId: "CHAT-1108",
    description: "Report could not be verified.",
  },
  {
    id: "REP-3284",
    type: "chat",
    reason: "Suspicious activity",
    status: "open",
    submittedAt: daysAgo(70),
    reporter: createReporter(
      "USR-1314",
      "Harrison Cole",
      "https://i.pravatar.cc/150?img=64",
      { isFlagged: true },
    ),
    reportedUser: createReporter(
      "USR-1315",
      "Grayson Brown",
      "https://i.pravatar.cc/150?img=65",
      { isFlagged: true },
    ),
    chatId: "CHAT-1109",
    description: "Repeated requests to move conversation off-platform.",
  },
];

const reportDataMap: Record<ReportType, ReportDetail[]> = {
  listing: listingReports,
  user: userReports,
  chat: chatReports,
};

const normalizeText = (value: string) => value.toLowerCase().trim();

const addDays = (date: Date, days: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );

const parseLocalDate = (value?: string | null) => {
  if (!value) return null;
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  const day = Number.parseInt(dayText, 10);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

const resolveDateBounds = (params: ReportFilterParams) => {
  const todayStart = startOfDay(new Date());

  if (params.datePreset === "all") {
    return { start: null as Date | null, end: null as Date | null };
  }

  if (params.datePreset === "today") {
    return { start: todayStart, end: endOfDay(todayStart) };
  }

  if (params.datePreset === "yesterday") {
    const yesterday = addDays(todayStart, -1);
    return { start: yesterday, end: endOfDay(yesterday) };
  }

  if (params.datePreset === "last7") {
    return { start: addDays(todayStart, -6), end: endOfDay(todayStart) };
  }

  if (params.datePreset === "last30") {
    return { start: addDays(todayStart, -29), end: endOfDay(todayStart) };
  }

  const parsedStart = parseLocalDate(params.startDate);
  const parsedEnd = parseLocalDate(params.endDate);

  if (params.datePreset === "custom" || parsedStart || parsedEnd) {
    if (
      parsedStart &&
      parsedEnd &&
      parsedStart.getTime() > parsedEnd.getTime()
    ) {
      return {
        start: startOfDay(parsedEnd),
        end: endOfDay(parsedStart),
      };
    }

    return {
      start: parsedStart ? startOfDay(parsedStart) : null,
      end: parsedEnd ? endOfDay(parsedEnd) : null,
    };
  }

  if (params.dateRange === "all") {
    return { start: null as Date | null, end: null as Date | null };
  }

  if (params.dateRange) {
    const days = Number.parseInt(params.dateRange, 10);
    if (!Number.isNaN(days) && days > 0) {
      return {
        start: addDays(todayStart, -(days - 1)),
        end: endOfDay(todayStart),
      };
    }
  }

  return { start: null as Date | null, end: null as Date | null };
};

const matchesSearch = (report: Report, search: string) => {
  const query = normalizeText(search);
  if (!query) return true;

  if (report.type === "listing") {
    const searchable = [
      report.id,
      report.listing.title,
      report.listing.seller.name,
      report.reporter.name,
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  }

  const searchable = [report.id, report.reportedUser.name, report.reporter.name]
    .join(" ")
    .toLowerCase();
  return searchable.includes(query);
};

const matchesDateRange = (
  report: Report,
  bounds: { start: Date | null; end: Date | null },
) => {
  if (!bounds.start && !bounds.end) return true;
  const submittedAt = new Date(report.submittedAt);
  if (Number.isNaN(submittedAt.getTime())) return false;
  if (bounds.start && submittedAt.getTime() < bounds.start.getTime())
    return false;
  if (bounds.end && submittedAt.getTime() > bounds.end.getTime()) return false;
  return true;
};

const paginateReports = <T extends Report>(
  items: T[],
  page: number,
  limit: number,
): PaginatedReportsResponse<T> => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageItems = items.slice(startIndex, endIndex);

  return {
    items: pageItems,
    total,
    page,
    totalPages,
    limit,
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminReportsService = {
  getReports: async (
    type: ReportType,
    params: ReportFilterParams = {},
  ): Promise<PaginatedReportsResponse<Report>> => {
    await delay(400);
    const reports = reportDataMap[type] || [];
    const dateBounds = resolveDateBounds(params);
    const filtered = reports.filter(
      (report) =>
        matchesSearch(report, params.search || "") &&
        matchesDateRange(report, dateBounds),
    );

    const page = params.page || 1;
    const limit = params.limit || 10;
    return paginateReports(filtered, page, limit);
  },

  getReportById: async (
    type: ReportType,
    id: string,
  ): Promise<ReportDetail> => {
    await delay(300);
    const report = reportDataMap[type]?.find((item) => item.id === id);
    if (!report) {
      throw new Error("Report not found");
    }
    return report;
  },
};

export const ADMIN_REPORTS_KEYS = {
  all: ["admin", "reports"] as const,
  lists: () => [...ADMIN_REPORTS_KEYS.all, "list"] as const,
  list: (type: ReportType, params?: ReportFilterParams) =>
    [...ADMIN_REPORTS_KEYS.lists(), type, params] as const,
  details: () => [...ADMIN_REPORTS_KEYS.all, "detail"] as const,
  detail: (type: ReportType, id: string) =>
    [...ADMIN_REPORTS_KEYS.details(), type, id] as const,
};

export const useAdminReports = (
  type: ReportType,
  params: ReportFilterParams,
) => {
  return useQuery({
    queryKey: ADMIN_REPORTS_KEYS.list(type, params),
    queryFn: () => adminReportsService.getReports(type, params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminReportDetail = (type: ReportType, id?: string) => {
  return useQuery({
    queryKey: ADMIN_REPORTS_KEYS.detail(type, id || ""),
    queryFn: () => adminReportsService.getReportById(type, id || ""),
    enabled: Boolean(type && id),
    staleTime: 30 * 1000,
  });
};
