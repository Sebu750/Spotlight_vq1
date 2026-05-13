export interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: 1,
    category: 'Interview',
    title: "Why the dorm room is the new fashion incubator.",
    excerpt: "Inside the makeshift studios of three designers who are bypassing traditional fashion school to build their own empires.",
    author: "Julian Valez",
    date: "May 12, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2600&auto=format&fit=crop",
    content: `
      <p>Fashion education is changing. No longer are the hallowed halls of Central Saint Martins or Parsons the only path to the runway. Today, some of the most innovative work is happening in 10x10 dorm rooms, powered by high-speed internet and industrial sewing machines squeezed between bunk beds.</p>
      <blockquote>"The gatekeepers are still there, but the gates are wide open if you know how to build your own door."</blockquote>
      <p>Julian Valez sits down with three Spotlight alumni who started with nothing but a vision and a laptop. We explore how they source deadstock fabric late at night and how they leveraged social media to build a following before they even had a business license. The future of fashion isn't just being taught; it's being built in real-time by a generation that refuses to wait for permission.</p>
      <p>In this deep dive, we look at the infrastructure needed for a micro-studio, the psychological resilience of the self-taught designer, and why "amateur" is the new badge of honor in the high-fashion world.</p>
    `
  },
  {
    id: 2,
    category: 'Industry Insights',
    title: "The death of the 'Entry Level' internship.",
    excerpt: "How performance-based funding is replacing the toxic coffee-run culture of the legacy houses.",
    author: "Sarah Chen",
    date: "May 08, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2670&auto=format&fit=crop",
    content: `
      <p>For decades, the unpaid internship was the barrier to entry for the fashion elite. It was a world of coffee runs, fabric swatching, and silent observation. But that era is ending. A new wave of platforms, led by Spotlight, is offering a different path: performance-based funding.</p>
      <blockquote>"We don't need interns who can fetch lattes; we need designers who can build supply chains."</blockquote>
      <p>Sarah Chen analyzes the shift from "paying your dues" to proving your value. We look at how decentralized funding and direct-to-consumer models are allowing young designers to hire their own teams instead of being the low-man on someone else's totem pole. The power dynamic is shifting, and the legacy houses are struggling to keep up with the speed of talent migration.</p>
    `
  },
  {
    id: 3,
    category: 'Competition Tips',
    title: "How to craft a 3-look submission that judges can't ignore.",
    excerpt: "Stop focusing on technical perfection and start focusing on emotional resonance.",
    author: "Marcus Thorne",
    date: "May 04, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551029506-0307096c4695?q=80&w=2670&auto=format&fit=crop",
    content: `
      <p>You have 30 seconds to capture a judge's attention. In that time, they aren't looking at your hemlines; they're looking for your soul. Marcus Thorne, head of judge recruitment at Spotlight, breaks down the anatomy of a winning submission.</p>
      <p>Most applicants make the mistake of showing their most "wearable" pieces. We don't want wearable; we want a vision. We want to see how you think about the body, how you manipulate light, and how you challenge the viewer's expectations of silhouette.</p>
      <blockquote>"Show me the piece that keeps you up at night, not the piece you think I'll like."</blockquote>
      <p>Learn the three elements of a high-impact portfolio: The Narrative, The Disruption, and The Execution. We'll show you how to photograph your work to maximize its digital impact and how to write a statement that doesn't just describe clothes, but defines a culture.</p>
    `
  },
  {
    id: 4,
    category: 'Designer Spotlight',
    title: "Elena Rossi: From S'24 Winner to Dover Street Market.",
    excerpt: "A deep dive into the 6 months that changed Elena's life and her upcoming collection drop.",
    author: "i-D Collaborative",
    date: "April 28, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
    content: `
      <p>Elena Rossi won Spotlight's Summer '24 competition with a collection of upcycled parachute silks that blurred the line between sculpture and survival gear. Six months later, her name is on the windows of Dover Street Market.</p>
      <p>Rossi's journey is a blueprint for the modern accelerator-backed designer. From the $50k grant to the intensive logistics mentoring, we trace every step of her development. How did she handle the production of 500 units for her first retail order? How did she maintain her creative integrity while scaling for a global audience?</p>
      <blockquote>"Spotlight gave me the armor I needed to enter the business world without losing my artistic soul."</blockquote>
    `
  },
  {
    id: 5,
    category: 'Behind-the-Scenes',
    title: "The logistics of a live runway in NYC: A nightmare in tulle.",
    excerpt: "What really happens in the 48 hours before the SpotLight finale show.",
    author: "Spotlight Team",
    date: "April 22, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2574&auto=format&fit=crop",
    content: `
      <p>It's 3:00 AM in a warehouse in Bushwick, and a team of twenty is frantically steam-pressing three miles of tulle. This is the reality of the Spotlight finale. Far from the glamour of the front row, the back-of-house is a symphony of controlled chaos.</p>
      <p>In this article, we pull back the curtain on the technical production of a top-tier fashion competition. From model casting to lighting design, we show you the sweat and grit required to make talent look effortless. We talk to the stage managers, the hair teams, and the designers who are seeing their dreams materialize for the first time under the spotlights of New York City.</p>
    `
  },
  {
    id: 6,
    category: 'Industry Insights',
    title: "Will AI replace the pattern maker? (Probably not, but...)",
    excerpt: "Exploring the hybrid future of algorithmic design and human craftsmanship.",
    author: "Tech & Textiles",
    date: "April 15, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    content: `
      <p>Generative AI is sweeping through the creative sectors, and fashion is no exception. But while a computer can generate a thousand variations of a jacket in seconds, it still can't understand how that jacket feels when the wearer moves.</p>
      <p>We explore the integration of AI tools in the design workflow—from generating mood boards to optimizing fabric yield. The most interesting designers aren't running from the machines; they're collaborating with them. We examine the rise of the "Algo-Artisan" and why human intuition remains the most valuable asset in an automated world.</p>
    `
  }
];
