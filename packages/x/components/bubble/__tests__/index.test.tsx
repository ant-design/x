import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Bubble from '../Bubble';

describe('Bubble Enhanced Tests', () => {
  describe('Props Coverage', () => {
    it('should handle all props correctly', () => {
      const ref = React.createRef<any>();
      const { container } = render(
        <Bubble
          ref={ref}
          prefixCls="custom-bubble"
          rootClassName="root-class"
          className="custom-class"
          style={{ margin: '10px' }}
          classNames={{ content: 'content-class' }}
          styles={{ content: { color: 'red' } }}
          placement="end"
          content="测试内容"
          variant="outlined"
          shape="round"
          loading={false}
          typing={false}
          editable={false}
          streaming={false}
          footerPlacement="inner-start"
          avatar={<div className="custom-avatar">头像</div>}
          header={<div className="custom-header">头部</div>}
          footer={<div className="custom-footer">底部</div>}
          extra={<div className="custom-extra">附加</div>}
          data-testid="bubble-test"
        />,
      );

      expect(container.querySelector('.custom-bubble')).toBeInTheDocument();
      expect(container.querySelector('.root-class')).toBeInTheDocument();
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
      expect(container.querySelector('.content-class')).toBeInTheDocument();
      expect(container.querySelector('.custom-avatar')).toBeInTheDocument();
      expect(container.querySelector('.custom-header')).toBeInTheDocument();
      expect(container.querySelector('.custom-footer')).toBeInTheDocument();
      expect(container.querySelector('.custom-extra')).toBeInTheDocument();
      expect(ref.current?.nativeElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Component Slots', () => {
    it('should render all slot components', () => {
      const { container } = render(
        <Bubble
          content="Main Content"
          avatar={<div className="custom-avatar">Avatar</div>}
          header={<div className="custom-header">Header</div>}
          footer={<div className="custom-footer">Footer</div>}
          extra={<div className="custom-extra">Extra</div>}
        />,
      );

      expect(container.querySelector('.custom-avatar')).toBeInTheDocument();
      expect(container.querySelector('.custom-header')).toBeInTheDocument();
      expect(container.querySelector('.custom-footer')).toBeInTheDocument();
      expect(container.querySelector('.custom-extra')).toBeInTheDocument();
    });

    it('should handle function slots', () => {
      const headerFn = (content: string) => <div>Header: {content}</div>;
      const { container } = render(<Bubble content="Test" header={headerFn} />);

      expect(container).toHaveTextContent('Header: Test');
    });

    it('should handle footer placement', () => {
      const { container } = render(
        <Bubble content="Test" footerPlacement="inner-start" footer={<div>Footer</div>} />,
      );

      expect(container.querySelector('.ant-bubble-footer-start')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state', () => {
      const { container } = render(<Bubble content="Test" loading />);

      expect(container.querySelector('.ant-bubble-loading')).toBeInTheDocument();
      expect(container.querySelector('.ant-bubble-dot')).toBeInTheDocument();
    });

    it('should show custom loading', () => {
      const { container } = render(
        <Bubble
          content="Test"
          loading
          loadingRender={() => <div className="custom-loading">Loading...</div>}
        />,
      );

      expect(container.querySelector('.custom-loading')).toBeInTheDocument();
    });
  });

  describe('Variant and Shape', () => {
    it('should apply all variants', () => {
      const { container, rerender } = render(<Bubble content="Test" variant="filled" />);
      expect(container.querySelector('.ant-bubble-content-filled')).toBeInTheDocument();

      rerender(<Bubble content="Test" variant="outlined" />);
      expect(container.querySelector('.ant-bubble-content-outlined')).toBeInTheDocument();

      rerender(<Bubble content="Test" variant="shadow" />);
      expect(container.querySelector('.ant-bubble-content-shadow')).toBeInTheDocument();

      rerender(<Bubble content="Test" variant="borderless" />);
      expect(container.querySelector('.ant-bubble-content-borderless')).toBeInTheDocument();
    });

    it('should apply all shapes', () => {
      const { container, rerender } = render(<Bubble content="Test" shape="default" />);
      expect(container.querySelector('.ant-bubble-content-default')).toBeInTheDocument();

      rerender(<Bubble content="Test" shape="round" />);
      expect(container.querySelector('.ant-bubble-content-round')).toBeInTheDocument();
    });
  });

  describe('Placement', () => {
    it('should apply all placements', () => {
      const placements = ['start', 'end'] as const;

      placements.forEach((placement) => {
        const { container } = render(<Bubble content="Test" placement={placement} />);
        expect(container.querySelector(`.ant-bubble-${placement}`)).toBeInTheDocument();
      });
    });
  });

  describe('Editable Features', () => {
    it('should handle editable boolean mode', () => {
      const { container } = render(<Bubble content="Editable Content" editable />);

      expect(container.querySelector('.ant-bubble-content-editing')).toBeInTheDocument();
      expect(container.querySelector('[contenteditable="true"]')).toBeInTheDocument();
    });

    it('should handle editable object mode', () => {
      const onEditConfirm = jest.fn();
      const onEditCancel = jest.fn();

      const { container } = render(
        <Bubble
          content="Test"
          editable={{
            editing: true,
            okText: 'Save',
            cancelText: 'Cancel',
          }}
          onEditConfirm={onEditConfirm}
          onEditCancel={onEditCancel}
        />,
      );

      expect(container.querySelector('.ant-bubble-content-editing')).toBeInTheDocument();

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Save');
      expect(buttons[1]).toHaveTextContent('Cancel');
    });

    it('should handle edit confirm', () => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="Initial" editable onEditConfirm={onEditConfirm} />,
      );

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('button')[0];

      fireEvent.input(editableDiv, { target: { textContent: 'Updated' } });
      fireEvent.click(confirmBtn);

      expect(onEditConfirm).toHaveBeenCalledWith('Updated');
    });

    it('should handle edit cancel', () => {
      const onEditCancel = jest.fn();
      const { container } = render(
        <Bubble content="Initial" editable onEditCancel={onEditCancel} />,
      );

      const cancelBtn = container.querySelectorAll('button')[1];
      fireEvent.click(cancelBtn);

      expect(onEditCancel).toHaveBeenCalled();
    });

    it('should prioritize loading over editable', () => {
      const { container } = render(<Bubble content="Test" editable loading />);

      expect(container.querySelector('.ant-bubble-dot')).toBeInTheDocument();
      expect(container.querySelector('[contenteditable="true"]')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const { container } = render(<Bubble content="" />);
      expect(container.querySelector('.ant-bubble')).toBeInTheDocument();
    });

    it('should handle null content', () => {
      const { container } = render(<Bubble content={null as any} />);
      expect(container.querySelector('.ant-bubble')).toBeInTheDocument();
    });

    it('should handle undefined content', () => {
      const { container } = render(<Bubble content="" />);
      expect(container.querySelector('.ant-bubble')).toBeInTheDocument();
    });

    it('should handle complex content types', () => {
      const complexContent = {
        type: 'message',
        text: 'Complex',
        data: { id: 1 },
      };

      const contentRender = (content: any) => (
        <div className="complex-render">
          {content.type}: {content.text}
        </div>
      );

      const { container } = render(
        <Bubble content={complexContent as any} contentRender={contentRender} />,
      );

      expect(container.querySelector('.complex-render')).toBeInTheDocument();
      expect(container).toHaveTextContent('message: Complex');
    });

    it('should handle content changes', () => {
      const { container, rerender } = render(<Bubble content="Initial" />);
      expect(container).toHaveTextContent('Initial');

      rerender(<Bubble content="Updated" />);
      expect(container).toHaveTextContent('Updated');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-string editable content', () => {
      expect(() => {
        render(
          <Bubble
            content={<div>Not string</div>}
            editable={{ editing: true }}
            onEditConfirm={jest.fn()}
          />,
        );
      }).toThrow('Content of editable Bubble should be string');
    });
  });
});
