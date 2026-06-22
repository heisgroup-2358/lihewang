export const ADMIN_STATS = {
  totalProducts: 48,
  activeProducts: 42,
  totalOrders: 156,
  pendingOrders: 8,
  totalUsers: 234,
  wholesaleUsers: 18,
  pendingApplications: 5,
  pendingWithdrawals: 3,
  totalRevenue: 284500,
  monthlyRevenue: 45200,
  totalCommissionPaid: 28450,
};

export const ADMIN_PRODUCTS = [
  { id: "P001", name: "白之戀人 24件入", brand: "Ishiya", price: 388, stock: 50, status: "active", sales: 128 },
  { id: "P002", name: "東京抹茶禮盒", brand: "京都宇治", price: 298, stock: 35, status: "active", sales: 86 },
  { id: "P003", name: "京都和菓子禮盒", brand: "虎屋", price: 458, stock: 20, status: "active", sales: 45 },
  { id: "P004", name: "Royce 朱古力禮盒", brand: "Royce", price: 268, stock: 0, status: "inactive", sales: 234 },
  { id: "P005", name: "函館甜品禮盒", brand: "函館菓子工房", price: 328, stock: 15, status: "active", sales: 23 },
  { id: "P006", name: "季節限定・櫻花禮盒", brand: "多間名店合作", price: 528, stock: 10, status: "active", sales: 67 },
];

export const ADMIN_ORDERS = [
  { id: "ORD-1024", customer: "陳大文", date: "2025-06-22", total: 1878, items: 3, status: "pending", payment: "paid" },
  { id: "ORD-1023", customer: "李小華", date: "2025-06-21", total: 458, items: 1, status: "shipped", payment: "paid" },
  { id: "ORD-1022", customer: "王小明", date: "2025-06-20", total: 894, items: 2, status: "delivered", payment: "paid" },
  { id: "ORD-1021", customer: "張美玲", date: "2025-06-19", total: 1234, items: 4, status: "shipped", payment: "paid" },
  { id: "ORD-1020", customer: "劉智強", date: "2025-06-18", total: 298, items: 1, status: "delivered", payment: "paid" },
  { id: "ORD-1019", customer: "陳小敏", date: "2025-06-17", total: 656, items: 2, status: "cancelled", payment: "refunded" },
  { id: "ORD-1018", customer: "黃志強", date: "2025-06-16", total: 776, items: 2, status: "delivered", payment: "paid" },
  { id: "ORD-1017", customer: "林佩琪", date: "2025-06-15", total: 528, items: 1, status: "pending", payment: "unpaid" },
];

export const ADMIN_USERS = [
  { id: "U001", name: "陳大文", email: "chan@example.com", phone: "5111 2233", role: "wholesale_lv1", status: "active", orders: 12, joined: "2025-01-15" },
  { id: "U002", name: "李小華", email: "lee@example.com", phone: "6222 3344", role: "wholesale_lv2", status: "active", orders: 28, joined: "2024-12-01" },
  { id: "U003", name: "王小明", email: "wong@example.com", phone: "7333 4455", role: "member", status: "active", orders: 5, joined: "2025-03-08" },
  { id: "U004", name: "張美玲", email: "cheung@example.com", phone: "8444 5566", role: "member", status: "active", orders: 3, joined: "2025-05-12" },
  { id: "U005", name: "劉智強", email: "lau@example.com", phone: "9555 6677", role: "wholesale_lv1", status: "suspended", orders: 8, joined: "2025-02-20" },
];

export const WHOLESALE_APPLICATIONS = [
  { id: "WA001", company: "香港禮品貿易有限公司", contact: "陳志強", phone: "5111 1111", email: "info@hk-gift.com", date: "2025-06-20", status: "pending" },
  { id: "WA002", company: "日之選批發", contact: "張美玲", phone: "5222 2222", email: "hello@jchoice.com", date: "2025-06-18", status: "pending" },
  { id: "WA003", company: "和風屋", contact: "李小明", phone: "5333 3333", email: "info@wafuu.com", date: "2025-06-15", status: "approved" },
  { id: "WA004", company: "東京物產香港", contact: "黃大衛", phone: "5444 4444", email: "david@tokyo.hk", date: "2025-06-10", status: "rejected" },
  { id: "WA005", company: "北海道食品香港", contact: "林美儀", phone: "5555 5555", email: "may@hokkaido.hk", date: "2025-06-22", status: "pending" },
];

export const COMMISSION_REPORT = [
  { user: "陳大文", downlines: 4, orders: 12, commission: 2340, paid: 1800, pending: 540 },
  { user: "李小華", downlines: 8, orders: 28, commission: 5670, paid: 4200, pending: 1470 },
  { user: "劉智強", downlines: 2, orders: 8, commission: 890, paid: 890, pending: 0 },
];

export const WITHDRAWAL_REQUESTS = [
  { id: "WD001", user: "陳大文", amount: 1200, bank: "HSBC", account: "123-456-789", date: "2025-06-20", status: "pending" },
  { id: "WD002", user: "李小華", amount: 2500, bank: "中銀香港", account: "012-345-678", date: "2025-06-19", status: "pending" },
  { id: "WD003", user: "劉智強", amount: 500, bank: "恒生銀行", account: "789-012-345", date: "2025-06-15", status: "completed" },
];
