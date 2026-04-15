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
  context: Record<string, any>; // resolved values from data model
}
```

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
    email: 'alice@example.com',   // resolved from /form/email
    name: 'Alice',                // resolved from /form/name
    subscribe: true               // resolved from /form/subscribe
  }
}
```

---

## Handling Actions in React

```tsx
const handleAction = (payload: ActionPayload) => {
  if (payload.name === 'submit_form') {
    const { email, name } = payload.context;
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
const handleAction = async (payload: ActionPayload) => {
  if (payload.name === 'submit') {
    // Show loading
    setCmdQueue((prev) => [
      ...prev,
      { version: 'v0.9', updateDataModel: { surfaceId: 'form', path: '/ui/loading', value: true } },
    ]);
    // Process with agent, then show result
    const result = await callAgent(payload.context);
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
