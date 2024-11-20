---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 4
order: 3
title: 表达｜用户输入
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*59IVSLXDTdIAAAAAAAAAAAAADgCCAQ/fmt.webp)

可用于 AI 对话的开放式输入，<font style="color:rgba(0, 0, 0, 0.85);">当用户开始向 AI 传达自己的意图时，往往需要输入多种类型的内容。</font>

<font style="color:rgba(0, 0, 0, 0.85);"></font>

<h1 id="pFaII"><font style="color:rgba(0, 0, 0, 0.88);">设计目标</font></h1>

<font style="color:rgb(28, 31, 35);">当用户有明确诉求时，需借助不同形式的输入交互来向 AI 精准表达意图，以此提升 AI 对用户意图传达的理解程度，进而给出准确回应。【输入组件】在表达阶段发挥着重要作用，借助多种形式（如文字描述、图片伤处、语音输入等）的输入组件，为用户与 AI 的交互增添了更多可能性与灵活性，让用户能够以自然、便捷且正确地完成输入内容并发送。</font>

<font style="color:rgb(28, 31, 35);"></font>

<font style="color:rgb(28, 31, 35);"></font>

---

<h1 id="lGsQM">🙌文本输入</h1>
<font style="color:rgba(0, 0, 0, 0.88);">输入框为用户提供了编辑文本的控件，是给大模型提供信息最基础和常见的方式。</font>

<font style="color:rgba(0, 0, 0, 0.88);"></font>

<h2 id="Mbyl6"><font style="color:rgba(0, 0, 0, 0.88);">文本框（Input）</font></h2>
<font style="color:rgba(0, 0, 0, 0.88);"></font>

<font style="color:rgba(0, 0, 0, 0.88);">输入较少的字符总数，使用单行的输入形式。为提升数据录入效率，通常可以在输入框内增加暗提示以帮助提醒用户。</font>

> <font style="color:rgba(0, 0, 0, 0.65);">注：可以对一些文本（如数字和网址）运用特别的样式。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*os7CTZgHfZgAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="MCuaf"><font style="color:rgba(0, 0, 0, 0.88);">文本域（Textarea）</font></h2>
<font style="color:rgba(0, 0, 0, 0.88);"></font>

<font style="color:rgba(0, 0, 0, 0.88);">录入长篇幅的单一的文本使用多行的文本区域。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*FE3vSrLOW_UAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="ac2BR">停止生成操作</h2>
停止生成操作常见位于输入框附近，就近方便用户操作。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*gCKFSY3S1oUAAAAAAAAAAAAADgCCAQ/fmt.webp)

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Ba4tQ6IN6LcAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="Fyuza">🎙️ 语音输入</h1>
<h2 id="MkJ1Y">语音倾听过程</h2>
<font style="color:#585A5A;"></font>

<font style="color:#585A5A;">可以提供用户以语音的形式输入，转化为文字供用户确认。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BM6xRrVP9B4AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="noDZ5">语音初次开始</h2>
<font style="color:#585A5A;"></font>

<font style="color:#585A5A;">初次启动语音，一般会出现系统自带的提示开启，用户允许后开启语音功能，或禁止不允许开启。</font>

![授权语音输入](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*N1QbRL-nCdUAAAAAAAAAAAAADgCCAQ/fmt.webp)

![禁止使用语音输入](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eaLATo9gzwEAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="Yd800">语音异常</h2>

<font style="color:#585A5A;">语音输入中会有异常情况出现，需要及时且清楚告知用户，如超时提醒、因网络异常而中断等。</font>

![超时提醒](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*N4eTQokA5akAAAAAAAAAAAAADgCCAQ/fmt.webp)

![网络异常](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*JrsuTYuyy_UAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="aEAMb">📃 文件输入</h1>
文件上传是用户基于文件有意图的表达，从而让大模型基于上传文件来深入理解并回答

<h2 id="NzaTx"><font style="color:rgba(0, 0, 0, 0.88);">简单上传</font></h2>

<font style="color:#585A5A;">基础上传方式通常用于单个文件的上传，且在不需要预览效果的情况下使用。用户只需点击按钮，即可弹出文件选择框，从而选择需要上传的文件。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*E2IPT4lnwj8AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="XmQP6">拖拽上传</h2>

<font style="color:#585A5A;">用户可以将文件拖入特定区域，从而完成上传。这种方式简洁高效，无需繁琐的操作步骤，只需轻轻一拖，文件即可快速上传至指定位置。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tosqQ4NLfOMAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="ZDU9q">🎯️ 快捷命令</h1>

<font style="color:#585A5A;">在 AI 大模型产品中，提供常用意图的快捷命令，方便用户快速输入。快捷命令使用户能高效与 AI 交互，避免繁琐输入操作，提高工作效率与使用体验。</font>

![“/” 唤起快捷命令](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*NpaOSq__vi8AAAAAAAAAAAAADgCCAQ/fmt.webp)

![输入框上方固定快捷命令](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*znoMQZL88_EAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="qM6v1"></h2>

<h1 id="oXHfz">🧩 <font style="color:rgb(38, 38, 38);">槽位填词</font></h1>
<font style="color:#000a14;"></font>

<font style="color:#585A5A;">槽位填写通常是指用户触发特定命令后，会出现预先设定的输入模板，用户只需进行填写或者选择操作即可。槽位填写为用户提供了一种便捷输入方式，减少了用户的输入负担，提高了输入的准确性和效率。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bHm7Q5NFGRUAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="xGdan"></h2>
<h1 id="Vy1pz"><font style="color:rgb(38, 38, 38);">💬</font><font style="color:rgb(38, 38, 38);"> </font>引用输入</h1>

<font style="color:#585A5A;">基于 AI 回答或用户发送的内容，若进行再次提问，可提供引用输入方式，引用样式涵盖文本、图片、文档等。这样方式，能够让用户更加便捷引用相关信息，丰富提问内容和背景，有助于获得更精准、更有针对性的回答。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UU-SRa-vbhAAAAAAAAAAAAAADgCCAQ/fmt.webp)
