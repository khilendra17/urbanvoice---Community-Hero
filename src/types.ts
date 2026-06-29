export interface Officer {
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  icon: string; // lucide icon name
}

export interface Issue {
  id: string;
  title: string;
  category: "Infrastructure" | "Sanitation" | "Utilities" | "Landscaping" | "Public Safety" | "Emergency";
  severity: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Resolved";
 location: string;
latitude: number;
longitude: number;
  timeAgo: string;
  description: string;
  imageUrl: string;
  votes: number;
  followed: boolean;
  comments: Comment[];
  timeline: TimelineEvent[];
  assignedDept: string;
  officer: Officer;
  slaCountdown: string; // e.g. "14:02:45"
  slaPercentage: number; // e.g. 65 for 65% width
}

export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  status?: "typing" | "complete";
  isInsight?: boolean;
}
