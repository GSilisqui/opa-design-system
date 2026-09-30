// Ícones do DS (Font Awesome 7 Pro). Import por ícone: só o que está listado entra no bundle do consumidor.
// Para adicionar: importe o regular e o solid, inclua o nome em IconName e a chave (nome do FA) nos dois mapas.
// Logos: importe de @fortawesome/free-brands-svg-icons, inclua em BrandIconName e no mapa brandsMap.
import { faAngleDown as rAngleDown } from "@fortawesome/pro-regular-svg-icons/faAngleDown";
import { faAngleUp as rAngleUp } from "@fortawesome/pro-regular-svg-icons/faAngleUp";
import { faAngleLeft as rAngleLeft } from "@fortawesome/pro-regular-svg-icons/faAngleLeft";
import { faAngleRight as rAngleRight } from "@fortawesome/pro-regular-svg-icons/faAngleRight";
import { faCalendar as rCalendar } from "@fortawesome/pro-regular-svg-icons/faCalendar";
import { faCircleXmark as rCircleXmark } from "@fortawesome/pro-regular-svg-icons/faCircleXmark";
import { faSpinner as rSpinner } from "@fortawesome/pro-regular-svg-icons/faSpinner";
import { faCheck as rCheck } from "@fortawesome/pro-regular-svg-icons/faCheck";
import { faCircleCheck as rCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import { faCircleExclamation as rCircleExclamation } from "@fortawesome/pro-regular-svg-icons/faCircleExclamation";
import { faCircleInfo as rCircleInfo } from "@fortawesome/pro-regular-svg-icons/faCircleInfo";
import { faCopy as rCopy } from "@fortawesome/pro-regular-svg-icons/faCopy";
import { faEllipsis as rEllipsis } from "@fortawesome/pro-regular-svg-icons/faEllipsis";
import { faFaceSmile as rFaceSmile } from "@fortawesome/pro-regular-svg-icons/faFaceSmile";
import { faMagnifyingGlass as rMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";
import { faMinus as rMinus } from "@fortawesome/pro-regular-svg-icons/faMinus";
import { faPen as rPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faPlus as rPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faTrash as rTrash } from "@fortawesome/pro-regular-svg-icons/faTrash";
import { faTriangleExclamation as rTriangleExclamation } from "@fortawesome/pro-regular-svg-icons/faTriangleExclamation";
import { faXmark as rXmark } from "@fortawesome/pro-regular-svg-icons/faXmark";
import { faAngleDown as sAngleDown } from "@fortawesome/pro-solid-svg-icons/faAngleDown";
import { faAngleUp as sAngleUp } from "@fortawesome/pro-solid-svg-icons/faAngleUp";
import { faAngleLeft as sAngleLeft } from "@fortawesome/pro-solid-svg-icons/faAngleLeft";
import { faAngleRight as sAngleRight } from "@fortawesome/pro-solid-svg-icons/faAngleRight";
import { faCalendar as sCalendar } from "@fortawesome/pro-solid-svg-icons/faCalendar";
import { faCircleXmark as sCircleXmark } from "@fortawesome/pro-solid-svg-icons/faCircleXmark";
import { faSpinner as sSpinner } from "@fortawesome/pro-solid-svg-icons/faSpinner";
import { faCheck as sCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";
import { faCircleCheck as sCircleCheck } from "@fortawesome/pro-solid-svg-icons/faCircleCheck";
import { faCircleExclamation as sCircleExclamation } from "@fortawesome/pro-solid-svg-icons/faCircleExclamation";
import { faCircleInfo as sCircleInfo } from "@fortawesome/pro-solid-svg-icons/faCircleInfo";
import { faCopy as sCopy } from "@fortawesome/pro-solid-svg-icons/faCopy";
import { faEllipsis as sEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import { faFaceSmile as sFaceSmile } from "@fortawesome/pro-solid-svg-icons/faFaceSmile";
import { faMagnifyingGlass as sMagnifyingGlass } from "@fortawesome/pro-solid-svg-icons/faMagnifyingGlass";
import { faMinus as sMinus } from "@fortawesome/pro-solid-svg-icons/faMinus";
import { faPen as sPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faPlus as sPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { faTrash as sTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faTriangleExclamation as sTriangleExclamation } from "@fortawesome/pro-solid-svg-icons/faTriangleExclamation";
import { faXmark as sXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faFacebook as bFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faFacebookMessenger as bFacebookMessenger } from "@fortawesome/free-brands-svg-icons/faFacebookMessenger";
import { faGoogle as bGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faInstagram as bInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faLinkedin as bLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faTelegram as bTelegram } from "@fortawesome/free-brands-svg-icons/faTelegram";
import { faWhatsapp as bWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faXTwitter as bXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";

/** Forma mínima de uma definição de ícone do Font Awesome. */
export type IconDefinition = {
  prefix: string;
  iconName: string;
  icon: [width: number, height: number, aliases: (string | number)[], unicode: string, path: string | string[]];
};

// União explícita (em vez de inferir): o tipo inferido apontaria para @fortawesome/fontawesome-common-types,
// que não é dependência direta, e o vite-plugin-dts deixaria de gerar este .d.ts.
export type IconName =
  | "angle-down"
  | "angle-left"
  | "angle-right"
  | "angle-up"
  | "calendar"
  | "check"
  | "circle-check"
  | "circle-xmark"
  | "circle-exclamation"
  | "circle-info"
  | "copy"
  | "ellipsis"
  | "face-smile"
  | "magnifying-glass"
  | "minus"
  | "pen"
  | "plus"
  | "trash"
  | "spinner"
  | "triangle-exclamation"
  | "xmark";

// Logos de marcas (Font Awesome Free Brands). Separados de IconName: só existem em variant="brands".
export type BrandIconName =
  | "facebook"
  | "facebook-messenger"
  | "google"
  | "instagram"
  | "linkedin"
  | "telegram"
  | "whatsapp"
  | "x-twitter";

const brandsMap: Record<BrandIconName, IconDefinition> = {
  facebook: bFacebook,
  "facebook-messenger": bFacebookMessenger,
  google: bGoogle,
  instagram: bInstagram,
  linkedin: bLinkedin,
  telegram: bTelegram,
  whatsapp: bWhatsapp,
  "x-twitter": bXTwitter,
};

const regular: Record<IconName, IconDefinition> = {
  "angle-down": rAngleDown,
  "angle-left": rAngleLeft,
  "angle-right": rAngleRight,
  "angle-up": rAngleUp,
  calendar: rCalendar,
  check: rCheck,
  "circle-check": rCircleCheck,
  "circle-xmark": rCircleXmark,
  "circle-exclamation": rCircleExclamation,
  "circle-info": rCircleInfo,
  copy: rCopy,
  ellipsis: rEllipsis,
  "face-smile": rFaceSmile,
  "magnifying-glass": rMagnifyingGlass,
  minus: rMinus,
  pen: rPen,
  plus: rPlus,
  trash: rTrash,
  spinner: rSpinner,
  "triangle-exclamation": rTriangleExclamation,
  xmark: rXmark,
};

const solid: Record<IconName, IconDefinition> = {
  "angle-down": sAngleDown,
  "angle-left": sAngleLeft,
  "angle-right": sAngleRight,
  "angle-up": sAngleUp,
  calendar: sCalendar,
  check: sCheck,
  "circle-check": sCircleCheck,
  "circle-xmark": sCircleXmark,
  "circle-exclamation": sCircleExclamation,
  "circle-info": sCircleInfo,
  copy: sCopy,
  ellipsis: sEllipsis,
  "face-smile": sFaceSmile,
  "magnifying-glass": sMagnifyingGlass,
  minus: sMinus,
  pen: sPen,
  plus: sPlus,
  trash: sTrash,
  spinner: sSpinner,
  "triangle-exclamation": sTriangleExclamation,
  xmark: sXmark,
};

export const icons: Record<"regular" | "solid" | "brands", Record<string, IconDefinition>> = { regular, solid, brands: brandsMap };
export const iconNames = Object.keys(regular) as IconName[];
export const brandIconNames = Object.keys(brandsMap) as BrandIconName[];
