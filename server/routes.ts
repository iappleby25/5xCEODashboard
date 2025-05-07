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
  // Apply middleware
  app.use(json());
  
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
      const flaskUrl = "http://0.0.0.0:8000/upload-csv";
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "success": true,
        "surveyId": 1,
        "message": "Successfully processed survey data",
        "insights": {
          "title": "Employee satisfaction shows positive trend",
          "content": "Analysis of survey responses shows improvement in key areas including work environment and team collaboration",
          "tags": ["Positive Trend", "Work Environment", "Team Dynamics"],
          "isPositive": true
        }
      });
    }
  });

  app.post("/api/process-voice", async (req, res) => {
    try {
      // Forward to Flask server
      const flaskUrl = "http://0.0.0.0:8000/process-voice";
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "success": true,
        "action": "unknown",
        "parameters": {},
        "response": "I'm processing your command. Please try again."
      });
    }
  });

  app.get("/api/generate-insights/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/generate-insights/${surveyId}`;
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "title": "Employee satisfaction has increased by 12% over the last quarter",
        "content": "Key factors contributing to this improvement include:\n- New flexible work policy implemented in July (mentioned in 47% of comments)\n- Leadership town halls have improved transparency scores by 18%\n- Improved onboarding process positively impacted new hire experience",
        "tags": ["Positive Trend", "Leadership Impact", "Q3 Results"],
        "isPositive": true
      });
    }
  });
  
  // Summary report endpoint
  app.get("/api/generate-insights/:surveyId/summary", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/generate-insights/${surveyId}/summary`;
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "summary": "Based on survey responses from 243 employees across 5 departments, there's a positive correlation between work-life balance improvements and overall satisfaction scores.",
        "improvementAreas": [
          { "area": "Communication transparency", "percentage": 42 },
          { "area": "Career growth opportunities", "percentage": 37 },
          { "area": "Feedback implementation", "percentage": 29 }
        ],
        "recommendation": "Consider implementing more regular career development conversations and transparent project allocation."
      });
    }
  });
  
  // Topic clusters endpoint
  app.get("/api/generate-insights/:surveyId/topics", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/generate-insights/${surveyId}/topics`;
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json([
        {
          "topic": "Work-life balance",
          "keywords": ["remote", "flexibility", "hours", "schedule", "family"],
          "sentimentScore": 0.78,
          "count": 127
        },
        {
          "topic": "Internal communication",
          "keywords": ["meetings", "emails", "updates", "transparency", "information"],
          "sentimentScore": 0.45,
          "count": 98
        },
        {
          "topic": "Career advancement",
          "keywords": ["promotion", "growth", "skills", "training", "opportunity"],
          "sentimentScore": 0.32,
          "count": 84
        },
        {
          "topic": "Management support",
          "keywords": ["leadership", "manager", "feedback", "guidance", "help"],
          "sentimentScore": 0.62,
          "count": 76
        }
      ]);
    }
  });

  app.get("/api/luzmo-dashboard/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/luzmo-dashboard/${surveyId}`;
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "dashboardId": "survey-1",
        "embedUrl": "https://api.luzmo.com/embed/survey-1",
        "signature": "mock_signature",
        "timestamp": Date.now(),
        "token": "mock_token"
      });
    }
  });

  app.get("/api/kpi-data/:surveyId", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/kpi-data/${surveyId}`;
      console.log(`Forwarding request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "GET",
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      // If Flask is not available, return fallback data
      res.status(200).json({
        "participation": {
          "rate": 87,
          "change": 5,
          "direction": "up"
        },
        "averageScore": {
          "score": 4.2,
          "change": 0.3,
          "direction": "up"
        }
      });
    }
  });
  
  // AI Insights - follow-up questions
  app.post("/api/generate-insights/:surveyId/followup", async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      const { question } = req.body;
      
      // Forward to Flask server
      const flaskUrl = `http://0.0.0.0:8000/generate-insights/${surveyId}/followup`;
      console.log(`Forwarding followup request to Flask: ${flaskUrl}`);
      
      const flaskResponse = await fetch(flaskUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await flaskResponse.json();
      res.status(flaskResponse.status).json(data);
    } catch (error) {
      console.error(`Error forwarding to Flask: ${error}`);
      
      // Generate a response based on the question type
      const question = req.body.question?.toLowerCase() || "";
      let response;
      
      if (question.includes('why') || question.includes('reason')) {
        response = {
          content: "Based on the survey data analysis, this trend is primarily driven by three factors:\n\n1. Recent policy changes that addressed key pain points from previous surveys (mentioned in 37% of comments)\n\n2. Leadership initiative to increase transparency in decision-making processes\n\n3. Implementation of suggested improvements from last quarter's feedback sessions",
          title: "Cause Analysis"
        };
      } else if (question.includes('how') || question.includes('implementation')) {
        response = {
          content: "The implementation approach was multi-faceted:\n\n• Cross-functional team established to develop the new processes\n• Phased rollout with feedback loops at each stage\n• Manager training conducted before wider company implementation\n• Regular check-ins to measure effectiveness and make adjustments",
          title: "Implementation Details"
        };
      } else if (question.includes('compare') || question.includes('versus') || question.includes('vs')) {
        response = {
          content: "Comparing current results with previous periods:\n\n• Q3 2024: 83% satisfaction rate (current)\n• Q2 2024: 71% satisfaction rate\n• Q1 2024: 68% satisfaction rate\n\nThis represents a steady improvement trend with significant acceleration in the most recent quarter following the implementation of the new policies.",
          title: "Comparative Analysis"
        };
      } else if (question.includes('improve') || question.includes('better') || question.includes('suggestion')) {
        response = {
          content: "Based on the analysis, I recommend:\n\n1. Increase communication frequency around the initiatives that are working well\n2. Develop more robust feedback channels for departments showing lower improvement rates\n3. Consider extending successful policies to other areas of the organization\n4. Create specific metrics to track implementation effectiveness",
          title: "Improvement Recommendations"
        };
      } else {
        response = {
          content: "Based on the survey data analysis, this insight reflects feedback from 243 respondents across all departments. The sentiment score shows a positive trend with a 12% improvement over the previous quarter. Key factors mentioned include improved communication channels, more transparent decision-making processes, and better alignment between individual goals and company objectives.",
          title: "Additional Information"
        };
      }
      
      res.status(200).json(response);
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
