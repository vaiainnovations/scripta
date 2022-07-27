import { Icon } from "@milkdown/core";

export const iconsMapping = {
  link: {
    label: "link",
    icon: "link"
  },
  bold: {
    label: "bold",
    icon: "text-bold"
  },
  strikeThrough: {
    label: "strikeThrough",
    icon: "text-underline"
  },
  italic: {
    label: "italic",
    icon: "text-italic"
  },
  taskList: {
    label: "taskList",
    icon: "task"
  },
  inlineCode: {
    label: "inlineCode",
    icon: "code-circle"
  },
  bulletList: {
    label: "bulletList",
    icon: "task-dots"
  },
  orderedList: {
    label: "orderedList",
    icon: "task-numbered"
  },
  divider: {
    label: "divider",
    icon: "grid-10"
  },
  code: {
    label: "code",
    icon: "code-1"
  },
  image: {
    label: "image",
    icon: "image"
  },
  table: {
    label: "table",
    icon: "hierarchy"
  }
};

export const getIcon = (key: Icon) => {
  const target = iconsMapping[key];
  if (!target) { return; }

  const { icon, label } = target;
  const span = document.createElement("span");
  span.className = `milkdown-icons icon-${icon} `;

  return {
    dom: span,
    label
  };
};
