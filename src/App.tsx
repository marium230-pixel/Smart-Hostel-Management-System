import { useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BedDouble, Bell, BookOpen, Building2, Check, ChevronDown, CircleHelp, Clock3, DoorOpen, LayoutDashboard, ListChecks, Menu, Moon, MoreHorizontal, Network, Plus, RotateCcw, Search, Settings, ShieldAlert, Sparkles, Users, X, Zap, Database, GitBranch, Hash, Layers3, Route, UserPlus, WalletCards, ClipboardList, CheckCircle2, CircleDot
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const heroImage = 'https://images.pexels.com/photos/31783935/pexels-photo-31783935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

type View = 'dashboard' | 'students' | 'rooms' | 'waiting' | 'rules' | 'fines' | 'complaints' | 'resolved' | 'activities' | 'path' | 'visualizer';
type Status = 'Active' | 'Checked out';
type Priority = 'High' | 'Medium' | 'Low';
type Student = { id: string; name: string; department: string; room: number | null; status: Status; violations: number };
type BSTNodeData = {
  id: number;
  left: BSTNodeData | null;
  right: BSTNodeData | null;
};
type Complaint = { id: number; studentId: string; description: string; priority: Priority; category: string };
type ResolvedComplaint = Complaint & { resolvedAt: string };
type ActivityItem = { id: number; text: string; detail: string; tone: string };

const rules = [
  ['Lights off after 11 PM', 'Rs. 500'], ['No outsiders after 8 PM', 'Rs. 1,000'], ['Mess timing: 7–9 AM, 12–2 PM, 7–9 PM', 'Rs. 300'], ['Keep room clean; weekly inspection', 'Rs. 400'], ['No loud music or speakers', 'Rs. 500'], ['Gate closes at 10:30 PM', 'Rs. 1,000'], ['No smoking or prohibited items', 'Rs. 2,000'], ['Attendance mandatory after 10 PM', 'Rs. 700'], ['No unauthorized room sharing', 'Rs. 1,000'], ['No damage to hostel property', 'Rs. 1,500'], ['No bullying or harassment', 'Rs. 2,000'], ['No littering in common areas', 'Rs. 300']
];
const seedStudents: Student[] = [
  { id: 'ST-101', name: 'Aarav Mehta', department: 'Computer Science', room: 101, status: 'Active', violations: 0 },
  { id: 'ST-102', name: 'Sara Khan', department: 'Architecture', room: 101, status: 'Active', violations: 2 },
  { id: 'ST-103', name: 'Rohan Das', department: 'Business', room: 102, status: 'Active', violations: 1 },
  { id: 'ST-104', name: 'Nisha Patel', department: 'Computer Science', room: 102, status: 'Active', violations: 0 },
  { id: 'ST-105', name: 'Fatima Ali', department: 'Psychology', room: 103, status: 'Active', violations: 3 },
  { id: 'ST-106', name: 'Kabir Singh', department: 'Engineering', room: 104, status: 'Active', violations: 0 },
  { id: 'ST-107', name: 'Maya Rao', department: 'Literature', room: 104, status: 'Active', violations: 1 },
  { id: 'ST-108', name: 'Aditya Shah', department: 'Law', room: 105, status: 'Active', violations: 0 }
];
const seedComplaints: Complaint[] = [
  { id: 12, studentId: 'ST-103', description: 'Water leakage near the common washroom', priority: 'High', category: 'Maintenance' },
  { id: 11, studentId: 'ST-102', description: 'The mess food was cold during dinner', priority: 'Medium', category: 'Mess' },
  { id: 10, studentId: 'ST-107', description: 'Wi-Fi signal is weak in the study hall', priority: 'Medium', category: 'Connectivity' },
  { id: 9, studentId: 'ST-101', description: 'Request for more quiet study spaces', priority: 'Low', category: 'General' },
  { id: 8, studentId: 'ST-105', description: 'Laundry collection schedule clarification', priority: 'Low', category: 'General' }
];
const seedActivities: ActivityItem[] = [
  { id: 1, text: 'New complaint #12 — Water Leakage', detail: '2m ago', tone: 'rose' },
  { id: 2, text: 'Fine imposed on ST-102', detail: '5m ago', tone: 'gold' },
  { id: 3, text: 'Student checked out: ST-109', detail: '10m ago', tone: 'sage' },
  { id: 4, text: 'Room 103 allocated to ST-105', detail: '12m ago', tone: 'mauve' },
  { id: 5, text: 'New student registered: ST-108', detail: '18m ago', tone: 'rose' }
];

function useDemoState() {
  const API = API_BASE;

  const [students, setStudents] = useState<Student[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [resolved, setResolved] = useState<ResolvedComplaint[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [fines, setFines] = useState<
    { studentId: string; rule: string; amount: string }[]
  >([]);
  const [dashboardData, setDashboardData] = useState({
  totalStudents: 0,
  occupiedBeds: 0,
  totalBeds: 10,
  vacantBeds: 10,
  occupancy: 0,
  pendingComplaints: 0,
  resolvedComplaints: 0,
  totalFines: 0,
  waitingStudents: 0,
});
const [dsaStats, setDsaStats] = useState({
  hashTableStudents: 0,
  linkedListStudents: 0,
  bstStudents: 0,
  waitingQueueSize: 0,
  actionStackSize: 0,
  highPriorityQueueSize: 0,
  mediumPriorityQueueSize: 0,
  lowPriorityQueueSize: 0,
  resolvedComplaints: 0,
  roomArraySize: 5,
  occupiedBeds: 0,
  graphVertices: 7,
});

  const studentIdToNumber = (id: string) =>
    Number(id.replace(/\D/g, ''));

  const studentIdToString = (id: number | string) =>
    `ST-${id}`;

  const apiRequest = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || 'Request failed.');
    }

    return data;
  };

  const refreshData = async () => {
    try {
     const [
  studentsData,
  complaintsData,
  resolvedData,
  activitiesData,
  finesData,
  dashboardResponse,
  dsaStatsData,
] = await Promise.all([
        apiRequest('/students'),
        apiRequest('/complaints'),
        apiRequest('/complaints/resolved'),
        apiRequest('/activities'),
        apiRequest('/fines'),
        apiRequest('/dashboard'),
        apiRequest('/dsa-stats'),
      ]);
setDashboardData({
  totalStudents: dashboardResponse.totalStudents || 0,
  occupiedBeds: dashboardResponse.occupiedBeds || 0,
  totalBeds: dashboardResponse.totalBeds || 10,
  vacantBeds: dashboardResponse.vacantBeds || 0,
  occupancy: dashboardResponse.occupancy || 0,
  pendingComplaints: dashboardResponse.pendingComplaints || 0,
  resolvedComplaints: dashboardResponse.resolvedComplaints || 0,
  totalFines: dashboardResponse.totalFines || 0,
  waitingStudents: dashboardResponse.waitingStudents || 0,
});
setDsaStats({
  hashTableStudents: dsaStatsData.hashTableStudents || 0,
  linkedListStudents: dsaStatsData.linkedListStudents || 0,
  bstStudents: dsaStatsData.bstStudents || 0,
  waitingQueueSize: dsaStatsData.waitingQueueSize || 0,
  actionStackSize: dsaStatsData.actionStackSize || 0,
  highPriorityQueueSize: dsaStatsData.highPriorityQueueSize || 0,
  mediumPriorityQueueSize: dsaStatsData.mediumPriorityQueueSize || 0,
  lowPriorityQueueSize: dsaStatsData.lowPriorityQueueSize || 0,
  resolvedComplaints: dsaStatsData.resolvedComplaints || 0,
  roomArraySize: dsaStatsData.roomArraySize || 5,
  occupiedBeds: dsaStatsData.occupiedBeds || 0,
  graphVertices: dsaStatsData.graphVertices || 7,
});
      const fineRecords = finesData.records || [];

      const violationCounts: Record<string, number> = {};

      fineRecords.forEach((fine: any) => {
        const id = studentIdToString(fine.studentId);
        violationCounts[id] = (violationCounts[id] || 0) + 1;
      });

      setStudents(
        studentsData.map((s: any) => ({
          id: studentIdToString(s.id),
          name: s.name,
          department: s.department,
          room: s.roomNumber === -1 ? null : s.roomNumber,
          status: s.active ? 'Active' : 'Checked out',
          violations: violationCounts[studentIdToString(s.id)] || 0,
        }))
      );

      const allComplaints = [
        ...(complaintsData.high || []),
        ...(complaintsData.medium || []),
        ...(complaintsData.low || []),
      ];

     const mapComplaint = (c: any) => ({
  id: c.id,
  studentId: studentIdToString(c.studentId),
  description: c.description,
  priority: (() => {
    const value = String(c.priorityName || c.priority)
      .replace(' Priority', '')
      .toLowerCase();

    return (value.charAt(0).toUpperCase() + value.slice(1)) as Priority;
  })(),
  category: c.category,
});
      setComplaints(allComplaints.map(mapComplaint));

      setResolved(
        resolvedData.map((c: any) => ({
          ...mapComplaint(c),
          resolvedAt: c.resolvedAt || 'Resolved',
        }))
      );

      setActivities(
        activitiesData.map((a: any, index: number) => ({
          id: a.position || index,
          text: a.description,
          detail: 'Recorded by C++ stack',
          tone: 'rose',
        }))
      );

      setFines(
        fineRecords.map((f: any) => ({
          studentId: studentIdToString(f.studentId),
          rule: f.ruleBroken,
          amount: `Rs. ${f.amount}`,
        }))
      );
    } catch (error) {
      console.error('Backend connection error:', error);
      alert(
        'Could not connect to the C++ backend. Make sure the hostel_server.exe is running.'
      );
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const register = async (student: Student) => {
    try {
      await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify({
          id: studentIdToNumber(student.id),
          name: student.name,
          department: student.department,
        }),
      });

      await refreshData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed.');
    }
  };

  const checkout = async (id: string) => {
    try {
      await apiRequest('/students/checkout', {
        method: 'POST',
        body: JSON.stringify({
          id: studentIdToNumber(id),
        }),
      });

      await refreshData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Checkout failed.');
    }
  };

  const addComplaint = async (complaint: Complaint) => {
    try {
      await apiRequest('/complaints', {
        method: 'POST',
        body: JSON.stringify({
          studentId: studentIdToNumber(complaint.studentId),
          description: complaint.description,
        }),
      });

      await refreshData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Complaint submission failed.');
    }
  };

  const resolveNext = async () => {
    try {
      const result = await apiRequest('/complaints/resolve', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      await refreshData();
      return result.complaint || result;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not resolve complaint.');
      return null;
    }
  };

  const addFine = async (studentId: string, ruleIndex: number) => {
    try {
      await apiRequest('/fines', {
        method: 'POST',
        body: JSON.stringify({
          studentId: studentIdToNumber(studentId),
          ruleId: ruleIndex + 1,
        }),
      });

      await refreshData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not add fine.');
    }
  };

  const reset = () => {
    alert('Backend reset is not configured yet.');
  };

  return {
    students,
     dashboardData,dsaStats,
    complaints,
    resolved,
    activities,
    fines,
    register,
    checkout,
    addComplaint,
    resolveNext,
    addFine,
    reset,
  };
}
const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'students', label: 'Students', icon: Users }, { id: 'rooms', label: 'Rooms', icon: BedDouble }, { id: 'waiting', label: 'Waiting List', icon: ListChecks }, { id: 'rules', label: 'Hostel Rules', icon: BookOpen }, { id: 'fines', label: 'Fines', icon: WalletCards }, { id: 'complaints', label: 'Complaints', icon: AlertTriangle }, { id: 'resolved', label: 'Resolved Complaints', icon: CheckCircle2 }, { id: 'activities', label: 'Recent Activities', icon: Activity }, { id: 'path', label: 'Path Finder', icon: Network }, { id: 'visualizer', label: 'DSA Visualizer', icon: GitBranch }
];

function App() {
  const demo = useDemoState();
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const title = navItems.find(item => item.id === view)?.label || 'Dashboard';
  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Building2 size={24} strokeWidth={1.7} /></div><div><strong>Smart Hostel</strong><span>Management System</span></div></div>
      <div className="sidebar-label">Workspace</div>
      <nav>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? 'nav-item active' : 'nav-item'} onClick={() => { setView(item.id); setSidebarOpen(false); }}><Icon size={17} /><span>{item.label}</span>{item.id === 'complaints' && demo.complaints.length > 0 && <em>{demo.complaints.length}</em>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="sidebar-label">System</div><button className="nav-item"><Settings size={17} /><span>Settings</span></button><button className="nav-item reset" onClick={() => window.confirm('Reset all demo data?') && demo.reset()}><RotateCcw size={17} /><span>Reset demo data</span></button><div className="sidebar-foot"><div className="team-avatar">SH</div><div><b>Demo Mode</b><span>Frontend simulation</span></div><CircleHelp size={15} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button><div className="breadcrumb"><span>Workspace</span><ArrowRight size={13} /><b>{title}</b></div><div className="top-actions"><label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students, rooms, or complaints..." /></label><button className="icon-button notification"><Bell size={19} /><i /></button><div className="profile"><div className="avatar">M</div><span>Manager</span><ChevronDown size={15} /></div></div></header>
      <div className="page-wrap"><Page view={view} search={search} demo={demo} onNavigate={setView} /></div>
    </main>
  </div>;
}

type Demo = ReturnType<typeof useDemoState>;
function Page({ view, search, demo, onNavigate }: { view: View; search: string; demo: Demo; onNavigate: (view: View) => void }) {
  if (view === 'dashboard') return <Dashboard demo={demo} onNavigate={onNavigate} />;
  if (view === 'students') return <Students demo={demo} search={search} />;
  if (view === 'rooms') return <Rooms students={demo.students} />;
  if (view === 'waiting') return <Waiting students={demo.students} />;
  if (view === 'rules') return <Rules />;
  if (view === 'fines') return <Fines demo={demo} />;
  if (view === 'complaints') return <Complaints demo={demo} />;
  if (view === 'resolved') return <Resolved complaints={demo.resolved} />;
  if (view === 'activities') return <Activities items={demo.activities} />;
  if (view === 'path') return <PathFinder />;
  return <Visualizer students={demo.students} dsaStats={demo.dsaStats} activities={demo.activities} complaints={demo.complaints} />
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
function Stat({ label, value, icon: Icon, trend, tone }: { label: string; value: string; icon: typeof Users; trend?: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-info"><span>{label}</span><strong>{value}</strong>{trend && <small className="trend">{trend}</small>}</div><div className="stat-spark" /></div>; }
function Dashboard({ demo, onNavigate }: { demo: Demo; onNavigate: (view: View) => void }) {
const occupied = demo.dashboardData.occupiedBeds;
const totalFines = demo.dashboardData.totalFines; 
const totalBeds = demo.dashboardData.totalBeds;
  const occupancy = demo.dashboardData.occupancy;
  const chartData = [{ name: 'Current', value: occupancy }];
  return <><section className="welcome-banner"><img src={heroImage} alt="Modern university campus building" /><div className="welcome-copy"><span className="eyebrow light">HOSTEL ADMINISTRATION</span><h1>Welcome back, Manager</h1><p>Keep your campus running beautifully.</p><div className="banner-pill"><Sparkles size={14} /> Everything looks in order today</div></div></section><div className="stats-grid"><Stat label="Total students" value={String(demo.dashboardData.totalStudents)} icon={Users} trend="+5% this month" tone="rose" /><Stat label="Occupied beds" value={`${occupied} / ${totalBeds}`} icon={BedDouble} trend={`${occupancy}% occupancy`} tone="mauve" /><Stat label="Pending complaints" value={String(demo.dashboardData.pendingComplaints)} icon={ShieldAlert} trend="Needs attention" tone="gold" /><Stat label="Total fines imposed" value={`Rs. ${totalFines.toLocaleString()}`} icon={WalletCards} trend="Across all residents" tone="sage" /></div><div className="dashboard-grid"><section className="panel occupancy-panel"><PanelHeading icon={BedDouble} title="Room status" link="View all rooms" onClick={() => onNavigate('rooms')} /><div className="room-list">{[101, 102, 103, 104, 105].map(room => { const residents = demo.students.filter(s => s.room === room && s.status === 'Active'); return <div className="room-row" key={room}><span className="room-number">Room {room}</span><span className={`status-chip ${residents.length === 0 ? 'vacant' : residents.length === 2 ? 'full' : 'occupied'}`}>{residents.length === 0 ? 'Vacant' : residents.length === 2 ? 'Full' : 'Occupied'}</span><span className="bed-count">{residents.length} / 2</span><span className="mini-users"><Users size={15} /><Users size={15} className={residents.length < 2 ? 'muted' : ''} /></span></div>; })}</div></section><section className="panel activity-panel"><PanelHeading icon={Activity} title="Recent activities" link="View all" onClick={() => onNavigate('activities')} /><div className="timeline">{demo.activities.slice(0, 4).map(item => <div className="timeline-item" key={item.id}><span className={`timeline-dot ${item.tone}`} /><div><b>{item.text}</b><small>{item.detail}</small></div></div>)}</div></section><section className="panel quick-panel"><PanelHeading icon={Zap} title="Quick actions" /><div className="quick-actions"><button onClick={() => onNavigate('students')}><UserPlus size={19} /><span>Register<br />student</span></button><button onClick={() => onNavigate('complaints')}><AlertTriangle size={19} /><span>Report<br />complaint</span></button><button onClick={() => onNavigate('rules')}><BookOpen size={19} /><span>View<br />rules</span></button><button onClick={() => onNavigate('path')}><Route size={19} /><span>Find a<br />path</span></button></div></section><section className="panel chart-panel"><PanelHeading icon={Activity} title="Occupancy overview" link="Current" /><div className="chart-value"><strong>{occupancy}%</strong><span>current occupancy</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={160}><AreaChart data={chartData}><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c98791" stopOpacity={0.3} /><stop offset="95%" stopColor="#c98791" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eee3df" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9a8d91', fontSize: 11 }} /><Tooltip contentStyle={{ border: '1px solid #eadfda', borderRadius: 12, background: '#fffaf8' }} /><Area type="monotone" dataKey="value" stroke="#ad737d" strokeWidth={2.5} fill="url(#areaFill)" /></AreaChart></ResponsiveContainer></div></section><section className="panel fines-panel"><PanelHeading icon={WalletCards} title="Recent fines" link="View all" /><table className="compact-table"><thead><tr><th>Student</th><th>Rule</th><th>Amount</th></tr></thead><tbody>{demo.fines.slice(0, 3).map((fine, i) => <tr key={`${fine.studentId}-${i}`}><td>{demo.students.find(s => s.id === fine.studentId)?.name || fine.studentId}</td><td>{fine.rule}</td><td><b>{fine.amount}</b></td></tr>)}</tbody></table></section><section className="overview-card"><div className="overview-top"><div><span className="eyebrow light">Hostel overview</span><h3>A considered place<br />to call home.</h3></div><Moon size={25} /></div><div className="donut"><div><strong>{occupancy}%</strong><span>occupied</span></div></div><div className="legend"><span><i className="dot rose-dot" />Occupied <b>{occupied}</b></span><span><i className="dot cream-dot" />Available <b>{demo.dashboardData.vacantBeds}</b></span></div></section></div></>;
}
function PanelHeading({ icon: Icon, title, link, onClick }: { icon: typeof Activity; title: string; link?: string; onClick?: () => void }) { return <div className="panel-heading"><div><Icon size={18} /><h2>{title}</h2></div>{link && <button type="button" onClick={onClick}>{link} <ArrowRight size={14} /></button>}</div>; }

function Students({ demo, search }: { demo: Demo; search: string }) { const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ id: '', name: '', department: 'Computer Science' }); const [sort, setSort] = useState(false); const filtered = demo.students.filter(s => `${s.id} ${s.name} ${s.department}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort ? a.id.localeCompare(b.id) : 0); const submit = () => { if (!form.id || !form.name || demo.students.some(s => s.id === form.id)) return; const room = [101, 102, 103, 104, 105].find(r => demo.students.filter(s => s.room === r && s.status === 'Active').length < 2) || null; demo.register({ ...form, room, status: 'Active', violations: 0 }); setForm({ id: '', name: '', department: 'Computer Science' }); setShowForm(false); }; return <><PageHeader eyebrow="Resident directory" title="Students" description="Manage residents, assignments, and checkout records." action={<button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> Register student</button>} />{showForm && <div className="inline-form panel"><div className="form-title"><h2>Register a student</h2><button className="icon-button" onClick={() => setShowForm(false)}><X size={18} /></button></div><div className="form-grid"><label>Student ID<input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="ST-109" /></label><label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Student name" /></label><label>Department<select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}><option>Computer Science</option><option>Engineering</option><option>Business</option><option>Architecture</option><option>Literature</option></select></label></div><div className="form-footer"><span>First available bed is assigned automatically.</span><button className="primary-button" onClick={submit}>Save student</button></div></div>}<section className="panel table-panel"><div className="table-tools"><div><h2>All students <span>{demo.students.length}</span></h2><p>Search results update as you type.</p></div><button className={`sort-button ${sort ? 'selected' : ''}`} onClick={() => setSort(!sort)}><GitBranch size={16} /> Sort by ID</button></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Student ID</th><th>Name</th><th>Department</th><th>Assigned room</th><th>Status</th><th>Violations</th><th></th></tr></thead><tbody>{filtered.map(student => <tr key={student.id}><td><b className="id-text">{student.id}</b></td><td><div className="person-cell"><div className="person-avatar">{student.name.split(' ').map(n => n[0]).join('')}</div>{student.name}</div></td><td>{student.department}</td><td>{student.room ? <span className="room-tag">Room {student.room}</span> : <span className="muted-text">Waiting list</span>}</td><td><span className={`status-chip ${student.status === 'Active' ? 'active' : 'closed'}`}>{student.status}</span></td><td>{student.violations >= 3 ? <span className="warning-count">{student.violations} warnings</span> : student.violations || '—'}</td><td><button className="table-action" disabled={student.status !== 'Active'} onClick={() => window.confirm(`Check out ${student.name}?`) && demo.checkout(student.id)}>{student.status === 'Active' ? 'Check out' : 'Completed'}</button></td></tr>)}</tbody></table></div></section></>; }

function Rooms({ students }: { students: Student[] }) { return <><PageHeader eyebrow="Accommodation" title="Rooms" description="Five rooms, ten beds, and automatic allocation for every resident." /><div className="room-cards">{[101, 102, 103, 104, 105].map(room => { const residents = students.filter(s => s.room === room && s.status === 'Active'); return <section className="room-card panel" key={room}><div className="room-card-head"><div><span className="eyebrow">Room</span><h2>{room}</h2></div><span className={`status-chip ${residents.length === 0 ? 'vacant' : residents.length === 2 ? 'full' : 'occupied'}`}>{residents.length === 0 ? 'Vacant' : residents.length === 2 ? 'Full' : 'Partially occupied'}</span></div><div className="room-illustration"><BedDouble size={43} strokeWidth={1.3} /><span>{residents.length} / 2 beds occupied</span></div><div className="resident-list">{residents.map(s => <div key={s.id}><div className="person-avatar">{s.name.split(' ').map(n => n[0]).join('')}</div><span>{s.name}</span><small>{s.id}</small></div>)}{residents.length < 2 && <div className="empty-bed"><DoorOpen size={15} /> Available bed</div>}</div><div className="progress"><span style={{ width: `${residents.length * 50}%` }} /></div></section>; })}</div></>; }
function Waiting({ students }: { students: Student[] }) { const waiting = students.filter(s => s.status === 'Active' && !s.room); return <><PageHeader eyebrow="Automatic queue" title="Waiting list" description="A fair FIFO queue for residents waiting for the next available bed." /><section className="queue-hero panel"><div className="queue-icon"><ListChecks size={25} /></div><div><span className="eyebrow">Queue status</span><h2>{waiting.length ? `${waiting.length} student${waiting.length > 1 ? 's' : ''} waiting for a room` : 'The queue is currently clear'}</h2><p>When a bed becomes available, the first eligible student is assigned automatically.</p></div><div className="fifo-badge">FIFO queue</div></section><section className="panel table-panel"><div className="table-tools"><div><h2>Queue order <span>{waiting.length}</span></h2><p>First in, first allocated.</p></div></div>{waiting.length ? <div className="queue-list">{waiting.map((s, i) => <div className="queue-row" key={s.id}><strong>0{i + 1}</strong><div className="person-avatar">{s.name.split(' ').map(n => n[0]).join('')}</div><div><b>{s.name}</b><span>{s.id} · {s.department}</span></div><span className="queue-state"><Clock3 size={15} /> Waiting</span></div>)}</div> : <EmptyState icon={Check} title="No students waiting" text="All current residents have an assigned bed." />}</section></>; }
function Rules() { const [query, setQuery] = useState(''); return <><PageHeader eyebrow="Resident handbook" title="Hostel rules" description="A clear, shared standard for a considerate campus community." /><div className="rules-toolbar"><div className="search-box light-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search rules..." /></div><span>12 official rules</span></div><div className="rules-grid">{rules.map((rule, i) => `${rule[0]} ${rule[1]}`.toLowerCase().includes(query.toLowerCase()) && <section className="rule-card panel" key={rule[0]}><div className="rule-number">{String(i + 1).padStart(2, '0')}</div><div><h3>{rule[0]}</h3><p>Applies to all residents and guests.</p></div><strong>{rule[1]}</strong></section>)}</div></>; }
function Fines({ demo }: { demo: Demo }) { const [showForm, setShowForm] = useState(false); const [studentId, setStudentId] = useState(''); const [rule, setRule] = useState(0); const active = demo.students.filter(s => s.status === 'Active'); const total = demo.fines.reduce((sum, f) => sum + Number(f.amount.replace(/[^0-9]/g, '')), 0); return <><PageHeader eyebrow="Accountability" title="Fines" description="Record violations and keep a transparent view of imposed fines." action={<button className="primary-button" onClick={() => setShowForm(!showForm)}><Plus size={17} /> Add violation</button>} />{showForm && <section className="panel inline-form"><div className="form-grid"><label>Student<select value={studentId} onChange={e => setStudentId(e.target.value)}><option value="">Select active student</option>{active.map(s => <option key={s.id} value={s.id}>{s.id} — {s.name}</option>)}</select></label><label>Rule violated<select value={rule} onChange={e => setRule(Number(e.target.value))}>{rules.map((r, i) => <option key={r[0]} value={i}>{i + 1}. {r[0]} — {r[1]}</option>)}</select></label></div><div className="form-footer"><span>Amount is automatically retrieved from the official rules.</span><button className="primary-button" disabled={!studentId} onClick={() => { demo.addFine(studentId, rule); setShowForm(false); setStudentId(''); }}>Impose fine</button></div></section>}<div className="summary-grid"><Stat label="Total violations" value={String(demo.fines.length)} icon={ClipboardList} tone="rose" /><Stat label="Total fines imposed" value={`Rs. ${total.toLocaleString()}`} icon={WalletCards} tone="gold" /><Stat label="Repeated violations" value={String(demo.students.filter(s => s.violations >= 3).length)} icon={AlertTriangle} tone="mauve" /></div><section className="panel table-panel"><div className="table-tools"><div><h2>Fine records <span>{demo.fines.length}</span></h2><p>Payment tracking is not part of this system.</p></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Student</th><th>Rule violated</th><th>Amount</th><th>Violation count</th></tr></thead><tbody>{demo.fines.map((fine, i) => { const s = demo.students.find(x => x.id === fine.studentId); return <tr key={i}><td><div className="person-cell"><div className="person-avatar">{s?.name.split(' ').map(n => n[0]).join('') || '?'}</div><div><b>{s?.name || fine.studentId}</b><small>{fine.studentId}</small></div></div></td><td>{fine.rule}</td><td><b>{fine.amount}</b></td><td>{s && s.violations >= 3 ? <span className="warning-count">{s.violations} warnings</span> : s?.violations || 1}</td></tr>; })}</tbody></table></div></section></>; }

function classify(text: string): { priority: Priority; category: string } { const lower = text.toLowerCase(); if (/(fire|medical|security|threat|electrical|harass|violence|emergency)/.test(lower)) return { priority: 'High', category: 'Safety & security' }; if (/(clean|food|wifi|wi-fi|plumb|furniture|laundry|maintenance)/.test(lower)) return { priority: 'Medium', category: 'Maintenance' }; return { priority: 'Low', category: 'General' }; }
function Complaints({ demo }: { demo: Demo }) { const [showForm, setShowForm] = useState(false); const [studentId, setStudentId] = useState(''); const [text, setText] = useState(''); const submit = () => { if (!studentId || !text) return; const result = classify(text); demo.addComplaint({ id: Math.max(0, ...demo.complaints.map(c => c.id)) + 1, studentId, description: text, ...result }); setStudentId(''); setText(''); setShowForm(false); }; return <><PageHeader eyebrow="Resident care" title="Complaints" description="Prioritized queues keep the most important issues moving first." action={<button className="primary-button" onClick={() => setShowForm(!showForm)}><Plus size={17} /> Submit complaint</button>} />{showForm && <section className="panel inline-form"><div className="form-grid"><label>Student<select value={studentId} onChange={e => setStudentId(e.target.value)}><option value="">Select active student</option>{demo.students.filter(s => s.status === 'Active').map(s => <option key={s.id} value={s.id}>{s.id} — {s.name}</option>)}</select></label><label className="wide">Complaint description<textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tell us what needs attention..." /></label></div><div className="form-footer"><span>Priority is assigned using the official keyword rules.</span><button className="primary-button" disabled={!studentId || !text} onClick={submit}>Submit complaint</button></div></section>}<div className="complaint-columns">{(['High', 'Medium', 'Low'] as Priority[]).map(priority => <section className="complaint-column" key={priority}><div className={`column-head ${priority.toLowerCase()}`}><div><span className="priority-dot" /><h2>{priority} priority</h2></div><b>{demo.complaints.filter(c => c.priority === priority).length}</b></div>{demo.complaints.filter(c => c.priority === priority).map(c => <article className="complaint-card panel" key={c.id}><div className="complaint-card-top"><span>#{c.id}</span><MoreHorizontal size={17} /></div><h3>{c.description}</h3><p>{c.studentId} · {c.category}</p><span className={`priority-label ${priority.toLowerCase()}`}>{priority} priority</span></article>)}{!demo.complaints.some(c => c.priority === priority) && <div className="empty-mini">No {priority.toLowerCase()} priority cases.</div>}</section>)}</div><div className="resolve-bar"><div><CheckCircle2 size={19} /><span><b>Resolve in priority order.</b> The next case will always be selected automatically.</span></div><button className="primary-button" disabled={!demo.complaints.length} onClick={() => demo.resolveNext()}>Resolve next complaint <ArrowRight size={16} /></button></div></>; }
function Resolved({ complaints }: { complaints: ResolvedComplaint[] }) { return <><PageHeader eyebrow="Closed loop" title="Resolved complaints" description="A simple history of issues that have been addressed." />{complaints.length ? <section className="panel table-panel"><div className="table-scroll"><table className="data-table"><thead><tr><th>Complaint ID</th><th>Student ID</th><th>Description</th><th>Priority</th><th>Category</th><th>Resolved</th></tr></thead><tbody>{complaints.map(complaint => <tr key={`${complaint.id}-${complaint.resolvedAt}`}><td><b className="id-text">#{complaint.id}</b></td><td>{complaint.studentId}</td><td>{complaint.description}</td><td><span className={`priority-label ${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></td><td>{complaint.category}</td><td>{new Date(complaint.resolvedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section> : <section className="panel table-panel"><div className="resolved-empty"><div className="empty-icon"><CheckCircle2 size={25} /></div><h2>No resolved complaints yet</h2><p>Complaints resolved in Demo Mode will appear here.</p><span className="demo-note"><CircleDot size={13} /> Resolution history is stored automatically</span></div></section>}</>; }
function Activities({ items }: { items: ActivityItem[] }) { return <><PageHeader eyebrow="System log" title="Recent activities" description="The latest ten actions, shown newest first like a stack." /><section className="panel activity-history"><div className="stack-label"><Layers3 size={17} /> LIFO activity stack <span>Top = newest</span></div>{items.map((item, i) => <div className="history-row" key={item.id}><div className={`history-icon ${item.tone}`}>{i === 0 ? <Sparkles size={16} /> : <Activity size={16} />}</div><div><b>{item.text}</b><span>{item.detail} · Demo Mode</span></div><span className="stack-index">{String(i + 1).padStart(2, '0')}</span></div>)}</section></>; }

function PathFinder() {
  const locations = ['Gate', 'Reception', 'BlockA', 'BlockB', 'Mess', 'Library', 'MedicalRoom'];
 
  const linePositions = [
    ['Gate', 'Reception', 110, 220, 270, 105], ['Reception', 'BlockA', 270, 105, 270, 270],
    ['Reception', 'BlockB', 270, 105, 460, 95], ['BlockA', 'Mess', 270, 270, 460, 205],
    ['BlockB', 'Mess', 460, 95, 460, 205], ['BlockA', 'Library', 270, 270, 600, 95],
    ['Mess', 'Library', 460, 205, 600, 95], ['BlockB', 'MedicalRoom', 460, 95, 600, 280],
    ['Library', 'MedicalRoom', 600, 95, 600, 280]
  ] as const;
  const [from, setFrom] = useState('Gate');
  const [to, setTo] = useState('MedicalRoom');
  const [result, setResult] = useState<{ route: string[]; distance: number } | null>(null);
 const findShortestPath = async () => {
  if (from === to) {
    setResult(null);
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/path?source=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`
    );

    if (!response.ok) {
      throw new Error('Backend request failed.');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'No route found.');
    }

    setResult({
      route: data.path,
      distance: data.distance
    });

  } catch (error) {
    console.error('Path Finder error:', error);
    alert('Could not calculate the route. Make sure the C++ backend is running.');
  }
};
  const selectedSegments = new Set(result ? result.route.slice(1).map((location, index) => [result.route[index], location].sort().join('|')) : []);
  const isHighlighted = (start: string, end: string) => selectedSegments.has([start, end].sort().join('|'));
  return <><PageHeader eyebrow="Campus navigation" title="Path finder" description="Explore the shortest route between important hostel locations." /><section className="path-layout"><div className="panel path-controls"><div className="path-intro"><div className="path-icon"><Route size={22} /></div><div><h2>Dijkstra route finder</h2><p>Exact demo graph from the C++ project.</p></div></div><label>Starting location<select value={from} onChange={e => setFrom(e.target.value)}>{locations.map(location => <option key={location}>{location}</option>)}</select></label><label>Destination<select value={to} onChange={e => setTo(e.target.value)}>{locations.map(location => <option key={location}>{location}</option>)}</select></label><button className="primary-button path-button" onClick={findShortestPath}><Route size={16} /> Find shortest path</button>{from === to ? <div className="route-message">Choose two different locations to find a route.</div> : result ? <div className="route-result"><span>Shortest route</span><strong>{result.route.join(' → ')}</strong><div><b>{result.distance} units</b><span>total distance</span></div></div> : <div className="route-message">Select your locations, then find the shortest path.</div>}</div><div className="panel graph-panel"><div className="graph-title"><h2>Hostel graph</h2><span><i className="legend-line" /> Connections <i className="legend-route" /> Selected route</span></div><div className="graph-map">{locations.map((location, i) => <div key={location} className={`graph-node node-${i}`}><span>{location}</span><div className="node-circle">{i === 0 ? <DoorOpen size={16} /> : i === 6 ? <ShieldAlert size={16} /> : <Building2 size={16} />}</div></div>)}<svg className="graph-lines" viewBox="0 0 700 360" preserveAspectRatio="none">{linePositions.map(([start, end, x1, y1, x2, y2]) => <line className={isHighlighted(start, end) ? 'highlighted' : 'muted'} key={`${start}-${end}`} x1={x1} y1={y1} x2={x2} y2={y2} />)}</svg></div></div></section></>;
}

function Visualizer({
  students,
  dsaStats,
  activities,
  complaints,
}: {
  students: Student[];
  activities: ActivityItem[];
  complaints: Complaint[];
  dsaStats: {
    hashTableStudents: number;
    linkedListStudents: number;
    bstStudents: number;
    waitingQueueSize: number;
    actionStackSize: number;
    highPriorityQueueSize: number;
    mediumPriorityQueueSize: number;
    lowPriorityQueueSize: number;
    resolvedComplaints: number;
    roomArraySize: number;
    occupiedBeds: number;
    graphVertices: number;
  };
}) {
  const [active, setActive] = useState('Array');
  const [bstTree, setBstTree] = useState<BSTNodeData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/bst-tree`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load BST');
        return response.json();
      })
      .then(data => setBstTree(data))
      .catch(error => console.error('BST loading error:', error));
  }, [active, students]);

  const tabs = [
    { name: 'Array', icon: Database },
    { name: 'Linked list', icon: GitBranch },
    { name: 'Hash table', icon: Hash },
    { name: 'FIFO queue', icon: ListChecks },
    { name: 'Stack', icon: Layers3 },
    { name: 'BST', icon: Network },
    { name: 'Priority queue', icon: ShieldAlert },
    { name: 'Graph', icon: Route }
  ];

  const renderBSTNode = (node: BSTNodeData): any => {
    return (
      <>
        <div className="tree-node">{node.id}</div>

        {node.left && (
          <div className="tree-branch left">
            {renderBSTNode(node.left)}
          </div>
        )}

        {node.right && (
          <div className="tree-branch right">
            {renderBSTNode(node.right)}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="University project"
        title="DSA visualizer"
        description="See the structures that power Smart Hostel, presented as clear educational models."
      />

      <div className="visualizer-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;

          return (
            <button
              className={active === tab.name ? 'active' : ''}
              onClick={() => setActive(tab.name)}
              key={tab.name}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </div>

      <section className="visualizer-stage panel">
        <div className="stage-copy">
          <span className="eyebrow">Interactive model</span>

          <h2>
            {active === 'Array' ? 'Static room array' : `${active} structure`}
          </h2>

          <p>
            {active === 'Array'
              ? 'Five rooms are stored in a fixed array. Each slot represents a room with a capacity of two beds.'
              : active === 'BST'
              ? 'Live Binary Search Tree fetched directly from the C++ backend. Each node represents a student ID.'
              : 'An illustrative view of the data structure used by the hostel system.'}
          </p>
        </div>
       
        <div className="stage-live-count">
          {active === 'Array' && (
            <span>Backend data: {dsaStats.roomArraySize} rooms | {dsaStats.occupiedBeds} occupied beds</span>
          )}

          {active === 'Linked list' && (
            <span>Backend data: {dsaStats.linkedListStudents} students</span>
          )}

          {active === 'Hash table' && (
            <span>Backend data: {dsaStats.hashTableStudents} students</span>
          )}

          {active === 'FIFO queue' && (
            <span>Backend data: {dsaStats.waitingQueueSize} students waiting</span>
          )}

          {active === 'Stack' && (
            <span>Backend data: {dsaStats.actionStackSize} recorded actions</span>
          )}

          {active === 'BST' && (
            <span>Backend data: {dsaStats.bstStudents} students</span>
          )}

          {active === 'Priority queue' && (
            <span>
              Backend data: High {dsaStats.highPriorityQueueSize} | Medium {dsaStats.mediumPriorityQueueSize} | Low {dsaStats.lowPriorityQueueSize}
            </span>
          )}

          {active === 'Graph' && (
            <span>Backend data: {dsaStats.graphVertices} graph vertices</span>
          )}
        </div>

        <div className={`visual-model model-${active.toLowerCase().replace(' ', '-')}`}>

          {active === 'Array' &&
            [101, 102, 103, 104, 105].slice(0, dsaStats.roomArraySize).map((room, i) => {
              const residents = students.filter(student => student.room === room && student.status === 'Active');
              return (
                <div className="array-cell" key={room}>
                  <span>index {i}</span>
                  <strong>{room}</strong>
                  <small>{residents.length} / 2 beds occupied</small>
                </div>
              );
            })}

          {active === 'Linked list' &&
            (students.length > 0 ? students.map((s, i) => (
              <div className="node-card" key={s.id}>
                <span>{s.id}</span>
                <b>{s.name}</b>
                {i < students.length - 1 && <ArrowRight size={17} />}
              </div>
            )) : <p>No student nodes in the linked list yet.</p>)}

          {active === 'Hash table' &&
            (students.length > 0 ? students.map((student, i) => (
              <div className="hash-row" key={student.id}>
                <span>bucket {i}</span>
                <b>{student.id}</b>
                <small>lookup O(1)</small>
              </div>
            )) : <p>No students in the hash table yet.</p>)}

          {active === 'FIFO queue' && (
            <div className="queue-model">
              {students.filter(s => !s.room).length
                ? students.filter(s => !s.room).map(s => (
                    <div className="model-pill" key={s.id}>{s.id}</div>
                  ))
                : <div className="model-pill">Queue is clear</div>}
              <span className="queue-arrow">→ first out</span>
            </div>
          )}

          {active === 'Stack' &&
            (activities.length > 0 ? activities.slice(0, 8).map((item, i) => (
              <div
                className="stack-block"
                style={{ width: `${Math.max(45, 90 - i * 6)}%` }}
                key={item.id}
              >
                {item.text}
                <span>{i === 0 ? 'TOP' : 'LIFO'}</span>
              </div>
            )) : <p>No recorded actions in the stack yet.</p>)}

          {active === 'BST' && (
            <div className="bst">
              {bstTree
                ? renderBSTNode(bstTree)
                : <p>No students in the BST yet.</p>}
            </div>
          )}

          {active === 'Priority queue' &&
            (complaints.length > 0
              ? [...complaints].sort((a, b) => {
                  const rank = { High: 0, Medium: 1, Low: 2 };
                  return rank[a.priority] - rank[b.priority];
                }).map(complaint => (
                  <div className={`priority-bar ${complaint.priority.toLowerCase()}`} key={complaint.id}>
                    <b>{complaint.priority}</b>
                    <span>#{complaint.id} · {complaint.description}</span>
                  </div>
                ))
              : <p>No pending complaints in the priority queues.</p>)}

          {active === 'Graph' && (
            <div className="mini-graph">
              <span>Gate</span>
              <i>2</i>
              <span>Reception</span>
              <i>4</i>
              <span>Block B</span>
              <i>2</i>
              <span>Mess</span>
            </div>
          )}

        </div>
      </section>

      <div className="visualizer-foot">
        <Database size={17} />
        <span>
          {active === 'BST'
            ? 'Live BST structure retrieved from the C++ backend using recursive tree traversal.'
            : active === 'Stack' || active === 'Priority queue' || active === 'Linked list' || active === 'Hash table' || active === 'Array' || active === 'FIFO queue'
            ? 'Records and counts are loaded from the C++ backend. The visual layout illustrates how each data structure operates.'
            : 'The route finder uses the C++ backend graph; this compact view illustrates its hostel locations.'}
        </span>
      </div>
    </>
  );
}
  function EmptyState({ icon: Icon, title, text }: { icon: typeof Check; title: string; text: string }) { return <div className="empty-state"><Icon size={25} /><h3>{title}</h3><p>{text}</p></div>; }

export default App;
