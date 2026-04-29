# Actions Reference

This file covers how user interactions flow from components back to the agent via `onAction`. Read this when implementing button handlers, form submission, or any user interaction.

---

## Action Flow

```
Component (Button click)
  → Card resolves action.event.context paths
  → Card calls onAction(ActionPayload)
  → XCard.Box forwards to your onAction handler
  → Your code sends new commands to agent / updates cmdQueue
```

---

## ActionPayload

```typescript
interface ActionPayload {
  name: string; // from action.event.name
  surfaceId: string; // which surface triggered this
  /**
   * Context passed by component, with path references automatically resolved.
   * Path references in action.event.context are converted to { value } format.
   */
  context: Record<string, any>;
}
```

---

## Path Reference Resolution

When a component triggers an action, X-Card automatically resolves path references in the context to actual values.

### v0.9 Format

```json
{
  "id": "submit_btn",
  "component": "Button",
  "action": {
    "event": {
      "name": "submit_form",
      "context": {
        "username": { "path": "/form/username", "label": "用户名" },
        "email": { "path": "/form/email", "label": "邮箱" }
      }
    }
  }
}
```

When the user clicks the button, `onAction` receives:

```typescript
{
  name: 'submit_form',
  surfaceId: 'contact_form',
  context: {
    // Path references are automatically resolved to { value } format
    username: { value: '张三', label: '用户名' },
    email: { value: 'test@example.com', label: '邮箱' }
  }
}
```

### v0.8 Format

In v0.8, action context uses array format:

```json
{
  "id": "submit_btn",
  "component": {
    "Button": {
      "action": {
        "name": "submit_form",
        "context": [
          { "key": "username", "value": { "path": "/form/username" } },
          { "key": "email", "value": { "path": "/form/email" } }
        ]
      }
    }
  }
}
```

Resolved payload:

```typescript
{
  name: 'submit_form',
  surfaceId: 'contact_form',
  context: {
    username: { value: '张三' },
    email: { value: 'test@example.com' }
  }
}
```

> **Note**: Only values that are `{ path: "xxx" }` format in the context are converted. Actual values passed by component (e.g., `{ value: "actual_value" }`) are preserved without conversion.

---

## Defining an Action on a Component

```json
{
  "id": "submit_btn",
  "component": "Button",
  "text": "Submit",
  "action": {
    "event": {
      "name": "submit_form",
      "context": {
        "email": { "path": "/form/email" },
        "name": { "path": "/form/name" },
        "subscribe": { "path": "/form/subscribe" }
      }
    }
  }
}
```

When the user clicks the button, `onAction` receives:

```typescript
{
  name: 'submit_form',
  surfaceId: 'contact_form',
  context: {
    // Path references are automatically resolved to { value } format
    email: { value: 'alice@example.com' },
    name: { value: 'Alice' },
    subscribe: { value: true }
  }
}
```

---

## Handling Actions in React

```tsx
const handleAction = (payload: ActionPayload) => {
  if (payload.name === 'submit_form') {
    // Each key in context corresponds to a path binding in the config,
    // resolved to { value, ...rest } format
    const email = payload.context.email?.value;
    const name = payload.context.name?.value;
    // 1. Call your agent API
    // 2. Push new commands in response
    setCmdQueue(prev => [
      ...prev,
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: payload.surfaceId,
          components: [
            { id: 'root', component: 'Text', text: `Thanks, ${name}! Confirmation sent to ${email}.` }
          ]
        }
      }
    ]);
  }
};

<XCard.Box commands={cmdQueue} onAction={handleAction} components={...}>
  <XCard.Card id="contact_form" />
</XCard.Box>
```

---

## Form Submission Pattern

Full round-trip with form validation:

```tsx
// 1. Agent sends form structure
const formCommands: XAgentCommand_v0_9[] = [
  { version: 'v0.9', createSurface: { surfaceId: 'form', catalogId: 'local://cat.json' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'root', component: 'Column', children: ['email_input', 'submit_btn'] },
        {
          id: 'email_input',
          component: 'TextField',
          label: 'Email',
          value: { path: '/form/email' },
          checks: [
            {
              call: 'required',
              args: { value: { path: '/form/email' } },
              message: 'Email is required',
            },
            {
              call: 'email',
              args: { value: { path: '/form/email' } },
              message: 'Invalid email format',
            },
          ],
        },
        {
          id: 'submit_btn',
          component: 'Button',
          text: 'Submit',
          action: { event: { name: 'submit', context: { email: { path: '/form/email' } } } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'form', path: '/form', value: { email: '' } } },
];

// 2. Handle submission
// Each key in context is resolved to { value, ...rest } format
const handleAction = async (payload: ActionPayload) => {
  if (payload.name === 'submit') {
    const email = payload.context.email?.value;
    // Show loading
    setCmdQueue((prev) => [
      ...prev,
      { version: 'v0.9', updateDataModel: { surfaceId: 'form', path: '/ui/loading', value: true } },
    ]);
    // Process with agent, then show result
    const result = await callAgent({ email });
    setCmdQueue((prev) => [
      ...prev,
      {
        version: 'v0.9',
        updateDataModel: { surfaceId: 'form', path: '/ui/loading', value: false },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'form',
          components: [{ id: 'root', component: 'Text', text: `Done: ${result}` }],
        },
      },
    ]);
  }
};
```

---

## Client-Side Function Actions

For local-only actions (no server round-trip):

```json
{
  "id": "link_btn",
  "component": "Button",
  "text": "Open Docs",
  "action": {
    "functionCall": {
      "call": "openUrl",
      "args": { "url": "https://a2ui.org" }
    }
  }
}
```

Available built-in functions: `openUrl`, `formatString`, `formatNumber`, `formatDate`, `formatCurrency`, `pluralize`, `and`, `or`, `not`.

---

## Validation Checks on Buttons

A Button with `checks` auto-disables when conditions are not met:

```json
{
  "id": "submit_btn",
  "component": "Button",
  "text": "Submit",
  "checks": [
    {
      "condition": {
        "call": "and",
        "args": {
          "values": [
            { "call": "required", "args": { "value": { "path": "/form/name" } } },
            { "call": "email", "args": { "value": { "path": "/form/email" } } }
          ]
        }
      },
      "message": "Name and valid email required"
    }
  ],
  "action": {
    "event": {
      "name": "submit",
      "context": { "name": { "path": "/form/name" }, "email": { "path": "/form/email" } }
    }
  }
}
```

> ⚠️ `action.event.context` paths are **write targets** pointing to where user input is stored. The Card resolves them by reading the data model when the action fires — do not mistake them for read bindings.
