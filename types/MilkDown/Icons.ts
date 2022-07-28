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
  },
  loading: {
    label: "loading",
    icon: "dots"
  }
};

export const getIcon = (key: Icon) => {
  const target = iconsMapping[key];
  if (!target) {
    return;
  }

  const { icon, label } = target;

  if (label === "loading") {
    const element = document.createElement("label");
    element.className = "flex flex-row items-center";

    const spanForward = document.createElement("span");
    spanForward.className = `forward-animated animated-icon milkdown-icons icon-${icon} `;

    const spanBackward = document.createElement("span");
    spanBackward.className = `back-animated animated-icon milkdown-icons icon-${icon} `;

    element.appendChild(spanForward);
    element.appendChild(spanBackward);
    element.appendChild(spanForward.cloneNode(true));

    return {
      dom: element,
      label
    };
  }

  const element = document.createElement("span");
  element.className = `milkdown-icons icon-${icon} `;

  return {
    dom: element,
    label
  };
};
