describe('Node.nodeName in happy-dom', () => {
  it('should check getNodeName behavior', () => {
    const el = document.createElement('streaming-component');
    console.log('createElement nodeName:', el.nodeName);
    console.log('createElement nodeName type:', typeof el.nodeName);

    // Check if Node.prototype.nodeName getter works
    const nodeNameGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName')?.get;
    console.log('Node.prototype.nodeName getter:', nodeNameGetter);
    if (nodeNameGetter) {
      console.log('nodeNameGetter.call(el):', nodeNameGetter.call(el));
    }

    // Check what happens with the template content owner document
    const template = document.createElement('template');
    if (template.content?.ownerDocument) {
      const doc = template.content.ownerDocument;
      const el2 = doc.createElement('streaming-component');
      console.log('template doc createElement nodeName:', el2.nodeName);

      const docNode = Node.prototype.nodeName;
      console.log('doc Node.prototype.nodeName:', docNode);

      const nodeNameGetter2 = Object.getOwnPropertyDescriptor(
        doc.defaultView?.Node?.prototype || {},
        'nodeName',
      )?.get;
      console.log('template doc Node.prototype.nodeName getter:', nodeNameGetter2);
    }

    // Check when DOMPurify switches documents
    const doc2 = document.implementation.createHTMLDocument('');
    console.log('createHTMLDocument nodeName:', doc2.body?.nodeName);

    // Test setting template innerHTML
    template.innerHTML = '<streaming-component>content</streaming-component>';
    const firstChild = template.content.firstChild as Element;
    console.log('template content firstChild nodeName after innerHTML:', firstChild?.nodeName);

    // Now check what lookupGetter would return for nodeName in this context
    const proto = Object.getPrototypeOf(firstChild);
    console.log('firstChild proto constructor:', proto?.constructor?.name);

    const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName');
    console.log('nodeName descriptor:', desc);

    // Test: Does the nodeName getter from the main document's Node.prototype work on elements from the template document?
    if (desc?.get) {
      try {
        const result = desc.get.call(firstChild);
        console.log('Calling main document nodeName getter on template element:', result);
      } catch (e) {
        console.log('Error calling nodeName getter:', (e as Error).message);
      }
    }
  });
});
