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
  CancelCircleIcon,
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
export const X = createIcon(CancelCircleIcon);
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
