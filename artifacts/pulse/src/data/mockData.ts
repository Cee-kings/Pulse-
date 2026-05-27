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
  {
    id: "author-4",
    name: "Theo Park",
    username: "theopark",
    bio: "Philosophy, language, and the machines we build to think for us. Formerly academic, permanently curious.",
    avatarInitials: "TP",
    avatarColor: "#1a6b8a",
    followers: 6712,
    following: 144,
    joinedDate: "September 2022",
  },
  {
    id: "author-5",
    name: "Leila Santos",
    username: "leilasantos",
    bio: "Food, memory, and what we carry with us. Writing from Lisbon, eating everywhere else.",
    avatarInitials: "LS",
    avatarColor: "#8a3a6b",
    followers: 3480,
    following: 410,
    joinedDate: "April 2023",
  },
  {
    id: "author-6",
    name: "Kai Brennan",
    username: "kaibrennan",
    bio: "Software engineer who reads too much. Writing about craft, complexity, and code that lasts.",
    avatarInitials: "KB",
    avatarColor: "#4a5568",
    followers: 1890,
    following: 67,
    joinedDate: "November 2023",
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
    subtitle: "A design system is only as good as the culture that maintains it.",
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
  {
    id: "post-5",
    title: "Language models don't understand anything, and that's the interesting part",
    subtitle: "The question isn't whether AI is conscious. It's what we lose when we stop asking.",
    content: `There is a parlour game philosophers play sometimes. You describe the behaviour of something — it responds to stimuli, it learns from experience, it models the world — and you ask: does it understand?

The game is rigged, of course. Understanding is not a behaviour. It is something we infer from behaviour, and the inference is always underdetermined. Which is why the debate about large language models understanding language has generated so much heat and so little light.

Here is what I think is actually interesting.

When a language model produces a response that surprises you — that seems insightful, or funny, or unexpectedly precise — your brain does something automatic. It reaches for an explanation. And the explanation it reaches for, almost every time, is intentionality. Something chose to say that.

This isn't naivety. It is how human cognition works. We are extraordinarily good at detecting agency, and we err heavily on the side of false positives. A face in the clouds, a personality in a car. The tendency is ancient and probably adaptive.

What language models have done, I think, is reveal just how thin the line is between the appearance of understanding and the attribution of it. When we say a person understands something, we mean partly that they can use it correctly across contexts. Language models can do that, within limits. But we also mean something harder to name — something about interiority, about there being a someone home.

Whether that someone is there in a language model, I genuinely do not know. I suspect the question may not be well-formed. But I find it more interesting than the usual binary — conscious or not, understanding or mimicry — because it points at something real about how understanding works in us, not just in machines.

We built a mirror. What we see in it is worth examining.`,
    authorId: "author-4",
    publishedAt: "May 13, 2026",
    readTime: 7,
    tags: ["AI", "philosophy", "language"],
    claps: 4208,
  },
  {
    id: "post-6",
    title: "The meal that only exists in memory",
    subtitle: "Some food can't be replicated. It can only be remembered.",
    content: `My grandmother made a soup I have been trying to recreate for fifteen years. Not the recipe — I have that, written in her handwriting on a folded piece of paper I keep in the back of a cookbook. The ingredients are simple. The method is simple. I have made it dozens of times.

It is never right.

I used to think this was a technique problem. Wrong onion variety, different salt, tomatoes out of season. I tried adjustments. I sourced things. For a while I convinced myself I was getting closer.

I wasn't. I was just getting better at a different soup that happened to share a name.

There is a category of food that I think exists primarily as memory. Not in the sense that it was poorly made or imagined — the soup was real, I ate it, I can still describe the weight of the bowl — but in the sense that what made it what it was extended beyond the food itself. It was the kitchen. The time of year. My age. Her presence. The particular quality of winter light through a window in a house that no longer exists.

Food is chemical. But eating is not. We metabolize context along with calories. The conditions of a meal — who made it, where, under what sky — are part of the dish in a way that no recipe can capture.

This doesn't make me sad, exactly. It makes me careful. I try now to notice the conditions. To eat the moment, not just the food.

The soup I cannot make is still the best I have ever had. That seems right.`,
    authorId: "author-5",
    publishedAt: "May 11, 2026",
    readTime: 5,
    tags: ["food", "memory", "culture"],
    claps: 2571,
  },
  {
    id: "post-7",
    title: "Write code like you won't be there to explain it",
    subtitle: "The best documentation is the kind that never needs to be written.",
    content: `I have a rule I give to engineers I work with. Imagine you are hit by a bus tomorrow. Not because I am morbid, but because it concentrates the mind on a particular question: could someone who has never seen this code understand it in a reasonable amount of time?

Most code fails this test badly.

Not because engineers are careless. Most of the engineers I've known care a great deal about their work. The problem is that code is written from the inside. You know what the variable means. You remember the constraint that made this approach necessary. The comment you didn't write is the one that seemed too obvious to write.

It is never obvious to the person who comes after.

The practice I have found most useful is reading your own code as if you wrote it six months ago. Not carefully, the way you read code you just wrote. Skim it. Notice what makes you hesitate. The places where you slow down are the places where the code is unclear.

This sounds simple. It is hard. You have to genuinely forget what you know, or at least pretend to. The best I have managed is a kind of enforced estrangement — I deliberately avoid code I've written for a week or two, then return to it with fresh eyes.

The goal is not exhaustive comments. Comments lie; they get out of sync with the code and quietly mislead. The goal is code that reveals its own intent. Variable names that describe what a thing is, not what it does mechanically. Functions short enough to hold in working memory. Structure that mirrors the shape of the problem, not the shape of the solution.

Someone will read this code. Probably you, six months from now. Write it for them.`,
    authorId: "author-6",
    publishedAt: "May 8, 2026",
    readTime: 5,
    tags: ["engineering", "craft", "code"],
    claps: 1344,
  },
  {
    id: "post-8",
    title: "The poverty of the quantified self",
    subtitle: "Measuring your life is not the same as understanding it.",
    content: `I tracked everything for a year. Sleep, steps, calories, heart rate variability, hours of deep work, mood on a five-point scale. I had dashboards. I had trends. I had, by the end, a very detailed record of a life I did not particularly recognise.

The quantified self movement promises clarity. Measure yourself, and you will know yourself. Optimize the inputs, improve the outputs. It is appealing because it turns the slippery problem of being human into something that looks like an engineering problem.

The issue is that the things worth knowing about a life resist quantification.

Was the day good? Depends on what happened in the last hour of it, and whether a particular conversation landed right, and whether you said something you've been meaning to say for months. A mood score does not capture this. A HRV reading does not care.

I am not against measurement. I wear a watch that tells me things about my sleep and I find some of it useful. But I notice a creeping tendency — in myself and in the culture — to privilege the measurable over the meaningful. To treat the metric as the thing, rather than as a rough proxy for it.

The risk is not that you measure yourself wrong. The risk is that you start living toward the metric. That you optimize for the number and lose the thing the number was supposed to track.

The best days of my year were not the days with the best scores. They were the days I forgot to check.`,
    authorId: "author-4",
    publishedAt: "May 5, 2026",
    readTime: 5,
    tags: ["philosophy", "self", "technology"],
    claps: 3890,
  },
  {
    id: "post-9",
    title: "A recipe for something that doesn't have a name",
    subtitle: "Some dishes are too personal for a category.",
    content: `There is a thing I make on Sunday evenings when I want something that asks nothing of me. It started as an improvisation — a way to use what was left in the fridge at the end of the week — and became, over time, a ritual.

I do not have a name for it. It is not a stew, exactly, or a braise. It is somewhere between the two, and also neither.

You start with oil and patience. Whatever allium is available — onion, shallots, a leek if you are lucky — cooked low and slow until it loses its insistence. Then garlic, briefly. Then whatever vegetables have been waiting too long in the crisper: a zucchini going soft at one end, half a head of fennel, a few carrots that have become flexible where they should be firm.

The liquid is whatever is open. Wine if there is wine. Stock if there is stock. Water is fine. Water is often fine.

Then something acidic — lemon, a spoonful of vinegar — and something with depth: miso, or a parmesan rind, or both. Then time. At least an hour. The goal is not to taste the ingredients separately. The goal is something that has decided to become one thing.

Salt carefully, repeatedly, throughout. Taste as if the tasting matters, because it does.

Eat from the pot, with bread, while standing at the counter. This is important. The occasion shapes the food. Serve it at a table and it becomes something else, something that needs to be good in a particular way. From the pot, with bread, it only needs to be true.

It always is.`,
    authorId: "author-5",
    publishedAt: "May 2, 2026",
    readTime: 4,
    tags: ["food", "recipes", "ritual"],
    claps: 1122,
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
