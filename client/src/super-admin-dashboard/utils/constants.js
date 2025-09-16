export const API_BASE_URL = "http://localhost:4000/api/v1/superadmin";

export const ROUTES = {
  LOGIN: "/superadmin/login",
  DASHBOARD: "/superadmin/dashboard",
  ANALYTICS: "/superadmin/analytics",
  REPORTS: "/superadmin/reports",
  COMPLAINTS: "/superadmin/complaints",
};

export const DEPARTMENTS = [
  "Water Supply",
  "Health and Medical",
  "Sanitation",
  "Electricity",
  "Road and Transport",
  "Education",
  "Other",
];

export const ZONES = [
  "Dr. Hedgewar (Kila Maidan) Zone",
  "Lal Bahadur Shastri (Raj Mohalla) Zone",
  "Shaheed Bhagat Singh (Nagar Nigam) Zone",
  "Maharana Pratap (Sangam Nagar) Zone",
  "Chandragupta Maurya (Sukhaliya) Zone",
  "Subhash Chandra Bose (Subhash Nagar) Zone",
  "Atal Bihari Vajpayee (Scheme No. 54) Zone",
  "Chandrashekhar Azad (Vijay Nagar) Zone",
  "Dr. Bhimrao Ambedkar (Pancham ki fel) Zone",
  "Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone",
  "Rajmata Scindia (Stadium) Zone",
  "Harsiddhi Zone",
  "Pt. Deendayal Upadhyay (Bilawali) Zone",
  "Rajendra Dharkar (Hawa Bungalow) Zone",
  "Laxman Singh Gaud (David Nagar) Zone",
  "Kushabhau Thackeray (Aerodrome Road) Zone",
  "Mahatma Gandhi (Narwal) Zone",
  "Chhatrapati Shivaji (Krishi Vihar) Zone",
  "Sardar Vallabhbhai Patel (Scheme No. 94) Zone",
  "Rajmata Jeejabai Zone",
  "Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)",
  "Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)",
];

export const STATUS_COLORS = {
  pending: "#FFA726",
  in_progress: "#42A5F5",
  resolved: "#66BB6A",
  rejected: "#EF5350",
  escalated: "#FF7043",
};

export const PRIORITY_COLORS = {
  low: "#81C784",
  medium: "#FFB74D",
  high: "#FF8A65",
  urgent: "#E57373",
};
