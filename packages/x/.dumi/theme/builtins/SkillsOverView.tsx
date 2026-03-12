import SkillMeta from '@ant-design/x-skill/skill-meta.json';
import { Empty, Flex, List, Spin, Tag, Typography } from 'antd';
import { createStyles, css } from 'antd-style';
import React, { useMemo } from 'react';
import useLocale from '../../hooks/useLocale';

interface SkillItem {
  skill: string;
  name: string;
  version: string;
  desc: string;
  descZh: string;
  tags: string[];
}

interface SkillCategory {
  description: string;
  descriptionZh: string;
  skills: SkillItem[];
}

interface SkillMetaData {
  [category: string]: SkillCategory;
}

const LOCALE_TEXTS = {
  cn: {
    emptyText: '暂无技能数据',
    loadingText: '加载中...',
  },
  en: {
    emptyText: 'No skills data',
    loadingText: 'Loading...',
  },
};

const useStyle = createStyles(({ token }) => ({
  container: css`
    border-radius: ${token.borderRadiusLG}px;
    border: 1px solid ${token.colorSplit};
    margin-bottom: ${token.marginLG}px;
    background: ${token.colorBgContainer};
    
    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
    }
  `,
  item: css`
    cursor: pointer;
    transition: all ${token.motionDurationMid} ${token.motionEaseInOut};
    border-bottom: 1px solid ${token.colorSplit};
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: ${token.colorFillQuaternary};
    }
    
    &:focus-visible {
      outline: 2px solid ${token.colorPrimary};
      outline-offset: -2px;
    }
  `,
  itemMeta: css`
    padding: ${token.paddingSM}px ${token.padding}px;
    
    @media (max-width: 768px) {
      padding: ${token.paddingXS}px ${token.paddingSM}px;
    }
  `,
  categoryTag: css`
    margin-inline-end: ${token.marginXS}px;
  `,
  description: css`
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.marginXS}px;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: ${token.fontSizeSM}px;
    }
  `,
  tagsContainer: css`
    margin-top: ${token.marginXS}px;
    flex-wrap: wrap;
    gap: ${token.marginXS}px;
  `,
  categoryTitle: css`
    margin-bottom: ${token.margin}px !important;
    
    @media (max-width: 768px) {
      font-size: ${token.fontSizeHeading4}px !important;
      margin-bottom: ${token.marginSM}px !important;
    }
  `,
  categoryDescription: css`
    display: block;
    margin-bottom: ${token.marginLG}px;
    
    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
      font-size: ${token.fontSizeSM}px;
    }
  `,
}));

const SkillsOverView: React.FC = React.memo(() => {
  // ======================== locale =========================
  const [_, lang] = useLocale();
  const localeTexts = LOCALE_TEXTS[lang === 'cn' ? 'cn' : 'en'];

  // ======================== style =========================
  const { styles } = useStyle();

  // ======================== memoized data =========================
  const groupedSkills = useMemo(() => SkillMeta as SkillMetaData, []);

  const getSkillDescription = useMemo(
    () =>
      (item: SkillItem): string =>
        lang === 'cn' ? item.descZh : item.desc,
    [lang],
  );

  const getCategoryText = useMemo(
    () =>
      (category: string): string =>
        category,
    [],
  );

  const hasSkills = useMemo(() => Object.keys(groupedSkills).length > 0, [groupedSkills]);

  const renderSkillItem = useMemo(
    () => (item: SkillItem) => (
      <List.Item className={styles.item} tabIndex={0} role="listitem" aria-label={item.name}>
        <List.Item.Meta
          className={styles.itemMeta}
          title={<Typography.Text strong>{item.name}</Typography.Text>}
          description={
            <div>
              <Typography.Paragraph
                className={styles.description}
                ellipsis={{ rows: 2, expandable: false }}
              >
                {getSkillDescription(item)}
              </Typography.Paragraph>
              <Flex gap="small" className={styles.tagsContainer} role="list" aria-label="技能标签">
                {item.tags.map((tag) => (
                  <Tag key={tag} color="blue" role="listitem">
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </div>
          }
        />
      </List.Item>
    ),
    [styles, getSkillDescription],
  );

  const renderCategory = useMemo(
    () =>
      ([category, group]: [string, SkillCategory]) => (
        <section key={category} aria-labelledby={`category-${category}`}>
          <Typography.Title level={3} className={styles.categoryTitle} id={`category-${category}`}>
            {getCategoryText(category)}
          </Typography.Title>
          <Typography.Text type="secondary" className={styles.categoryDescription}>
            {lang === 'cn' ? group.descriptionZh : group.description}
          </Typography.Text>
          <List
            itemLayout="horizontal"
            className={styles.container}
            dataSource={group.skills}
            renderItem={renderSkillItem}
            locale={{
              emptyText: <Empty description={localeTexts.emptyText} />,
            }}
            aria-label={`${category} 技能列表`}
          />
        </section>
      ),
    [styles, getCategoryText, lang, renderSkillItem, localeTexts.emptyText],
  );

  if (!hasSkills) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 400 }}>
        <Empty description={localeTexts.emptyText} />
      </Flex>
    );
  }

  return (
    <div role="main" aria-label="技能概览">
      <Spin spinning={false} tip={localeTexts.loadingText}>
        {Object.entries(groupedSkills).map(renderCategory)}
      </Spin>
    </div>
  );
});

SkillsOverView.displayName = 'SkillsOverView';

export default SkillsOverView;
