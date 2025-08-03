export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-astral-radial">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Astral Current Theme Test</h1>
        
        {/* Color Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Theme Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded">Primary</div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded">Secondary</div>
            <div className="bg-accent text-accent-foreground p-4 rounded">Accent</div>
            <div className="bg-muted text-muted-foreground p-4 rounded">Muted</div>
            <div className="bg-card text-card-foreground p-4 rounded border">Card</div>
            <div className="bg-popover text-popover-foreground p-4 rounded border">Popover</div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Semantic Colors</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-success text-success-foreground p-4 rounded">Success</div>
            <div className="bg-warning text-warning-foreground p-4 rounded">Warning</div>
            <div className="bg-destructive text-destructive-foreground p-4 rounded">Destructive</div>
            <div className="bg-info text-info-foreground p-4 rounded">Info</div>
          </div>
        </section>

        {/* Gradients */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gradient Utilities</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-astral-linear text-white p-8 rounded">
              <h3 className="text-xl font-bold">Astral Linear Gradient</h3>
              <p>Primary → Secondary → Accent</p>
            </div>
            <div className="bg-neural-gradient text-white p-8 rounded">
              <h3 className="text-xl font-bold">Neural Gradient (Legacy)</h3>
              <p>Primary → Accent</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Typography (Prose)</h2>
          <article className="prose prose-astral max-w-none">
            <h1>This is a Prose Heading 1</h1>
            <p>
              This is a paragraph with <strong>bold text</strong> and <em>italic text</em>. 
              The typography plugin provides beautiful typographic defaults for any content you can't control.
            </p>
            <h2>Heading Level 2</h2>
            <p>
              Here's a link: <a href="#">This is a styled link</a>. Notice how it uses the primary color.
            </p>
            <ul>
              <li>First list item</li>
              <li>Second list item with <code>inline code</code></li>
              <li>Third list item</li>
            </ul>
            <blockquote>
              This is a blockquote. It should have nice styling with proper borders and spacing.
            </blockquote>
            <pre><code>{`// Code block example
const theme = 'Astral Current';
console.log('Beautiful syntax highlighting');`}</code></pre>
          </article>
        </section>

        {/* Buttons with Glow Effects */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Glow Effects</h2>
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded glow-primary">
              Primary Glow
            </button>
            <button className="bg-accent text-accent-foreground px-6 py-3 rounded glow-accent">
              Accent Glow
            </button>
            <button className="bg-success text-success-foreground px-6 py-3 rounded glow-success">
              Success Glow
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}