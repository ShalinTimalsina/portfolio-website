import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean, 
  integer,
  jsonb
} from 'drizzle-orm/pg-core';

// 1. External Articles (Blog)
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  publisher: text('publisher').notNull(), // e.g., "Medium", "Hashnode"
  publishedAt: timestamp('published_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Projects
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  coverImage: text('cover_image'),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]), // Postgres array/jsonb for tags
  liveUrl: text('live_url'),
  repoUrl: text('repo_url'),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Site Content (Key-Value)
export const siteContent = pgTable('site_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').unique().notNull(), // e.g. "hero.heading"
  value: text('value').notNull(),
  type: text('type').notNull(), // 'text', 'richtext', 'json', 'url'
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Media
export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  alt: text('alt').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// 5. Messages (Contact Form)
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Terminal Content
export const terminalContent = pgTable('terminal_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  command: text('command').unique().notNull(),
  output: text('output').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Mascot Lines
export const mascotLines = pgTable('mascot_lines', {
  id: uuid('id').defaultRandom().primaryKey(),
  trigger: text('trigger').unique().notNull(), // e.g., 'typing', 'error', 'success'
  line: text('line').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
