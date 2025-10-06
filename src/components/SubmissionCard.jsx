```jsx
import React from 'react'


export default function SubmissionCard({ submission }) {
return (
<div style={{ padding: 12, borderRadius: 10, marginBottom: 10, background: '#fff', boxShadow: '0 4px 10px rgba(12,18,30,0.04)' }}>
<div style={{ fontSize: 14 }}>{submission.text}</div>
<div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>by {submission.author}</div>
</div>
)
}
```
