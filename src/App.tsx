import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  Calendar,
  User,
  Plus,
  Trash2,
  CalendarDays,
  Briefcase,
  AlertCircle,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Download,
  Settings,
  Shield,
  RefreshCw,
  Lock,
  KeyRound,
  Printer,
  Edit3,
  Info,
  UploadCloud,
  MessageSquare,
  Users,
  AlertTriangle,
  X,
} from "lucide-react";

// --- 1. CONFIGURACIÓN ---

const firebaseConfig = {
  apiKey: "AIzaSyBntbZNbTIH6AdESFEc3hFkwNjoSKF2YdE",
  authDomain: "vacaciones-strongforms.firebaseapp.com",
  projectId: "vacaciones-strongforms",
  storageBucket: "vacaciones-strongforms.firebasestorage.app",
  messagingSenderId: "434045801898",
  appId: "1:434045801898:web:076453346e5b8a508d47d3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "empresa-vacaciones-prod";

const ADMIN_NAME = "Sergio Laurlund";
const DEFAULT_PIN = "1234";

// --- TRADUCCIONES ---
const TRANSLATIONS: any = {
  es: {
    app_title: "Portal RRHH v10 (Final)",
    nav_summary: "Mi Resumen",
    nav_calendar: "Calendario Equipo",
    nav_print: "Imprimir",
    nav_admin: "Admin",
    nav_team_print: "Equipo",
    nav_logout: "Cerrar Sesión",
    stats_vacation: "Vacaciones",
    stats_sick: "Bajas / Enfermedad",
    stats_personal: "Asuntos Propios",
    stats_family: "Cuidado Familiar",
    stats_remaining: "Restantes",
    stats_of: "de",
    stats_allowed: "permitidos",
    stats_unlimited: "Sin límite anual",
    stats_work_days: "Laborales",
    stats_personal_detail:
      "de 2 permitidos en Alumed / Strongforms* (condiciones mejoradas)",
    btn_new_request: "Nueva Solicitud",
    table_type: "Tipo",
    table_dates: "Fechas",
    table_days_nat: "Días Nat.",
    table_days_work: "Días Háb.",
    table_note: "Nota",
    table_action: "Acción",
    table_no_data: "No tienes solicitudes registradas en",
    form_title: "Nueva Solicitud",
    form_type_vacation: "Vacaciones",
    form_type_sick: "Enfermedad / Baja",
    form_type_personal: "Asuntos Propios",
    form_type_family: "Cuidado Familiar",
    form_from: "Desde",
    form_to: "Hasta",
    form_natural_days: "Días Naturales (a descontar)",
    form_work_equivalency: "Equivalencia Laboral (Info)",
    form_grace_period: "Cuenta para",
    form_grace_period_suffix: "(Periodo Gracia)",
    form_comments: "Comentarios (Opcional)",
    form_cancel: "Cancelar",
    form_confirm: "Confirmar",
    login_hello: "Hola",
    login_pin_text: "Introduce tu PIN de acceso",
    login_back: "Volver",
    login_enter: "Entrar",
    login_select: "Selecciona tu usuario",
    login_connection: "Conexión establecida. No hay datos.",
    login_init_btn: "Inicializar Plantilla",
    admin_limits: "Límites Anuales Globales",
    admin_holidays: "Festivos",
    admin_data: "Datos y Seguridad",
    admin_save: "Guardar Configuración",
    admin_import: "Importar Festivos 2026 (CV)",
    admin_set_30: "Establecer 30 días a TODOS",
    admin_download: "Descargar CSV",
    confirm_delete: "¿Seguro que quieres eliminar esta solicitud?",
    confirm_generic: "¿Estás seguro?",
    days: "días",
    day: "día",
    btn_excel: "Descargar Excel",
  },
  en: {
    app_title: "HR Portal",
    nav_summary: "My Summary",
    nav_calendar: "Team Calendar",
    nav_print: "Print",
    nav_admin: "Admin",
    nav_team_print: "Team",
    nav_logout: "Logout",
    stats_vacation: "Vacation",
    stats_sick: "Sick Leave",
    stats_personal: "Personal Days",
    stats_family: "Family Care",
    stats_remaining: "Remaining",
    stats_of: "of",
    stats_allowed: "allowed",
    stats_unlimited: "Unlimited",
    stats_work_days: "Working Days",
    stats_personal_detail:
      "of 2 allowed at Alumed / Strongforms* (improved conditions)",
    btn_new_request: "New Request",
    table_type: "Type",
    table_dates: "Dates",
    table_days_nat: "Cal. Days",
    table_days_work: "Work Days",
    table_note: "Note",
    table_action: "Action",
    table_no_data: "No requests found for",
    form_title: "New Request",
    form_type_vacation: "Vacation",
    form_type_sick: "Sick Leave",
    form_type_personal: "Personal Day",
    form_type_family: "Family Care",
    form_from: "From",
    form_to: "To",
    form_natural_days: "Calendar Days (deducted)",
    form_work_equivalency: "Work Days (Info)",
    form_grace_period: "Counts for",
    form_grace_period_suffix: "(Grace Period)",
    form_comments: "Comments (Optional)",
    form_cancel: "Cancel",
    form_confirm: "Confirm",
    login_hello: "Hello",
    login_pin_text: "Enter your access PIN",
    login_back: "Back",
    login_enter: "Enter",
    login_select: "Select your user",
    login_connection: "Connected. No data found.",
    login_init_btn: "Initialize Template",
    admin_limits: "Global Annual Limits",
    admin_holidays: "Holidays",
    admin_data: "Data & Security",
    admin_save: "Save Settings",
    admin_import: "Import 2026 Holidays (CV)",
    admin_set_30: "Set 30 days for ALL",
    admin_download: "Download CSV",
    confirm_delete: "Are you sure you want to delete this request?",
    confirm_generic: "Are you sure?",
    days: "days",
    day: "day",
    btn_excel: "Download Excel",
  },
  fr: {
    app_title: "Portail RH",
    nav_summary: "Mon Résumé",
    nav_calendar: "Calendrier Équipe",
    nav_print: "Imprimer",
    nav_admin: "Admin",
    nav_team_print: "Équipe",
    nav_logout: "Déconnexion",
    stats_vacation: "Congés Payés",
    stats_sick: "Maladie",
    stats_personal: "Affaires Personnelles",
    stats_family: "Garde Enfant/Famille",
    stats_remaining: "Restants",
    stats_of: "sur",
    stats_allowed: "autorisés",
    stats_unlimited: "Illimité",
    stats_work_days: "Ouvrables",
    stats_personal_detail:
      "sur 2 autorisés chez Alumed / Strongforms* (conditions améliorées)",
    btn_new_request: "Nouvelle Demande",
    table_type: "Type",
    table_dates: "Dates",
    table_days_nat: "Jours Cal.",
    table_days_work: "Jours Ouv.",
    table_note: "Note",
    table_action: "Action",
    table_no_data: "Aucune demande pour",
    form_title: "Nouvelle Demande",
    form_type_vacation: "Congés",
    form_type_sick: "Maladie",
    form_type_personal: "Personnel",
    form_type_family: "Famille",
    form_from: "Du",
    form_to: "Au",
    form_natural_days: "Jours Calendaires (déduits)",
    form_work_equivalency: "Jours Ouvrables (Info)",
    form_grace_period: "Compte pour",
    form_grace_period_suffix: "(Période de Grâce)",
    form_comments: "Commentaires (Optionnel)",
    form_cancel: "Annuler",
    form_confirm: "Confirmer",
    login_hello: "Bonjour",
    login_pin_text: "Entrez votre code PIN",
    login_back: "Retour",
    login_enter: "Entrer",
    login_select: "Sélectionnez votre utilisateur",
    login_connection: "Connexion établie. Pas de données.",
    login_init_btn: "Initialiser Modèle",
    admin_limits: "Limites Annuelles",
    admin_holidays: "Jours Fériés",
    admin_data: "Données et Sécurité",
    admin_save: "Enregistrer",
    admin_import: "Importer Fériés 2026 (CV)",
    admin_set_30: "Mettre 30 jours à TOUS",
    admin_download: "Télécharger CSV",
    confirm_delete: "Voulez-vous vraiment supprimer cette demande ?",
    confirm_generic: "Êtes-vous sûr ?",
    days: "jours",
    day: "jour",
    btn_excel: "Télécharger Excel",
  },
  wo: {
    app_title: "Buntub HR",
    nav_summary: "Sama Mbir",
    nav_calendar: "Arminaatu Mboolo",
    nav_print: "Imprimer",
    nav_admin: "Admin",
    nav_team_print: "Mboolo",
    nav_logout: "Génn",
    stats_vacation: "Noppalu (Congés)",
    stats_sick: "Faju / Tawat",
    stats_personal: "Sama Sohla",
    stats_family: "Toppatoo Njaboot",
    stats_remaining: "Li ci dess",
    stats_of: "ci",
    stats_allowed: "lañu maye",
    stats_unlimited: "Amul dayo",
    stats_work_days: "Ligeey",
    stats_personal_detail: "ci 2 lañu maye ci Alumed / Strongforms*",
    btn_new_request: "Ñaan mu bees",
    table_type: "Xeet",
    table_dates: "Jamono",
    table_days_nat: "Bes",
    table_days_work: "Bes Ligeey",
    table_note: "Karmat",
    table_action: "Def",
    table_no_data: "Amuloo benn ñaan ci",
    form_title: "Ñaan mu bees",
    form_type_vacation: "Noppalu",
    form_type_sick: "Faju",
    form_type_personal: "Sama Sohla",
    form_type_family: "Njaboot",
    form_from: "Dalle",
    form_to: "Ba",
    form_natural_days: "Bes yi ñuy waññi",
    form_work_equivalency: "Bes Ligeey",
    form_grace_period: "Bok na ci",
    form_grace_period_suffix: "(Période Grâce)",
    form_comments: "Wax ci (Bu la neexee)",
    form_cancel: "Neenal",
    form_confirm: "Dëggal",
    login_hello: "Na nga def",
    login_pin_text: "Dugalal sa PIN",
    login_back: "Dellu",
    login_enter: "Dugg",
    login_select: "Tannal sa tur",
    login_connection: "Jokko na. Amul dara.",
    login_init_btn: "Sos",
    admin_limits: "Limites Annuelles",
    admin_holidays: "Besu Noppalu",
    admin_data: "Données et Sécurité",
    admin_save: "Denc",
    admin_import: "Indi Fériés 2026 (CV)",
    admin_set_30: "Def 30 bes ñepp",
    admin_download: "Waccé CSV",
    confirm_delete: "Dëgg-dëgg bëgg nga dindi li?",
    confirm_generic: "Wóor na la?",
    days: "bes",
    day: "bes",
    btn_excel: "Waccé Excel",
  },
};

const HOLIDAYS_2026_VALENCIA = [
  { date: "2026-01-01", name: "Año Nuevo" },
  { date: "2026-01-06", name: "Epifanía del Señor" },
  { date: "2026-03-19", name: "San José" },
  { date: "2026-04-03", name: "Viernes Santo" },
  { date: "2026-04-06", name: "Lunes de Pascua" },
  { date: "2026-04-16", name: "Santa Faz (Alicante)" },
  { date: "2026-05-01", name: "Fiesta del Trabajo" },
  { date: "2026-06-23", name: "Fiesta Local (Alicante)" },
  { date: "2026-06-24", name: "San Juan" },
  { date: "2026-08-15", name: "Asunción de la Virgen" },
  { date: "2026-10-09", name: "Día de la Comunitat Valenciana" },
  { date: "2026-10-12", name: "Fiesta Nacional de España" },
  { date: "2026-12-08", name: "Inmaculada Concepción" },
  { date: "2026-12-25", name: "Natividad del Señor" },
];

const INITIAL_EMPLOYEES = [
  { name: "Abdou (SF)", role: "user", pin: "1234" },
  { name: "Alejandro (SF)", role: "user", pin: "1234" },
  { name: "Alieu (SF)", role: "user", pin: "1234" },
  { name: "Andres (SF)", role: "user", pin: "1234" },
  { name: "Fernando (SF)", role: "user", pin: "1234" },
  { name: "Ismael (Alumed)", role: "user", pin: "1234" },
  { name: "Marcos (SF)", role: "user", pin: "1234" },
  { name: "Ramon (SF)", role: "user", pin: "1234" },
  { name: "Sergio Laurlund", role: "admin", pin: "1234" },
];

// --- 2. UTILITIES ---

const formatDate = (date: any) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (year: any, month: any) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const calculateNaturalDuration = (
  startStr: any,
  endStr: any,
  holidays: any = []
) => {
  if (!startStr || !endStr) return 0;
  let count = 0;
  let current = new Date(startStr);
  const end = new Date(endStr);
  const holidaySet = new Set(holidays.map((h: any) => h.date));
  while (current <= end) {
    const dateStr = formatDate(current);
    if (!holidaySet.has(dateStr)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

const calculateWorkingDuration = (
  startStr: any,
  endStr: any,
  holidays: any = []
) => {
  if (!startStr || !endStr) return 0;
  let count = 0;
  let current = new Date(startStr);
  const end = new Date(endStr);
  const holidaySet = new Set(holidays.map((h: any) => h.date));
  while (current <= end) {
    const day = current.getDay();
    const dateStr = formatDate(current);
    if (day !== 0 && day !== 6 && !holidaySet.has(dateStr)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

const getFiscalYear = (dateStr: any) => {
  if (!dateStr) return new Date().getFullYear();
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (month === 1 && day <= 15) return year - 1;
  return year;
};

function stringToColor(str: any) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// --- EXCEL HELPER ---
const exportToExcel = (fileName: string, htmlContent: string) => {
  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Calendario</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #000; text-align: center; padding: 5px; }
        .bg-green { background-color: #86efac; }
        .bg-red { background-color: #fca5a5; }
        .bg-purple { background-color: #d8b4fe; }
        .bg-blue { background-color: #93c5fd; }
        .bg-orange { background-color: #fed7aa; }
        .bg-gray { background-color: #e5e7eb; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
  const blob = new Blob([template], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// --- 3. SUB-COMPONENTS ---

let confirmAction: any = null;
const openConfirm = (message: any, onConfirm: any) => {
  const event = new CustomEvent("open-confirm", {
    detail: { message, onConfirm },
  });
  window.dispatchEvent(event);
};

function ConfirmModal({ t }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e: any) => {
      setMessage(e.detail.message);
      confirmAction = e.detail.onConfirm;
      setIsOpen(true);
    };
    window.addEventListener("open-confirm", handler);
    return () => window.removeEventListener("open-confirm", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="bg-orange-100 p-3 rounded-full mb-4">
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {t("confirm_generic")}
          </h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex w-full gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              {t("form_cancel")}
            </button>
            <button
              onClick={() => {
                confirmAction && confirmAction();
                setIsOpen(false);
              }}
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition shadow-lg shadow-orange-200"
            >
              {t("form_confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  total,
  color,
  icon,
  customSubtext,
  t,
}: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-3 opacity-10 text-${color}-500`}>
      {icon}
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
      {title}
    </div>
    <div className={`text-3xl font-bold text-${color}-600`}>{value}</div>
    {customSubtext ? (
      <div className="text-xs text-slate-400 mt-1">{customSubtext}</div>
    ) : (
      <>
        {total !== undefined && (
          <div className="text-xs text-slate-400 mt-1">
            {t("stats_of")} {total} {t("stats_allowed")}
          </div>
        )}
        {total === undefined && (
          <div className="text-xs text-slate-400 mt-1">
            {t("stats_unlimited")}
          </div>
        )}
      </>
    )}
  </div>
);

const Badge = ({ type, t }: any) => {
  const styles: any = {
    vacation: "bg-green-100 text-green-800",
    sick: "bg-red-100 text-red-800",
    personal: "bg-purple-100 text-purple-800",
    family: "bg-blue-100 text-blue-800",
  };
  const labels: any = {
    vacation: t("stats_vacation"),
    sick: t("stats_sick"),
    personal: t("stats_personal"),
    family: t("stats_family"),
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
};

const TypeBtn = ({ active, onClick, label }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 text-xs font-bold rounded-lg border transition ${
      active
        ? "bg-orange-600 text-white border-orange-600 shadow-md"
        : "bg-white text-slate-500 border-slate-200 hover:border-orange-300"
    }`}
  >
    {label}
  </button>
);

// --- TEAM CALENDAR ---
function TeamCalendar({ employees, requests, holidays }: any) {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = getDaysInMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("es-ES", {
    month: "long",
  });

  const handlePrev = () => setDate(new Date(year, month - 1, 1));
  const handleNext = () => setDate(new Date(year, month + 1, 1));

  const getCellStatus = (d: any, empId: any) => {
    const dateStr = formatDate(d);
    const isHoliday = holidays.some((h: any) => h.date === dateStr);
    if (isHoliday) return { type: "holiday", label: "F" };
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6)
      return { type: "weekend", label: "" };
    const req = requests.find(
      (r: any) =>
        r.userId === empId && dateStr >= r.startDate && dateStr <= r.endDate
    );
    if (req) return { type: req.type, label: "" };
    return { type: "empty", label: "" };
  };

  const getStyle = (type: any) => {
    switch (type) {
      case "vacation":
        return "bg-green-500";
      case "sick":
        return "bg-red-500";
      case "personal":
        return "bg-purple-500";
      case "family":
        return "bg-blue-500";
      case "holiday":
        return "bg-orange-200 text-orange-800 font-bold";
      case "weekend":
        return "bg-slate-100";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center">
          <CalendarDays className="mr-2 text-slate-400" size={20} />
          {monthName} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 text-left font-bold text-slate-500 w-48 sticky left-0 bg-slate-50 z-20 border-r border-slate-200">
                Empleado
              </th>
              {days.map((d: any) => (
                <th
                  key={formatDate(d)}
                  className={`p-1 min-w-[2.5rem] text-center font-medium border-r border-slate-100 ${
                    d.getDay() === 0 || d.getDay() === 6
                      ? "text-red-400 bg-red-50"
                      : "text-slate-600"
                  }`}
                >
                  <div className="text-[10px] uppercase opacity-50">
                    {d
                      .toLocaleDateString("es-ES", { weekday: "short" })
                      .slice(0, 1)}
                  </div>
                  <div>{d.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp: any) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium text-slate-700 sticky left-0 bg-white hover:bg-slate-50 z-10 border-r border-slate-200 flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: stringToColor(emp.name) }}
                  ></div>
                  <span className="truncate w-32">{emp.name}</span>
                </td>
                {days.map((d: any) => {
                  const status = getCellStatus(d, emp.id);
                  return (
                    <td
                      key={formatDate(d)}
                      className={`p-1 border-r border-slate-100 text-center relative h-10 ${
                        status.type === "weekend" ? "bg-slate-50/50" : ""
                      }`}
                    >
                      {status.type !== "empty" && status.type !== "weekend" && (
                        <div
                          className={`w-full h-8 rounded-md flex items-center justify-center text-[10px] shadow-sm ${getStyle(
                            status.type
                          )}`}
                          title={status.type}
                        >
                          {status.label}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-4 text-xs text-slate-600 justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-green-500 mr-2"></div> Vacaciones
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>{" "}
          Baja/Enfermedad
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-purple-500 mr-2"></div> Asuntos
          Propios
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div> Cuidado
          Familiar
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-orange-200 mr-2 border border-orange-300"></div>{" "}
          Festivo
        </div>
      </div>
    </div>
  );
}

// --- PRINT VIEWS (EXCEL ENABLED) ---
function PrintableYearView({ user, requests, holidays, onBack }: any) {
  const [year, setYear] = useState(new Date().getFullYear());
  const months = Array.from({ length: 12 }, (_, i) => i);
  const getDayColor = (date: any) => {
    const dateStr = formatDate(date);
    const dayReq = requests.find(
      (r: any) =>
        r.userId === user.id && dateStr >= r.startDate && dateStr <= r.endDate
    );
    const isHoliday = holidays.some((h: any) => h.date === dateStr);
    if (dayReq) {
      if (dayReq.type === "vacation") return "bg-green-200";
      if (dayReq.type === "sick") return "bg-red-200";
      if (dayReq.type === "personal") return "bg-purple-200";
      if (dayReq.type === "family") return "bg-blue-200";
    }
    if (isHoliday) return "bg-orange-100";
    if (date.getDay() === 0 || date.getDay() === 6) return "bg-slate-100";
    return "";
  };

  const handleExcelExport = () => {
    let tableHTML = `<h2>Calendario ${year} - ${user.name}</h2><table><tr><th>Mes</th><th>Días</th></tr>`;
    months.forEach((month) => {
      const days = getDaysInMonth(year, month);
      const monthName = new Date(year, month, 1).toLocaleString("es-ES", {
        month: "long",
      });
      tableHTML += `<tr><td><b>${monthName}</b></td>`;
      days.forEach((d) => {
        const dateStr = formatDate(d);
        const dayReq = requests.find(
          (r: any) =>
            r.userId === user.id &&
            dateStr >= r.startDate &&
            dateStr <= r.endDate
        );
        const isHoliday = holidays.some((h: any) => h.date === dateStr);
        let bgColorClass = "";
        let text: any = d.getDate();

        if (dayReq) {
          if (dayReq.type === "vacation") bgColorClass = "bg-green";
          else if (dayReq.type === "sick") bgColorClass = "bg-red";
          else if (dayReq.type === "personal") bgColorClass = "bg-purple";
          else if (dayReq.type === "family") bgColorClass = "bg-blue";
        } else if (isHoliday) {
          bgColorClass = "bg-orange";
        } else if (d.getDay() === 0 || d.getDay() === 6) {
          bgColorClass = "bg-gray";
        }
        tableHTML += `<td class="${bgColorClass}">${text}</td>`;
      });
      tableHTML += "</tr>";
    });
    tableHTML += "</table>";
    exportToExcel(`Calendario_${user.name}_${year}.xls`, tableHTML);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 flex items-center"
        >
          <ChevronLeft className="mr-1" /> Volver
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setYear(year - 1)}
            className="p-2 border rounded hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-2xl font-bold">{year}</span>
          <button
            onClick={() => setYear(year + 1)}
            className="p-2 border rounded hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        {/* BOTÓN PDF OCULTO EN MÓVIL (md:flex), EXCEL VISIBLE SIEMPRE */}
        <button
          onClick={() => window.print()}
          className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg items-center hover:bg-blue-700 mr-2"
        >
          <Printer className="mr-2" size={18} /> PDF
        </button>
        <button
          onClick={handleExcelExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
        >
          <Download className="mr-2" size={18} /> Excel
        </button>
      </div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Calendario Laboral {year}
        </h1>
        <h2 className="text-lg text-slate-600">{user.name}</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 text-xs">
        {months.map((month: any) => {
          const days = getDaysInMonth(year, month);
          const monthName = new Date(year, month, 1).toLocaleString("es-ES", {
            month: "long",
          });
          const offset = days[0].getDay();
          return (
            <div key={month} className="border p-2 rounded break-inside-avoid">
              <h3 className="font-bold text-center uppercase mb-2 bg-slate-50 p-1 rounded">
                {monthName}
              </h3>
              <div className="grid grid-cols-7 gap-px">
                {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
                  <div key={d} className="text-center font-bold text-slate-400">
                    {d}
                  </div>
                ))}
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`off-${i}`}></div>
                ))}
                {days.map((d: any) => (
                  <div
                    key={formatDate(d)}
                    className={`text-center p-1 rounded-sm ${getDayColor(d)}`}
                  >
                    {d.getDate()}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintableTeamView({ employees, requests, holidays, onBack }: any) {
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [year, setYear] = useState(new Date().getFullYear());
  const monthsToPrint = Array.from(
    { length: endMonth - startMonth + 1 },
    (_, i) => startMonth + i
  );

  const getDayColor = (date: any, empId: any) => {
    const dateStr = formatDate(date);
    const dayReq = requests.find(
      (r: any) =>
        r.userId === empId && dateStr >= r.startDate && dateStr <= r.endDate
    );
    const isHoliday = holidays.some((h: any) => h.date === dateStr);
    if (dayReq) {
      if (dayReq.type === "vacation") return "bg-green-300";
      if (dayReq.type === "sick") return "bg-red-300";
      if (dayReq.type === "personal") return "bg-purple-300";
      if (dayReq.type === "family") return "bg-blue-300";
    }
    if (isHoliday) return "bg-orange-200";
    if (date.getDay() === 0 || date.getDay() === 6) return "bg-gray-200";
    return "bg-white";
  };

  const handleExcelExport = () => {
    let tableHTML = `<h2>Cuadrante Vacaciones ${year}</h2><table><thead><tr><th>Empleado</th>`;
    tableHTML += `</tr></thead><tbody>`;

    monthsToPrint.forEach((month) => {
      const days = getDaysInMonth(year, month);
      const monthName = new Date(year, month, 1).toLocaleString("es-ES", {
        month: "long",
      });
      tableHTML += `<tr><td colspan="${
        days.length + 1
      }" style="background-color:#eee; font-weight:bold; text-align:left;">${monthName}</td></tr>`;

      // Header Days
      tableHTML += `<tr><td></td>`;
      days.forEach((d) => (tableHTML += `<td>${d.getDate()}</td>`));
      tableHTML += `</tr>`;

      employees.forEach((emp: any) => {
        tableHTML += `<tr><td>${emp.name}</td>`;
        days.forEach((d) => {
          const dateStr = formatDate(d);
          const dayReq = requests.find(
            (r: any) =>
              r.userId === emp.id &&
              dateStr >= r.startDate &&
              dateStr <= r.endDate
          );
          const isHoliday = holidays.some((h: any) => h.date === dateStr);
          let bgColorClass = "";

          if (dayReq) {
            if (dayReq.type === "vacation") bgColorClass = "bg-green";
            else if (dayReq.type === "sick") bgColorClass = "bg-red";
            else if (dayReq.type === "personal") bgColorClass = "bg-purple";
            else if (dayReq.type === "family") bgColorClass = "bg-blue";
          } else if (isHoliday) {
            bgColorClass = "bg-orange";
          } else if (d.getDay() === 0 || d.getDay() === 6) {
            bgColorClass = "bg-gray";
          }
          tableHTML += `<td class="${bgColorClass}"></td>`;
        });
        tableHTML += `</tr>`;
      });
    });
    tableHTML += "</tbody></table>";
    exportToExcel(`Cuadrante_${year}.xls`, tableHTML);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-slate-100 p-4 rounded-lg">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 flex items-center"
        >
          <ChevronLeft className="mr-1" /> Volver
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Año:</span>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
          <span className="font-bold ml-4">Desde:</span>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            className="border rounded p-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleString("es-ES", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          <span className="font-bold ml-4">Hasta:</span>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(Number(e.target.value))}
            className="border rounded p-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleString("es-ES", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        {/* BOTÓN PDF OCULTO EN MÓVIL (md:flex), EXCEL VISIBLE SIEMPRE */}
        <button
          onClick={() => window.print()}
          className="hidden md:flex bg-blue-700 text-white px-4 py-2 rounded-lg items-center hover:bg-blue-800 mr-2"
        >
          <Printer className="mr-2" size={18} /> PDF
        </button>
        <button
          onClick={handleExcelExport}
          className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-800"
        >
          <Download className="mr-2" size={18} /> Excel
        </button>
      </div>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-center uppercase mb-4">
          Cuadrante Vacaciones {year}
        </h1>
        {monthsToPrint.map((month) => {
          const days = getDaysInMonth(year, month);
          const monthName = new Date(year, month, 1).toLocaleString("es-ES", {
            month: "long",
          });
          return (
            <div key={month} className="break-inside-avoid mb-8">
              <h3 className="text-lg font-bold uppercase mb-2 bg-slate-100 p-2 border-l-4 border-blue-600">
                {monthName}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-1 w-32 bg-gray-50 text-left">
                        Empleado
                      </th>
                      {days.map((d) => (
                        <th
                          key={d.getDate()}
                          className={`border p-1 w-6 text-center ${
                            d.getDay() === 0 || d.getDay() === 6
                              ? "bg-gray-200 text-gray-500"
                              : ""
                          }`}
                        >
                          {d.getDate()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp: any) => (
                      <tr key={emp.id}>
                        <td className="border p-1 font-medium truncate">
                          {emp.name}
                        </td>
                        {days.map((d) => (
                          <td
                            key={formatDate(d)}
                            className={`border p-1 ${getDayColor(d, emp.id)}`}
                          ></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center space-x-6 text-sm print:flex border-t pt-4">
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-green-300 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Vacaciones
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-purple-300 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Asuntos P.
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-red-300 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Baja
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-blue-300 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Familiar
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-orange-200 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Festivo
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-gray-200 mr-2 border"
            style={{ printColorAdjust: "exact" }}
          ></div>{" "}
          Finde
        </div>
      </div>
    </div>
  );
}

// --- SCREENS ---
function LoginScreen({ employees, onLogin, t, changeLanguage, lang }: any) {
  const [seeding, setSeeding] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "config", "settings"),
        { maxPersonalDays: 2, maxSickDays: 0, maxFamilyDays: 0 }
      );
      const promises = INITIAL_EMPLOYEES.map((emp) =>
        addDoc(
          collection(db, "artifacts", appId, "public", "data", "employees"),
          {
            name: emp.name,
            totalVacationDays: 30,
            balanceAdjustment: 0,
            pin: DEFAULT_PIN,
            createdAt: new Date().toISOString(),
          }
        )
      );
      await Promise.all(promises);
    } catch (error: any) {
      alert("Error: " + error.message);
      setSeeding(false);
    }
  };

  const handlePinSubmit = (e: any) => {
    e.preventDefault();
    const userPin = selectedEmp.pin || DEFAULT_PIN;
    if (pinInput === userPin) onLogin(selectedEmp);
    else {
      setError("PIN incorrecto");
      setPinInput("");
    }
  };

  if (selectedEmp) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-sm fixed inset-0 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
          <div className="text-center mb-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {t("login_hello")}, {selectedEmp.name.split(" ")[0]}
            </h3>
            <p className="text-sm text-slate-500">{t("login_pin_text")}</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center text-3xl tracking-[0.5em] font-bold py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="••••"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmp(null);
                  setPinInput("");
                  setError("");
                }}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
              >
                {t("login_back")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
              >
                {t("login_enter")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex space-x-1 z-10">
            <button
              onClick={() => changeLanguage("es")}
              className={`p-1 text-xs rounded ${
                lang === "es"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`p-1 text-xs rounded ${
                lang === "en"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("fr")}
              className={`p-1 text-xs rounded ${
                lang === "fr"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => changeLanguage("wo")}
              className={`p-1 text-xs rounded ${
                lang === "wo"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              WO
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
          <CalendarDays className="h-16 w-16 text-white mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {t("app_title")}
          </h2>
          <p className="text-slate-400 text-sm mt-2">Alumed / Strongforms</p>
        </div>
        <div className="p-8">
          {employees.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">{t("login_connection")}</p>
              <button
                onClick={seedDatabase}
                disabled={seeding}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center"
              >
                {seeding ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={18} /> ...
                  </>
                ) : (
                  t("login_init_btn")
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t("login_select")}
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {employees.map((emp: any) => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmp(emp)}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition group bg-white text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          emp.name === ADMIN_NAME
                            ? "bg-orange-100 text-orange-600"
                            : "bg-slate-100 text-slate-500"
                        } group-hover:bg-orange-600 group-hover:text-white transition-colors`}
                      >
                        {emp.name === ADMIN_NAME ? (
                          <Shield size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-orange-900">
                        {emp.name}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-orange-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestForm({
  user,
  settings,
  stats,
  holidays,
  currentYearView,
  onClose,
  totalAvailable,
  t,
}: any) {
  const [type, setType] = useState("vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const duration = useMemo(
    () => calculateNaturalDuration(startDate, endDate, holidays),
    [startDate, endDate, holidays]
  );
  const workDuration = useMemo(
    () => calculateWorkingDuration(startDate, endDate, holidays),
    [startDate, endDate, holidays]
  );
  const reqFiscalYear = useMemo(
    () => (startDate ? getFiscalYear(startDate) : currentYearView),
    [startDate, currentYearView]
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (duration <= 0) {
      setError("Fecha incorrecta.");
      return;
    }
    if (
      type === "personal" &&
      settings.maxPersonalDays > 0 &&
      stats.personalDays + duration > settings.maxPersonalDays
    ) {
      setError("Límite excedido.");
      return;
    }
    if (
      type === "family" &&
      settings.maxFamilyDays > 0 &&
      stats.familyDays + duration > settings.maxFamilyDays
    ) {
      setError("Límite excedido.");
      return;
    }
    if (type === "vacation" && stats.usedVacation + duration > totalAvailable) {
      openConfirm(
        `ADVERTENCIA: Vas a exceder tus días de vacaciones disponibles y quedarás en negativo (${
          totalAvailable - (stats.usedVacation + duration)
        }). ¿Continuar?`,
        async () => {
          await saveRequest();
        }
      );
      return;
    }
    await saveRequest();
  };

  const saveRequest = async () => {
    try {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "requests"),
        {
          userId: user.id,
          userName: user.name,
          type,
          startDate,
          endDate,
          notes,
          createdAt: new Date().toISOString(),
        }
      );
      onClose();
    } catch (err) {
      setError("Error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">
            {t("form_title")}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("form_type")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <TypeBtn
                active={type === "vacation"}
                onClick={() => setType("vacation")}
                label={t("form_type_vacation")}
              />
              <TypeBtn
                active={type === "sick"}
                onClick={() => setType("sick")}
                label={t("form_type_sick")}
              />
              <TypeBtn
                active={type === "personal"}
                onClick={() => setType("personal")}
                label={t("form_type_personal")}
              />
              <TypeBtn
                active={type === "family"}
                onClick={() => setType("family")}
                label={t("form_type_family")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("form_from")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("form_to")}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
                required
              />
            </div>
          </div>
          {startDate && endDate && (
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-800 font-medium">
                  {t("form_natural_days")}:
                </span>
                <span className="text-xl font-bold text-orange-900">
                  {duration}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                <span className="text-xs text-orange-700">
                  {t("form_work_equivalency")}:
                </span>
                <span className="text-sm font-bold text-orange-800">
                  {workDuration} {t("days")}
                </span>
              </div>
              {reqFiscalYear < parseInt(startDate.split("-")[0]) && (
                <p className="text-xs text-blue-600 mt-1 flex items-start font-bold">
                  <AlertCircle
                    size={12}
                    className="mr-1 mt-0.5 flex-shrink-0"
                  />
                  {t("form_grace_period")} {reqFiscalYear}{" "}
                  {t("form_grace_period_suffix")}.
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("form_comments")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 h-24 outline-none resize-none"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              {t("form_cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg shadow-orange-200 transition transform active:scale-95"
            >
              {t("form_confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({
  user,
  requests,
  holidays,
  settings,
  totalAvailable,
  t,
}: any) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [yearView, setYearView] = useState(
    getFiscalYear(formatDate(new Date()))
  );

  const myRequests = useMemo(() => {
    return requests
      .filter((r: any) => r.userId === user.id)
      .filter((r: any) => getFiscalYear(r.startDate) === yearView)
      .sort(
        (a: any, b: any) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
  }, [requests, user.id, yearView]);

  const stats = useMemo(() => {
    let usedVacation = 0,
      sickDays = 0,
      personalDays = 0,
      familyDays = 0,
      usedVacationWork = 0;
    myRequests.forEach((req: any) => {
      const duration = calculateNaturalDuration(
        req.startDate,
        req.endDate,
        holidays
      );
      const workDuration = calculateWorkingDuration(
        req.startDate,
        req.endDate,
        holidays
      );
      if (req.type === "vacation") {
        usedVacation += duration;
        usedVacationWork += workDuration;
      }
      if (req.type === "sick") sickDays += duration;
      if (req.type === "personal") personalDays += duration;
      if (req.type === "family") familyDays += duration;
    });
    return {
      usedVacation,
      usedVacationWork,
      sickDays,
      personalDays,
      familyDays,
      remainingVacation: totalAvailable - usedVacation,
    };
  }, [myRequests, totalAvailable, holidays]);

  const handleDeleteRequest = async (reqId: any) => {
    openConfirm(t("confirm_delete"), async () => {
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "requests", reqId)
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-700">
          Año Fiscal {yearView}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setYearView(yearView - 1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-mono font-bold text-slate-800 text-lg">
            {yearView}
          </span>
          <button
            onClick={() => setYearView(yearView + 1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 p-3 opacity-10 text-green-500`}
          >
            <Calendar />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t("stats_vacation")}
          </div>
          <div className="mb-2">
            <div
              className={`text-3xl font-bold ${
                stats.remainingVacation < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {stats.remainingVacation}
            </div>
            <div className="text-xs text-slate-400">
              {t("stats_remaining")} ({t("stats_of")} {totalAvailable})
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 mt-2">
            <div className="flex items-center text-xs text-slate-500">
              <Info size={12} className="mr-1 text-blue-400" />
              <span>
                {t("stats_work_days")}:{" "}
                <strong className="text-slate-700">
                  {stats.usedVacationWork} / 22
                </strong>
              </span>
            </div>
          </div>
        </div>
        <StatCard
          title={t("stats_sick")}
          value={stats.sickDays}
          total={settings.maxSickDays > 0 ? settings.maxSickDays : undefined}
          color="red"
          icon={<HeartPulse />}
          t={t}
        />
        <StatCard
          title={t("stats_personal")}
          value={stats.personalDays}
          total={settings.maxPersonalDays}
          color="purple"
          icon={<Briefcase />}
          customSubtext={t("stats_personal_detail")}
          t={t}
        />
        <StatCard
          title={t("stats_family")}
          value={stats.familyDays}
          total={
            settings.maxFamilyDays > 0 ? settings.maxFamilyDays : undefined
          }
          color="blue"
          icon={<User />}
          t={t}
        />
      </div>
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          {t("table_dates")} ({yearView})
        </h2>
        <button
          onClick={() => setShowRequestForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center transition shadow-lg shadow-orange-200 font-medium"
        >
          <Plus size={18} className="mr-2" />
          {t("btn_new_request")}
        </button>
      </div>
      {showRequestForm && (
        <RequestForm
          user={user}
          settings={settings}
          stats={stats}
          holidays={holidays}
          currentYearView={yearView}
          onClose={() => setShowRequestForm(false)}
          totalAvailable={totalAvailable}
          t={t}
        />
      )}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {myRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic">
            {t("table_no_data")} {yearView}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_type")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_dates")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_days_nat")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_days_work")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_note")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("table_action")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {myRequests.map((req: any) => {
                  const duration = calculateNaturalDuration(
                    req.startDate,
                    req.endDate,
                    holidays
                  );
                  const workDuration = calculateWorkingDuration(
                    req.startDate,
                    req.endDate,
                    holidays
                  );
                  const isGracePeriod =
                    getFiscalYear(req.startDate) <
                    parseInt(req.startDate.split("-")[0]);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge type={req.type} t={t} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {req.startDate}{" "}
                        <span className="text-slate-300 mx-2">➜</span>{" "}
                        {req.endDate}
                        {isGracePeriod && (
                          <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">
                            {t("form_grace_period_suffix")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        {duration} {t("days")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {req.type === "vacation"
                          ? `${workDuration} ${t("days")}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {req.notes && (
                          <div className="group relative flex justify-center">
                            <MessageSquare
                              size={16}
                              className="text-slate-400 cursor-help"
                            />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-50">
                              {req.notes}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="text-slate-300 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPanel({ employees, holidays, requests, settings, t }: any) {
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [limits, setLimits] = useState(settings);
  useEffect(() => {
    setLimits(settings);
  }, [settings]);
  const saveSettings = async () => {
    await setDoc(
      doc(db, "artifacts", appId, "public", "data", "config", "settings"),
      limits
    );
    openConfirm("Configuración guardada correctamente.", () => {});
  };
  const importHolidays2026 = async () => {
    openConfirm(t("admin_import"), async () => {
      const batch = writeBatch(db);
      HOLIDAYS_2026_VALENCIA.forEach((h) => {
        const ref = doc(
          collection(db, "artifacts", appId, "public", "data", "holidays")
        );
        batch.set(ref, h);
      });
      await batch.commit();
    });
  };
  const updateAllDays = async () => {
    openConfirm(t("admin_set_30"), async () => {
      const batch = writeBatch(db);
      employees.forEach((emp: any) => {
        const ref = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "employees",
          emp.id
        );
        batch.update(ref, { totalVacationDays: 30 });
      });
      await batch.commit();
    });
  };
  const updateBalance = async (empId: any, currentAdj: any) => {
    const newAdj = prompt("Ajuste (-1, +2...):", currentAdj || 0);
    if (newAdj !== null) {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "employees", empId),
        { balanceAdjustment: Number(newAdj) }
      );
    }
  };
  const addHoliday = async (e: any) => {
    e.preventDefault();
    if (!newHolidayName || !newHolidayDate) return;
    await addDoc(
      collection(db, "artifacts", appId, "public", "data", "holidays"),
      { name: newHolidayName, date: newHolidayDate }
    );
    setNewHolidayName("");
    setNewHolidayDate("");
  };
  const removeHoliday = async (id: any) =>
    await deleteDoc(
      doc(db, "artifacts", appId, "public", "data", "holidays", id)
    );
  const updatePin = async (empId: any, newPin: any) => {
    const pin = prompt("Nuevo PIN:", newPin);
    if (pin && pin.length === 4)
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "employees", empId),
        { pin }
      );
  };
  const downloadCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,Empleado,Tipo,Inicio,Fin,Dias Naturales,Notas\n";
    requests.forEach((req: any) => {
      csvContent += `"${req.userName}",${req.type},${req.startDate},${
        req.endDate
      },,"${req.notes || ""}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vacaciones_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-6">
          <Settings className="text-slate-400 mr-2" />
          <h2 className="text-lg font-bold text-slate-800">
            {t("admin_limits")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {t("stats_personal")}
            </label>
            <input
              type="number"
              value={limits.maxPersonalDays}
              onChange={(e) =>
                setLimits({
                  ...limits,
                  maxPersonalDays: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {t("stats_sick")}
            </label>
            <input
              type="number"
              value={limits.maxSickDays}
              onChange={(e) =>
                setLimits({ ...limits, maxSickDays: Number(e.target.value) })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {t("stats_family")}
            </label>
            <input
              type="number"
              value={limits.maxFamilyDays}
              onChange={(e) =>
                setLimits({ ...limits, maxFamilyDays: Number(e.target.value) })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={saveSettings}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900"
          >
            {t("admin_save")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="text-red-500 mr-2" />
              <h2 className="text-lg font-bold text-slate-800">
                {t("admin_holidays")}
              </h2>
            </div>
          </div>
          <div className="mb-6 flex gap-2">
            <button
              onClick={importHolidays2026}
              className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-purple-200 flex items-center justify-center"
            >
              <UploadCloud size={16} className="mr-2" /> {t("admin_import")}
            </button>
          </div>
          <form onSubmit={addHoliday} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder={t("admin_holidays")}
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
            >
              <Plus size={16} />
            </button>
          </form>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {holidays
              .sort((a: any, b: any) => a.date.localeCompare(b.date))
              .map((h: any) => (
                <div
                  key={h.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-sm group border border-red-100"
                >
                  <div>
                    <span className="font-mono text-red-400 mr-3">
                      {h.date}
                    </span>
                    <span className="font-medium text-slate-700">{h.name}</span>
                  </div>
                  <button
                    onClick={() => removeHoliday(h.id)}
                    className="text-red-300 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center mb-6">
            <User className="text-blue-500 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">
              {t("admin_data")}
            </h2>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4 overflow-y-auto max-h-60 custom-scrollbar">
            <ul className="space-y-2">
              {employees.map((e: any) => (
                <li
                  key={e.id}
                  className="flex justify-between items-center text-sm text-slate-600 p-2 hover:bg-slate-100 rounded"
                >
                  <span className="font-medium w-1/3 truncate">{e.name}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 text-xs border"
                      title="PIN"
                    >
                      {e.pin || "1234"}
                    </span>
                    <button
                      onClick={() => updatePin(e.id, e.pin)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Cambiar PIN"
                    >
                      <KeyRound size={16} />
                    </button>
                    <button
                      onClick={() => updateBalance(e.id, e.balanceAdjustment)}
                      className={`px-2 py-1 rounded text-xs font-bold border ${
                        e.balanceAdjustment
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}
                      title="Ajuste Manual"
                    >
                      {e.balanceAdjustment > 0
                        ? `+${e.balanceAdjustment}`
                        : e.balanceAdjustment || "±0"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={updateAllDays}
              className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-bold hover:bg-blue-200 transition text-sm"
            >
              <Edit3 size={16} className="mr-2" /> {t("admin_set_30")}
            </button>
            <button
              onClick={downloadCSV}
              className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 text-sm"
            >
              <Download size={16} className="mr-2" /> {t("admin_download")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. APP PRINCIPAL (DEFINIDA AL FINAL) ---
export default function VacationApp() {
  const [user, setUser] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(
    () => localStorage.getItem("app_lang") || "es"
  );

  const t = (key: any) =>
    TRANSLATIONS[lang][key] || TRANSLATIONS["es"][key] || key;
  const changeLanguage = (l: any) => {
    setLang(l);
    localStorage.setItem("app_lang", l);
  };

  const [employees, setEmployees] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState({
    maxPersonalDays: 2,
    maxSickDays: 0,
    maxFamilyDays: 0,
  });

  useEffect(() => {
    // FIX VERCEL: Uso directo de anónimo, sin tokens mágicos
    const initAuth = async () => {
      await signInAnonymously(auth);
    };
    initAuth().catch(console.error);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const settingsRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "config",
      "settings"
    );
    onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setGlobalSettings(docSnap.data() as any);
      } else {
        setDoc(settingsRef, {
          maxPersonalDays: 2,
          maxSickDays: 0,
          maxFamilyDays: 0,
        }).catch(console.error);
      }
    });
    onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "employees"),
      (snapshot) => {
        const emps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        emps.sort((a: any, b: any) => {
          if (a.name === ADMIN_NAME) return 1;
          if (b.name === ADMIN_NAME) return -1;
          return a.name.localeCompare(b.name);
        });
        setEmployees(emps);
        setLoading(false);
      }
    );
    onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "requests"),
      (snapshot) => {
        setRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "holidays"),
      (snapshot) => {
        setHolidays(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
  }, [user]);

  useEffect(() => {
    if (employees.length > 0 && currentUserData) {
      const freshData = employees.find((e: any) => e.id === currentUserData.id);
      if (freshData) setCurrentUserData(freshData);
    }
  }, [employees]);

  const handleLogin = (employee: any) => {
    setCurrentUserData(employee);
    localStorage.setItem("localEmployeeId", employee.id);
    setView("dashboard");
  };
  const handleLogout = () => {
    setCurrentUserData(null);
    localStorage.removeItem("localEmployeeId");
    setView("dashboard");
  };
  const handleChangeMyPin = async () => {
    const newPin = prompt("Introduce tu nuevo PIN de 4 dígitos:");
    if (newPin && newPin.length === 4) {
      try {
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "employees",
            currentUserData.id
          ),
          { pin: newPin }
        );
        alert("PIN actualizado correctamente.");
      } catch (e) {
        alert("Error al actualizar PIN");
      }
    } else if (newPin) {
      alert("El PIN debe tener exactamente 4 dígitos.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Conectando...
      </div>
    );
  if (!currentUserData)
    return (
      <LoginScreen
        employees={employees}
        onLogin={handleLogin}
        t={t}
        changeLanguage={changeLanguage}
        lang={lang}
      />
    );
  if (view === "printYear")
    return (
      <PrintableYearView
        user={currentUserData}
        requests={requests}
        holidays={holidays}
        onBack={() => setView("dashboard")}
      />
    );
  if (view === "printTeam")
    return (
      <PrintableTeamView
        employees={employees}
        requests={requests}
        holidays={holidays}
        onBack={() => setView("dashboard")}
      />
    );

  const totalDaysWithAdjustment =
    (currentUserData.totalVacationDays || 30) +
    (currentUserData.balanceAdjustment || 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide hidden sm:block">
                {t("app_title")}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              <div className="flex space-x-1 text-xs">
                <button
                  onClick={() => changeLanguage("es")}
                  className={`p-1 rounded ${
                    lang === "es"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`p-1 rounded ${
                    lang === "en"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("fr")}
                  className={`p-1 rounded ${
                    lang === "fr"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => changeLanguage("wo")}
                  className={`p-1 rounded ${
                    lang === "wo"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  WO
                </button>
              </div>
              <button
                onClick={() => setView("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  view === "dashboard" ? "bg-slate-800" : "hover:bg-slate-800"
                }`}
              >
                {t("nav_summary")}
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  view === "calendar" ? "bg-slate-800" : "hover:bg-slate-800"
                }`}
              >
                {t("nav_calendar")}
              </button>
              <button
                onClick={() => setView("printYear")}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:bg-slate-800 flex items-center`}
                title={t("nav_print")}
              >
                <Printer size={16} className="mr-1" /> {t("nav_print")}
              </button>
              {currentUserData.name === ADMIN_NAME && (
                <>
                  <button
                    onClick={() => setView("printTeam")}
                    className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-blue-700 hover:bg-blue-600 flex items-center`}
                    title={t("nav_team_print")}
                  >
                    <Users size={16} className="mr-1" />
                  </button>
                  <button
                    onClick={() => setView("admin")}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap ${
                      view === "admin"
                        ? "bg-orange-600"
                        : "hover:bg-orange-600 bg-orange-700"
                    }`}
                  >
                    <Settings size={14} className="mr-1" /> {t("nav_admin")}
                  </button>
                </>
              )}
              <div className="flex items-center pl-4 border-l border-slate-700 ml-4">
                <div className="flex flex-col items-end mr-3">
                  <span className="text-sm font-bold text-orange-400 leading-none">
                    {currentUserData.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {totalDaysWithAdjustment} {t("days")}
                  </span>
                </div>
                <button
                  onClick={handleChangeMyPin}
                  className="p-2 mr-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                  title="Cambiar PIN"
                >
                  <KeyRound size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                  title={t("nav_logout")}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {view === "dashboard" && (
          <Dashboard
            user={currentUserData}
            requests={requests}
            holidays={holidays}
            settings={globalSettings}
            totalAvailable={totalDaysWithAdjustment}
            t={t}
          />
        )}
        {view === "calendar" && (
          <TeamCalendar
            employees={employees}
            requests={requests}
            holidays={holidays}
          />
        )}
        {view === "admin" && currentUserData.name === ADMIN_NAME && (
          <AdminPanel
            employees={employees}
            holidays={holidays}
            requests={requests}
            settings={globalSettings}
            t={t}
          />
        )}
      </main>
      <ConfirmModal t={t} />
    </div>
  );
}
