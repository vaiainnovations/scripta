import { EditorView } from "@milkdown/prose/view";
import { EditorState, TextSelection } from "@milkdown/prose/state";
import { NodeType, MarkType } from "@milkdown/prose/model";
import { wrapIn, setBlockType } from "@milkdown/prose/commands";
import { findParentNode } from "@milkdown/prose";

export const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
  if (!type) {
    return false;
  }
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, type);
};

export const isTextSelection = (editorState: EditorState): boolean => {
  const { selection } = editorState;
  if (selection instanceof TextSelection) {
    const text = editorState.doc.textBetween(selection.from, selection.to);

    if (!text) { return false; }

    return true;
  }
  return false;
};

export const isInCodeFence = (editorState: EditorState): boolean =>
  Boolean(findParentNode(node => !!node.type.spec.code)(editorState.selection));

export const isTextAndNotHasMark = (editorState: EditorState, mark?: MarkType): boolean =>
  isInCodeFence(editorState) || hasMark(editorState, mark);

export const notBlockType = (state: EditorState, node: NodeType | undefined): boolean => {
  if (!node) {
    return true;
  }
  return !setBlockType(node)(state);
};

export const notWrapped = (state: EditorState, node: NodeType | undefined): boolean => {
  if (!node) {
    return true;
  }
  return !wrapIn(node)(state);
};

export const headingBlock = (state: EditorState): boolean => {
  const setToHeading = (level: number) =>
    setBlockType(state.schema.nodes.heading, { level })(state);
  return !(setToHeading(1) || setToHeading(2) || setToHeading(3));
};

export const mobileEditorSize = (view: EditorView, type: MarkType | undefined): boolean => {
  // console.log(view.dom.offsetWidth);
  return view.dom.offsetWidth < 718 && !hasMark(view.state, type);
};
