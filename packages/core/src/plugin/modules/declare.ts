import type { NodeEntry, Range } from "doc-editor-delta";
import type { BaseNode } from "doc-editor-delta";

import type { CommandFn } from "../../command/types";
import { EDITOR_ELEMENT_TYPE } from "../types/constant";
import type { BlockContext, BlockProps, LeafContext, LeafProps } from "../types/context";

abstract class BasePlugin {
  /** 插件唯一标识 */
  public abstract readonly key: string;
  /** 插件类型 */
  public abstract readonly type: keyof typeof EDITOR_ELEMENT_TYPE;
  /** 插件调度优先级 优先级越高 体现在`DOM`结构在越外层 */
  public readonly priority?: number;
  /** 插件销毁时调度 */
  public abstract destroy(): void;
  /** 插件命令注册 */
  public onCommand?: CommandFn;
  /** 按键事件注册 */
  public onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): boolean | void;
  /** 对`Range[]`进行装饰 */
  public onDecorate?(entry: NodeEntry): Range[];
  /** 将`Fragment`序列化为`HTML` */
  public serialize?(entry: BaseNode): HTMLElement;
  /** 将`HTML`反序列化为`Fragment` */
  public deserialize?(element: HTMLElement): BaseNode;
  /** 对节点进行`Normalize` */
  public normalize?(entry: NodeEntry): void;
}

export abstract class BlockPlugin extends BasePlugin {
  /** 块级节点类型 */
  public readonly type = EDITOR_ELEMENT_TYPE.BLOCK;
  /** 块节点匹配插件 */
  public abstract match(props: BlockProps): boolean;
  /** 渲染行节点 */
  public renderLine?(context: BlockContext): JSX.Element;
  /** 渲染块级子节点 */
  public render?(context: BlockContext): JSX.Element;
  /** 注册的子节点插件 */
  public WITH_LEAF_PLUGINS?: LeafPlugin[];
}

export abstract class LeafPlugin extends BasePlugin {
  /** 块级节点类型 */
  public readonly type = EDITOR_ELEMENT_TYPE.INLINE;
  /** 行内节点匹配插件 */
  public abstract match(props: LeafProps): boolean;
  /** 渲染行内节点 */
  public render?(context: LeafContext): JSX.Element;
}

export type EditorPlugin = BlockPlugin | LeafPlugin;
