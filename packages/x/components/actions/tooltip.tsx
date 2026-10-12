import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import React from 'react';

type ActionTooltip = string | TooltipProps | false | null | undefined;

function isTooltipProps(tooltip: ActionTooltip): tooltip is TooltipProps {
  return !!tooltip && typeof tooltip === 'object';
}

export function renderWithTooltip(
  node: React.ReactElement,
  tooltip: ActionTooltip,
  label?: string,
  disabled?: boolean,
) {
  if (disabled || tooltip === false) {
    return node;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { title: tooltip ?? label };

  if (tooltipProps.title == null && tooltipProps.overlay == null) {
    return node;
  }

  return <Tooltip {...tooltipProps}>{node}</Tooltip>;
}
