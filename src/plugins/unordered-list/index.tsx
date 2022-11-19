import "./index.scss";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT, Plugin } from "../../core/plugin/interface";
import { CommandFn } from "../../core/command";
import { Editor } from "slate";
import { isObject } from "src/utils/is";
import { KEYBOARD } from "../../utils/constant";
import {
  isMatchedEvent,
  isCollapsed,
  isMatchedAttributeNode,
  isFocusLineStart,
  isWrappedEdgeNode,
  isWrappedAdjoinNode,
} from "../../core/ops/is";
import { setBlockNode, setUnWrapNodes, setWrapNodes, setWrapStructure } from "../../core/ops/set";
import { getBlockNode, existKey } from "../../core/ops/get";
import { assertValue } from "src/utils/common";

declare module "slate" {
  interface BlockElement {
    "unordered-list"?: boolean;
    "unordered-list-item"?: UnOrderListItemConfig;
  }
}

export type UnOrderListItemConfig = {
  level: number;
};
export const unorderedListKey = "unordered-list";
export const unorderedListItemKey = "unordered-list-item";
const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, unorderedListKey, true, data.path)) {
      setWrapNodes(editor, { [unorderedListKey]: true }, { [unorderedListItemKey]: { level: 1 } });
    } else {
      setUnWrapNodes(editor, {
        wrapKey: unorderedListKey,
        itemKey: unorderedListItemKey,
      });
    }
  }
};
export const UnorderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: unorderedListKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, unorderedListKey) || existKey(props.element, unorderedListItemKey),
    renderLine: context => {
      if (existKey(context.element, unorderedListKey)) {
        return <ul className="doc-unordered-list">{context.children}</ul>;
      } else {
        const config = assertValue(context.element[unorderedListItemKey]);
        return (
          <li className={`doc-unordered-item unordered-li-${config.level}`}>{context.children}</li>
        );
      }
    },
    command: orderListCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: unorderedListKey });
        const itemMatch = getBlockNode(editor, { key: unorderedListItemKey });
        setWrapStructure(editor, wrapMatch, itemMatch, unorderedListItemKey);

        if (
          !itemMatch ||
          !wrapMatch ||
          !isWrappedAdjoinNode(editor, { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
          return void 0;
        }

        const { level } = assertValue(itemMatch.block[unorderedListItemKey]);

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(
              editor,
              { [unorderedListItemKey]: { level: level + 1 } },
              { node: itemMatch.block }
            );
          }
          event.preventDefault();
        } else if (isFocusLineStart(editor, itemMatch.path)) {
          if (level > 1) {
            setBlockNode(
              editor,
              { [unorderedListItemKey]: { level: level - 1 } },
              { node: itemMatch.block }
            );
            event.preventDefault();
          } else {
            if (isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
              setUnWrapNodes(editor, { wrapKey: unorderedListKey, itemKey: unorderedListItemKey });
              event.preventDefault();
            }
          }
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
