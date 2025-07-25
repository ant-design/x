## zh-CN

通过设置 `typing` 属性，开启打字效果。当 `content` 更新时，若之前的内容是更新内容的子集（前缀），则会继续输出。如果有差异，则会智能地从公共前缀的差异点继续输出，而不是重新开始。例如从 "今天天气真好" 更新为 "今天天气不好" 时，会从 "不" 字开始继续打字。

## en-US

Enable typing output by setting the `typing` prop. When `content` is updated, if the previous content is a subset (prefix) of the new content, it will continue to output. If there are differences, it will intelligently continue output from the common prefix difference point instead of restarting. For example, when updating from "The weather is nice today." to "The weather is bad today.", it will continue typing from "bad".
