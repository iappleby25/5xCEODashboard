import {
  users, type User, type InsertUser,
  departments, type Department, type InsertDepartment,
  surveys, type Survey, type InsertSurvey,
  responses, type Response, type InsertResponse,
  activities, type Activity, type InsertActivity,
  insights, type Insight, type InsertInsight
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Department operations
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  getAllDepartments(): Promise<Department[]>;

  // Survey operations
  getSurvey(id: number): Promise<Survey | undefined>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getAllSurveys(): Promise<Survey[]>;
  
  // Response operations
  getResponse(id: number): Promise<Response | undefined>;
  createResponse(response: InsertResponse): Promise<Response>;
  getAllResponses(): Promise<Response[]>;
  getResponsesBySurvey(surveyId: number): Promise<Response[]>;
  getResponsesByDepartment(departmentId: number): Promise<Response[]>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByUser(userId: number): Promise<Activity[]>;
  
  // Insight operations
  getInsight(id: number): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  getAllInsights(): Promise<Insight[]>;
  getInsightsBySurvey(surveyId: number): Promise<Insight[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private departments: Map<number, Department>;
  private surveys: Map<number, Survey>;
  private responses: Map<number, Response>;
  private activities: Map<number, Activity>;
  private insights: Map<number, Insight>;
  
  userCurrentId: number;
  departmentCurrentId: number;
  surveyCurrentId: number;
  responseCurrentId: number;
  activityCurrentId: number;
  insightCurrentId: number;

  constructor() {
    this.users = new Map();
    this.departments = new Map();
    this.surveys = new Map();
    this.responses = new Map();
    this.activities = new Map();
    this.insights = new Map();
    
    this.userCurrentId = 1;
    this.departmentCurrentId = 1;
    this.surveyCurrentId = 1;
    this.responseCurrentId = 1;
    this.activityCurrentId = 1;
    this.insightCurrentId = 1;
    
    // Initialize with some mock data
    this.initMockData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Department operations
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const id = this.departmentCurrentId++;
    const department: Department = { ...insertDepartment, id };
    this.departments.set(id, department);
    return department;
  }

  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  // Survey operations
  async getSurvey(id: number): Promise<Survey | undefined> {
    return this.surveys.get(id);
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const id = this.surveyCurrentId++;
    const now = new Date();
    const survey: Survey = { 
      ...insertSurvey, 
      id,
      createdAt: now
    };
    this.surveys.set(id, survey);
    return survey;
  }

  async getAllSurveys(): Promise<Survey[]> {
    return Array.from(this.surveys.values());
  }

  // Response operations
  async getResponse(id: number): Promise<Response | undefined> {
    return this.responses.get(id);
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.responseCurrentId++;
    const now = new Date();
    const response: Response = { 
      ...insertResponse, 
      id,
      createdAt: now
    };
    this.responses.set(id, response);
    return response;
  }

  async getAllResponses(): Promise<Response[]> {
    return Array.from(this.responses.values());
  }

  async getResponsesBySurvey(surveyId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.surveyId === surveyId
    );
  }

  async getResponsesByDepartment(departmentId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.departmentId === departmentId
    );
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const now = new Date();
    const activity: Activity = { 
      ...insertActivity, 
      id,
      createdAt: now
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
  }

  // Insight operations
  async getInsight(id: number): Promise<Insight | undefined> {
    return this.insights.get(id);
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = this.insightCurrentId++;
    const now = new Date();
    const insight: Insight = { 
      ...insertInsight, 
      id,
      createdAt: now
    };
    this.insights.set(id, insight);
    return insight;
  }

  async getAllInsights(): Promise<Insight[]> {
    return Array.from(this.insights.values());
  }

  async getInsightsBySurvey(surveyId: number): Promise<Insight[]> {
    return Array.from(this.insights.values()).filter(
      (insight) => insight.surveyId === surveyId
    );
  }

  // Initialize mock data for development
  private initMockData() {
    // Create admin user
    const adminUser: User = {
      id: this.userCurrentId++,
      username: 'admin',
      password: 'password', // In a real app, this would be hashed
      name: 'Alex Johnson',
      role: 'Administrator',
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    // Create departments
    const departments = [
      { name: 'Engineering' },
      { name: 'Marketing' },
      { name: 'Sales' },
      { name: 'HR' },
      { name: 'Product' }
    ];

    departments.forEach(dept => {
      const department: Department = {
        id: this.departmentCurrentId++,
        name: dept.name
      };
      this.departments.set(department.id, department);
    });

    // Create a survey
    const survey: Survey = {
      id: this.surveyCurrentId++,
      title: 'Q3 Engagement Survey',
      type: 'engagement',
      period: 'Q3 2023',
      createdAt: new Date(),
      createdBy: adminUser.id
    };
    this.surveys.set(survey.id, survey);

    // Create an activity
    const activity: Activity = {
      id: this.activityCurrentId++,
      userId: adminUser.id,
      type: 'upload',
      description: 'New survey data uploaded: Q3 Engagement Survey (243 responses)',
      createdAt: new Date()
    };
    this.activities.set(activity.id, activity);

    // Create a second activity
    const activity2: Activity = {
      id: this.activityCurrentId++,
      userId: adminUser.id,
      type: 'report',
      description: 'Report generated: Department Comparison Report',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    };
    this.activities.set(activity2.id, activity2);

    // Create a third activity
    const activity3: Activity = {
      id: this.activityCurrentId++,
      userId: adminUser.id,
      type: 'filter',
      description: 'Modified department and date range filters',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    };
    this.activities.set(activity3.id, activity3);

    // Create an insight
    const insight: Insight = {
      id: this.insightCurrentId++,
      surveyId: survey.id,
      title: 'Employee satisfaction has increased by 12% over the last quarter',
      content: 'Key factors contributing to this improvement include:\n- New flexible work policy implemented in July (mentioned in 47% of comments)\n- Leadership town halls have improved transparency scores by 18%\n- Improved onboarding process positively impacted new hire experience',
      tags: ['Positive Trend', 'Leadership Impact', 'Q3 Results'],
      isPositive: true,
      createdAt: new Date()
    };
    this.insights.set(insight.id, insight);

    // Create responses for each department
    Array.from(this.departments.values()).forEach(dept => {
      // Random data for demo purposes
      const totalParticipants = Math.floor(Math.random() * 50) + 20;
      const completedParticipants = Math.floor(Math.random() * (totalParticipants - 5)) + 5;
      const averageScore = Math.floor(Math.random() * 10) + 35; // 3.5 to 4.5 range (as integer: 35-45)
      const previousScore = averageScore - (Math.floor(Math.random() * 6) - 2); // -2 to +3 difference

      const response: Response = {
        id: this.responseCurrentId++,
        surveyId: survey.id,
        departmentId: dept.id,
        totalParticipants,
        completedParticipants,
        averageScore,
        previousScore,
        responseData: {
          questions: [
            {
              id: 1,
              text: "How satisfied are you with your work environment?",
              responses: {
                1: Math.floor(Math.random() * 5),
                2: Math.floor(Math.random() * 10),
                3: Math.floor(Math.random() * 15),
                4: Math.floor(Math.random() * 20),
                5: Math.floor(Math.random() * 15)
              }
            },
            {
              id: 2,
              text: "How would you rate leadership transparency?",
              responses: {
                1: Math.floor(Math.random() * 5),
                2: Math.floor(Math.random() * 10),
                3: Math.floor(Math.random() * 15),
                4: Math.floor(Math.random() * 20),
                5: Math.floor(Math.random() * 15)
              }
            }
          ]
        },
        createdAt: new Date()
      };
      this.responses.set(response.id, response);
    });
  }
}

export const storage = new MemStorage();
