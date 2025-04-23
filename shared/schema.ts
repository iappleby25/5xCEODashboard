import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

// Survey schema
export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // engagement, pulse, onboarding
  period: text("period").notNull(), // Q1 2023, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const insertSurveySchema = createInsertSchema(surveys).pick({
  title: true,
  type: true,
  period: true,
  createdBy: true,
});

// Department schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertDepartmentSchema = createInsertSchema(departments).pick({
  name: true,
});

// Response schema
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id).notNull(),
  departmentId: integer("department_id").references(() => departments.id).notNull(),
  totalParticipants: integer("total_participants").notNull(),
  completedParticipants: integer("completed_participants").notNull(),
  averageScore: integer("average_score").notNull(), // Stored as integer (e.g., 42 for 4.2/5)
  previousScore: integer("previous_score"), // For comparison
  responseData: json("response_data").notNull(), // Detailed response data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResponseSchema = createInsertSchema(responses).pick({
  surveyId: true,
  departmentId: true,
  totalParticipants: true,
  completedParticipants: true,
  averageScore: true,
  previousScore: true,
  responseData: true,
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // upload, report, filter
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  description: true,
});

// AI Insight schema
export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull(),
  isPositive: boolean("is_positive").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInsightSchema = createInsertSchema(insights).pick({
  surveyId: true,
  title: true,
  content: true,
  tags: true,
  isPositive: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;
