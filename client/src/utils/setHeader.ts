import { useUiStore } from "../store/useUiStore";

export let lastSetHeaderPathname = "";

export const setHeader = (
  title: string = "Dashboard",
  actions: React.ReactNode | null = null
) => {
  lastSetHeaderPathname = window.location.pathname;
  useUiStore.setState({ headerTitle: title, headerActions: actions });
};
