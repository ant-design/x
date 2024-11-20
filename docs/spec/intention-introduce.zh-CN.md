---
group:
  title: ❤️ Intention 意图设计
  order: 0
order: 1
title: 介绍
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DY3oSowUuI8AAAAAAAAAAAAADgCCAQ/fmt.webp)

在简介篇中我们提到在蚂蚁内部 AI 产品实践中，经常冒出诸多的体验困惑，其中最关键的都聚焦在设计的「模糊前期」，比如：什么时候应该使用会话的方式？如何让 AI 理解用户的意图？等等。意图这一体验要素，在 AI 时代变得更加举足轻重，除了技术的努力，设计能在意图方面做些什么呢？

<h1 id="eaIbX">What 什么是意图设计</h1>

在<font style="color:rgb(0, 0, 0);">人工智能领域</font>，意图<font style="background-color:rgb(253, 253, 254);">通常被定义为</font><font style="color:rgb(0, 0, 0);">用户希望达成的目标</font><font style="background-color:rgb(253, 253, 254);">，如查询天气情况、办理银行业务、预约服务等。这些意图并不总是直接表达出来，而是隐含在用户的言行之中。</font>

<font style="background-color:rgb(253, 253, 254);">在不同的领域和维度，意图也有不同的分类，如按照用户意图清晰度可分成意图清晰与意图模糊；按照用户与系统的交互目的可分为咨询信息类与执行任务类。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*89KfQ7WummEAAAAAAAAAAAAADgCCAQ/fmt.webp)<font style="background-color:rgb(253, 253, 254);"></font>

<font style="background-color:rgb(253, 253, 254);"></font>

<h1 id="fOsSJ"><font style="color:rgb(36, 41, 47);">Why 为什么要做意图设计</font></h1>

用户的意图常常隐含在言行之中，人们倾向于以自然方式表达需求，而非直接说明意图。因此，准确识别这些隐含意图至关重要。<font style="background-color:rgb(253, 253, 254);">它能帮助 AI 更准确地回应用户需求，更高效完成用户目标。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lWARTZdjOzkAAAAAAAAAAAAADgCCAQ/fmt.webp)<font style="background-color:rgb(253, 253, 254);"></font>

换句话说用户目标的实现已从 GUI 时代的繁琐界面操作转变为 AGI 时代 AI 对复杂意图的理解。这大大降低了用户的学习成本，提升了产品体验。然而我们在蚂蚁内部的AI实践中发现，并非所有意图都适合会话式交互，有时简单点击在某些场景下比多轮对话更为高效。

<font style="background-color:rgb(253, 253, 254);">除了传统界面交互与会话式等交互界面范式的问题，通过调研我们还发现：大部分用户对于 AI 产品存在认知盲区，即</font>不清楚 AI 能帮我实现哪些意图<font style="background-color:rgb(253, 253, 254);">，以及往往</font>没有能力准确表达意图<font style="background-color:rgb(253, 253, 254);">，这在一定程度上阻碍了 AI 的有效应用。因此，如何提升用户对 AI 能力的认知，并设计出让用户能轻松准确表达意图的界面，成为当前 AI 设计领域待解决的重要课题。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*99HAQ6jTEOIAAAAAAAAAAAAADgCCAQ/fmt.webp)

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*LteUT7RaGMAAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="ehvPv"><font style="color:rgb(51, 51, 51);">How 如何应用意图设计</font></h1>

<font style="color:rgb(51, 51, 51);">那么该如何应用意图设计策略解决 AI 产品的体验设计问题呢？概览如下图，具体细节内容请查看子篇章。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ktkvR6RxoNIAAAAAAAAAAAAADgCCAQ/fmt.webp)
