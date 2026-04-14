## Bubble

Common Props Reference: [Common Props](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| Attribute | Description | Type | Default | Version |
|------|------|------|--------|------|
| placement | Bubble position | `start` \| `end` | `start` | - |
| loading | Loading state | boolean | - | - |
| loadingRender | Custom loading content renderer | () => React.ReactNode | - | - |
| content | Bubble content | [ContentType](#contenttype) | - | - |
| contentRender | Custom content renderer | (content: ContentType, info: InfoType ) => React.ReactNode | - | - |
| editable | Editable | boolean \| [EditableBubbleOption](#editablebubbleoption) | `false` | 2.0.0 |
| typing | Typing animation effect | boolean \| [BubbleAnimationOption](#bubbleanimationoption) \| ((content: ContentType, info: InfoType) => boolean \| [BubbleAnimationOption](#bubbleanimationoption)) | `false` | - |
| streaming | Streaming mode | boolean | `false` | - |
| variant | Bubble style variant | `filled` \| `outlined` \| `shadow` \| `borderless` | `filled` | - |
| shape | Bubble shape | `default` \| `round` \| `corner` | `default` | - |
| footerPlacement | Footer slot position | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | 2.0.0 |
| header | Header slot | [BubbleSlot](#bubbleslot) | - | - |
| footer | Footer slot | [BubbleSlot](#bubbleslot) | - | - |
| avatar | Avatar slot | [BubbleSlot](#bubbleslot) | - | - |
| extra | Extra slot | [BubbleSlot](#bubbleslot) | - | - |
| onTyping | Typing animation callback | (rendererContent: string, currentContent: string) => void | - | 2.0.0 |
| onTypingComplete | Typing animation complete callback | (content: string) => void | - | - |
| onEditConfirm | Edit confirm callback | (content: string) => void | - | 2.0.0 |
| onEditCancel | Edit cancel callback | () => void | - | 2.0.0 |

#### ContentType

Default type

```typescript
type ContentType = React.ReactNode | AnyObject | string | number;
```

Custom type usage

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
   * @description Whether editable
   */
  editing?: boolean;
  /**
   * @description OK button
   */
  okText?: React.ReactNode;
  /**
   * @description Cancel button
   */
  cancelText?: React.ReactNode;
}
```

#### BubbleAnimationOption

```typescript
interface BubbleAnimationOption {
  /**
   * @description Animation effect type, typewriter, fade-in
   * @default 'fade-in'
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description Content step unit, array format for random interval
   * @default 6
   */
  step?: number | [number, number];
  /**
   * @description Animation trigger interval
   * @default 100
   */
  interval?: number;
  /**
   * @description Whether to keep the common prefix when restarting animation
   * @default true
   */
  keepPrefix?: boolean;
}
```

#### streaming

`streaming` notifies Bubble whether the current `content` is streaming input. In streaming mode, regardless of whether Bubble input animation is enabled, Bubble will not trigger the `onTypingComplete` callback until `streaming` becomes `false`, even if the current `content` is fully output. Only when `streaming` becomes `false` and the content is fully output will Bubble trigger `onTypingComplete`. This avoids multiple triggers due to unstable streaming and ensures only one trigger per streaming process.

In [this example](#bubble-demo-stream), you can try to force the streaming flag off:

- If you enable input animation and perform **slow loading**, multiple triggers of `onTypingComplete` may occur because streaming speed cannot keep up with animation speed.
- If you disable input animation, each streaming input will trigger `onTypingComplete`.

### Bubble.List

| Attribute | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Bubble data list, `key` and `role` required. When used with X SDK [`useXChat`](/x-sdks/use-x-chat), you can pass `status` to help Bubble manage configuration | (BubbleProps & { key: string \| number, role: string , status: MessageStatus, extraInfo?: AnyObject })[] | - | - |
| autoScroll | Auto-scroll | boolean | `true` | - |
| role | Role default configuration | [RoleType](#roletype) | - | - |

#### MessageStatus

```typescript
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

#### InfoType

When used in conjunction with [`useXChat`](/x-sdks/use-x-chat), `key` can be used as `MessageId`,and `extraInfo` can be used as a custom parameter.

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

#### Bubble.List autoScroll Top Alignment

**Bubble.List** auto-scroll is a simple reverse sorting scheme. In a fixed-height **Bubble.List**, if the message content is insufficient to fill the height, the content is bottom-aligned. It is recommended not to set a fixed height for **Bubble.List**, but to set a fixed height for its parent container and use flex layout (`display: flex` and `flex-direction: column`). This way, **Bubble.List** adapts its height and aligns content to the top when content is sparse, as shown in the [Bubble List demo](#bubble-demo-list).

```tsx
<div style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
  <Bubble.List items={items} autoScroll />
</div>
```

If you do not want to use flex layout, you can set `max-height` for **Bubble.List**. When content is sparse, the height adapts and aligns to the top.

```tsx
<Bubble.List items={items} autoScroll style={{ maxHeight: 600 }} />
```

#### Bubble.List role and Custom Bubble

Both the `role` and `items` attributes of **Bubble.List** can be configured for bubbles, where the `role` configuration is used as the default and can be omitted. `item.role` is used to specify the bubble role for the data item, which will be matched with `Bubble.List.role`. The `items` itself can also be configured with bubble attributes, with higher priority than the `role` configuration. The final bubble configuration is: `{ ...role[item.role], ...item }`.

Note that [semantic configuration](#semantic-dom) in **Bubble.List** can also style the bubbles, but it has the lowest priority and will be overridden by role or items.

The final configuration priority is: `items` > `role` > `Bubble.List.styles` = `Bubble.List.classNames`.

Special note: We provide four default fields for `role`, `ai`, `user`, `system`, `divider`. Among these, `system` and `divider` are reserved fields. If `item.role` is assigned either of them, **Bubble.List** will render this bubble data as **Bubble.System (role = 'system')** or **Bubble.Divider (role = 'divider')**.

Therefore, if you want to customize the rendering of system Bubble or divider Bubble, you should use other names.

Customize the rendering Bubble, you can refer to the rendering method of reference in [this example](#bubble-demo-list).

### Bubble.System

Common Props Reference: [Common Props](/docs/react/common-props)

| Attribute | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Bubble content | [ContentType](#contenttype) | - | - |
| variant | Bubble style variant | `filled` \| `outlined` \| `shadow` \| `borderless` | `shadow` | - |
| shape | Bubble shape | `default` \| `round` \| `corner` | `default` | - |

### Bubble.Divider

Common Props Reference: [Common Props](/docs/react/common-props)

| Attribute | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Bubble content，same as Divider.children | [ContentType](#contenttype) | - | - |
| dividerProps | Divider props | [Divider](https://ant.design/components/divider-cn) | - | - |

---

## Sender

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowSpeech | Whether to allow voice input | boolean \| SpeechConfig | false | - |
| classNames | Style class names | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of the input box | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether in loading state | boolean | false | - |
| suffix | Suffix content, displays action buttons by default. When you don't need the default action buttons, you can set `suffix={false}` | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | oriNode | 2.0.0 |
| header | Header panel | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| prefix | Prefix content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| footer | Footer content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| readOnly | Whether to make the input box read-only | boolean | false | - |
| rootClassName | Root element style class | string | - | - |
| styles | Semantic style definition | [See below](#semantic-dom) | - | - |
| submitType | Submission mode | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input box value | string | - | - |
| onSubmit | Callback for clicking the send button | (message: string, slotConfig: SlotConfigType[], skill: SkillType) => void | - | - |
| onChange | Callback for input box value change | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig: SlotConfigType[], skill: SkillType) => void | - | - |
| onCancel | Callback for clicking the cancel button | () => void | - | - |
| onPaste | Callback for pasting | React.ClipboardEventHandler<`HTMLElement`> | - | - |
| onPasteFile | Callback for pasting files | (files: FileList) => void | - | - |
| onKeyDown | Callback for keyboard press | (event: React.KeyboardEvent) => void \| false | - | - |
| onFocus | Callback for getting focus | React.FocusEventHandler<`HTMLTextAreaElement`> | - | - |
| onBlur | Callback for losing focus | React.FocusEventHandler<`HTMLTextAreaElement`> | - | - |
| placeholder | Placeholder of the input box | string | - | - |
| autoSize | Auto-adjust content height, can be set to true \| false or object: { minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | Slot configuration, after configuration the input box will switch to slot mode, supporting structured input. In this mode, `value` and `defaultValue` configurations will be invalid. | SlotConfigType[] | - | 2.0.0 |
| skill | Skill configuration, the input box will switch to slot mode, supporting structured input. In this mode, `value` and `defaultValue` configurations will be invalid. | SkillType | - | 2.0.0 |

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
  // When `recording` is set, the built-in voice input feature will be disabled.
  // Developers need to implement third-party voice input functionality.
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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| inputElement | Input element | `HTMLTextAreaElement` | - | - |
| nativeElement | Outer container | `HTMLDivElement` | - | - |
| focus | Get focus, when `cursor = 'slot'` the focus will be in the first slot of type `input`, if no corresponding `input` exists it will behave the same as `end` | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' \| 'slot' }) | - | - |
| blur | Remove focus | () => void | - | - |
| insert | Insert text or slots, when using slots ensure slotConfig is configured | (value: string) => void \| (slotConfig: SlotConfigType[], position: insertPosition, replaceCharacters: string, preventScroll: boolean) => void; | - | - |
| clear | Clear content | () => void | - | - |
| getValue | Get current content and structured configuration | () => { value: string; slotConfig: SlotConfigType[], skill: SkillType } | - | - |

#### SlotConfigType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Node type, determines the rendering component type, required | 'text' \| 'input' \| 'select' \| 'tag' \| 'content' \| 'custom' | - | 2.0.0 |
| key | Unique identifier, can be omitted when type is text | string | - | - |
| formatResult | Format the final result | (value: any) => string | - | 2.0.0 |

##### text node properties

| Property | Description  | Type   | Default | Version |
| -------- | ------------ | ------ | ------- | ------- |
| value    | Text content | string | -       | 2.0.0   |

##### input node properties

| Property           | Description   | Type                                  | Default | Version |
| ------------------ | ------------- | ------------------------------------- | ------- | ------- |
| props.placeholder  | Placeholder   | string                                | -       | 2.0.0   |
| props.defaultValue | Default value | string \| number \| readonly string[] | -       | 2.0.0   |

##### select node properties

| Property           | Description             | Type     | Default | Version |
| ------------------ | ----------------------- | -------- | ------- | ------- |
| props.options      | Options array, required | string[] | -       | 2.0.0   |
| props.placeholder  | Placeholder             | string   | -       | 2.0.0   |
| props.defaultValue | Default value           | string   | -       | 2.0.0   |

##### tag node properties

| Property    | Description           | Type      | Default | Version |
| ----------- | --------------------- | --------- | ------- | ------- |
| props.label | Tag content, required | ReactNode | -       | 2.0.0   |
| props.value | Tag value             | string    | -       | 2.0.0   |

##### content node properties

| Property           | Description   | Type   | Default | Version |
| ------------------ | ------------- | ------ | ------- | ------- |
| props.defaultValue | Default value | any    | -       | 2.1.0   |
| props.placeholder  | Placeholder   | string | -       | 2.1.0   |

##### custom node properties

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| props.defaultValue | Default value | any | - | 2.0.0 |
| customRender | Custom rendering function | (value: any, onChange: (value: any) => void, props: { disabled?: boolean, readOnly?: boolean }, item: SlotConfigType) => React.ReactNode | - | 2.0.0 |

### Sender.Header

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | ReactNode | - | - |
| classNames | Style class names | [See below](#semantic-dom) | - | - |
| closable | Whether it can be closed | boolean | true | - |
| forceRender | Force rendering, use when you need to reference internal elements during initialization | boolean | false | - |
| open | Whether to expand | boolean | - | - |
| styles | Semantic style definition | [See below](#semantic-dom) | - | - |
| title | Title | ReactNode | - | - |
| onOpenChange | Callback for expansion state change | (open: boolean) => void | - | - |

### Sender.Switch

| Property          | Description              | Type                       | Default | Version |
| ----------------- | ------------------------ | -------------------------- | ------- | ------- |
| children          | General content          | ReactNode                  | -       | 2.0.0   |
| checkedChildren   | Content when checked     | ReactNode                  | -       | 2.0.0   |
| unCheckedChildren | Content when unchecked   | ReactNode                  | -       | 2.0.0   |
| icon              | Set icon component       | ReactNode                  | -       | 2.0.0   |
| disabled          | Whether disabled         | boolean                    | false   | 2.0.0   |
| loading           | Loading switch           | boolean                    | -       | 2.0.0   |
| defaultValue      | Default checked state    | boolean                    | -       | 2.0.0   |
| value             | Switch value             | boolean                    | false   | 2.0.0   |
| onChange          | Callback when changed    | function(checked: boolean) | -       | 2.0.0   |
| rootClassName     | Root element style class | string                     | -       | 2.0.0   |

### ⚠️ Slot Mode Notes

- **In slot mode, `value` and `defaultValue` properties are invalid**, please use `ref` and callback events to get the input box value and slot configuration.
- **In slot mode, the third parameter `config` of `onChange`/`onSubmit` callbacks** is only used to get the current structured content.

**Example:**

```jsx
// ❌ Incorrect usage, slotConfig and skill are for uncontrolled usage
const [config, setConfig] = useState([]);
const [skill, setSkill] = useState([]);
<Sender
  slotConfig={config}
  skill={skill}
  onChange={(value, e, config, skill) => {
    setConfig(config);
    setSkill(skill)
  }}
/>

// ✅ Correct usage
<Sender
  key={key}
  slotConfig={config}
  skill={skill}
  onChange={(value, _e, config, skill) => {
    // Only used to get structured content
    setKey('new_key')
  }}
/>
```

---

## Conversations

Common props ref：[Common props](/docs/react/common-props)

### ConversationsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey | Currently selected value | string | - | - |
| defaultActiveKey | Default selected value | string | - | - |
| items | Data source for conversation list | `ItemType`[] | - | - |
| onActiveChange | Callback for selection change | (value: string, item: ItemType) => void | - | - |
| menu | Operation menu for conversations | ItemMenuProps\| ((conversation: ConversationItemType) => ItemMenuProps) | - | - |
| groupable | If grouping is supported, it defaults to the `Conversation.group` field | boolean \| GroupableProps | - | - |
| shortcutKeys | Shortcut key operations | { creation?: ShortcutKeys<number>; items?:ShortcutKeys<'number'> \| ShortcutKeys<number>[];} | - | 2.0.0 |
| creation | New conversation configuration | CreationProps | - | 2.0.0 |
| styles | Semantic structure styles | styles?: {creation?: React.CSSProperties;item?: React.CSSProperties;} | - | - |
| classNames | Semantic structure class names | classNames?: { creation?: string; item?:string;} | - | - |
| rootClassName | Root node className | string | - | - |

### ItemType

```tsx
type ItemType = ConversationItemType | DividerItemType;
```

#### ConversationItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier | string | - | - |
| label | Conversation name | React.ReactNode | - | - |
| group | Conversation type, linked to `ConversationsProps.groupable` | string | - | - |
| icon | Conversation icon | React.ReactNode | - | - |
| disabled | Whether to disable | boolean | - | - |

#### DividerItemType

| Property | Description    | Type      | Default   | Version |
| -------- | -------------- | --------- | --------- | ------- |
| type     | Divider type   | 'divider' | 'divider' | -       |
| dashed   | Whether dashed | boolean   | false     | -       |

### GroupableProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | Group title | React.ReactNode\| ((group: string, info: { groupInfo: GroupInfoType}) => React.ReactNode) | - | - |
| collapsible | Collapsible configuration | boolean \| ((group: string) => boolean) | - | - |
| defaultExpandedKeys | Default expanded or collapsed groups | string[] | - | - |
| onExpand | Expand or collapse callback | (expandedKeys: string[]) => void | - | - |
| expandedKeys | Expanded group keys | string[] | - | - |

### ItemMenuProps

Inherits antd [MenuProps](https://ant.design/components/menu-cn#api) properties.

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

---

## Welcome

### WelcomeProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names for different parts of each prompt item. | Record<'icon' \| 'title' \| 'description' \| 'extra', string> | - | - |
| description | The description displayed in the prompt list. | React.ReactNode | - | - |
| extra | The extra operation displayed at the end of the prompt list. | React.ReactNode | - | - |
| icon | The icon displayed on the front side of the prompt list. | React.ReactNode | - | - |
| rootClassName | The style class name of the root node. | string | - | - |
| styles | Custom styles for different parts of each prompt item. | Record<'icon' \| 'title' \| 'description' \| 'extra', React.CSSProperties> | - | - |
| title | The title displayed at the top of the prompt list. | React.ReactNode | - | - |
| variant | Variant type. | 'filled' \| 'borderless' | 'filled' | - |

---

## Prompts

### PromptsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names for different parts of each prompt item. | Record<SemanticType, string> | - | - |
| items | List containing multiple prompt items. | PromptProps[] | - | - |
| prefixCls | Prefix for style class names. | string | - | - |
| rootClassName | Style class name for the root node. | string | - | - |
| styles | Custom styles for different parts of each prompt item. | Record<SemanticType, React.CSSProperties> | - | - |
| title | Title displayed at the top of the prompt list. | React.ReactNode | - | - |
| vertical | When set to `true`, the Prompts will be arranged vertically. | boolean | `false` | - |
| wrap | When set to `true`, the Prompts will automatically wrap. | boolean | `false` | - |
| onItemClick | Callback function when a prompt item is clicked. | (info: { data: PromptProps }) => void | - | - |
| fadeIn | Fade in effect | boolean | - | - |
| fadeInLeft | Fade left in effect | boolean | - | - |

### PromptProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Nested child prompt items. | PromptProps[] | - | - |
| description | Prompt description providing additional information. | React.ReactNode | - | - |
| disabled | When set to `true`, click events are disabled. | boolean | `false` | - |
| icon | Prompt icon displayed on the left side of the prompt item. | React.ReactNode | - | - |
| key | Unique identifier used to distinguish each prompt item. | string | - | - |
| label | Prompt label displaying the main content of the prompt. | React.ReactNode | - | - |

---

## Attachments

Common props ref: [Common props](/docs/react/common-props).

### AttachmentsProps

Inherits antd [Upload](https://ant.design/components/upload) properties.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom class names, [see below](#semantic-dom) | Record<string, string> | - | - |
| disabled | Whether to disable | boolean | false | - |
| maxCount | Maximum number of files for upload | number \| - | - | 2.0.0 |
| getDropContainer | Config the area where files can be dropped | () => HTMLElement | - | - |
| items | Attachment list, same as Upload `fileList` | Attachment[] | - | - |
| overflow | Behavior when the file list overflows | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | Placeholder information when there is no file | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | Root node className | string | - | - |
| styles | Custom style object, [see below](#semantic-dom) | Record<string, React.CSSProperties> | - | - |
| imageProps | Image config, same as antd [Image](https://ant.design/components/image) | ImageProps | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}
```

### AttachmentsRef

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| nativeElement | Get the native node | HTMLElement | - |
| fileNativeElement | Get the file upload native node | HTMLElement | - |
| upload | Manually upload a file | (file: File) => void | - |
| select | Manually select files | (options: { accept?: string; multiple?: boolean; }) => void | 2.0.0 |

---

## Suggestion

Common props ref：[Common props](/docs/react/common-props)

For more configuration, please check [CascaderProps](https://ant.design/components/cascader#api)

### SuggestionsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Take up the full width | boolean | false | - |
| children | Custom input box | ({ onTrigger, onKeyDown }) => ReactElement | - | - |
| items | Suggestion list | SuggestionItem[] \| ((info: T) => SuggestionItem[]) | - | - |
| open | Controlled open panel | boolean | - | - |
| rootClassName | Root element class name | string | - | - |
| onSelect | Callback when the suggestion item is selected | (value: string, selectedOptions: SuggestionItem[]) => void; | - | - |
| onOpenChange | Callback when the panel open state changes | (open: boolean) => void | - | - |
| getPopupContainer | The parent node of the menu. Default is to render to body. If you encounter menu scrolling positioning issues, try modifying it to the scrolling area and positioning relative to it | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |

#### onTrigger

```typescript | pure
type onTrigger<T> = (info: T | false) => void;
```

Suggestion accepts generics to customize the parameter type passed to `items` renderProps. When `false` is passed, the suggestion panel is closed.

### SuggestionItem

| Property | Description                           | Type             | Default | Version |
| -------- | ------------------------------------- | ---------------- | ------- | ------- |
| children | Child item for the suggestion item    | SuggestionItem[] | -       | -       |
| extra    | Extra content for the suggestion item | ReactNode        | -       | -       |
| icon     | Icon for the suggestion               | ReactNode        | -       | -       |
| label    | Content to display for the suggestion | ReactNode        | -       | -       |
| value    | Value of the suggestion item          | string           | -       | -       |

---

## Think

Common props ref：[Common props](/docs/react/common-props)

### ThinkProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| children | Think Content | React.ReactNode | - | - |
| title | Text of status | React.ReactNode | - | - |
| icon | Show icon | React.ReactNode | - | - |
| loading | Loading | boolean \| React.ReactNode | false | - |
| defaultExpanded | Default Expand state | boolean | true | - |
| expanded | Expand state | boolean | - | - |
| onExpand | Callback when expand changes | (expand: boolean) => void | - | - |
| blink | Blink mode | boolean | - | - |

---

## ThoughtChain

Reference: [Common API](/docs/react/common-props)

### ThoughtChainProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Collection of thought nodes | ThoughtChainItemType[] | - | - |
| defaultExpandedKeys | Initially expanded nodes | string[] | - | - |
| expandedKeys | Currently expanded nodes | string[] | - | - |
| onExpand | Callback for when expanded nodes change | (expandedKeys: string[]) => void; | - | - |
| line | Line style, no line is shown when `false` | boolean \| 'solid' \| 'dashed' \| 'dotted‌' | 'solid' | - |
| classNames | Class names for semantic structure | Record<'root'\|'item' \| 'itemIcon'\|'itemHeader' \| 'itemContent' \| 'itemFooter', string> | - | - |
| prefixCls | Custom prefix | string | - | - |
| styles | Styles for semantic structure | Record<'root'\|'item' \|'itemIcon'\| 'itemHeader' \| 'itemContent' \| 'itemFooter', React.CSSProperties> | - | - |
| rootClassName | Root element class name | string | - | - |

### ThoughtChainItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Content of the thought node | React.ReactNode | - | - |
| description | Description of the thought node | React.ReactNode | - | - |
| footer | Footer of the thought node | React.ReactNode | - | - |
| icon | Icon of the thought node, not displayed when `false` | false \| React.ReactNode | DefaultIcon | - |
| key | Unique identifier for the thought node | string | - | - |
| status | Status of the thought node | 'loading' \| 'success' \| 'error'\| 'abort' | - | - |
| title | Title of the thought node | React.ReactNode | - | - |
| collapsible | Whether the thought node is collapsible | boolean | false | - |
| blink | Blink mode | boolean | - | - |

### ThoughtChain.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | Custom prefix | string | - | - |
| icon | Icon of the thought chain | React.ReactNode | - | - |
| title | Title of the thought chain | React.ReactNode | - | - |
| description | Description of the thought chain | React.ReactNode | - | - |
| status | Status of the thought chain | 'loading' \| 'success' \| 'error'\| 'abort' | - | - |
| variant | Variant configuration | 'solid' \| 'outlined' \| 'text' | - | - |
| blink | Blink mode | boolean | - | - |

---

## Actions

Common props ref：[Common props](/docs/react/common-props)

### ActionsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | List containing multiple action items | ([ItemType](#itemtype) \| ReactNode)[] | - | - |
| onClick | Callback function when component is clicked | function({ item, key, keyPath, domEvent }) | - | - |
| dropdownProps | Configuration properties for dropdown menu | DropdownProps | - | - |
| variant | Variant | `borderless` \| `outlined` \|`filled` | `borderless` | - |
| fadeIn | Fade in effect | boolean | - | 2.0.0 |
| fadeInLeft | Fade left in effect | boolean | - | 2.0.0 |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier for custom action | string | - | - |
| label | Display label for custom action | string | - | - |
| icon | Icon for custom action | ReactNode | - | - |
| onItemClick | Callback function when custom action button is clicked | (info: [ItemType](#itemtype)) => void | - | - |
| danger | Syntactic sugar, sets danger icon | boolean | false | - |
| subItems | Sub action items | Omit<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'>[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu | `hover` \| `click` | `hover` | - |
| actionRender | Custom render action item content | (item: [ItemType](#itemtype)) => ReactNode | - | - |

### Actions.Feedback

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Feedback status value | `like` \| `dislike` \| `default` | `default` | 2.0.0 |
| onChange | Feedback status change callback | (value: `like` \| `dislike` \| `default`) => void | - | 2.0.0 |

### Actions.Copy

| Property | Description       | Type            | Default | Version |
| -------- | ----------------- | --------------- | ------- | ------- |
| text     | Text to be copied | string          | ''      | 2.0.0   |
| icon     | Copy button       | React.ReactNode | -       | 2.0.0   |

### Actions.Audio

| Property | Description     | Type                                     | Default | Version |
| -------- | --------------- | ---------------------------------------- | ------- | ------- |
| status   | Playback status | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0   |

### Actions.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| status | Status | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0 |
| label | Display label for custom action | string | - | 2.0.0 |
| defaultIcon | Default status icon | ReactNode | - | 2.0.0 |
| runningIcon | Running status icon | ReactNode | - | 2.0.0 |

---

## FileCard

Common props ref：[Common props](/docs/react/common-props)

### FileCardProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | File name | string | - | - |
| byte | File size (bytes) | number | - | - |
| size | Card size | 'small' \| 'default' | 'default' | - |
| description | File description, supports function form to get context information | React.ReactNode \| ((info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }) => React.ReactNode) | - | - |
| loading | Loading state | boolean | false | - |
| type | File type | 'file' \| 'image' \| 'audio' \| 'video' \| string | - | - |
| src | Image or file URL | string | - | - |
| mask | Mask content, supports function form to get context information. For `type="image"`, this is configured via `imageProps.preview.mask`,This prop only applies to non-image file types. | React.ReactNode \| ((info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }) => React.ReactNode) | - | - |
| icon | Custom icon | React.ReactNode \| PresetIcons | - | - |
| imageProps | Image props configuration | [Image](https://ant.design/components/image-cn#api) | - | - |
| videoProps | Video props configuration | Partial<React.JSX.IntrinsicElements['video']> | - | - |
| audioProps | Audio props configuration | Partial<React.JSX.IntrinsicElements['audio']> | - | - |
| spinProps | Loading animation props configuration | [SpinProps](https://ant.design/components/spin-cn#api) & { showText?: boolean; icon?: React.ReactNode } | - | - |
| onClick | Click event callback, receives file information and click event | (info: { size: string, icon: React.ReactNode, namePrefix?: string, nameSuffix?: string, name?: string, src?: string, type?: string }, event: React.MouseEvent\<HTMLDivElement\>) => void | - | - |

### PresetIcons

Preset icon types, supports the following values:

```typescript
type PresetIcons =
  | 'default' // Default file icon
  | 'excel' // Excel file icon
  | 'image' // Image file icon
  | 'markdown' // Markdown file icon
  | 'pdf' // PDF file icon
  | 'ppt' // PowerPoint file icon
  | 'word' // Word file icon
  | 'zip' // Archive file icon
  | 'video' // Video file icon
  | 'audio' // Audio file icon
  | 'java' // Java file icon
  | 'javascript' // JavaScript file icon
  | 'python'; // Python file icon
```

### FileCard.List

File list component for displaying multiple file cards.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | File list data | FileCardProps[] | - | - |
| size | Card size | 'small' \| 'default' | 'default' | - |
| removable | Whether removable | boolean \| ((item: FileCardProps) => boolean) | false | - |
| onRemove | Remove event callback | (item: FileCardProps) => void | - | - |
| extension | Extension content | React.ReactNode | - | - |
| overflow | Overflow display style | 'scrollX' \| 'scrollY' \| 'wrap' | 'wrap' | - |

---

## Sources

Common props ref：[Common props](/docs/react/common-props)

### SourcesProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| title | Title content | React.ReactNode | - | - |
| items | Sources content list | SourcesItem[] | - | - |
| expandIconPosition | Expand icon position | 'start' \| 'end' | 'start' | - |
| defaultExpanded | Default expand state | boolean | true | - |
| expanded | Expand state | boolean | - | - |
| onExpand | Callback when expand changes | (expand: boolean) => void | - | - |
| onClick | Callback when click | (item: SourcesItem) => void | - | - |
| inline | Inline mode | boolean | false | - |
| activeKey | Active key in inline mode | React.Key | - | - |
| popoverOverlayWidth | Popover overlay width | number \| string | 300 | - |

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

For common properties, refer to: [Common Properties](/docs/react/common-props).

### CodeHighlighterProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Language | `string` | - |
| children | Code content | `string` | - |
| header | Header content, set to `false` to hide the header | `React.ReactNode \| (() => React.ReactNode \| false) \| false` | - |
| className | Style class name | `string` |  |
| classNames | Style class names | `string` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| prismLightMode | Whether to use Prism light mode to automatically load language support based on lang prop for smaller bundle size | `boolean` | `true` |

### CodeHighlighterRef

| Property      | Description        | Type        | Version |
| ------------- | ------------------ | ----------- | ------- |
| nativeElement | Get native element | HTMLElement | -       |

---

## Mermaid

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Code content | `string` | - |
| header | Header | `React.ReactNode \| null` | React.ReactNode |
| className | Style class name | `string` | - |
| classNames | Style class name | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', string>>` | - |
| styles | Style object | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', React.CSSProperties>>` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| config | Mermaid configuration | `MermaidConfig` | - |
| actions | Actions configuration | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ItemType[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` |
| onRenderTypeChange | Callback when render type changes | `(value: 'image' \| 'code') => void` | - |
| prefixCls | Style prefix | `string` | - |
| style | Custom style | `React.CSSProperties` | - |

---

## XProvider

`XProvider` fully extends `antd`'s `ConfigProvider`. Props ref：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### Component Config

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bubble | Global configuration for the Bubble component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| conversations | Global configuration for the Conversations component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;shortcutKeys: {items?: ShortcutKeys<'number'> \| ShortcutKeys<number>[]}}  | - | - |
| prompts | Global configuration for the Prompts component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| sender | Global configuration for the Sender component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| suggestion | Global configuration for the Suggestion component | {style: React.CSSProperties; className: string;} | - |  |
| thoughtChain | Global configuration for the ThoughtChain component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;}| - |  |
| actions | Global configuration for the Actions component | {style: React.CSSProperties; className: string;}| - |  |

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

To successfully send a notification, you need to ensure that the current domain has been granted notification permission.

### XNotification

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| permission | Indicates whether the user has granted permission to display web notifications for the current origin. | NotificationPermission | - | - |
| requestPermission| Requests permission from the user to display notifications for the current origin. | ()=> Promise</NotificationPermission/> | - | - |
| open |Push a notification to the user| (config: XNotificationOpenArgs)=> void | - | - |
| close|Close pushed notifications. You can pass a tag list to close specific notifications, or call without arguments to close all.| (config?: string[])=> void | - | - |

#### NotificationPermission

```tsx | pure
type NotificationPermission =
  | 'granted' // The user has explicitly granted the current origin permission to display system notifications.
  | 'denied' // The user has explicitly denied the current origin permission to display system notifications.
  | 'default'; // The user's decision is unknown; in this case, the application behaves as if the permission was "denied".
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

## System Permission Settings

### Change `Notification` settings on Windows

The setting path for different versions of the Windows system will be different. You can refer to the approximate path: "Start" menu > "Settings" > "System" > and then select "Notifications & actions" on the left, after which you can operate on global notifications and application notifications.

### Change `Notification` settings on Mac

On a Mac, use the "Notifications" settings to specify the period during which you do not want to be disturbed by notifications, and control how notifications are displayed in the "Notification Center". To change these settings, choose "Apple" menu > "System Settings", then click "Notifications" in the sidebar (you may need to scroll down).

## FAQ

### I have obtained the permission for the current `origin` to display system notifications, and the `onShow` callback has also been triggered. Why can't the pushed notification be displayed?

`Notification` is a system-level feature. Please ensure that notifications are enabled for the browser application on your device.

---

## Folder

Common props ref: [Common props](/docs/react/common-props)

### FolderProps

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| treeData | File tree data | [FolderTreeData](#foldertreedata)[] | `[]` | - |
| selectable | Whether to enable selection functionality | boolean | `true` | - |
| selectedFile | Selected file paths (controlled) | string[] | - | - |
| defaultSelectedFile | Default selected file paths | string[] | `[]` | - |
| onSelectedFileChange | Callback when file selection changes | (file: { path: string[]; name?: string; content?: string }) => void | - | - |
| directoryTreeWith | Directory tree width | number \| string | `278` | - |
| emptyRender | Content to display when empty, set to `false` to hide | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewRender | Custom file preview content | React.ReactNode \| ((file: { content?: string; path: string[]; title?: React.ReactNode; language: string }, info: { originNode: React.ReactNode }) => React.ReactNode) | - | - |
| expandedPaths | Array of expanded node paths (controlled) | string[] | - | - |
| defaultExpandedPaths | Array of default expanded node paths | string[] | - | - |
| defaultExpandAll | Whether to expand all nodes by default | boolean | `true` | - |
| onExpandedPathsChange | Callback when expand/collapse changes | (paths: string[]) => void | - | - |
| fileContentService | File content service | [FileContentService](#filecontentservice) | - | - |
| onFileClick | File click event | (filePath: string, content?: string) => void | - | - |
| onFolderClick | Folder click event | (folderPath: string) => void | - | - |
| directoryTitle | Directory tree title, set to `false` to hide | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewTitle | File preview title | string \| (({ title, path, content }: { title: string; path: string[]; content: string }) => React.ReactNode) | - | - |
| directoryIcons | Custom icon configuration, set to `false` to hide icons | false \| Record<'directory' \| string, React.ReactNode \| (() => React.ReactNode)> | - | - |

### FolderTreeData

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Display name | string | - | - |
| path | File path | string | - | - |
| content | File content (optional) | string | - | - |
| children | Sub-items (valid only for folder type) | [FolderTreeData](#foldertreedata)[] | - | - |

### FileContentService

File content service interface, used for dynamically loading file content.

```typescript
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```
