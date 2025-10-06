```jsx
await sdk.actions.composeCast(cast)
// optionally show a UI success state
setSubmissions(prev => [{ id: Date.now(), text, author: 'you (casted)' }, ...prev])
} catch (err) {
console.error('Failed to compose cast', err)
alert('Could not submit your answer. Make sure you are inside the Farcaster Mini App host and signed in.')
}
}


return (
<div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 900, margin: '24px auto', padding: 16 }}>
<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
<div>
<h1 style={{ margin: 0 }}>MikroGorev</h1>
<div style={{ opacity: 0.7, fontSize: 14 }}>Daily micro-challenges for Farcaster — quick to join, easy to share.</div>
</div>
<div>
{!signedIn ? (
<button onClick={handleSignin} disabled={!ready} style={{ padding: '8px 12px', borderRadius: 8 }}>
Sign in
</button>
) : (
<button disabled style={{ padding: '8px 12px', borderRadius: 8 }}>Signed in</button>
)}
</div>
</header>


<main style={{ marginTop: 20 }}>
<ChallengeCard challenge={todayChallenge} onJoin={handleJoin} />


<section style={{ marginTop: 28 }}>
<h2 style={{ marginBottom: 8 }}>Recent submissions</h2>
{submissions.length === 0 ? (
<div style={{ opacity: 0.7 }}>No submissions yet — be the first!</div>
) : (
submissions.map(s => <SubmissionCard key={s.id} submission={s} />)
)}
</section>
</main>


<footer style={{ marginTop: 40, opacity: 0.6, fontSize: 13 }}>
<div>Built for demo purposes. Replace reward & mint flows with your secure backend before production.</div>
</footer>
</div>
)
}
```
