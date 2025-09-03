import React from 'react';
import Renderer from '../core/Renderer';

// Mock React components for testing
const MockComponent: React.FC<any> = (props) => {
  return React.createElement('div', props);
};

describe('Renderer', () => {
  describe('detectUnclosedTags', () => {
    it('should detect unclosed custom tags', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);
      
      // Test case 1: Unclosed tag
      const html1 = '<custom-tag>content';
      const result1 = detectUnclosedTags(html1);
      expect(result1.has('custom-tag')).toBe(true);
      
      // Test case 2: Closed tag
      const html2 = '<custom-tag>content</custom-tag>';
      const result2 = detectUnclosedTags(html2);
      expect(result2.has('custom-tag')).toBe(false);
      
      // Test case 3: Self-closing tag
      const html3 = '<custom-tag />';
      const result3 = detectUnclosedTags(html3);
      expect(result3.has('custom-tag')).toBe(false);
    });

    it('should handle multiple tags correctly', () => {
      const renderer = new Renderer({
        components: {
          'tag-a': MockComponent,
          'tag-b': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);
      
      // Test case: One closed, one unclosed
      const html = '<tag-a>content</tag-a><tag-b>content';
      const result = detectUnclosedTags(html);
      expect(result.has('tag-a')).toBe(false);
      expect(result.has('tag-b')).toBe(true);
    });

    it('should ignore non-custom tags', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);
      
      // Test case: Standard HTML tags should be ignored
      const html = '<div>content<p>paragraph';
      const result = detectUnclosedTags(html);
      expect(result.size).toBe(0);
    });
  });

  describe('processHtml', () => {
    it('should pass correct streamStatus to custom components', () => {
      const components = {
        'streaming-component': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case 1: Closed tag should have streamStatus="done"
      const html1 = '<streaming-component>content</streaming-component>';
      renderer.processHtml(html1);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'done',
        })
      );
      
      createElementSpy.mockClear();
      
      // Note: Testing unclosed tags is more complex because html-react-parser 
      // won't call the replace function for malformed HTML. In a real streaming 
      // scenario, the HTML would be processed incrementally as it's received.
      
      createElementSpy.mockRestore();
    });

    it('should handle self-closing tags correctly', () => {
      const components = {
        'self-closing': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case: Self-closing tag should have streamStatus="done"
      const html = '<self-closing />';
      renderer.processHtml(html);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'done',
        })
      );
      
      createElementSpy.mockRestore();
    });

    it('should correctly process mixed content with custom components', () => {
      const components = {
        'component-a': MockComponent,
        'component-b': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case: Mixed content with multiple custom components
      const html = '<p>Some text</p><component-a>Content A</component-a><component-b />More text';
      renderer.processHtml(html);
      
      // Verify that component-a was called with streamStatus="done" (closed tag)
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'done',
        })
      );
      
      createElementSpy.mockRestore();
    });

    it('should handle streaming scenario with unclosed tags', () => {
      const components = {
        'streaming-tag': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // In a real streaming scenario, we might process HTML incrementally
      // For this test, we simulate the state at different points in the stream
      
      // First, process incomplete HTML (unclosed tag)
      const html1 = '<streaming-tag>Partial content';
      renderer.processHtml(html1);
      
      // Then, process complete HTML (closed tag)
      createElementSpy.mockClear();
      const html2 = '<streaming-tag>Partial content</streaming-tag>';
      renderer.processHtml(html2);
      
      // Verify that the component was called with streamStatus="done" (closed tag)
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'done',
        })
      );
      
      createElementSpy.mockRestore();
    });

    it('should merge class and className attributes correctly', () => {
      const components = {
        'test-component': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case 1: Only class attribute
      const html1 = '<test-component class="custom-class">content</test-component>';
      renderer.processHtml(html1);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'custom-class',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 2: Only className attribute
      const html2 = '<test-component className="existing-class">content</test-component>';
      renderer.processHtml(html2);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 3: Both class and className attributes
      const html3 = '<test-component class="new-class" className="existing-class">content</test-component>';
      renderer.processHtml(html3);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class new-class',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 4: Multiple classes in class attribute
      const html4 = '<test-component class="class1 class2" className="existing-class">content</test-component>';
      renderer.processHtml(html4);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class class1 class2',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 5: Empty class attribute
      const html5 = '<test-component class="" className="existing-class">content</test-component>';
      renderer.processHtml(html5);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 6: Empty className attribute
      const html6 = '<test-component class="new-class" className="">content</test-component>';
      renderer.processHtml(html6);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'new-class',
        })
      );
      
      createElementSpy.mockClear();
      
      // Test case 7: Both empty
      const html7 = '<test-component class="" className="">content</test-component>';
      renderer.processHtml(html7);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: '',
        })
      );
      
      createElementSpy.mockRestore();
    });

    it('should handle class attribute merging with special characters', () => {
      const components = {
        'test-component': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case: Classes with special characters
      const html = '<test-component class="btn btn-primary" className="custom-component">content</test-component>';
      renderer.processHtml(html);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'custom-component btn btn-primary',
        })
      );
      
      createElementSpy.mockRestore();
    });

    it('should preserve other attributes while merging class and className', () => {
      const components = {
        'test-component': MockComponent,
      };
      
      const renderer = new Renderer({ components });
      
      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');
      
      // Test case: Multiple attributes including class and className
      const html = '<test-component id="test-id" class="custom-class" className="existing-class" data-test="value">content</test-component>';
      renderer.processHtml(html);
      
      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          id: 'test-id',
          className: 'existing-class custom-class',
          'data-test': 'value',
        })
      );
      
      createElementSpy.mockRestore();
    });
  });
});
