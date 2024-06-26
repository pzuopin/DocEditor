import type { Path } from "slate";
import { Node } from "slate";

export type {
  BaseElement,
  BaseNode,
  BlockElement,
  TextBlockElement,
  TextElement,
} from "./interface";
export type EditorPath = Path;
export const EditorNode = Node;
export type { BaseRange, NodeEntry } from "slate";
export type {
  BaseOperation,
  NodeOperation,
  Operation,
  SetSelectionOperation,
  TextOperation,
} from "slate";
export {
  createEditor,
  Editor,
  Element,
  Location,
  Node,
  Path,
  Point,
  Range,
  Text,
  Transforms,
} from "slate";
export { HistoryEditor, withHistory } from "slate-history";
export type { RenderElementProps, RenderLeafProps } from "slate-react";
export {
  Editable,
  Slate as EditorProvider,
  ReactEditor,
  useFocused,
  useReadOnly,
  useSelected,
  useSlate,
  useSlateSelector,
  useSlateStatic,
  withReact,
} from "slate-react";
