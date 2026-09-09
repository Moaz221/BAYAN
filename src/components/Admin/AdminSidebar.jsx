import { LayoutDashboard, Users, BookOpen, PlaySquare, FileText, BarChart3, CreditCard } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'students', label: 'إدارة الطلاب', icon: Users },
  { id: 'plans', label: 'الباقات والاشتراكات', icon: CreditCard },
  { id: 'units', label: 'إدارة الوحدات', icon: BookOpen },
  { id: 'lessons', label: 'إدارة الدروس', icon: PlaySquare },
  { id: 'exams', label: 'الامتحانات', icon: FileText },
  { id: 'examResults', label: 'نتائج الامتحانات', icon: BarChart3 },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full rounded-[24px] border border-[#D4AF37]/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.95),rgba(5,7,10,0.95))] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px] sm:p-5 lg:w-[300px]">
      <div className="mb-4 border-b border-white/10 pb-4 sm:mb-8 sm:pb-6">
        <span className="inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold text-[#D4AF37]">
          لوحة الأستاذ
        </span>

        <h1 className="mt-3 text-2xl font-black text-white font-amiri sm:mt-4 sm:text-3xl">بَيان</h1>
        <p className="mt-1 text-xs leading-6 text-gray-400 sm:mt-2 sm:text-sm sm:leading-7">
          إدارة المنصة التعليمية والطلاب والوحدات والدروس من مكان واحد بشكل منظم واحترافي.
        </p>
      </div>

      <nav className="admin-sidebar-nav flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex min-w-[116px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-center transition-all duration-300 sm:min-w-[132px] sm:px-4 sm:py-4 lg:min-w-0 lg:flex-row lg:justify-between lg:gap-0 lg:text-right ${
                active
                  ? 'border-[#D4AF37]/30 bg-[#D4AF37]/12 text-white shadow-[0_0_30px_rgba(212,175,55,0.08)]'
                  : 'border-transparent bg-white/[0.03] text-gray-300 hover:border-white/10 hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-xs font-medium leading-5 sm:text-sm lg:order-1">{item.label}</span>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all sm:h-11 sm:w-11 sm:rounded-2xl lg:order-2 ${
                  active
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                }`}
              >
                <Icon size={20} />
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
