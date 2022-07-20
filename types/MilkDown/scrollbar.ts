export const getScrollbar = (main: string, bg: string, hover: string, direction: string, type: string) => {
  return `
    scrollbar-width: thin;
    scrollbar-color: ${main} ${bg};
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      ${direction === "y" ? "width" : "height"}: ${type === "thin" ? 2 : 12}px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-track {
      border-radius: 999px;
      background: transparent;
      border: 4px solid transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background-color: ${main};
      border: ${type === "thin" ? 0 : 4}px solid transparent;
      background-clip: content-box;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: ${hover};
    }
  `;
};
