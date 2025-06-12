import { Ionicons } from "@expo/vector-icons";

export type NavigationRoute =
  | "inventory"
  | "matches"
  | "tools"
  | "explore"
  | "menu";

export interface NavigationItem {
  name: NavigationRoute;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const navigationItems: NavigationItem[] = [
  { name: "inventory", title: "Inventario", icon: "albums" },
  { name: "matches", title: "Partidas", icon: "game-controller" },
  { name: "tools", title: "Herramientas", icon: "construct" },
  { name: "explore", title: "Explorar", icon: "search" },
  { name: "menu", title: "Menú", icon: "ellipsis-horizontal" },
];

export const menuItems: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
}[] = [
  {
    title: "Acerca de",
    icon: "information-circle-outline",
    route: "/(other)/about",
  },
  {
    title: "Configuración",
    icon: "settings-outline",
    route: "/(other)/settings",
  },
  {
    title: "Cerrar sesión",
    icon: "log-out-outline",
    route: null,
  },
];

export const toolItems = [
  {
    title: "Simulador de Dado",
    icon: "dice-outline",
    route: "/(tools)/dice",
  },
  {
    title: "Temporizador de Turno",
    icon: "timer-outline",
    route: "/(tools)/timer",
  },
  {
    title: "Cronómetro de Acción",
    icon: "flash-outline",
    route: "/(tools)/stopwatch",
  },
];
