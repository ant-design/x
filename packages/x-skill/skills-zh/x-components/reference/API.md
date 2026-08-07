## Bubble

通用属性参考：[通用属性](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 | 
|------|------|------|--------|------| 
| placement | 气泡位置 | `start` \| `end` | `start` | - | 
| loading | 加载状态 | boolean | - | - | 
| loadingRender | 自定义加载内容渲染 | () => React.ReactNode | - | - | 
| content | 气泡内容 | [ContentType](#contenttype) | - | - | 
| contentRender | 自定义内容渲染 | (content: ContentType, info: InfoType ) => React.ReactNode | - | - | 
| editable | 是否可编辑 | boolean \| [EditableBubbleOption](#editablebubbleoption) | `false` | 2.0.0 | 
| typing | 打字动画效果 |  boolean \| [BubbleAnimationOption](#bubbleanimationoption) \| ((content: ContentType, info: InfoType) => boolean \| [BubbleAnimationOption](#bubbleanimationoption)) | `false` | - | 
| streaming | 是否为流式传输 | boolean | `false` | - | 
| variant | 气泡样式变体 | `filled` \| `outlined` \| `shadow` \| `borderless` | `filled` | - | 
| shape | 气泡形状 | `default` \| `round` \| `corner` | `default` | - | 
| footerPlacement | 底部插槽位置 | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | 2.0.0 | 
| header | 头部插槽 | [BubbleSlot](#bubbleslot) | - | - |
| footer | 底部插槽 | [BubbleSlot](#bubbleslot) | - | - |
| avatar | 头像插槽 | [BubbleSlot](#bubbleslot) | - | - |
| extra | 额外插槽 | [BubbleSlot](#bubbleslot) | - | - |
| onTyping | 动画执行回调 | (rendererContent: string, currentContent: string) => void | - | 2.0.0 | 
| onTypingComplete | 动画结束回调 | (content: string) => void | - | - |
| onEditConfirm | 编辑确认回调 | (content: string) => void | - | 2.0.0 |
| onEditCancel | 编辑取消回调 | () => void | - | 2.0.0 |

#### ContentType

默认类型

```typescript
type ContentType = React.ReactNode | AnyObject | string | number;
```

自定义类型使用

```tsx
type CustomContentType {
  ...
}

<Bubble<CustomContentType> {...props} />
```

#### BubbleSlot

```typescript
type BubbleSlot<ContentType> =
  | React.ReactNode
  | ((content: ContentType, info: InfoType) => React.ReactNode);
```

#### EditableBubbleOption

```typescript
interface EditableBubbleOption {
  /**
   * @description 是否可编辑
   */
  editing?: boolean;
  /**
   * @description 确认按钮
   */
  okText?: React.ReactNode;
  /**
   * @description 取消按钮
   */
  cancelText?: React.ReactNode;
}
```

#### BubbleAnimationOption

```typescript
interface BubbleAnimationOption {
  /**
   * @description 动画效果类型，打字机，渐入
   * @default 'fade-in'
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description 内容步进单位，数组格式为随机区间
   * @default 6
   */
  step?: number | [number, number];
  /**
   * @description 动画触发间隔
   * @default 100
   */
  interval?: number;
  /**
   * @description 重新开始一段动画时是否保留文本的公共前缀
   * @default true
   */
  keepPrefix?: boolean;
}
```

#### streaming

`streaming` 用于通知 Bubble 当前的 `content` 是否属于流式输入的当处于流式传输模。当处于流式传输模式，无论是否启用 Bubble 输入动画，在 `streaming` 变为 `false` 之前，Bubble 不会因为把当前 `content` 全部输出完毕就触发 `onTypingComplete` 回调，只有当 `streaming` 变为 `false`，且 `content` 全部输出完毕后，Bubble 才会触发 `onTypingComplete` 回调。这样可以避免由于流式传输不稳定而导致多次触发 `onTypingComplete` 回调的问题，保证一次流式传输过程仅触发一次 `onTypingComplete`。

在[这个例子](#bubble-demo-stream)中，你可以尝试强制关闭流式标志，同时

- 若你启用了输入动画，进行 **慢速加载** 时，会因为流式传输的速度跟不上动画速度而导致多次触发 `onTypingComplete`。
- 若你关闭了输入动画，每一次的流式输入都会触发 `onTypingComplete`。

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 气泡数据列表，`key`，`role` 必填。`styles`、`classNames` 会覆盖 Bubble.List 对应配置。当结合X SDK [`useXChat`](/x-sdks/use-x-chat-cn) 使用时可传入`status` 帮助 Bubble 对配置进行管理 | (([BubbleProps](#bubble) & [DividerBubbleProps](#bubbledivider)) & { key: string \| number, role: string , status: MessageStatus, extraInfo?: AnyObject})[] | - | - |
| autoScroll | 是否自动滚动 | boolean | `true` | - |
| role | 气泡角色默认配置 | [RoleType](#roletype) | - | - |

#### MessageStatus

```typescript
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

#### InfoType

配合 [`useXChat`](/x-sdks/use-x-chat-cn) 使用 ，`key` 可做为 `MessageId`，`extraInfo` 可作为自定义参数。

```typescript
type InfoType = {
  status?: MessageStatus;
  key?: string | number;
  extraInfo?: AnyObject;
};
```

#### RoleType

```typescript
export type RoleProps = Pick<
  BubbleProps<any>,
  | 'typing'
  | 'variant'
  | 'shape'
  | 'placement'
  | 'rootClassName'
  | 'classNames'
  | 'className'
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'header'
  | 'footer'
  | 'avatar'
  | 'extra'
  | 'editable'
  | 'onTyping'
  | 'onTypingComplete'
  | 'onEditConfirm'
  | 'onEditCancel'
>;
export type FuncRoleProps = (data: BubbleItemType) => RoleProps;

export type DividerRoleProps = Partial<DividerBubbleProps>;
export type FuncDividerRoleProps = (data: BubbleItemType) => DividerRoleProps;

export type RoleType = Partial<
  'ai' | 'system' | 'user', RoleProps | FuncRoleProps>
> & { divider: DividerRoleProps | FuncDividerRoleProps } & Record<
    string,
    RoleProps | FuncRoleProps
  >;
```

#### Bubble.List autoScroll

**Bubble.List** 滚动托管需要自身或父容器设置明确的 `height`，否则无法滚动。

```tsx
<Bubble.List items={items} style={{ height: 500 }} autoScroll />
// or
<div style={{ height: 500 }}>
  <Bubble.List items={items} autoScroll />
</div>
```

#### Bubble.List role 与自定义 Bubble

**Bubble.List** 的 `role` 和 `items` 两个属性都可以配置气泡，其中 `role` 的配置作为默认配置使用，可缺省。`item.role` 用于指明该条数据的气泡角色，会与 `Bubble.List.role` 进行匹配。`items` 本身也可配置气泡属性，优先级高于 `role` 的配置，最终的气泡配置为：`{ ...role[item.role], ...item }`。

注意， **Bubble.List** 中的[语义化配置](#semantic-dom)也可以为气泡配置样式，但它的优先级最低，会被 `role` 或 `items` 覆盖。

最终配置的优先级为： `items` > `role` > `Bubble.List.styles` = `Bubble.List.classNames`。

特别说明，我们为 `role` 提供了四个默认字段，`ai`、`user`、`system`、`divider`。其中，`system`、`divider` 是保留字段，如果 `item.role` 赋值为它们俩之一，**Bubble.List** 会把这条气泡数据渲染为 **Bubble.System (role = 'system')** 或 **Bubble.Divider (role = 'divider')**。

因此，若你想自定义渲染系统消息或分割线时，应该使用其他的命名。

自定义渲染消息，可以参考[这个例子](#bubble-demo-list)中 reference 的渲染方式。

### Bubble.System

通用属性参考：[通用属性](/docs/react/common-props)

| 属性    | 说明         | 类型                                               | 默认值    | 版本 |
| ------- | ------------ | -------------------------------------------------- | --------- | ---- |
| content | 气泡内容     | [ContentType](#contenttype)                        | -         | -    |
| variant | 气泡样式变体 | `filled` \| `outlined` \| `shadow` \| `borderless` | `shadow`  | -    |
| shape   | 气泡形状     | `default` \| `round` \| `corner`                   | `default` | -    |

### Bubble.Divider

通用属性参考：[通用属性](/docs/react/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 气泡内容，等效 Divider.children | [ContentType](#contenttype) | - | - |
| dividerProps | Divider 组件属性 | [Divider](https://ant.design/components/divider-cn) | - | - |

---

## Sender

通用属性参考：[通用属性](/docs/react/common-props)

### SenderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record<'input', ComponentType> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否加载中 | boolean | false | - |
| suffix | 后缀内容，默认展示操作按钮，当不需要默认操作按钮时，可以设为 `suffix={false}` | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | oriNode | 2.0.0 |
| header | 头部面板 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| prefix | 前缀内容 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| footer | 底部内容 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | SubmitType | `enter` \| `shiftEnter` | - |
| value | 输入框值 | string | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string, slotConfig: SlotConfigType[], skill: SkillType) => void | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig: SlotConfigType[],skill: SkillType) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |
| onPaste | 粘贴回调 | React.ClipboardEventHandler<`HTMLElement`> | - | - |
| onPasteFile | 黏贴文件的回调 | (files: FileList) => void | - | - |
| onKeyDown | 键盘按下回调 | (event: React.KeyboardEvent) => void \| false | - | - |
| onFocus | 获取焦点回调 | React.FocusEventHandler<`HTMLTextAreaElement`> | - | - |
| onBlur | 失去焦点回调 | React.FocusEventHandler<`HTMLTextAreaElement`> | - | - |
| placeholder | 输入框占位符 | string | - | - |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | 词槽配置，配置后输入框将变为词槽模式，支持结构化输入，此模式`value` 和 `defaultValue` 配置将无效。 | SlotConfigType[] | - | 2.0.0 |
| skill | 技能配置，输入框将变为词槽模式，支持结构化输入，此模式`value` 和 `defaultValue` 配置将无效。 | SkillType | - | 2.0.0 |

```typescript | pure
interface SkillType {
  title?: React.ReactNode;
  value: string;
  toolTip?: TooltipProps;
  closable?:
    | boolean
    | {
        closeIcon?: React.ReactNode;
        onClose?: React.MouseEventHandler<HTMLDivElement>;
        disabled?: boolean;
      };
}
```

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

```typescript | pure
type ActionsComponents = {
  SendButton: React.ComponentType<ButtonProps>;
  ClearButton: React.ComponentType<ButtonProps>;
  LoadingButton: React.ComponentType<ButtonProps>;
  SpeechButton: React.ComponentType<ButtonProps>;
};
```

### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| inputElement | 输入框元素 | `HTMLTextAreaElement` | - | - |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| focus | 获取焦点，当 `cursor = 'slot'` 时焦点会在第一个插槽类型为 `input` 的输入框内，若不存在对应的 `input` 则效果会和 `end` 一致。 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' \| 'slot' }) | - | - |
| blur | 取消焦点 | () => void | - | - |
| insert | 插入文本或者插槽，使用插槽时需确保 slotConfig 已配置 | (value: string) => void \| (slotConfig: SlotConfigType[], position: insertPosition, replaceCharacters: string, preventScroll: boolean) => void; | - | - |
| clear | 清空内容 | () => void | - | - |
| getValue | 获取当前内容和结构化配置 | () => { value: string; slotConfig: SlotConfigType[],skill: SkillType } | - | - |

#### SlotConfigType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 节点类型，决定渲染组件类型，必填 | 'text' \| 'input' \| 'select' \| 'tag' \| 'content' \| 'custom' | - | 2.0.0 |
| key | 唯一标识，type 为 text 时可省略 | string | - | - |
| formatResult | 格式化最终结果 | (value: any) => string | - | 2.0.0 |

##### text 节点属性

| 属性  | 说明     | 类型   | 默认值 | 版本  |
| ----- | -------- | ------ | ------ | ----- |
| value | 文本内容 | string | -      | 2.0.0 |

##### input 节点属性

| 属性               | 说明   | 类型                                  | 默认值 | 版本  |
| ------------------ | ------ | ------------------------------------- | ------ | ----- |
| props.placeholder  | 占位符 | string                                | -      | 2.0.0 |
| props.defaultValue | 默认值 | string \| number \| readonly string[] | -      | 2.0.0 |

##### select 节点属性

| 属性               | 说明           | 类型     | 默认值 | 版本  |
| ------------------ | -------------- | -------- | ------ | ----- |
| props.options      | 选项数组，必填 | string[] | -      | 2.0.0 |
| props.placeholder  | 占位符         | string   | -      | 2.0.0 |
| props.defaultValue | 默认值         | string   | -      | 2.0.0 |

##### tag 节点属性

| 属性        | 说明           | 类型      | 默认值 | 版本  |
| ----------- | -------------- | --------- | ------ | ----- |
| props.label | 标签内容，必填 | ReactNode | -      | 2.0.0 |
| props.value | 标签值         | string    | -      | 2.0.0 |

##### content 节点属性

| 属性               | 说明   | 类型   | 默认值 | 版本  |
| ------------------ | ------ | ------ | ------ | ----- |
| props.defaultValue | 默认值 | any    | -      | 2.1.0 |
| props.placeholder  | 占位符 | string | -      | 2.1.0 |

##### custom 节点属性

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| props.defaultValue | 默认值 | any | - | 2.0.0 |
| customRender | 自定义渲染函数 | (value: any, onChange: (value: any) => void, props: { disabled？:boolean,readOnly？: boolean},item: SlotConfigType) => React.ReactNode | - | 2.0.0 |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | ReactNode | - | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| title | 标题 | ReactNode | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

### Sender.Switch

| 属性              | 说明             | 类型                       | 默认值 | 版本  |
| ----------------- | ---------------- | -------------------------- | ------ | ----- |
| children          | 通用内容         | ReactNode                  | -      | 2.0.0 |
| checkedChildren   | 选中时的内容     | ReactNode                  | -      | 2.0.0 |
| unCheckedChildren | 非选中时的内容   | ReactNode                  | -      | 2.0.0 |
| icon              | 设置图标组件     | ReactNode                  | -      | 2.0.0 |
| disabled          | 是否禁用         | boolean                    | false  | 2.0.0 |
| loading           | 加载中的开关     | boolean                    | -      | 2.0.0 |
| defaultValue      | 默认选中状态     | boolean                    | -      | 2.0.0 |
| value             | 开关的值         | boolean                    | false  | 2.0.0 |
| onChange          | 变化时的回调函数 | function(checked: boolean) | -      | 2.0.0 |
| rootClassName     | 根元素样式类     | string                     | -      | 2.0.0 |

### ⚠️ 词槽模式注意事项

- **词槽模式下，`value` 和 `defaultValue` 属性无效**，请使用 `ref` 及回调事件获取输入框的值和词槽配置。
- **词槽模式下，`onChange`/`onSubmit` 回调的第三个参数 `config`**，仅用于获取当前结构化内容。

**示例：**

```jsx
// ❌ 错误用法, slotConfig 和 skill 为不受控用法
const [config, setConfig] = useState([]);
const [skill, setSkill] = useState([]);
<Sender
  slotConfig={config}
  skill={skill}
  onChange={(value, e, config,skill) => {
    setConfig(config);
    setSkill(skill)
  }}
/>

// ✅ 正确用法
<Sender
  key={key}
  slotConfig={config}
  skill={skill}
  onChange={(value, _e, config, skill) => {
    // 仅用于获取结构化内容
    setKey('new_key')

  }}
/>
```

---

## Conversations

通用属性参考：[通用属性](/docs/react/common-props)

### ConversationsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 会话列表数据源 | `ItemType`[] | - | - |
| activeKey | 当前选中的值 | string | - | - |
| defaultActiveKey | 初始化选中的值 | string | - | - |
| onActiveChange | 选中变更回调 | (value: string, item: ItemType) => void | - | - |
| menu | 会话操作菜单 | ItemMenuProps\| ((conversation: ConversationItemType) => ItemMenuProps) | - | - |
| groupable | 是否支持分组, 开启后默认按 `Conversation.group` 字段分组 | boolean \| GroupableProps | - | - |
| shortcutKeys | 快捷键操作 | { creation?: ShortcutKeys\<number\>; items?:ShortcutKeys\<'number'\> \| ShortcutKeys\<number\>[];} | - | 2.0.0 |
| creation | 新会话操作配置 | CreationProps | - | 2.0.0 |
| styles | 语义化结构 style | styles?: {creation?: React.CSSProperties;item?: React.CSSProperties;} | - | - |
| classNames | 语义化结构 className | classNames?: { creation?: string; item?:string;} | - | - |
| rootClassName | 根节点类名 | string | - | - |

### ItemType

```tsx
type ItemType = ConversationItemType | DividerItemType;
```

#### ConversationItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识 | string | - | - |
| label | 会话名称 | React.ReactNode | - | - |
| group | 会话分组类型，与 `ConversationsProps.groupable` 联动 | string | - | - |
| icon | 会话图标 | React.ReactNode | - | - |
| disabled | 是否禁用 | boolean | false | - |

#### DividerItemType

| 属性   | 说明           | 类型      | 默认值    | 版本 |
| ------ | -------------- | --------- | --------- | ---- |
| type   | 会话列表分割线 | 'divider' | 'divider' | -    |
| dashed | 是否虚线       | boolean   | false     | -    |

### ItemMenuProps

继承 antd [MenuProps](https://ant.design/components/menu-cn#api) 属性。

```tsx
MenuProps & {
    trigger?:
      | React.ReactNode
      | ((
          conversation: ConversationItemType,
          info: { originNode: React.ReactNode },
        ) => React.ReactNode);
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
```

### GroupableProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 分组标题 | React.ReactNode\| ((group: string, info: { groupInfo: GroupInfoType}) => React.ReactNode) | - | - |
| collapsible | 可折叠配置 | boolean \| ((group: string) => boolean) | - | - |
| defaultExpandedKeys | 默认展开或收起 | string[] | - | - |
| onExpand | 展开或收起 | (expandedKeys: string[]) => void | - | - |
| expandedKeys | 展开分组的 keys | string[] | - | - |

---

## Welcome

通用属性参考：[通用属性](/docs/react/common-props)

### WelcomeProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', string> | - | - |
| description | 显示在提示列表中的描述。 | React.ReactNode | - | - |
| extra | 显示在提示列表末尾的额外操作。 | React.ReactNode | - | - |
| icon | 显示在提示列表前侧的图标。 | React.ReactNode | - | - |
| rootClassName | 根节点的样式类名。 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', React.CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题。 | React.ReactNode | - | - |
| variant | 变体类型。 | 'filled' \| 'borderless' | 'filled' | - |

---

## Prompts

通用属性参考：[通用属性](/docs/react/common-props)

### PromptsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分 | Record<SemanticType, string> | - | - |
| items | 包含多个提示项的列表 | PromptProps[] | - | - |
| prefixCls | 样式类名的前缀 | string | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分 | Record<SemanticType, React.CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题 | React.ReactNode | - | - |
| vertical | 设置为 `true` 时, 提示列表将垂直排列 | boolean | `false` | - |
| wrap | 设置为 `true` 时, 提示列表将自动换行 | boolean | `false` | - |
| onItemClick | 提示项被点击时的回调函数 | (info: { data: PromptProps }) => void | - | - |
| fadeIn | 渐入效果 | boolean | - | - |
| fadeInLeft | 从左到右渐入效果 | boolean | - | - |

### PromptProps

| 属性        | 说明                         | 类型            | 默认值  | 版本 |
| ----------- | ---------------------------- | --------------- | ------- | ---- |
| children    | 嵌套的子提示项               | PromptProps[]   | -       | -    |
| description | 提示描述提供额外的信息       | React.ReactNode | -       | -    |
| disabled    | 设置为 `true` 时禁用点击事件 | boolean         | `false` | -    |
| icon        | 提示图标显示在提示项的左侧   | React.ReactNode | -       | -    |
| key         | 唯一标识用于区分每个提示项   | string          | -       | -    |
| label       | 提示标签显示提示的主要内容   | React.ReactNode | -       | -    |

---

## Attachments

通用属性参考：[通用属性](/docs/react/common-props)。

### AttachmentsProps

继承 antd [Upload](https://ant.design/components/upload) 属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，[见下](#semantic-dom) | Record<string, string> | - | - |
| disabled | 是否禁用 | boolean | false | - |
| maxCount | 最大上传文件数量 | number \| - | - | 2.0.0 |
| getDropContainer | 设置拖拽时，可以释放文件的区域 | () => HTMLElement | - | - |
| items | 附件列表，同 Upload `fileList` | Attachment[] | - | - |
| overflow | 文件列表超出时样式 | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | 没有文件时的占位信息 | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| styles | 自定义样式对象，[见下](#semantic-dom) | Record<string, React.CSSProperties> | - | - |
| imageProps | 图片属性，同 antd [Image](https://ant.design/components/image) 属性 | ImageProps | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}
```

```tsx | pure
interface Attachment<T = any> extends UploadFile<T>, Omit<FileCardProps, 'size' | 'byte' | 'type'> {
  description?: React.ReactNode;
  cardType?: FileCardProps['type'];
}
```

### AttachmentsRef

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 获取原生节点 | HTMLElement | - |
| fileNativeElement | 获取文件上传原生节点 | HTMLElement | - |
| upload | 手工调用上传文件 | (file: File) => void | - |
| select | 手工调用选择文件 | (options: { accept?: string; multiple?: boolean; }) => void | 2.0.0 |

---

## Suggestion

通用属性参考：[通用属性](/docs/react/common-props)

更多配置请查看 [CascaderProps](https://ant.design/components/cascader-cn#api)

### SuggestionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 是否整行宽度 | boolean | false | - |
| children | 自定义输入框 | ({ onTrigger, onKeyDown }) => ReactElement | - | - |
| items | 建议项列表 | SuggestionItem[] \| ((info: T) => SuggestionItem[]) | - | - |
| open | 受控打开面板 | boolean | - | - |
| rootClassName | 根元素样式类名 | string | - | - |
| onSelect | 选中建议项回调 | (value: string, selectedOptions: SuggestionItem[]) => void; | - | - |
| onOpenChange | 面板打开状态变化回调 | (open: boolean) => void | - | - |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位 | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |

#### onTrigger

```typescript | pure
type onTrigger<T> = (info: T | false) => void;
```

Suggestion 接受泛型以自定义传递给 `items` renderProps 的参数类型，当传递 `false` 时，则关闭建议面板。

### SuggestionItem

| 属性     | 说明           | 类型             | 默认值 | 版本 |
| -------- | -------------- | ---------------- | ------ | ---- |
| children | 子项目         | SuggestionItem[] | -      | -    |
| extra    | 建议项额外内容 | ReactNode        | -      | -    |
| icon     | 建议项图标     | ReactNode        | -      | -    |
| label    | 建议项显示内容 | ReactNode        | -      | -    |
| value    | 建议项值       | string           | -      | -    |

---

## Think

通用属性参考：[通用属性](/docs/react/common-props)

### ThinkProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 样式类名 | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | 样式 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| children | 内容 | React.ReactNode | - | - |
| title | 状态文本 | React.ReactNode | - | - |
| icon | 状态图标 | React.ReactNode | - | - |
| loading | 加载中 | boolean \| React.ReactNode | false | - |
| defaultExpanded | 默认是否展开 | boolean | true | - |
| expanded | 是否展开 | boolean | - | - |
| onExpand | 展开事件 | (expand: boolean) => void | - | - |
| blink | 闪动模式 | boolean | - | - |

---

## ThoughtChain

通用属性参考：[通用属性](/docs/react/common-props)

### ThoughtChainProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 思维节点集合 | ThoughtChainItemType[] | - | - |
| defaultExpandedKeys | 初始化展开的节点 | string[] | - | - |
| expandedKeys | 当前展开的节点 | string[] | - | - |
| onExpand | 展开节点变化回调 | (expandedKeys: string[]) => void; | - | - |
| line | 线条样式，为`false` 时不展示线条 | boolean \| 'solid' \| 'dashed' \| 'dotted‌' | 'solid' | - |
| classNames | 语义化结构的类名 | Record<'root'\|'item' \| 'itemIcon'\|'itemHeader' \| 'itemContent' \| 'itemFooter', string> | - | - |
| prefixCls | 自定义前缀 | string | - | - |
| styles | 语义化结构的样式 | Record<'root'\|'item' \|'itemIcon'\| 'itemHeader' \| 'itemContent' \| 'itemFooter', React.CSSProperties> | - | - |
| rootClassName | 根元素样式类名 | string | - | - |

### ThoughtChainItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 思维节点内容 | React.ReactNode | - | - |
| description | 思维节点描述 | React.ReactNode | - | - |
| footer | 思维节点脚注 | React.ReactNode | - | - |
| icon | 思维节点图标,为false时不展示 | false\|React.ReactNode | DefaultIcon | - |
| key | 思维节点唯一标识符 | string | - | - |
| status | 思维节点状态 | 'loading' \| 'success' \| 'error'\| 'abort' | - | - |
| title | 思维节点标题 | React.ReactNode | - | - |
| collapsible | 思维节点是否可折叠 | boolean | false | - |
| blink | 闪动效果 | boolean | - | - |

### ThoughtChain.Item

| 属性        | 说明       | 类型                                        | 默认值 | 版本 |
| ----------- | ---------- | ------------------------------------------- | ------ | ---- |
| prefixCls   | 自定义前缀 | string                                      | -      | -    |
| icon        | 思维链图标 | React.ReactNode                             | -      | -    |
| title       | 思维链标题 | React.ReactNode                             | -      | -    |
| description | 思维链描述 | React.ReactNode                             | -      | -    |
| status      | 思维链状态 | 'loading' \| 'success' \| 'error'\| 'abort' | -      | -    |
| variant     | 变体配置   | 'solid' \| 'outlined' \| 'text'             | -      | -    |
| blink       | 闪动效果   | boolean                                     | -      | -    |

---

## Actions

通用属性参考：[通用属性](/docs/react/common-props)

### ActionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ([ItemType](#itemtype) \| ReactNode)[] | - | - |
| onClick | 组件被点击时的回调函数 | function({ item, key, keyPath, domEvent }) | - | - |
| dropdownProps | 下拉菜单的配置属性 | DropdownProps | - | - |
| variant | 变体 | `borderless` \| `outlined` \|`filled` | `borderless` | - |
| fadeIn | 渐入效果 | boolean | - | 2.0.0 |
| fadeInLeft | 从左到右渐入效果 | boolean | - | 2.0.0 |

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | ReactNode | - | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: [ItemType](#itemtype)) => void | - | - |
| danger | 语法糖，设置危险icon | boolean | false | - |
| subItems | 子操作项 | Omit<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'>[] | - | - |
| triggerSubMenuAction | 触发子菜单的操作 | `hover` \| `click` | `hover` | - |
| actionRender | 自定义渲染操作项内容 | (item: [ItemType](#itemtype)) => ReactNode | - | - |

### Actions.Feedback

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 反馈状态值 | `like` \| `dislike` \| `default` | `default` | 2.0.0 |
| onChange | 反馈状态变化回调 | (value: `like` \| `dislike` \| `default`) => void | - | 2.0.0 |

### Actions.Copy

| 属性 | 说明       | 类型            | 默认值 | 版本  |
| ---- | ---------- | --------------- | ------ | ----- |
| text | 复制的文本 | string          | ''     | 2.0.0 |
| icon | 复制按钮   | React.ReactNode | -      | 2.0.0 |

### Actions.Audio

| 属性   | 说明     | 类型                                     | 默认值  | 版本  |
| ------ | -------- | ---------------------------------------- | ------- | ----- |
| status | 播放状态 | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0 |

### Actions.Item

| 属性        | 说明                 | 类型                                     | 默认值  | 版本  |
| ----------- | -------------------- | ---------------------------------------- | ------- | ----- |
| status      | 状态                 | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0 |
| label       | 自定义操作的显示标签 | string                                   | -       | 2.0.0 |
| defaultIcon | 默认状态图标         | React.ReactNode                          | -       | 2.0.0 |
| runningIcon | 执行状态图标         | React.ReactNode                          | -       | 2.0.0 |

---

## FileCard

通用属性参考：[通用属性](/docs/react/common-props)

### FileCardProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 文件名称 | string | - | - |
| byte | 文件大小（字节） | number | - | - |
| size | 卡片大小 | 'small' \| 'default' | 'default' | - |
| description | 文件描述，支持函数形式获取上下文信息 | React.ReactNode \| ((info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }) => React.ReactNode) | - | - |
| loading | 是否处于加载状态 | boolean | false | - |
| type | 文件类型 | 'file' \| 'image' \| 'audio' \| 'video' \| string | - | - |
| src | 图片或文件地址 | string | - | - |
| mask | 遮罩内容，支持函数形式获取上下文信息。对于 `type="image"`，可通过 `imageProps.preview.mask` 配置，此属性仅适用于非图像文件类型。 | React.ReactNode \| ((info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }) => React.ReactNode) | - | - |
| icon | 自定义图标 | React.ReactNode \| PresetIcons | - | - |
| imageProps | 图片属性，同 antd [Image](https://ant.design/components/image-cn#api) 属性 | ImageProps | - | - |
| videoProps | 视频属性配置 | Partial<React.JSX.IntrinsicElements['video']> | - | - |
| audioProps | 音频属性配置 | Partial<React.JSX.IntrinsicElements['audio']> | - | - |
| spinProps | 加载中属性 | [SpinProps](https://ant.design/components/spin-cn#api) & { showText?: boolean; icon?: React.ReactNode } | - | - |
| onClick | 点击事件回调，接收文件信息和点击事件 | (info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }, event: React.MouseEvent\<HTMLDivElement\>) => void | - | - |

### PresetIcons

预设图标类型，支持以下值：

```typescript
type PresetIcons =
  | 'default' // 默认文件图标
  | 'excel' // Excel 文件图标
  | 'image' // 图片文件图标
  | 'markdown' // Markdown 文件图标
  | 'pdf' // PDF 文件图标
  | 'ppt' // PowerPoint 文件图标
  | 'word' // Word 文件图标
  | 'zip' // 压缩文件图标
  | 'video' // 视频文件图标
  | 'audio' // 音频文件图标
  | 'java' // Java 文件图标
  | 'javascript' // JavaScript 文件图标
  | 'python'; // Python 文件图标
```

### FileCard.List

文件列表组件，用于展示多个文件卡片。

| 属性      | 说明         | 类型                                          | 默认值    | 版本 |
| --------- | ------------ | --------------------------------------------- | --------- | ---- |
| items     | 文件列表数据 | FileCardProps[]                               | -         | -    |
| size      | 卡片大小     | 'small' \| 'default'                          | 'default' | -    |
| removable | 是否可删除   | boolean \| ((item: FileCardProps) => boolean) | false     | -    |
| onRemove  | 删除事件回调 | (item: FileCardProps) => void                 | -         | -    |
| extension | 扩展内容     | React.ReactNode                               | -         | -    |
| overflow  | 超出展示方式 | 'scrollX' \| 'scrollY' \| 'wrap'              | 'wrap'    | -    |

## 语义化 DOM

### FileCard

<code src="./demo/_semantic.tsx" simplify="true"></code>

### FileCard.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="FileCard"></ComponentTokenTable>

---

## Sources

通用属性参考：[通用属性](/docs/react/common-props)

### SourcesProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 样式类名 | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | 样式 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| title | 标题内容 | React.ReactNode | - | - |
| items | 来源内容 | SourcesItem[] | - | - |
| expandIconPosition | 折叠图标位置 | 'start' \| 'end' | 'start' | - |
| defaultExpanded | 默认是否展开 | boolean | true | - |
| expanded | 是否展开 | boolean | - | - |
| onExpand | 展开事件 | (expand: boolean) => void | - | - |
| onClick | 点击事件 | (item: SourcesItem) => void | - | - |
| inline | 行内模式 | boolean | false | - |
| activeKey | 行内模式，激活的 key | React.Key | - | - |
| popoverOverlayWidth | 弹出层宽度 | number \| string | 300 | - |

```typescript
interface SourcesItem {
  key?: React.Key;
  title: React.ReactNode;
  url?: string;
  icon?: React.ReactNode;
  description?: React.ReactNode;
}
```

---

## CodeHighlighter

通用属性参考：[通用属性](/docs/react/common-props)。

### CodeHighlighterProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| lang | 代码语言类型 | `string` | - |
| children | 代码内容 | `string` | - |
| header | 头部内容，为 `false` 时不显示头部 | `React.ReactNode \| (() => React.ReactNode \| false) \| false` | - |
| highlightProps | 代码高亮配置，透传给 react-syntax-highlighter | [`SyntaxHighlighterProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| prismLightMode | 是否使用 Prism 轻量模式，根据 `lang` 自动按需加载语言支持以减少打包体积 | `boolean` | `true` |

### CodeHighlighterRef

| 属性          | 说明              | 类型          | 版本 |
| ------------- | ----------------- | ------------- | ---- |
| nativeElement | 获取原生 DOM 节点 | `HTMLElement` | -    |

---

## Mermaid

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 代码内容 | `string` | - |
| header | 顶部 | `React.ReactNode \| null` | React.ReactNode |
| className | 样式类名 | `string` | - |
| classNames | 样式类名 | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', string>>` | - |
| styles | 样式对象 | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', React.CSSProperties>>` | - |
| highlightProps | 代码高亮配置 | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| config | Mermaid 配置项 | `MermaidConfig` | - |
| actions | 操作栏配置 | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ItemType[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` |
| onRenderTypeChange | 渲染类型切换回调 | `(value: 'image' \| 'code') => void` | - |
| prefixCls | 样式前缀 | `string` | - |
| style | 自定义样式 | `React.CSSProperties` | - |

---

## XProvider

`XProvider` 完全继承 `antd` 的 `ConfigProvider`, 属性参考：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### 国际化

如果您的项目使用了antd 那么需要将antd的locale合并传入XProvider

```ts
import { XProvider  } from '@ant-design/x';
import zhCN from 'antd/locale/zh_CN';
import zhCN_X from '@ant-design/x/locale/zh_CN';

<XProvider locale={{...zhCN_X,...zhCN}}>
  <App />
</XProvider>
```

### 组件配置

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bubble | 气泡组件的全局配置 |{style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;}| - | - |
| conversations | 会话组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;shortcutKeys: {items?: ShortcutKeys\<'number'\> \| ShortcutKeys\<number\>[]}} | - | - |
| prompts | 提示集组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| sender | 输入框组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| suggestion | 建议组件的全局配置 |{style: React.CSSProperties; className: string;} | - |  |
| thoughtChain | 思维链组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| actions | 操作列表组件的全局配置 | {style: React.CSSProperties; className: string;} | - | - |

#### ShortcutKeys

```ts
type SignKeysType = {
  Ctrl: keyof KeyboardEvent;
  Alt: keyof KeyboardEvent;
  Meta: keyof KeyboardEvent;
  Shift: keyof KeyboardEvent;
};
type ShortcutKeys<CustomKey = number | 'number'> =
  | [keyof SignKeysType, keyof SignKeysType, CustomKey]
  | [keyof SignKeysType, CustomKey];
```

---

## Notification

成功发送通知需要确保已授权当前域名通知权限，

### XNotification

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| permission | 表明当前用户是否授予当前来源（origin）显示 web 通知的权限。 | NotificationPermission | - | - |
| requestPermission | 向用户为当前来源请求显示通知的权限。 | ()=> Promise\<NotificationPermission\> | - | - |
|open |向用户推送一个通知|(config: XNotificationOpenArgs)=> void | - | - |
|close|关闭已推送的通知，可以传入tag列表关闭指定通知，没有参数则会关闭所有通知|(config?: string[])=> void | - | - |

#### NotificationPermission

```tsx | pure
type NotificationPermission =
  | 'granted' // 用户已明确授予当前源显示系统通知的权限。
  | 'denied' // 用户已明确拒绝当前源显示系统通知的权限。
  | 'default'; // 用户决定未知；在这种情况下，应用程序的行为就像权限被“拒绝”一样。
```

#### XNotificationOpenArgs

```tsx | pure
type XNotificationOpenArgs = {
  openConfig: NotificationOptions & {
    title: string;
    onClick?: (event: Event, close?: Notification['close']) => void;
    onClose?: (event: Event) => void;
    onError?: (event: Event) => void;
    onShow?: (event: Event) => void;
    duration?: number;
  };
  closeConfig: NotificationOptions['tag'][];
};
```

#### NotificationOptions

```tsx | pure
interface NotificationOptions {
  badge?: string;
  body?: string;
  data?: any;
  dir?: NotificationDirection;
  icon?: string;
  lang?: string;
  requireInteraction?: boolean;
  silent?: boolean | null;
  tag?: string;
}
```

### useNotification

```tsx | pure
type useNotification = [
  { permission: XNotification['permission'] },
  {
    open: XNotification['open'];
    close: XNotification['close'];
    requestPermission: XNotification['requestPermission'];
  },
];
```

## 系统权限设置

### 在 Windows 上更改 `通知` 设置

在 Windows 系统上不同版本系统的设置路径会有不同，可大概参考路径：“开始”菜单 > “设置”> “系统” > 然后在左侧选择 “通知和操作”，之后可以对全局通知以及应用通知等进行操作。

### 在 Mac 上更改 `通知` 设置

在 Mac 上，使用 ”通知“ 设置来指定不想被通知打扰的时段，并控制通知在 ”通知中心“ 中的显示方式。若要更改这些设置，请选取 ”苹果“菜单> ”系统设置“，然后点按边栏中的 ”通知”（你可能需要向下滚动）。

## FAQ

### 已经获取了当前来源 `origin` 显示系统通知的权限，`onShow` 回调也触发了，为何还是无法展示推送的通知？

`Notification` 为系统通知，需要确保设备开启了对应浏览器应用的通知权限。

---

## Folder

通用属性参考：[通用属性](/docs/react/common-props)

### FolderProps

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| treeData | 文件树数据 | [FolderTreeData](#foldertreenode)[] | `[]` | - |
| selectable | 是否开启选择功能 | boolean | `true` | - |
| selectedFile | 选中的文件路径（受控） | string[] | - | - |
| defaultSelectedFile | 默认选中的文件路径 | string[] | `[]` | - |
| onSelectedFileChange | 文件选择变化时的回调 | (file: { path: string[]; name?: string; content?: string }) => void | - | - |
| directoryTreeWith | 目录树宽度 | number \| string | `278` | - |
| emptyRender | 空状态时的展示内容，设为 `false` 时不展示 | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewRender | 自定义文件预览内容 | React.ReactNode \| ((file: { content?: string; path: string[]; title?: React.ReactNode; language: string }, info: { originNode: React.ReactNode }) => React.ReactNode) | - | - |
| expandedPaths | 展开的节点路径数组（受控） | string[] | - | - |
| defaultExpandedPaths | 默认展开的节点路径数组 | string[] | - | - |
| defaultExpandAll | 是否默认展开所有节点 | boolean | `true` | - |
| onExpandedPathsChange | 展开/收起变化时的回调 | (paths: string[]) => void | - | - |
| fileContentService | 文件内容服务 | [FileContentService](#filecontentservice) | - | - |
| onFileClick | 文件点击事件 | (filePath: string, content?: string) => void | - | - |
| onFolderClick | 文件夹点击事件 | (folderPath: string) => void | - | - |
| directoryTitle | 目录树标题，设为 `false` 时不展示 | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewTitle | 文件预览标题 | string \| (({ title, path, content }: { title: string; path: string[]; content: string }) => React.ReactNode) | - | - |
| directoryIcons | 自定义图标配置，设为 `false` 时不展示图标 | false \| Record<'directory' \| string, React.ReactNode \| (() => React.ReactNode)> | - | - |

### FolderTreeData

| 属性     | 说明                     | 类型                                | 默认值 | 版本 |
| -------- | ------------------------ | ----------------------------------- | ------ | ---- |
| title    | 显示名称                 | string                              | -      | -    |
| path     | 文件路径                 | string                              | -      | -    |
| content  | 文件内容（可选）         | string                              | -      | -    |
| children | 子项（仅文件夹类型有效） | [FolderTreeData](#foldertreenode)[] | -      | -    |

### FileContentService

文件内容服务接口，用于动态加载文件内容。

```typescript
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Folder"></ComponentTokenTable>
