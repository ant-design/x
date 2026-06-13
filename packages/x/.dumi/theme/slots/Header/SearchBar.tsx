import { SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';
import { useLocation } from 'dumi';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';
import * as React from 'react';

const useStyle = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    align-items: center;
    margin-inline-end: -10px;
  `,
  iconBtn: css`
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${token.borderRadiusLG}px;
    color: ${token.colorTextSecondary};
    font-size: 15px;
    flex-shrink: 0;
    transition:
      color 0.2s,
      background 0.2s,
      opacity 0.25s,
      width 0.3s;

    &:hover {
      color: ${token.colorText};
      background: rgba(255, 255, 255, 0.12);
    }
  `,
  iconBtnVisible: css`
    width: 32px;
    height: 32px;
    opacity: 1;
    pointer-events: auto;
  `,
  iconBtnHidden: css`
    display: none !important;
  `,
  searchWrapper: css`
    width: 0;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    flex-shrink: 0;
    transition:
      width 0.3s ease,
      opacity 0.3s ease;

    .dumi-default-search-shortcut {
      display: none;
    }

    .dumi-default-search-bar:not(:last-child) {
      margin-inline-end: 0;
    }

    .dumi-default-search-bar-input {
      width: 100%;
      height: 32px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: ${token.colorText};
      font-size: 13px;
      padding-inline-end: 12px;
      transition:
        background 0.2s,
        border-color 0.2s,
        box-shadow 0.2s;

      &::placeholder {
        color: ${token.colorTextTertiary};
      }

      &:focus {
        background: ${token.colorBgElevated};
        border-color: rgba(255, 255, 255, 0.45);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
      }
    }

    .dumi-default-search-bar-svg {
      fill: ${token.colorTextTertiary};
    }

    .dumi-default-search-popover {
      inset-inline-start: 0;
      inset-inline-end: auto;

      &::before {
        inset-inline-start: 92px;
        inset-inline-end: auto;
      }
    }
  `,
  searchWrapperExpanded: css`
    width: 200px !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
  `,
}));

export interface SearchBarProps {
  isMobile: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile }) => {
  const { styles } = useStyle();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const { pathname } = useLocation();

  React.useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  React.useEffect(() => {
    if (expanded && !isMobile) {
      requestAnimationFrame(() => {
        const input = wrapperRef.current?.querySelector('input');
        input?.focus();
      });
    }
  }, [expanded, isMobile]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleBlur = () => {
    timeoutRef.current = window.setTimeout(() => {
      if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
        setExpanded(false);
      }
    }, 150);
  };

  if (isMobile) return null;

  return (
    <>
      <div className={styles.container}>
        <button
          type="button"
          aria-label="Search"
          aria-hidden={expanded}
          className={clsx(styles.iconBtn, expanded ? styles.iconBtnHidden : styles.iconBtnVisible)}
          onClick={() => setExpanded(true)}
        >
          <SearchOutlined />
        </button>
        <div
          ref={wrapperRef}
          aria-hidden={!expanded}
          className={clsx(styles.searchWrapper, expanded && styles.searchWrapperExpanded)}
          onBlur={handleBlur}
        >
          <DumiSearchBar />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
