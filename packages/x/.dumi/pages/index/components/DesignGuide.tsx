import { Button } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { useLocation, useNavigate } from 'dumi';
import React from 'react';
import useLocale from '../../../hooks/useLocale';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';
import Container from '../common/Container';
import { DESIGN_STAGE_COLOR } from '../common/CustomizationProvider';

const comma = '\u00A0,\u00A0\u00A0\u00A0';

const locales = {
  cn: {
    title: 'AI 界面解决方案',
    desc: '基于RICH，延续熟悉的 Ant Design 设计语言，全新 AGI 混合界面（Hybrid-UI）解决方案，完美融合 GUI 和自然会话交互。从唤醒到表达，从过程到反馈，合适的组件恰当的呈现在所有的人机互动过程中。',

    awaken: '唤醒',
    awaken_title: `轻松唤醒${comma}即刻吸引`,
    awaken_desc: '可以让首次接触的用户快速理解AI能做什么, 告知用户AI可实现的意图范围, 降低用户成本',
    awaken_action: '从唤醒开始',

    express: '表达',
    express_title: `简单表达${comma}随时反馈`,
    express_desc: '让用户知道如何快捷且正确的表达意图, 减少AI的不理解风险, 看清自己发送的内容',
    express_action: '从表达开始',

    confirm: '确认',
    confirm_title: `过程确认${comma}尽在掌握`,
    confirm_desc: '让用户知道该任务的AI执行运转情况, 缓解用户等待焦虑, 有掌控感',
    confirm_action: '从确认开始',

    feedback: '反馈',
    feedback_title: `结果反馈${comma}谁能不信`,
    feedback_desc: '让用户清晰看到并信任AI任务完成的情况, 并快速应用AI生成结果',
    feedback_action: '从反馈开始',
  },
  en: {
    title: 'AI Interface Solution',
    desc: 'Building on the RICH paradigm and Ant Design language, the AGI Hybrid-UI solution blends GUI with natural conversation, presenting optimal components at each stage of human-computer interaction.',

    awaken: 'Awaken',
    awaken_title: `Effortlessly Awaken${comma}Instantly Engage`,
    awaken_desc:
      'Helps new users quickly understand what AI can do, informs them of the AI’s capability range, and lowers entry barriers.',
    awaken_action: 'Start with Awaken',

    express: 'Express',
    express_title: `Simple Express${comma}Instant Feedback`,
    express_desc:
      'Guides users on how to express intentions effectively, reducing misunderstandings with AI and clarifying their input.',
    express_action: 'Start with Express',

    confirm: 'Confirm',
    confirm_title: `Process Confirm${comma}Fully in Control`,
    confirm_desc:
      'Keeps users informed of the AI’s task execution status, easing wait-time anxiety and providing a sense of control.',
    confirm_action: 'Start with Confirm',

    feedback: 'Feedback',
    feedback_title: `Result Feedback${comma}Built-in Trust`,
    feedback_desc:
      'Clearly displays AI task completion, fostering trust, and enabling quick application of AI-generated results.',
    feedback_action: 'Start with Feedback',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
    `,
    content: css`
      display: flex;
      justify-content: space-between;
      padding-top: ${token.pcContainerMargin}px;
    `,
    chain: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 540px;
    `,
    chain_item: css`
      display: flex;
      gap: ${token.paddingLG}px;
      color: #ffffff;
    `,
    chain_item_content: css`
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: ${token.paddingLG}px;
      overflow: hidden;
      
    `,
    chain_item_line: css`
      height: 300px;
      width: 4px;
      margin: 0 auto;
    `,
    chain_item_label: css`
      font-size: ${token.fontSizeHeading4}px;
      font-weight: bold;
      line-height: 40px;
    `,
    chain_item_title: css`
      font-size: ${token.fontSizeHeading1 + 10}px;
      line-height: 56px;
      font-weight: bold;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        font-size: ${token.fontSizeHeading2}px;
      }
    `,
    chain_item_desc: css`
      font-size: ${token.fontSizeHeading5}px;
      line-height: 32px;
      opacity: 0.65;
    `,
    chain_item_action: css`
      background: #ffffff1a;
      position: relative;
      border-radius: 40px;
      width: min-content;
      padding: ${token.paddingLG}px;
      overflow: hidden;
      font-size: ${token.fontSizeHeading5}px;
      font-weight: bold;
      opacity: 0.9;
      border: none !important;

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;

        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;

        padding: ${token.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `,

    chain_item_icon: css`
      width: 40px;
      height: 40px;
      position: relative;

      img {
        position: absolute;
      }
    `,
  };
});

const DesignGuide: React.FC = () => {
  const [locale] = useLocale(locales);
  const { styles } = useStyle();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*NBliSL6_YIsAAAAAAAAAAAAADgCCAQ/original',
      label: locale.awaken,
      title: locale.awaken_title,
      desc: locale.awaken_desc,
      action: locale.awaken_action,
      startColor: DESIGN_STAGE_COLOR.AWAKE.START,
      endColor: DESIGN_STAGE_COLOR.AWAKE.END,
      path: 'components/welcome',
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*3XXESYNxPNkAAAAAAAAAAAAADgCCAQ/original',
      label: locale.express,
      title: locale.express_title,
      desc: locale.express_desc,
      action: locale.express_action,
      startColor: DESIGN_STAGE_COLOR.EXPRESS.START,
      endColor: DESIGN_STAGE_COLOR.EXPRESS.END,
      path: 'components/attachments',
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pX3DR5MaxE8AAAAAAAAAAAAADgCCAQ/original',
      label: locale.confirm,
      title: locale.confirm_title,
      desc: locale.confirm_desc,
      action: locale.confirm_action,
      startColor: DESIGN_STAGE_COLOR.CONFIRM.START,
      endColor: DESIGN_STAGE_COLOR.CONFIRM.END,
      path: 'components/think',
    },
    {
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*jVNbRLytvWMAAAAAAAAAAAAADgCCAQ/original',
      label: locale.feedback,
      title: locale.feedback_title,
      desc: locale.feedback_desc,
      action: locale.feedback_action,
      startColor: DESIGN_STAGE_COLOR.FEEDBACK.START,
      endColor: DESIGN_STAGE_COLOR.FEEDBACK.END,
      path: 'components/actions',
    },
  ];

  return (
    <Container className={styles.container} title={locale.title} desc={locale.desc}>
      <div className={styles.content}>
        <div className={styles.chain}>
          {items.map((item, index) => {
            const titleParts = item.title.split(item.label);
            return (
              <div className={styles.chain_item} key={item.label}>
                <div>
                  <div className={classnames(styles.chain_item_icon)}>
                    <img alt="icon" src={item.icon} loading="lazy" />
                    <img
                      alt="icon"
                      src={item.icon}
                      loading="lazy"
                      style={{ filter: 'blur(18px)' }}
                    />
                  </div>
                  <div
                    className={styles.chain_item_line}
                    style={
                      index === items.length - 1
                        ? {}
                        : {
                            backgroundImage: `linear-gradient(180deg, ${item.startColor}00 0%, ${item.startColor} 25%, ${item.endColor} 75%, ${item.endColor}00 100%)`,
                          }
                    }
                  />
                </div>
                <div className={styles.chain_item_content}>
                  <div className={styles.chain_item_label}>
                    <span style={{ paddingInlineEnd: 10 }}>{index + 1}.</span>
                    {item.label}
                  </div>
                  <div className={styles.chain_item_title}>
                    <span>{titleParts[0]}</span>
                    <span
                      style={{
                        background: `linear-gradient(127deg, ${item.startColor} 23%, ${item.endColor} 100%)`,
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {item.label}
                    </span>
                    <span style={{ maxWidth: '100%', display: 'inline-block' }}>
                      {titleParts[1]}
                    </span>
                  </div>
                  <div className={styles.chain_item_desc}>{item.desc}</div>
                  <Button
                    className={styles.chain_item_action}
                    type="text"
                    size="large"
                    onClick={() =>
                      navigate(getLocalizedPathname(item.path, isZhCN(pathname), search))
                    }
                  >
                    {item.action}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default DesignGuide;
