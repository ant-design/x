export interface SharedProps {
  isZhCN: boolean;
  isRTL: boolean;
  /**
   * @description is mobile device || inner window width < 768px
   */
  isMobile: boolean;
  /**
   * @description is pc device  && scrollY > 800px, header will be mini mode
   */
  isMini: boolean;
}
