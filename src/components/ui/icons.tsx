import type { SVGAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  Archive01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  AttachmentIcon,
  Bookmark01Icon,
  Building02Icon,
  Calendar03Icon,
  CallIcon,
  ChartDecreaseIcon,
  ChartIncreaseIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  DashboardSquare01Icon,
  Download01Icon,
  FilterHorizontalIcon,
  FilterIcon,
  HelpCircleIcon,
  Image01Icon,
  InboxIcon,
  InformationCircleIcon,
  Location01Icon,
  Logout01Icon,
  Mail01Icon,
  Maximize01Icon,
  Menu01Icon,
  Message01Icon,
  Mic01Icon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  Navigation01Icon,
  Note01Icon,
  Notification03Icon,
  RefreshIcon,
  Search01Icon,
  SentIcon,
  Settings01Icon,
  Share01Icon,
  SmileIcon,
  SparklesIcon,
  StickyNote01Icon,
  Time01Icon,
  Train01Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserMultiple02Icon,
  Video01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

type AppIconProps = SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};

function createIcon(icon: IconSvgElement) {
  return function Icon({ size = 18, className, color }: AppIconProps) {
    const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
    return (
      <HugeiconsIcon
        icon={icon}
        size={px}
        color={color ?? "currentColor"}
        strokeWidth={1.5}
        className={className}
      />
    );
  };
}

export const LayoutGrid = createIcon(DashboardSquare01Icon);
export const Users = createIcon(UserGroupIcon);
export const Staff = createIcon(UserMultiple02Icon);
export const Sparkles = createIcon(SparklesIcon);
export const Building2 = createIcon(Building02Icon);
export const Calendar = createIcon(Calendar03Icon);
export const MessageSquare = createIcon(WhatsappIcon);
export const Messages = createIcon(Message01Icon);
export const HelpCircle = createIcon(HelpCircleIcon);
export const Navigation = createIcon(Navigation01Icon);
export const ChevronLeft = createIcon(ArrowLeft01Icon);
export const ChevronDown = createIcon(ArrowDown01Icon);
export const ChevronRight = createIcon(ArrowRight01Icon);
export const UserCircle = createIcon(UserCircleIcon);
export const ArrowUpRight = createIcon(ArrowUpRight01Icon);
export const Plus = createIcon(Add01Icon);
export const TrendingUp = createIcon(ChartIncreaseIcon);
export const TrendingDown = createIcon(ChartDecreaseIcon);
export const MoreHorizontal = createIcon(MoreHorizontalIcon);
export const ArrowLeft = createIcon(ArrowLeft01Icon);
export const Download = createIcon(Download01Icon);
export const FileText = createIcon(Note01Icon);
export const Notes = createIcon(StickyNote01Icon);
export const Share2 = createIcon(Share01Icon);
export const Bookmark = createIcon(Bookmark01Icon);
export const CheckCircle2 = createIcon(CheckmarkCircle01Icon);
export const ListFilter = createIcon(FilterIcon);
export const Mail = createIcon(Mail01Icon);
export const MapPin = createIcon(Location01Icon);
export const Phone = createIcon(CallIcon);
export const Search = createIcon(Search01Icon);
export const RotateCw = createIcon(RefreshIcon);
export const MoreVertical = createIcon(MoreVerticalIcon);
export function Pencil({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12l-2.38-2.38a1.5 1.5 0 0 0-2.12 0L4 16v4z"
        stroke={color ?? "currentColor"}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5l4 4"
        stroke={color ?? "currentColor"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Bold arrow to tray line — save / download file. */
export function DataDownload({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M12 4v9m0 0l3.5-3.5M12 13l-3.5-3.5"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19h14" stroke={stroke} strokeWidth={2.25} strokeLinecap="round" />
    </svg>
  );
}

/** Bold arrow from tray line — upload file. */
export function DataUpload({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M12 20V11m0 0l3.5 3.5M12 11l-3.5 3.5"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19h14" stroke={stroke} strokeWidth={2.25} strokeLinecap="round" />
    </svg>
  );
}

const TRAY_PATH = "M6 20h12M6 20v-7M18 20v-7";

/** Thin arrow up from open tray — export / send out. */
export function DataExport({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M12 17V7m0 0l-3 3m3-3l3 3"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={TRAY_PATH} stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Thin arrow down into open tray — import / bring in. */
export function DataImport({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M12 7v10m0 0l-3-3m3 3l3-3"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={TRAY_PATH} stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Cloud upload (toolbar + upload modal). */
export function UploadCloud({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M7 18a4 4 0 0 1 .1-8 5.5 5.5 0 0 1 10.6 1.5A3.5 3.5 0 0 1 19 18H7z"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M12 8v8M9 11l3-3 3 3" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Eye({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

export function EyeOff({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M3.5 4.5l17 17M10.2 10.7a2.75 2.75 0 003.1 3.1M6.7 6.9C4.9 8.2 3.4 10.1 2.25 12c1.5 2.7 5.2 6.75 9.75 6.75 1.45 0 2.82-.35 4.05-.97M9.9 5.26A10.4 10.4 0 0112 4.25c4.55 0 8.25 4.05 9.75 6.75-.6 1.1-1.55 2.35-2.75 3.45"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function X({ size = 18, className, color, ...rest }: AppIconProps) {
  const px = typeof size === "number" ? size : Number.parseFloat(String(size)) || 18;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke={color ?? "currentColor"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
export const Bell = createIcon(Notification03Icon);
export const Menu = createIcon(Menu01Icon);
export const Settings = createIcon(Settings01Icon);
export const Logout = createIcon(Logout01Icon);
export const UnfoldMore = createIcon(ArrowUpDownIcon);
export const SlidersHorizontal = createIcon(FilterHorizontalIcon);
export const Maximize2 = createIcon(Maximize01Icon);
export const TrainFront = createIcon(Train01Icon);
export const Construction = createIcon(Settings01Icon);
export const Info = createIcon(InformationCircleIcon);
export const ImageIcon = createIcon(Image01Icon);
export const Mic = createIcon(Mic01Icon);
export const Send = createIcon(SentIcon);
export const Smile = createIcon(SmileIcon);
export const VideoIcon = createIcon(Video01Icon);
export const PaperclipIcon = createIcon(AttachmentIcon);
export const Clock = createIcon(Clock01Icon);
export const Time = createIcon(Time01Icon);
export const DirectInboxIcon = createIcon(InboxIcon);
export const ArchiveIcon = createIcon(Archive01Icon);
export const ArrowUp = createIcon(ArrowUp01Icon);
export const ArrowDown = createIcon(ArrowDown01Icon);
