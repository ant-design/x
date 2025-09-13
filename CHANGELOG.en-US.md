---
order: 6
title: Changelog
toc: false
timeline: true
tag: vVERSION
---

`@ant-design/x` follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

- Weekly release: Patch version for routine bugfix.
- Monthly release: minor version at the end for new features.
- Major version release for breaking change and new features.

---

## 2.0.0-alpha.7

`2025-09-15`

### @ant-design/x

- Bubble
  - 💄 Fixed the default `white-space` style issue. [#1147](https://github.com/ant-design/x/pull/1147) by [@kimteayon](https://github.com/kimteayon).
  - 🐛 Fixed type export and documentation import errors. [#1160](https://github.com/ant-design/x/pull/1160) by [@kimteayon](https://github.com/kimteayon).
- 📖 Removed deprecated tools `useXAgent` and `useXChat`, and updated or replaced related documentation with `X SDK`. [#1148](https://github.com/ant-design/x/pull/1148) by [@kimteayon](https://github.com/kimteayon).
- 🐛 Fixed the missing `status` display issue in the FileCard component. [#1156](https://github.com/ant-design/x/pull/1156) by [@hy993658052](https://github.com/hy993658052).
- 🐛 Fixed the issue where the Sender component could not paste Excel cell text when file paste was enabled. [#1167](https://github.com/ant-design/x/pull/1167) by [@kimteayon](https://github.com/kimteayon).

### @ant-design/x-markdown

- 🆕 Added Mermaid plugin operation functionality. [#1135](https://github.com/ant-design/x/pull/1135) by [@Div627](https://github.com/Div627).
- 🐛 Fixed the streaming effect in XMarkdown. [#1135](https://github.com/ant-design/x/pull/1135) by [@Div627](https://github.com/Div627).
- 🆕 Added plugin internationalization and theme customization features, along with documentation upgrades. [#1135](https://github.com/ant-design/x/pull/1135) by [@kimteayon](https://github.com/kimteayon).
- 🆕 Added `openLinksInNewTab` configuration for XMarkdown links and adjusted theme colors. [#1164](https://github.com/ant-design/x/pull/1164) by [@Div627](https://github.com/Div627).
- 🐛 Fixed style conflicts between XMarkdown and documentation markdown. [#1161](https://github.com/ant-design/x/pull/1161) by [@kimteayon](https://github.com/kimteayon).

### @ant-design/x-sdk

- 🛠 Refactored the `isRequesting` property in the useXChat tool, upgrading it from a method to an observable variable. [#1168](https://github.com/ant-design/x/pull/1168) by [@hylin](https://github.com/hylin).
- 🆕 Added message `abort` status to the useXChat tool, fixed the `message` parameter error in the `requestFallback` callback method, and removed error state message filtering. [#1171](https://github.com/ant-design/x/pull/1171) by [@kimteayon](https://github.com/kimteayon).

### Others

- 📖 Optimized the official site to enhance user experience. [#1169](https://github.com/ant-design/x/pull/1169) by [@hylin](https://github.com/hylin).
- 📖 Updated documentation for introduction, model integration, agent integration, X SDK, and template code. [#1171](https://github.com/ant-design/x/pull/1171) by [@kimteayon](https://github.com/hylin).

## 2.0.0-alpha.6

`2025-08-28`

### @ant-design/x

- 🐛 Fixed the issue where pressing `Enter` in normal mode of the Sender component would trigger `Submit` when selecting a candidate word. [#1144](https://github.com/ant-design/x/pull/1144) by [@kimteayon](https://github.com/kimteayon).
- 🐛 Fixed the issue where the Sender component could not insert a new line when `submitType` was set to `shiftEnter` in slot mode. [#1143](https://github.com/ant-design/x/pull/1143) by [@kimteayon](https://github.com/kimteayon).
- 💄 Fixed the abnormal `margin` style when the `description` content of ThoughtChain.Item wrapped to a new line.
- 🛠 Refactored the template room using `@ant-design/x-sdk`. [#1139](https://github.com/ant-design/x/pull/1139) by [@hylin](https://github.com/hylin).
- 🐛 Fixed the persistent display of the `prefix` in the Bubble component. [#1137](https://github.com/ant-design/x/pull/1137) by [@anxLiang](https://github.com/anxLiang).
- 📖 Added documentation to explain the scrolling container issue in Bubble.List. [#1133](https://github.com/ant-design/x/pull/1133) by [@anxLiang](https://github.com/anxLiang).
- 🐛 Fixed the issue where uploaded images in the Attachment component were not displayed. [#1140](https://github.com/ant-design/x/pull/1140) by [@hy993658052](https://github.com/hy993658052).
- 🐛 Fixed semantic issues and size display problems in the FileCard component. [#1130](https://github.com/ant-design/x/pull/1130) by [@kimteayon](https://github.com/kimteayon).

### Others

- 📦 Upgraded the father configuration. [#1125](https://github.com/ant-design/x/pull/1125) by [@fireairforce](https://github.com/fireairforce).
- 📖 Optimized the official site to enhance user experience. [#1142](https://github.com/ant-design/x/pull/1142) by [@kimteayon](https://github.com/kimteayon).

## 2.0.0-alpha.5

`2025-08-20`

### @ant-design/x

- 🆕 Added subcomponent features for Actions, including Actions.Copy, Actions.Audio, and Actions.Item. [#1121](https://github.com/ant-design/x/pull/1121) by [@kimteayon](https://github.com/kimteayon).
- Bubble
  - 🆕 Added functionality to render content with line breaks and tabs when `string content` is provided. [#1127](https://github.com/ant-design/x/pull/1122) by [@anxLiang](https://github.com/anxLiang).
  - 🆕 Added semantic implementation. [#1116](https://github.com/ant-design/x/pull/1116) by [@kimteayon](https://github.com/kimteayon).
  - 🐛 Optimized styles and type issues. [#1108](https://github.com/ant-design/x/pull/1108) by [@anxLiang](https://github.com/anxLiang).
- 🆕 Added semantic configuration for the Sender component. [#1116](https://github.com/ant-design/x/pull/1116) by [@kimteayon](https://github.com/kimteayon).

### @ant-design/x-sdk

- 🛠 Overall optimization of X SDK. [#1114](https://github.com/ant-design/x/pull/1114) by [@hylin](https://github.com/hylin).

### Others

- 📖 Refactored the template room using X SDK. [#1139](https://github.com/ant-design/x/pull/1139) by [@hylin](https://github.com/hylin).
- 📖 Optimized the official site to enhance user experience. [#1124](https://github.com/ant-design/x/pull/1124) by [@kimteayon](https://github.com/kimteayon), [#1123](https://github.com/ant-design/x/pull/1123) by [@kimteayon](https://github.com/kimteayon).
- 🛠 Optimized the release process. [#1115](https://github.com/ant-design/x/pull/1115) by [@kimteayon](https://github.com/kimteayon).

## 2.0.0-alpha.3

`2025-08-14`

### @ant-design/x-markdown

- 🛠 Optimized version logic, configuration, and documentation. [#1112](https://github.com/ant-design/x/pull/1112) by [@Div627](https://github.com/Div627).

## 2.0.0-alpha.1

`2025-08-12`

### @ant-design/x

- 🛠 Refactored and upgraded the Bubble component. [#1100](https://github.com/ant-design/x/pull/1100) by [@anxLiang](https://github.com/anxLiang), [#1077](https://github.com/ant-design/x/pull/1077) by [@anxLiang](https://github.com/anxLiang).
- 🛠 Refactored and upgraded the Bubble.List component. [#1077](https://github.com/ant-design/x/pull/1077) by [@anxLiang](https://github.com/anxLiang).
- 🐛 Fixed the issue where the `readOnly` and `loading` logic of the Bubble component did not take effect. [#1101](https://github.com/ant-design/x/pull/1101) by [@kimteayon](https://github.com/kimteayon).

### Others

- 🛠 Optimized the release process. [#1098](https://github.com/ant-design/x/pull/1098) by [@kimteayon](https://github.com/kimteayon).
- 📖 Optimized the official site to enhance user experience. [#1087](https://github.com/ant-design/x/pull/1087) by [@kimteayon](https://github.com/kimteayon).

## 2.0.0-alpha.0

`2025-08-05`

### @ant-design/x

- 🔥 Added new component FileCard. [#1095](https://github.com/ant-design/x/pull/1094) by [@hy993658052](https://github.com/hy993658052).
- 🔥 Added new component Notification. [#973](https://github.com/ant-design/x/pull/973) by [@kimteayon](https://github.com/kimteayon).
- 🔥 Added new component Think. [#970](https://github.com/ant-design/x/pull/970), [#966](https://github.com/ant-design/x/pull/966), [#946](https://github.com/ant-design/x/pull/946) by [@hy993658052](https://github.com/hy993658052).
- 🛠 Refactored and upgraded the Attachments component.
- 🛠 Refactored and upgraded the Actions component. [#994](https://github.com/ant-design/x/pull/994) by [@vanndxh](https://github.com/vanndxh).
- 🛠 Refactored and upgraded the Conversations component. [#955](https://github.com/ant-design/x/pull/955), [#954](https://github.com/ant-design/x/pull/954), [#937](https://github.com/ant-design/x/pull/937) by [@kimteayon](https://github.com/kimteayon).
- 🛠 Refactored and upgraded the Sender component. [#1073](https://github.com/ant-design/x/pull/1073), [#962](https://github.com/ant-design/x/pull/962) by [@kimteayon](https://github.com/kimteayon), [@Chuck-Ray](https://github.com/Chuck-Ray).
- 🛠 Refactored and upgraded the ThoughtChain component. [#985](https://github.com/ant-design/x/pull/985) by [@kimteayon](https://github.com/kimteayon).
- 🆕 Added `Ref` functionality to all components. [#1081](https://github.com/ant-design/x/pull/1081) by [@kimteayon](https://github.com/kimteayon).
- 🆕 Integrated internationalization logic into the XProvider component. [#952](https://github.com/ant-design/x/pull/952) by [@kimteayon](https://github.com/kimteayon).

### @ant-design/x-markdown

- 🔥 Added new component XMarkdown. [#1060](https://github.com/ant-design/x/pull/1060), [#989](https://github.com/ant-design/x/pull/989) by [@Div627](https://github.com/Div627).
- 🔥 Added new plugin Latex. [#1060](https://github.com/ant-design/x/pull/1060), [#989](https://github.com/ant-design/x/pull/989) by [@Div627](https://github.com/Div627).
- 🔥 Added new plugin HighlightCode. [#1060](https://github.com/ant-design/x/pull/1060), [#989](https://github.com/ant-design/x/pull/989) by [@Div627](https://github.com/Div627).
- 🔥 Added new plugin Mermaid. [#1060](https://github.com/ant-design/x/pull/1060), [#989](https://github.com/ant-design/x/pull/989) by [@Div627](https://github.com/Div627).

### @ant-design/x-sdk

- 🔥 Added new tool useXChat. [#1098](https://github.com/ant-design/x/pull/1098) by [@hylin](https://github.com/hylin).
- 🔥 Added new tool useXConversations. [#1098](https://github.com/ant-design/x/pull/1098) by [@hylin](https://github.com/hylin).
- 🔥 Added new tool Chat Provider. [#1098](https://github.com/ant-design/x/pull/1098) by [@hylin](https://github.com/hylin).
- 🔥 Added new tool XRequest. [#1098](https://github.com/ant-design/x/pull/1098) by [@hylin](https://github.com/hylin).
- 🔥 Added new tool XStream. [#1098](https://github.com/ant-design/x/pull/1098) by [@hylin](https://github.com/hylin).

### Others

- 🛠 The overall framework has been upgraded to Monorepo.[#823](https://github.com/ant-design/x/pull/823) by [@elrrrrrrr](https://github.com/elrrrrrrr).
- 🛠 Upgraded all components to Ant Design V6. [#1012](https://github.com/ant-design/x/pull/1012) by [@kimteayon](https://github.com/kimteayon).
- 🛠 Upgraded and adjusted the release logic of Ant Design X. [#1098](https://github.com/ant-design/x/pull/1098), [#1009](https://github.com/ant-design/x/pull/1009) by [@kimteayon](https://github.com/kimteayon).
- 📖 Optimized the official site to enhance user experience. [#1083](https://github.com/ant-design/x/pull/1083) by [@kimteayon](https://github.com/kimteayon), [#1001](https://github.com/ant-design/x/pull/1001) by [@elrrrrrrr](https://github.com/elrrrrrrr).

## 1.6.1

`2025-09-12`

- 🐛 Fixed ThoughtChain component `title` could not display the collapsed title when passing `ReactNode`. [#1172](https://github.com/ant-design/x/pull/1172) by [@IsDyh01](https://github.com/IsDyh01).
- 🐛 Fixed Sender component `LoadingButton` would display two icons when the `icon ` property is passed. [#1145](https://github.com/ant-design/x/pull/1145) by [@IsDyh01](https://github.com/IsDyh01).
- 🐛 Fixed semantic loss in Sender component `content`. [#703](https://github.com/ant-design/x/pull/703) by [@HomyeeKing](https://github.com/HomyeeKing).
- 🐛 Removed redundant condition checks in Bubble component typing effect prefix logic. [#1091](https://github.com/ant-design/x/pull/1091) by [@AqingCyan](https://github.com/AqingCyan).
- 🐛 Fixed missing `updating` status in useXChat. [#833](https://github.com/ant-design/x/pull/833) by [@wzc520pyfm](https://github.com/wzc520pyfm).
- 🐛 Fixed the exception in Suggestion component when items is an empty array in `useActive`. [#824](https://github.com/ant-design/x/pull/824) by [@LengYXin](https://github.com/LengYXin).
- 📖 Improved the official site for better user experience. [#960](https://github.com/ant-design/x/pull/960) by [@wzc520pyfm](https://github.com/wzc520pyfm), [#1048](https://github.com/ant-design/x/pull/1048) by [@wzc520pyfm](https://github.com/wzc520pyfm), [#1118](https://github.com/ant-design/x/pull/1118) by [@afc163](https://github.com/afc163), [#1122](https://github.com/ant-design/x/pull/1122) by [@fireairforce](https://github.com/fireairforce), [#1120](https://github.com/ant-design/x/pull/1120) by [@IsDyh01](https://github.com/IsDyh01).

## 1.6.0

`2025-07-30`

- 🆕 Attachments component `FileCard` adds icon and type configuration. [#1006](https://github.com/ant-design/x/pull/1006) by [@kieranwv](https://github.com/kieranwv).
- 📖 Added documentation and demo for Toolbox Agent integration. [#1063](https://github.com/ant-design/x/pull/1063) by [iamkun-2](https://github.com/iamkun-2).
- 📖 Improved official site for better user experience. [#1054](https://github.com/ant-design/x/pull/1054) by [@hylin](https://github.com/hylin), [#1056](https://github.com/hylin).

## 1.5.0

`2025-07-16`

- 🆕 Added Bubble component support for `onScroll` event listener. [#1021](https://github.com/ant-design/x/pull/1021) by [@QdabuliuQ](https://github.com/QdabuliuQ).
- 🐛 Removed duplicate TypeScript type declaration in Bubble component. [#1032](https://github.com/ant-design/x/pull/1032) by [@wzc520pyfm](https://github.com/wzc520pyfm).
- 🐛 Fixed Conversations `onActiveChange` being triggered when a disabled `menu` item is clicked. [#1024](https://github.com/ant-design/x/pull/1024) by [@QdabuliuQ](https://github.com/QdabuliuQ).
- 🐛 Fixed semantic configuration for Attachments component `FileList`. [#1017](https://github.com/ant-design/x/pull/1017) by [@kimteayon](https://github.com/kimteayon).
- 🐛 Added html configuration for Actions component. [#995](https://github.com/ant-design/x/pull/995) by [@vanndxh](https://github.com/vanndxh).
- 🐛 Fixed Conversations label display issue and improved semantic configuration. [#898](https://github.com/ant-design/x/pull/898) by [@yuanliu147](https://github.com/yuanliu147).
- 📖 Improved official site for better user experience. [#940](https://github.com/ant-design/x/pull/940) by [@coding-ice](https://github.com/coding-ice), [#969](https://github.com/ant-design/x/pull/969) by [@afc163](https://github.com/afc163), [#968](https://github.com/ant-design/x/pull/968) by [@afc163](https://github.com/afc163), [#1019](https://github.com/ant-design/x/pull/1019) by [hylin](https://github.com/hylin),[#1036](https://github.com/ant-design/x/pull/1036) by [@kimteayon](https://github.com/kimteayon).

## 1.4.0

`2025-05-30`

- 🔥 New Component Actions.[#768](https://github.com/ant-design/x/pull/768) by [vanndxh](https://github.com/vanndxh)
- 🐛 Fix the issue where Bubble.List `footer` and `header` cannot retrieve keys.[#876](https://github.com/ant-design/x/pull/876) by [kimteayon](https://github.com/kimteayon)
- 🐛 Fix the issue of overflow and ellipsis of Conversations list titles.[#877](https://github.com/ant-design/x/pull/877) by [kimteayon](https://github.com/kimteayon)
- 📖 Enhance the official website to improve user experience.[#816](https://github.com/ant-design/x/pull/816) by [@Rain120](https://github.com/Rain120)、[#880](https://github.com/ant-design/x/pull/880) by [@kimteayon](https://github.com/kimteayon)

## 1.3.0

`2025-05-21`

- 📖 Add Conversation type export. [#258](https://github.com/ant-design/x/pull/258) by [@ONLY-yours](https://github.com/ONLY-yours)
- 💄 Fixed the issue that the Prompts scroll bar is always displayed. [#785](https://github.com/ant-design/x/pull/785) by [@kimteayon](https://github.com/kimteayon)
- 🐛 Fix Suggestion warning for using antd deprecated API `onDropdownVisibleChange`. [#827](https://github.com/ant-design/x/pull/827) by [@zombieJ](https://github.com/zombieJ)
- 🆕 Extend Bubble`content` to `footer` and `header` method implementation parameters, and add Demo implementation.[#683](https://github.com/ant-design/x/pull/683) by [@L-Hknu](https://github.com/L-Hknu) and [@kimteayon](https://github.com/kimteayon)
- 📖 Fixed the security issue of Api Key being exposed on the site.[#840](https://github.com/ant-design/x/pull/840) by [@kimteayon](https://github.com/kimteayon)
- 📖 Enhance the official website to improve user experience.[#783](https://github.com/ant-design/x/pull/783) by [@kimteayon](https://github.com/kimteayon) ,[#229](https://github.com/ant-design/x/pull/229) by [@afc163](https://github.com/afc163) ,[#835](https://github.com/ant-design/x/pull/835) by [@kimteayon](https://github.com/kimteayon) ,[#814](https://github.com/ant-design/x/pull/814) by [@wzc520pyfm](https://github.com/wzc520pyfm)

## 1.2.0

`2025-04-25`

- 🐛 Delete Conversations ellipsis tooltip , fix 'tooltip' display error issue.[#776](https://github.com/ant-design/x/pull/776) by [@afc163](https://github.com/afc163)
- 🐛 Fixed Attachments `image` card style.[#751](https://github.com/ant-design/x/pull/751) by [@wzc520pyfm](https://github.com/wzc520pyfm)
- 🐛 Fixed ThoughtChain controlled issue.[#752](https://github.com/ant-design/x/pull/752) by [@Youzi2233](https://github.com/Youzi2233)
- XRequest
  - 🆕 XRequestCallbacks adds an 'onStream' callback that allows for stream listening and abort operations.[#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
  - 🐛 Fixed the issue of XRequestOptions changes not taking effect and added a demo.[#736](https://github.com/ant-design/x/pull/736) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 Add an example of model integration. [#725](https://github.com/ant-design/x/pull/725) by [@kimteayon](https://github.com/kimteayon)
  - 📖 Inaccurate parameter naming in optimizing API methods.[#736](https://github.com/ant-design/x/pull/736) by [@kimteayon](https://github.com/kimteayon)
- useXAgent
  - 🆕 RequestFn adds an `onStream` callback that allows for stream listening and abort operations.[#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 RequestFn has added a `transformStream` transformation function for processing stream data.[#725](https://github.com/ant-design/x/pull/725) by [@kimteayon](https://github.com/kimteayon)
  - 🐛 Fix the issue of XAgentConfig Preset changes not taking effect and add an example.[#736](https://github.com/ant-design/x/pull/736) by [@kimteayon](https://github.com/kimteayon)
  - 🐛 Fix the issue of incorrect callback types for RequestFn `onSuccess` and update the corresponding demo. [#725](https://github.com/ant-design/x/pull/725) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 Add model access, Custom RequestParams,and customize `XRequestOptions`demos. [#725](https://github.com/ant-design/x/pull/725) by [@kimteayon](https://github.com/kimteayon) ,[#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
- useXChat
  - 🆕 XChatConfig adds input and output generic types.[#725](https://github.com/ant-design/x/pull/725) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 XChatConfig adds `transformMessage` transformation function,which can transform `messages` when updating data and update to `messages` at the same time. [#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 XChatConfig adds `transformStream`conversion function for processing stream data.[#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 XChatConfig adds `resolveAbortController`callback function, which can obtain the`AbortController` controller for controlling the stream state.[#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 Add model access examples and remove incorrect abort examples. [#711](https://github.com/ant-design/x/pull/711) by [@kimteayon](https://github.com/kimteayon)
- 🐛 Fixed the issue of Sender `header` `border-radius` style overflow.[#732](https://github.com/ant-design/x/pull/732) by [@Bao0630](https://github.com/Bao0630)
- 📖 Add a copilot style model room.[#657](https://github.com/ant-design/x/pull/657) by [@vanndxh](https://github.com/vanndxh)
- 📖 Refactoring the independent model room.[#753](https://github.com/ant-design/x/pull/753) by [@vanndxh](https://github.com/vanndxh)
- 📖 Enhance the official website to improve user experience.[#730](https://github.com/ant-design/x/pull/730) by [@afc163](https://github.com/afc163) ,[#758](https://github.com/ant-design/x/pull/758) by [@coding-ice](https://github.com/coding-ice) , [#761](https://github.com/ant-design/x/pull/761) by [@ONLY-yours](https://github.com/ONLY-yours)

## 1.1.1

`2025-04-14`

- Bubble.List
  - 💄 Refactor Bubble.List, reduce unnecessary refreshes during updates.[#479](https://github.com/ant-design/x/pull/479) by [@YumoImer](https://github.com/YumoImer)
  - 🐛 Fixed scrollbar styles issues of `Bubble.List` under dark theme.[#727](https://github.com/ant-design/x/pull/727) by [@kimteayon](https://github.com/kimteayon)
- Conversation
  - 🐛 Fixed style issues of `ul` and `li` in Conversation.[#726](https://github.com/ant-design/x/pull/726) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 Extended `getPopupContainer` for `menu`.[#698](https://github.com/ant-design/x/pull/698) by [@yuxuan-ctrl](https://github.com/yuxuan-ctrl)
- 🐛 Fixed ThoughtChain Collapse cannot unfold issue.[#720](https://github.com/ant-design/x/pull/720) by [@kimteayon](https://github.com/kimteayon)
- 🐛 Fixed Attachments image display style issue.[#708](https://github.com/ant-design/x/pull/708) by [@hy993658052](https://github.com/hy993658052)
- 💄 Refactor Sender,Control the 'disabled' attribute of custom `Actions`.[#666](https://github.com/ant-design/x/pull/666) by [@afc163](https://github.com/afc163)
- 📖 Enhance the official website to improve user experience.[#680](https://github.com/ant-design/x/pull/680) by [@wzc520pyfm](https://github.com/wzc520pyfm),[#699](https://github.com/ant-design/x/pull/699) by [@afc163](https://github.com/afc163),[#716](https://github.com/ant-design/x/pull/716) by [@afc163](https://github.com/afc163),[#686](https://github.com/ant-design/x/pull/686) by [@afc163](https://github.com/afc163),[#728](https://github.com/ant-design/x/pull/728) by [@kimteayon](https://github.com/kimteayon)

## 1.1.0

`2025-03-28`

- Sender
  - 🆕 Add `footer` to support custom footer content.[#654](https://github.com/ant-design/x/pull/654) by [@kimteayon](https://github.com/kimteayon)
  - 🆕 Extended `autoSize` to support custom content height.[#637](https://github.com/ant-design/x/pull/637) by [@Zhang-Wei-666](https://github.com/Zhang-Wei-666)
  - 📖 Add the declarations for `onFocus` and `onBlur` types.[#625](https://github.com/ant-design/x/pull/625) by [@aojunhao123](https://github.com/aojunhao123)
- 🆕 Extended Conversations `menu.trigger` to support custom menu trigger.[#630](https://github.com/ant-design/x/pull/630) by [@kimteayon](https://github.com/kimteayon)
- Attachments
  - 🆕 Extended `ImageProps` to support custom image configuration.[#613](https://github.com/ant-design/x/pull/613) by [@hy993658052 ](https://github.com/hy993658052)
  - 📖 Add Attachments `onRemove` API documentation[#608](https://github.com/ant-design/x/pull/608) by [@kimteayon](https://github.com/kimteayon)
- 📖 Extended `GPT-Vis` rendering chart example.[#603](https://github.com/ant-design/x/pull/603) by [@lvisei](https://github.com/lvisei)
- 📦 Improved Chat Design X `peerDependencies`.[#611](https://github.com/ant-design/x/pull/611) by [@pokerface9830 ](https://github.com/pokerface9830)
- 📖 Enhance the official website to improve user experience.[#626](https://github.com/ant-design/x/pull/626) by [@aojunhao123](https://github.com/aojunhao123),[#648](https://github.com/ant-design/x/pull/648) by [@kimteayon](https://github.com/kimteayon),[#659](https://github.com/ant-design/x/pull/659) by [@afc163](https://github.com/afc163),[#667](https://github.com/ant-design/x/pull/667) by [@jin19980928](https://github.com/jin19980928)

## 1.0.6

`2025-03-14`

- 🆕 Extended `Sender` file pasting can handle multiple files.[#505](https://github.com/ant-design/x/pull/500) by [@ztkuaikuai](https://github.com/ztkuaikuai)
- 🆕 Extended `BubbleList` role definition function.[#485](https://github.com/ant-design/x/pull/500) by [@chenluda](https://github.com/chenluda)
- 🐛 Fixed `Attachments` multi file horizontal scrollbar display.[#556](https://github.com/ant-design/x/pull/556) by [@onefeng123 ](https://github.com/onefeng123)
- 🐛 Fixed `Attachments` onRemove non effective issue.[#555](https://github.com/ant-design/x/pull/555) by [@edison-tianhe ](https://github.com/edison-tianhe)
- 🐛 Fixed `Sender` the issue of actions lacking `SpeechButton`.[#549](https://github.com/ant-design/x/pull/549) by [@zombieJ ](https://github.com/zombieJ)
- 🐛 Fixed `Attachments`the issue of file initialization display.[#524](https://github.com/ant-design/x/pull/524) by [@ztkuaikuai ](https://github.com/ztkuaikuai)
- 🐛 Fixed `Conversations`scroll bar issue.[#485](https://github.com/ant-design/x/pull/485) by [@LofiSu](https://github.com/LofiSu)
- 📖 Improved`Bubble` `typing` reduces unnecessary rendering.[#477](https://github.com/ant-design/x/pull/477) by [@kxcy001123](https://github.com/kxcy001123)
- 📦 Improved Chat Design X construct [#578](https://github.com/ant-design/x/pull/578),[#584](https://github.com/ant-design/x/pull/584) by [@kimteayon](https://github.com/kimteayon), [#578](https://github.com/ant-design/x/pull/578) by [@kimteayon](https://github.com/kimteayon),[#587](https://github.com/ant-design/x/pull/587) by [@afc163](https://github.com/afc163)
- 📖 Enhance the official website to improve user experience.[#484](https://github.com/ant-design/x/pull/484) by [@ztkuaikuai](https://github.com/ztkuaikuai), [#495](https://github.com/ant-design/x/pull/495) by [@ztkuaikuai](https://github.com/ztkuaikuai), [#522](https://github.com/ant-design/x/pull/522) by [@liangchaofei](https://github.com/liangchaofei),[#537](https://github.com/ant-design/x/pull/537) by [@wzc520pyfm](https://github.com/wzc520pyfm),[#553](https://github.com/ant-design/x/pull/553) by [@PeachScript](https://github.com/PeachScript), [#578](https://github.com/ant-design/x/pull/578) by [@kimteayon](https://github.com/kimteayon), [#585](https://github.com/ant-design/x/pull/585) by [@MaricoHan](https://github.com/MaricoHan)

## 1.0.5

`2025-01-13`

- 🐛 Fix `Attachment` remove icon style. [#460](https://github.com/ant-design/x/pull/460) by [@Rain120](https://github.com/Rain120)
- 🛠 Refactor `BubbleProps` to support `ContentType` type argument. [#403](https://github.com/ant-design/x/pull/403) by [@YumoImer](https://github.com/YumoImer)
- 🛠 Dev and site support React 19. [#432](https://github.com/ant-design/x/pull/432) by [@YumoImer](https://github.com/YumoImer)
- 📖 Enhance the official website to improve user experience. [#456](https://github.com/ant-design/x/pull/456), [#446](https://github.com/ant-design/x/pull/446), [#448](https://github.com/ant-design/x/pull/448), [#444](https://github.com/ant-design/x/pull/444), [#414](https://github.com/ant-design/x/pull/414), [#406](https://github.com/ant-design/x/pull/406), [#404](https://github.com/ant-design/x/pull/404) by [@wzc520pyfm](https://github.com/wzc520pyfm), [@YumoImer](https://github.com/YumoImer), [@Rain120](https://github.com/Rain120), [@afc163](https://github.com/afc163)

## 1.0.4

`2024-12-25`

- 🆕 Extended `XStream` support for the cancel feature. [#319](https://github.com/ant-design/x/pull/319) by [@ppbl](https://github.com/ppbl)
- 🆕 Extended `Bubble` support for the `typing.suffix` feature. [#316](https://github.com/ant-design/x/pull/316) by [@BQXBQX](https://github.com/BQXBQX)
- 🆕 Extended `Sender` component's `onChange` parameter to include the `event` object. [#362](https://github.com/ant-design/x/pull/362) by [@defaultjacky](https://github.com/defaultjacky)
- 🆕 Enhanced the `Sender` component's `ref` to support focus control methods like `focus` and `blur`. [#397](https://github.com/ant-design/x/pull/397) by [@YumoImer](https://github.com/YumoImer)
- 🐛 Fixed styling issues in `ThoughtChain` when `cssVar` is not applied. [#373](https://github.com/ant-design/x/pull/373) by [@YumoImer](https://github.com/YumoImer)
- 📖 Added `Petercat` assistant feature. [#375](https://github.com/ant-design/x/pull/375) by [@xingwanying](https://github.com/xingwanying)
- 📖 Improved the official website for a better user experience. [#389](https://github.com/ant-design/x/pull/389), [#377](https://github.com/ant-design/x/pull/377), [#364](https://github.com/ant-design/x/pull/364), [#368](https://github.com/ant-design/x/pull/368) by [@afc163](https://github.com/afc163), [@YumoImer](https://github.com/YumoImer)

## 1.0.3

`2024-12-16`

- 💄 Refactor the styles when `placement: 'end'` is set for `Bubble`. [#314](https://github.com/ant-design/x/pull/314) by [@YumoImer](https://github.com/YumoImer)
- 🐛 Fix occasional failure to trigger auto-scrolling when `autoScroll` is set in `Bubble.List`. [#336](https://github.com/ant-design/x/pull/336) by [@anzhou99Ru](https://github.com/anzhou99Ru)
- 📖 Enhance the official website to improve user experience. [#343](https://github.com/ant-design/x/pull/343), [#334](https://github.com/ant-design/x/pull/334), [#315](https://github.com/ant-design/x/pull/315), [#331](https://github.com/ant-design/x/pull/331) by [@afc163](https://github.com/afc163), [@YumoImer](https://github.com/YumoImer), [@Wxh16144](https://github.com/Wxh16144)
- 🛠 Fix errors encountered when running `pnpm lint`. [#313](https://github.com/ant-design/x/pull/313) by [@BQXBQX](https://github.com/BQXBQX)

## 1.0.2

`2024-12-04`

- 🛠 Enhanced `XRequest` to support parsing custom protocols. [#293](https://github.com/ant-design/x/pull/293) by [@YumoImer](https://github.com/YumoImer)
- 🐛 Fixed an issue where the preview buttons for `Attachment` did not toggle visibility properly. [#295](https://github.com/ant-design/x/pull/295) by [@anzhou99](https://github.com/anzhou99)
- 🐛 Fixed a bug in `useXChat` where the same message triggered `onUpdate` multiple times. [#298](https://github.com/ant-design/x/pull/298) by [@YumoImer](https://github.com/YumoImer)
- 📖 Added documentation for using `Bubble` with `GPT-Vis`. [#288](https://github.com/ant-design/x/pull/288) by [@lvisei](https://github.com/lvisei)
- 📦 Updated browser target configurations to reduce bundle size. [#282](https://github.com/ant-design/x/pull/282) by [@afc163](https://github.com/afc163)
- 🛠 Fixed errors when running `pnpm run prestart`. [#287](https://github.com/ant-design/x/pull/287) by [@long36708](https://github.com/long36708)

## 1.0.1

`2024-11-29`

- 🛠 Optimized TS types for `useXAgent` and `XStream`. [#272](https://github.com/ant-design/x/pull/272) by [@YumoImer](https://github.com/YumoImer)
- 🛠 Made the `agent` parameter optional to support data management functionality using only `useXChat`. [#271](https://github.com/ant-design/x/pull/271) by [@YumoImer](https://github.com/YumoImer)
- 💄 Adjusted `Conversations` style based on RICH design specification. [#242](https://github.com/ant-design/x/pull/242) by [@YumoImer](https://github.com/YumoImer)
- 🛠 Fixed ghost dependency issue that prevented the project from starting when using `pnpm`. [#223](https://github.com/ant-design/x/pull/223) by [@YumoImer](https://github.com/YumoImer)
- 🌈 Demonstrated the attachment upload functionality in the standalone template. [#250](https://github.com/ant-design/x/pull/250), [#265](https://github.com/ant-design/x/pull/265) by [@kelvinelove](https://github.com/kelvinelove)
- 📖 Fixed missing contributor information. [#212](https://github.com/ant-design/x/pull/212) by [@afc163](https://github.com/afc163)
- 📖 Optimized official site to enhance user experience. [#277](https://github.com/ant-design/x/pull/277), [#264](https://github.com/ant-design/x/pull/264), [#263](https://github.com/ant-design/x/pull/263), [#262](https://github.com/ant-design/x/pull/262), [#261](https://github.com/ant-design/x/pull/261), [#241](https://github.com/ant-design/x/pull/241), [#246](https://github.com/ant-design/x/pull/246), [#210](https://github.com/ant-design/x/pull/210), [#211](https://github.com/ant-design/x/pull/211) by [@YumoImer](https://github.com/YumoImer), [@afc163](https://github.com/afc163), [@Rain-1214](https://github.com/Rain-1214), [@kelvinelove](https://github.com/kelvinelove) and [@tabzzz1](https://github.com/tabzzz1)
- 📦 Updated browser targets to reduce bundle size. [#234](https://github.com/ant-design/x/pull/234) by [@afc163](https://github.com/afc163)

## 1.0.0

`2024-11-22`

🎉 We are thrilled to announce the official release of [Ant Design X](https://x.ant.design) 1.0.0!

- 🌈 **Derived from Best Practices of Enterprise-Level AI Products**: Built on the RICH interaction paradigm, delivering an exceptional AI interaction experience.
- 🧩 **Flexible and Diverse Atomic Components**: Covers most AI dialogue scenarios, empowering you to quickly build personalized AI interaction interfaces.
- ⚡ **Out-of-the-Box Model Integration**: Easily connect with inference services compatible with OpenAI standards.
- 🔄 **Efficient Management of Conversation Data Flows**: Provides powerful tools for managing data flows, enhancing development efficiency.
- 📦 **Rich Template Support**: Offers multiple templates for quickly starting LUI application development.
- 🛡 **Complete TypeScript Support**: Developed with TypeScript, ensuring robust type coverage to improve the development experience and reliability.
- 🎨 **Advanced Theme Customization**: Supports fine-grained style adjustments to meet diverse use cases and personalization needs.

![demos](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## 1.0.0-alpha.12

`2024-11-07`

- 🔥 Sender support `onPasteFile` and Attachments support `ref.upload` for manual uploading, by [@zombieJ](https://github.com/zombieJ) [#184](https://github.com/ant-design/x/pull/184)
- 🔥 Sender `allowSpeech` support using third-part SDK, by [@zombieJ](https://github.com/zombieJ) [#187](https://github.com/ant-design/x/pull/187)

## 1.0.0-alpha.11

`2024-11-06`

- 🔥 New Component Welcome, by [@zombieJ](https://github.com/zombieJ) [#179](https://github.com/ant-design/x/pull/179)
- 🔥 Prompts support nest structure, by [@zombieJ](https://github.com/zombieJ) [#181](https://github.com/ant-design/x/pull/181)
- 🔥 Attachments support Attachments.FileCard component, by [@zombieJ](https://github.com/zombieJ) [#182](https://github.com/ant-design/x/pull/182)

## 1.0.0-alpha.10

`2024-11-04`

- 🐛 Fix Attachments drop upload could not trigger the upload request, by [@YumoImer](https://github.com/YumoImer) [#178](https://github.com/ant-design/x/pull/178)

## 1.0.0-alpha.9

`2024-11-01`

- 🐛 Fix the logic in the Attachments, by [@YumoImer](https://github.com/YumoImer) [#174](https://github.com/ant-design/x/pull/174)
- 🐛 Fix Sender.Header can not focus, by [@zombieJ](https://github.com/zombieJ) [#175](https://github.com/ant-design/x/pull/175)

## 1.0.0-alpha.7

`2024-10-31`

- 🐛 Fix Attachments first upload could not trigger the upload request, by [@YumoImer](https://github.com/YumoImer) [#172](https://github.com/ant-design/x/pull/172)

## 1.0.0-alpha.6

`2024-10-25`

- 🔥 New Component `Attachments`, by [@zombieJ](https://github.com/zombieJ) [#168](https://github.com/ant-design/x/pull/168)
- 🔥 New Tools `XStream`, by [@YumoImer](https://github.com/YumoImer) [#138](https://github.com/ant-design/x/pull/138)
- 🔥 New Tools `XRequest`, by [@YumoImer](https://github.com/YumoImer) [#138](https://github.com/ant-design/x/pull/138)

## 1.0.0-alpha.5

`2024-10-23`

- 🆕 Bubble support `loadingRender` to customize loading content. [#165](https://github.com/ant-design/x/pull/165)
- 🐛 Fix components missing style when without XProvider. [#163](https://github.com/ant-design/x/pull/163)

## 1.0.0-alpha.4

`2024-10-17`

- Sender
  - 🆕 Sender support `speech`, by [@zombieJ](https://github.com/zombieJ) [#154](https://github.com/ant-design/x/pull/154)
  - 🆕 Sender support Sender.Header, by [@zombieJ](https://github.com/zombieJ) [#156](https://github.com/ant-design/x/pull/156)
  - 🆕 Sender style adjust, by [@zombieJ](https://github.com/zombieJ) [#151](https://github.com/ant-design/x/pull/151)
- 📖 update group config for Components category, by [@YumoImer](https://github.com/YumoImer) [#155](https://github.com/ant-design/x/pull/155)
- 📖 tweak demo toggle button style , by [@afc163](https://github.com/afc163) [#146](https://github.com/ant-design/x/pull/146)
- 📖 Update README.md, by [@afc163](https://github.com/afc163) [#142](https://github.com/ant-design/x/pull/142)

## 1.0.0-alpha.3

`2024-10-10`

- Bubble
  - 🆕 Bubble support `variant` props, by [@zombieJ](https://github.com/zombieJ) [#140](https://github.com/ant-design/x/pull/140)
  - 🆕 Bubble support `shape` props, by [@zombieJ](https://github.com/zombieJ) [#144](https://github.com/ant-design/x/pull/144)
  - 🆕 Bubble support `header` and `footer` props, by [@zombieJ](https://github.com/zombieJ) [#147](https://github.com/ant-design/x/pull/147)

## 1.0.0-alpha.2

`2024-09-27`

- 🔥 New Component `XProvider` for global configuration, by [@YumoImer](https://github.com/YumoImer) [#127](https://github.com/ant-design/x/pull/127)
- 🔥 New Runtime Hook `useXChat` for data management, by [@zombieJ](https://github.com/zombieJ) [#125](https://github.com/ant-design/x/pull/125)
- 🔥 New Runtime Hook `useXAgent` for model scheduling, by [@zombieJ](https://github.com/zombieJ) [#125](https://github.com/ant-design/x/pull/125)
- 🆕 `ThoughtChain` component now support the `size` property, by [@YumoImer](https://github.com/YumoImer) [#123](https://github.com/ant-design/x/pull/123)
- 🛠 Updated `.lintstagedrc.json`, by [@afc163](https://github.com/afc163) [#128](https://github.com/ant-design/x/pull/128)
- 🛠 Updated dependency `cheerio` to `v1.0.0`, by [@afc163](https://github.com/afc163) [#121](https://github.com/ant-design/x/pull/121)

## 1.0.0-alpha.1

`2024-09-10`

### 🚀 Features

- 🔥 feat: Suggestion 建议组件 by [@ONLY-yours](https://github.com/ONLY-yours) in [#87](https://github.com/ant-design/x/pull/87)

### 🐛 Fixes

- 🐛 fix: change the Sender restProps type by [@ONLY-yours](https://github.com/ONLY-yours) in [#101](https://github.com/ant-design/x/pull/101)
- 🛠 fix: bun install by [@afc163](https://github.com/afc163) in [#111](https://github.com/ant-design/x/pull/111)

### 🛠 Refactors

- 🛠 chore: add layer support by [@zombieJ](https://github.com/zombieJ) in [#118](https://github.com/ant-design/x/pull/118)
- 🛠 chore: speed up workflows by [@afc163](https://github.com/afc163) in [#119](https://github.com/ant-design/x/pull/119)
- 🛠 chore(deps-dev): bump the dev-dependencies group with 5 updates by [@dependabot](https://github.com/dependabot) in [#120](https://github.com/ant-design/x/pull/120)
- 🛠 chore: clean up README.md by [@afc163](https://github.com/afc163) in [#102](https://github.com/ant-design/x/pull/102)
- 🛠 chore: add issue templates by [@afc163](https://github.com/afc163) in [#103](https://github.com/ant-design/x/pull/103)
- 🛠 chore: add bun.lockb by [@afc163](https://github.com/afc163) in [#108](https://github.com/ant-design/x/pull/108)
- 🛠 chore: Delete index-style-only.js by [@afc163](https://github.com/afc163) in [#106](https://github.com/ant-design/x/pull/106)
- 🛠 chore: Update main.yml by [@afc163](https://github.com/afc163) in [#105](https://github.com/ant-design/x/pull/105)
- 🛠 chore: Update package.json by [@afc163](https://github.com/afc163) in [#110](https://github.com/ant-design/x/pull/110)

### 📖 Documentation

- 📖 docs: Update README.md by [@afc163](https://github.com/afc163) in [#104](https://github.com/ant-design/x/pull/104)
- 📖 docs: Update codecov badge by [@afc163](https://github.com/afc163) in [#112](https://github.com/ant-design/x/pull/112)

## 1.0.0-alpha.0

`2024-09-05`

- 🔥 New Component Bubble. [#19](https://github.com/ant-design/x/pull/19) [@li-jia-nan](https://github.com/li-jia-nan)
  - 🔥 Bubble support direction [#52](https://github.com/ant-design/x/pull/52) [@li-jia-nan](https://github.com/li-jia-nan)
- 🔥 New Component Bubble.List. [#57](https://github.com/ant-design/x/pull/57) [@zombieJ](https://github.com/zombieJ)
- 🔥 New Component Conversations. [#48](https://github.com/ant-design/x/pull/48) [@YumoImer](https://github.com/YumoImer)
- 🔥 New Component Prompts. [#55](https://github.com/ant-design/x/pull/55) [@YumoImer](https://github.com/YumoImer)
- 🔥 New Component Sender. [#46](https://github.com/ant-design/x/pull/46) [@ONLY-yours](https://github.com/ONLY-yours)
- 🔥 New Component ThoughtChain. [#86](https://github.com/ant-design/x/pull/86) [@YumoImer](https://github.com/YumoImer)
- 📦 Use `father` to build. [#84](https://github.com/ant-design/x/pull/84) [@zombieJ](https://github.com/zombieJ)
- 🛠 Fix ThemeContext instances being inconsistent when using `antd` es or lib package. [#88](https://github.com/ant-design/x/pull/88) [@YumoImer](https://github.com/YumoImer)
- 🛠 Refactor: API Naming Conventions [#73](https://github.com/ant-design/x/pull/73) [@zombieJ](https://github.com/zombieJ)
- 🛠 MISC: CI, Github Actions, Publish
  - 🛠 [#59](https://github.com/ant-design/x/pull/59) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#62](https://github.com/ant-design/x/pull/62) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#71](https://github.com/ant-design/x/pull/71) [@ONLY-yours](https://github.com/ONLY-yours)
  - 🛠 [#72](https://github.com/ant-design/x/pull/72) [@YumoImer](https://github.com/YumoImer)
  - 🛠 [#98](https://github.com/ant-design/x/pull/98) [@YumoImer](https://github.com/YumoImer)
- 📖 Update README.md
  - 📖 [#81](https://github.com/ant-design/x/pull/81) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#82](https://github.com/ant-design/x/pull/82) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#61](https://github.com/ant-design/x/pull/61) [@afc163](https://github.com/afc163)

## 0.0.0-alpha.0

`2024-05-10`

- MISC: Project initialization.
