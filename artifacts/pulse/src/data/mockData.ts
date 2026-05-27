export interface Author {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  followers: number;
  following: number;
  joinedDate: string;
}

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  authorId: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  claps: number;
  coverImage?: string;
}

export const authors: Author[] = [
  {
    id: "author-1",
    name: "Mara Chen",
    username: "marachen",
    bio: "Writer, thinker, occasional dreamer. I write about technology, creativity, and the intersection of both.",
    avatarInitials: "MC",
    avatarColor: "#3d7a5c",
    followers: 4821,
    following: 312,
    joinedDate: "March 2023",
  },
  {
    id: "author-2",
    name: "Jordan Ellis",
    username: "jordanellis",
    bio: "Product designer turned writer. Exploring design thinking, mental models, and the craft of making things.",
    avatarInitials: "JE",
    avatarColor: "#6b4f9e",
    followers: 2139,
    following: 88,
    joinedDate: "January 2024",
  },
  {
    id: "author-3",
    name: "Nadia Bloom",
    username: "nadiabloom",
    bio: "Essays on solitude, attention, and what it means to live slowly in a fast world.",
    avatarInitials: "NB",
    avatarColor: "#b54f2a",
    followers: 9304,
    following: 221,
    joinedDate: "June 2022",
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    title: "The quiet art of doing one thing at a time",
    subtitle:
      "In a world built for multitasking, there is a radical joy in giving something your complete attention.",
    content: `There is a version of focus that most productivity gurus sell you — a sharp, militant discipline that carves the day into 25-minute blocks and tracks output in spreadsheets. It is useful, perhaps. But it is not what I mean.

What I mean is softer. It is the feeling of reading a book so completely that you forget you are reading at all. It is the way a conversation becomes real when you stop composing your response and simply listen. It is the moment a walk stops being exercise and becomes a walk.

Single-tasking is not a productivity hack. It is a way of living.

The problem is that our tools do not want us to single-task. Every app is designed with a pull — notifications, red dots, feeds that refresh before you have finished reading. Not out of malice, but because attention is the product. We are not using the platforms. The platforms are using us.

I started an experiment six months ago. I would do one thing at a time. Not perfectly — I still failed often — but intentionally. I would write with no browser open. I would eat without my phone. I would sit with a problem before I Googled it.

The results were strange. I became slower and more capable at once. Tasks that had taken hours with constant context-switching began finishing in focused stretches. More importantly, I began to care again. Caring requires attention. You cannot half-care about something. You either give it your presence or you don't.

There is a particular texture to time when you spend it on one thing. It feels longer in the best way — dense, rich, accountable. A single good hour can feel like a whole day well spent.

I don't know if this is productivity. I don't much care anymore. It is something better: the feeling of being present for your own life.`,
    authorId: "author-3",
    publishedAt: "May 24, 2026",
    readTime: 4,
    tags: ["mindfulness", "focus", "lifestyle"],
    claps: 1847,
  },
  {
    id: "post-2",
    title: "Why most design systems fail at the human layer",
    subtitle:
      "A design system is only as good as the culture that maintains it.",
    content: `Every company I have worked with has eventually built a design system. And almost every company I have worked with has eventually watched that design system slowly stop being used.

The pattern is familiar. A dedicated team spends six months building components, documenting tokens, writing usage guidelines. There is a launch announcement. Engineers use it for a month. Then the deadlines come, the one-offs multiply, and the system begins to drift from the product it was supposed to govern.

Why does this happen? The obvious answer is tooling — Figma libraries that go out of sync with code, documentation that lags behind. But I think the real answer is cultural.

A design system is a shared language. And like any language, it only lives if people choose to speak it. The failure mode is not technical. It is social.

The teams that maintain healthy systems over time share something in common: they treat the system as a living conversation rather than a finished artifact. Someone owns it, yes — but everyone contributes to it. Changes are proposed, debated, and merged. Exceptions are documented, not just tolerated.

More importantly, the system has a clear advocate who sits close to the product. Not in a separate design-systems team insulated from feature work, but embedded in the flow of building. Close enough to feel the friction when something doesn't fit.

A design system is not infrastructure. It is culture made visible. Treat it that way.`,
    authorId: "author-2",
    publishedAt: "May 21, 2026",
    readTime: 5,
    tags: ["design", "product", "culture"],
    claps: 923,
  },
  {
    id: "post-3",
    title: "The thing nobody tells you about learning in public",
    subtitle: "Sharing your process online changes it — sometimes for better, sometimes not.",
    content: `Learning in public has become a kind of gospel in tech and creative circles. Write about what you're learning. Share your process. Build an audience as you build your skills. The advice is everywhere.

I tried it. For two years I documented nearly everything I was learning — side projects, reading notes, half-formed ideas. It grew. People read it. Some of them wrote back.

And then something subtle happened that took me a while to name.

I started optimizing for shareable learning rather than real learning. I would choose the project that made a better story over the project that actually stretched me. I would frame confusions as rhetorical moves rather than sitting with them honestly. The audience had become a filter between me and the raw experience of not-knowing.

This is not an argument against learning in public. It is an argument for being careful about what you optimize for when you do.

The writers and engineers I admire most share something they made, not something they performed. The difference is subtle but real. A thing made lives on its own terms. A thing performed lives by reaction.

If you are going to learn in public — and I think it can be wonderful — keep some of the learning private. Keep a notebook that no one reads. Let yourself be confused in rooms with no witnesses. Share the thing when it is ready, not because it will perform well on a Tuesday.

The audience can wait. The learning cannot.`,
    authorId: "author-1",
    publishedAt: "May 19, 2026",
    readTime: 6,
    tags: ["learning", "writing", "internet"],
    claps: 3102,
  },
  {
    id: "post-4",
    title: "On the strange comfort of unfinished notebooks",
    subtitle: "Why I stopped trying to fill every page.",
    content: `I have a drawer full of notebooks, almost none of them finished. For years this felt like failure — proof of some character flaw, an inability to complete things.

I don't think that anymore.

A notebook is not a project. It does not need to be finished. It is a space for thinking, and thinking rarely respects the physical boundaries of a spine and a cover.

The best notebooks I have kept were the ones I picked up when I needed them and put down without ceremony. No ritual. No review system. Just a place to write things down while they were still moving.

There is something particular about the blank pages at the back of a used notebook. They are not empty. They are possible.`,
    authorId: "author-3",
    publishedAt: "May 15, 2026",
    readTime: 3,
    tags: ["writing", "creativity", "reflection"],
    claps: 671,
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function getPostsByAuthor(authorId: string): Post[] {
  return posts.filter((p) => p.authorId === authorId);
}
