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
  code: {
    label: "code",
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
  paperclip: {
    label: "//",
    icon: "paperclip-2"
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
