import type { ComponentType, SVGAttributes } from "react";
import type { IconProps } from "iconsax-reactjs";
import {
  Add,
  Archive,
  ArrowDown2,
  ArrowDown as IArrowDown,
  ArrowLeft as IArrowLeft,
  ArrowLeft2,
  ArrowRight2,
  ArrowUp as IArrowUp,
  Bookmark as IBookmark,
  Buildings2,
  Bus,
  Calendar as ICalendar,
  Call,
  Category,
  Clock as IClock,
  CloseCircle,
  DirectInbox,
  DocumentDownload,
  DocumentText,
  EmojiHappy,
  ExportSquare,
  Filter,
  Gallery,
  InfoCircle,
  Location,
  MagicStar,
  Maximize4,
  Menu as IMenu,
  MessageQuestion,
  MessageSquare as IMessageSquare,
  Messages2,
  Microphone,
  More,
  Notification,
  Paperclip,
  People,
  ProfileCircle,
  Refresh,
  Routing,
  SearchNormal1,
  Send2,
  Setting2,
  Share,
  Sms,
  TickCircle,
  TrendDown,
  TrendUp,
  Video,
} from "iconsax-reactjs";

type AppIconProps = SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};

function createIcon(SvgIcon: ComponentType<IconProps>) {
  return function Icon({ size = 18, className, color, ...rest }: AppIconProps) {
    return (
      <SvgIcon
        size={size}
        variant="Linear"
        className={className}
        color={color ?? "currentColor"}
        {...rest}
      />
    );
  };
}

export const LayoutGrid = createIcon(Category);
export const Users = createIcon(People);
export const Sparkles = createIcon(MagicStar);
export const Building2 = createIcon(Buildings2);
export const Calendar = createIcon(ICalendar);
export const MessageSquare = createIcon(IMessageSquare);
export const HelpCircle = createIcon(MessageQuestion);
export const Navigation = createIcon(Routing);
export const ChevronLeft = createIcon(ArrowLeft2);
export const ChevronDown = createIcon(ArrowDown2);
export const ChevronRight = createIcon(ArrowRight2);
export const UserCircle = createIcon(ProfileCircle);
export const ArrowUpRight = createIcon(ExportSquare);
export const Plus = createIcon(Add);
export const TrendingUp = createIcon(TrendUp);
export const TrendingDown = createIcon(TrendDown);
export const MoreHorizontal = createIcon(More);
export const ArrowLeft = createIcon(IArrowLeft);
export const Download = createIcon(DocumentDownload);
export const FileText = createIcon(DocumentText);
export const Messages = createIcon(Messages2);
export const Share2 = createIcon(Share);
export const Bookmark = createIcon(IBookmark);
export const CheckCircle2 = createIcon(TickCircle);
export const ListFilter = createIcon(Filter);
export const Mail = createIcon(Sms);
export const MapPin = createIcon(Location);
export const Phone = createIcon(Call);
export const Search = createIcon(SearchNormal1);
export const RotateCw = createIcon(Refresh);
export const MoreVertical = createIcon(More);
export const X = createIcon(CloseCircle);
export const Bell = createIcon(Notification);
export const Menu = createIcon(IMenu);
export const Settings = createIcon(Setting2);
export const SlidersHorizontal = createIcon(Filter);
export const Maximize2 = createIcon(Maximize4);
export const TrainFront = createIcon(Bus);
export const Construction = createIcon(Setting2);
export const Info = createIcon(InfoCircle);
export const ImageIcon = createIcon(Gallery);
export const Mic = createIcon(Microphone);
export const Send = createIcon(Send2);
export const Smile = createIcon(EmojiHappy);
export const VideoIcon = createIcon(Video);
export const PaperclipIcon = createIcon(Paperclip);
export const Clock = createIcon(IClock);
export const DirectInboxIcon = createIcon(DirectInbox);
export const ArchiveIcon = createIcon(Archive);
export const ArrowUp = createIcon(IArrowUp);
export const ArrowDown = createIcon(IArrowDown);
