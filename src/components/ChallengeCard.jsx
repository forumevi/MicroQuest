```jsx
import React, { useState } from 'react'


export default function ChallengeCard({ challenge, onJoin }) {
const [text, setText] = useState('')


return (
<div style={{ borderRadius: 12, padding: 16, boxShadow: '0 6px 18px rgba(12,18,30,0.06)' }}>
<h2 style={{ marginTop: 0 }}>{challenge.title}</h2>
<p style={{ marginTop: 6 }}>{challenge.description}</p>
<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
<input
value={text}
onChange={e => setText(e.target.value)}
placeholder="Write your short caption or tip..."
style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e6e9ef' }}
/>
<button
onClick={() => { if (text.trim()) { onJoin(text.trim()); setText('') } }}
style={{ padding: '10px 14px', borderRadius: 8 }}
>
Join
</button>
</div>
<div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>{challenge.reward}</div>
</div>
)
}
