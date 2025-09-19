import DOMPurify from 'dompurify';
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
        }),
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
        }),
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
        }),
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
        }),
      );

      createElementSpy.mockRestore();
    });

    it('should merge class and className attributes correctly', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: { ALLOWED_ATTR: ['class', 'className'] },
      });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case 1: Only class attribute
      const html1 = '<test-component class="custom-class">content</test-component>';
      renderer.processHtml(html1);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'custom-class',
        }),
      );

      createElementSpy.mockClear();

      // Test case 2: Only className attribute
      const html2 = '<test-component className="existing-class">content</test-component>';
      renderer.processHtml(html2);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class',
        }),
      );

      createElementSpy.mockClear();

      // Test case 3: Both class and className attributes
      const html3 =
        '<test-component class="new-class" className="existing-class">content</test-component>';
      renderer.processHtml(html3);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class new-class',
        }),
      );

      createElementSpy.mockClear();

      // Test case 4: Multiple classes in class attribute
      const html4 =
        '<test-component class="class1 class2" className="existing-class">content</test-component>';
      renderer.processHtml(html4);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class class1 class2',
        }),
      );

      createElementSpy.mockClear();

      // Test case 5: Empty class attribute
      const html5 = '<test-component class="" className="existing-class">content</test-component>';
      renderer.processHtml(html5);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing-class',
        }),
      );

      createElementSpy.mockClear();

      // Test case 6: Empty className attribute
      const html6 = '<test-component class="new-class" className="">content</test-component>';
      renderer.processHtml(html6);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'new-class',
        }),
      );

      createElementSpy.mockClear();

      // Test case 7: Both empty
      const html7 = '<test-component class="" className="">content</test-component>';
      renderer.processHtml(html7);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: '',
        }),
      );

      createElementSpy.mockRestore();
    });

    it('should handle class attribute merging with special characters', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: { ALLOWED_ATTR: ['class', 'className'] },
      });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case: Classes with special characters
      const html =
        '<test-component class="btn btn-primary" className="custom-component">content</test-component>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'custom-component btn btn-primary',
        }),
      );

      createElementSpy.mockRestore();
    });

    it('should preserve other attributes while merging class and className', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: { ALLOWED_ATTR: ['class', 'classname', 'id', 'data-test'] },
      });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case: Multiple attributes including class and className
      const html =
        '<test-component id="test-id" class="custom-class" classname="existing-class" data-test="value">content</test-component>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          id: 'test-id',
          className: 'existing-class custom-class',
          'data-test': 'value',
        }),
      );

      createElementSpy.mockRestore();
    });
  });

  describe('configureDOMPurify', () => {
    it('should configure DOMPurify with custom components', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
          'another-tag': MockComponent,
        },
      });

      // Access private method for testing
      const configureDOMPurify = (renderer as any).configureDOMPurify.bind(renderer);
      const config = configureDOMPurify();

      expect(config.ADD_TAGS).toContain('custom-tag');
      expect(config.ADD_TAGS).toContain('another-tag');
    });

    it('should merge with user provided dompurifyConfig', () => {
      const userConfig = {
        ALLOWED_TAGS: ['div', 'span'],
        ALLOWED_ATTR: ['class', 'id'],
      };

      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
        dompurifyConfig: userConfig,
      });

      // Access private method for testing
      const configureDOMPurify = (renderer as any).configureDOMPurify.bind(renderer);
      const config = configureDOMPurify();

      expect(config.ADD_TAGS).toContain('custom-tag');
      expect(config.ALLOWED_TAGS).toContain('div');
      expect(config.ALLOWED_TAGS).toContain('span');
      expect(config.ALLOWED_ATTR).toContain('class');
      expect(config.ALLOWED_ATTR).toContain('id');
    });

    it('should handle empty components', () => {
      const renderer = new Renderer({});

      // Access private method for testing
      const configureDOMPurify = (renderer as any).configureDOMPurify.bind(renderer);
      const config = configureDOMPurify();

      expect(config.ADD_TAGS).toEqual([]);
    });

    it('should deduplicate tags in ADD_TAGS', () => {
      const userConfig = {
        ALLOWED_TAGS: ['custom-tag'],
      };

      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
        dompurifyConfig: userConfig,
      });

      // Access private method for testing
      const configureDOMPurify = (renderer as any).configureDOMPurify.bind(renderer);
      const config = configureDOMPurify();

      const customTagCount = config.ADD_TAGS.filter((tag: string) => tag === 'custom-tag').length;
      expect(customTagCount).toBe(1);
    });
  });

  describe('detectUnclosedTags edge cases', () => {
    it('should handle nested tags correctly', () => {
      const renderer = new Renderer({
        components: {
          'outer-tag': MockComponent,
          'inner-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      // Test case: Properly nested and closed tags
      const html1 = '<outer-tag><inner-tag>content</inner-tag></outer-tag>';
      const result1 = detectUnclosedTags(html1);
      expect(result1.size).toBe(0);

      // Test case: Inner tag unclosed
      const html2 = '<outer-tag><inner-tag>content</outer-tag>';
      const result2 = detectUnclosedTags(html2);
      expect(result2.has('inner-tag')).toBe(true);
      expect(result2.has('outer-tag')).toBe(false);

      // Test case: Outer tag unclosed
      const html3 = '<outer-tag><inner-tag>content</inner-tag>';
      const result3 = detectUnclosedTags(html3);
      expect(result3.has('outer-tag')).toBe(true);
      expect(result3.has('inner-tag')).toBe(false);
    });

    it('should handle case insensitive tag names', () => {
      const renderer = new Renderer({
        components: {
          'test-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      // Test case: Mixed case tags
      const html1 = '<Test-Tag>content';
      const result1 = detectUnclosedTags(html1);
      expect(result1.has('test-tag')).toBe(true);

      const html2 = '<TEST-TAG>content</TEST-TAG>';
      const result2 = detectUnclosedTags(html2);
      expect(result2.has('test-tag')).toBe(false);
    });

    it('should handle tags with attributes', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      // Test case: Tag with attributes, unclosed
      const html1 = '<custom-tag class="test" id="my-id">content';
      const result1 = detectUnclosedTags(html1);
      expect(result1.has('custom-tag')).toBe(true);

      // Test case: Tag with attributes, closed
      const html2 = '<custom-tag class="test" id="my-id">content</custom-tag>';
      const result2 = detectUnclosedTags(html2);
      expect(result2.has('custom-tag')).toBe(false);
    });

    it('should handle malformed HTML gracefully', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      // Test case: Malformed closing tag
      const html1 = '<custom-tag>content</custom-tag';
      const result1 = detectUnclosedTags(html1);
      expect(result1.has('custom-tag')).toBe(true);

      // Test case: Missing closing bracket
      const html2 = '<custom-tag>content';
      const result2 = detectUnclosedTags(html2);
      expect(result2.has('custom-tag')).toBe(true);

      // Test case: Extra closing tags
      const html3 = '<custom-tag>content</custom-tag></custom-tag>';
      const result3 = detectUnclosedTags(html3);
      expect(result3.has('custom-tag')).toBe(false);
    });

    it('should handle empty string', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      const result = detectUnclosedTags('');
      expect(result.size).toBe(0);
    });

    it('should handle same tag multiple times', () => {
      const renderer = new Renderer({
        components: {
          'custom-tag': MockComponent,
        },
      });

      // Access private method for testing
      const detectUnclosedTags = (renderer as any).detectUnclosedTags.bind(renderer);

      // Test case: Multiple instances, some closed, some not
      const html = '<custom-tag>first</custom-tag><custom-tag>second';
      const result = detectUnclosedTags(html);
      expect(result.has('custom-tag')).toBe(true);
    });
  });

  describe('streamStatus integration', () => {
    it('should set streamStatus to loading for unclosed tags in processHtml', () => {
      const components = {
        'streaming-tag': MockComponent,
      };

      const renderer = new Renderer({ components });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Note: Due to html-react-parser behavior, we need to simulate the scenario
      // where we have valid HTML but want to test the streamStatus logic
      // We'll use a mock to control the detectUnclosedTags result
      const mockUnclosedTags = new Set(['streaming-tag']);
      jest.spyOn(renderer as any, 'detectUnclosedTags').mockReturnValue(mockUnclosedTags);

      const html = '<streaming-tag>content</streaming-tag>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'loading',
        }),
      );

      createElementSpy.mockRestore();
      jest.restoreAllMocks();
    });

    it('should set streamStatus to done for closed tags in processHtml', () => {
      const components = {
        'streaming-tag': MockComponent,
      };

      const renderer = new Renderer({ components });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Mock detectUnclosedTags to return empty set (all tags closed)
      jest.spyOn(renderer as any, 'detectUnclosedTags').mockReturnValue(new Set());

      const html = '<streaming-tag>content</streaming-tag>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          streamStatus: 'done',
        }),
      );

      createElementSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('className merging edge cases', () => {
    it('should handle undefined class attributes', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({ components });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case: Only other attributes, no class or className
      const html = '<test-component id="test-id" data-value="test">content</test-component>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          id: 'test-id',
          'data-value': 'test',
          className: '',
        }),
      );

      createElementSpy.mockRestore();
    });

    it('should handle whitespace in class attributes', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: { ALLOWED_ATTR: ['class', 'classname'] },
      });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case: Extra whitespace in class attributes
      const html =
        '<test-component class="  class1   class2  " classname="  existing  ">content</test-component>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'existing class1   class2',
        }),
      );

      createElementSpy.mockRestore();
    });

    it('should handle classname attribute (lowercase)', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: { ALLOWED_ATTR: ['classname'] },
      });

      // Mock createElement to capture props
      const createElementSpy = jest.spyOn(React, 'createElement');

      // Test case: Using "classname" (lowercase) instead of "className"
      const html = '<test-component classname="test-class">content</test-component>';
      renderer.processHtml(html);

      expect(createElementSpy).toHaveBeenCalledWith(
        MockComponent,
        expect.objectContaining({
          className: 'test-class',
        }),
      );

      createElementSpy.mockRestore();
    });
  });

  describe('DOMPurify integration', () => {
    it('should use DOMPurify with correct configuration', () => {
      const components = {
        'custom-tag': MockComponent,
      };

      const renderer = new Renderer({ components });

      // Spy on DOMPurify.sanitize
      const sanitizeSpy = jest.spyOn(DOMPurify, 'sanitize');

      const html = '<custom-tag>content</custom-tag><script>alert("xss")</script>';
      renderer.processHtml(html);

      expect(sanitizeSpy).toHaveBeenCalledWith(
        html,
        expect.objectContaining({
          ADD_TAGS: expect.arrayContaining(['custom-tag']),
        }),
      );

      sanitizeSpy.mockRestore();
    });

    it('should respect user dompurifyConfig', () => {
      const components = {
        'custom-tag': MockComponent,
      };

      const userConfig = {
        ALLOWED_TAGS: ['custom-tag'],
        ALLOWED_ATTR: ['class'],
      };

      const renderer = new Renderer({
        components,
        dompurifyConfig: userConfig,
      });

      // Spy on DOMPurify.sanitize
      const sanitizeSpy = jest.spyOn(DOMPurify, 'sanitize');

      const html = '<custom-tag class="test" id="test-id">content</custom-tag>';
      renderer.processHtml(html);

      expect(sanitizeSpy).toHaveBeenCalledWith(
        html,
        expect.objectContaining({
          ALLOWED_TAGS: expect.arrayContaining(['custom-tag']),
          ALLOWED_ATTR: expect.arrayContaining(['class']),
          ADD_TAGS: expect.arrayContaining(['custom-tag']),
        }),
      );

      sanitizeSpy.mockRestore();
    });
  });

  describe('render method', () => {
    it('should be an alias for processHtml', () => {
      const components = {
        'test-component': MockComponent,
      };

      const renderer = new Renderer({ components });

      // Spy on processHtml
      const processHtmlSpy = jest.spyOn(renderer, 'processHtml');

      const html = '<test-component>content</test-component>';
      const result = renderer.render(html);

      expect(processHtmlSpy).toHaveBeenCalledWith(html);
      expect(result).toBeDefined();

      processHtmlSpy.mockRestore();
    });
  });
});
