import React from 'react';
import CodeHighlighter from '../index';

const App: React.FC = () => {
  return (
    <div>
      <h3>Python</h3>
      <CodeHighlighter lang="python">
        {`def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3,6,8,10,1,2,1]))`}
      </CodeHighlighter>

      <h3>TypeScript</h3>
      <CodeHighlighter lang="typescript">
        {`interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}`}
      </CodeHighlighter>

      <h3>JSON</h3>
      <CodeHighlighter lang="json">
        {`{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"]
}`}
      </CodeHighlighter>

      <h3>SQL</h3>
      <CodeHighlighter lang="sql">
        {`SELECT 
    u.name,
    u.email,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2023-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC;`}
      </CodeHighlighter>
    </div>
  );
};

export default App;
