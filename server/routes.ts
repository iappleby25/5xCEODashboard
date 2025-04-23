import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { json } from "express";
import { z } from "zod";
import {
  insertUserSchema,
  insertSurveySchema,
  insertDepartmentSchema,
  insertResponseSchema,
  insertActivitySchema,
  insertInsightSchema,
  activities,
} from "@shared/schema";
import { exec } from "child_process";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route prefix: /api
  const apiRouter = app.route("/api");

  // Start Flask server
  startFlaskServer();

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid user data" });
      }
      const user = await storage.createUser(validation.data);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Survey routes
  app.get("/api/surveys", async (req, res) => {
    try {
      const surveys = await storage.getAllSurveys();
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ message: "Error fetching surveys" });
    }
  });

  app.get("/api/surveys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const survey = await storage.getSurvey(id);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.json(survey);
    } catch (error) {
      res.status(500).json({ message: "Error fetching survey" });
    }
  });

  app.post("/api/surveys", async (req, res) => {
    try {
      const validation = insertSurveySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid survey data" });
      }
      const survey = await storage.createSurvey(validation.data);
      res.status(201).json(survey);
    } catch (error) {
      res.status(500).json({ message: "Error creating survey" });
    }
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching departments" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const validation = insertDepartmentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid department data" });
      }
      const department = await storage.createDepartment(validation.data);
      res.status(201).json(department);
    } catch (error) {
      res.status(500).json({ message: "Error creating department" });
    }
  });

  // Response routes
  app.get("/api/responses", async (req, res) => {
    try {
      const responses = await storage.getAllResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching responses" });
    }
  });

  app.get("/api/responses/survey/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const responses = await storage.getResponsesBySurvey(id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching responses by survey" });
    }
  });

  app.get("/api/responses/department/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const responses = await storage.getResponsesByDepartment(id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching responses by department" });
    }
  });

  app.post("/api/responses", async (req, res) => {
    try {
      const validation = insertResponseSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid response data" });
      }
      const response = await storage.createResponse(validation.data);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error creating response" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities" });
    }
  });

  app.get("/api/activities/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activities = await storage.getActivitiesByUser(id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities by user" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validation = insertActivitySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid activity data" });
      }
      const activity = await storage.createActivity(validation.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Error creating activity" });
    }
  });

  // Insight routes
  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await storage.getAllInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Error fetching insights" });
    }
  });

  app.get("/api/insights/survey/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const insights = await storage.getInsightsBySurvey(id);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Error fetching insights by survey" });
    }
  });

  app.post("/api/insights", async (req, res) => {
    try {
      const validation = insertInsightSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid insight data" });
      }
      const insight = await storage.createInsight(validation.data);
      res.status(201).json(insight);
    } catch (error) {
      res.status(500).json({ message: "Error creating insight" });
    }
  });

  // Proxy routes to Flask server
  app.post("/api/upload-csv", async (req, res) => {
    try {
      // Forward to Flask server
      const flaskResponse = await fetch("http://localhost:8000/upload-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error uploading CSV" });
    }
  });

  app.post("/api/process-voice", async (req, res) => {
    try {
      // Forward to Flask server
      const flaskResponse = await fetch("http://localhost:8000/process-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error processing voice command" });
    }
  });

  app.get("/api/generate-insights/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskResponse = await fetch(`http://localhost:8000/generate-insights/${surveyId}`, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error generating insights" });
    }
  });

  app.get("/api/luzmo-dashboard/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskResponse = await fetch(`http://localhost:8000/luzmo-dashboard/${surveyId}`, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error getting Luzmo dashboard" });
    }
  });

  app.get("/api/kpi-data/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskResponse = await fetch(`http://localhost:8000/kpi-data/${surveyId}`, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error getting KPI data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function startFlaskServer() {
  // Start Flask server with NLP initialization as a separate process
  exec("python start_flask.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Flask server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Flask server stderr: ${stderr}`);
      return;
    }
    console.log(`Flask server stdout: ${stdout}`);
  });
}
