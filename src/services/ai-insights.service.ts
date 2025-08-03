import {
  AIInsightsSummary,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ChatSession,
  CompanyMetrics,
  GenerateInsightsRequest,
  ProfitabilityInsight,
  EngagementRecommendation,
  RetentionAnalysis
} from '@/types/ai-insights';

/**
 * AI Insights Service
 * Handles generation of AI-powered business insights and chat functionality
 */
export class AIInsightsService {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai';
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  /**
   * Generate comprehensive AI insights for a company
   */
  async generateInsights(request: GenerateInsightsRequest): Promise<AIInsightsSummary> {
    await this.analyzeMetrics(request.metrics); // For future trend analysis
    const profitabilityInsights = await this.generateProfitabilityInsights(request);
    const engagementRecs = await this.generateEngagementRecommendations(request);
    const retentionAnalysis = await this.analyzeRetention(request);

    return {
      company_id: request.company_id,
      generated_at: new Date().toISOString(),
      overall_health_score: this.calculateHealthScore(request.metrics),
      top_opportunities: profitabilityInsights,
      engagement_recommendations: engagementRecs,
      retention_analysis: retentionAnalysis,
      key_metrics: request.metrics,
      next_review_date: this.calculateNextReviewDate()
    };
  }

  /**
   * Analyze company metrics and identify patterns
   */
  private async analyzeMetrics(metrics: CompanyMetrics): Promise<any> {
    // Calculate trends and anomalies
    const scores = {
      retention: this.scoreMetric(metrics.retention_rate, 0.85, 0.95),
      engagement: this.scoreMetric(metrics.engagement_score, 70, 85),
      productivity: this.scoreMetric(metrics.productivity_index, 75, 90),
      training: this.scoreMetric(metrics.training_completion_rate, 0.80, 0.95)
    };

    return {
      strengths: Object.entries(scores).filter(([, score]) => score >= 80).map(([key]) => key),
      weaknesses: Object.entries(scores).filter(([, score]) => score < 60).map(([key]) => key),
      opportunities: Object.entries(scores).filter(([, score]) => score >= 60 && score < 80).map(([key]) => key)
    };
  }

  /**
   * Generate profitability improvement insights
   */
  private async generateProfitabilityInsights(request: GenerateInsightsRequest): Promise<ProfitabilityInsight[]> {
    const insights: ProfitabilityInsight[] = [];
    const { metrics } = request;

    // Retention-based cost reduction
    if (metrics.retention_rate < 0.85) {
      insights.push({
        id: `retention-${Date.now()}`,
        type: 'cost_reduction',
        title: 'Reduce Turnover Costs Through Targeted Retention',
        description: `Current retention rate of ${(metrics.retention_rate * 100).toFixed(1)}% indicates significant turnover costs. Implementing targeted retention strategies could save substantial recruitment and training expenses.`,
        impact_score: 8,
        confidence: 0.85,
        estimated_value: this.calculateTurnoverSavings(metrics),
        timeframe: 'medium_term',
        action_items: [
          'Implement personalized learning paths to increase engagement',
          'Create mentorship programs for at-risk employees',
          'Enhance onboarding experience with AI-powered guidance',
          'Develop early warning system for employee flight risk'
        ],
        priority: 'high',
        category: 'retention'
      });
    }

    // Training efficiency gains
    if (metrics.training_completion_rate < 0.80) {
      insights.push({
        id: `training-${Date.now()}`,
        type: 'efficiency_gain',
        title: 'Optimize Training ROI with AI-Powered Personalization',
        description: `Training completion rate of ${(metrics.training_completion_rate * 100).toFixed(1)}% suggests inefficient learning programs. Personalized AI coaching could improve completion rates by 40% and reduce time-to-proficiency.`,
        impact_score: 9,
        confidence: 0.92,
        estimated_value: this.calculateTrainingROI(metrics),
        timeframe: 'short_term',
        action_items: [
          'Deploy Readiness Index assessments for all learners',
          'Implement adaptive learning paths based on individual profiles',
          'Create micro-learning modules for better engagement',
          'Add real-time AI coaching support'
        ],
        priority: 'critical',
        category: 'training'
      });
    }

    // Productivity enhancement
    if (metrics.productivity_index < 80) {
      insights.push({
        id: `productivity-${Date.now()}`,
        type: 'revenue_increase',
        title: 'Boost Revenue Through Skills-Based Productivity Gains',
        description: `Productivity index of ${metrics.productivity_index} indicates untapped potential. Strategic skill development could increase individual productivity by 25-30%, directly impacting revenue.`,
        impact_score: 7,
        confidence: 0.78,
        estimated_value: this.calculateProductivityGains(metrics),
        timeframe: 'medium_term',
        action_items: [
          'Identify top performers and analyze their skill profiles',
          'Create replicable training programs based on high-performer patterns',
          'Implement just-in-time learning for immediate skill application',
          'Establish performance tracking and feedback loops'
        ],
        priority: 'medium',
        category: 'performance'
      });
    }

    return insights.sort((a, b) => b.impact_score - a.impact_score);
  }

  /**
   * Generate engagement improvement recommendations
   */
  private async generateEngagementRecommendations(request: GenerateInsightsRequest): Promise<EngagementRecommendation[]> {
    const { metrics } = request;
    const recommendations: EngagementRecommendation[] = [];

    if (metrics.engagement_score < 75) {
      recommendations.push({
        id: `engagement-${Date.now()}`,
        title: 'Implement Gamified Learning Experiences',
        description: 'Low engagement scores indicate traditional training methods are not resonating. Gamification elements can increase engagement by 60% and improve knowledge retention.',
        current_metric: metrics.engagement_score,
        target_metric: Math.min(85, metrics.engagement_score + 15),
        improvement_potential: 20,
        implementation_effort: 'medium',
        resources_needed: [
          'Learning experience platform with gamification features',
          'Content design team',
          'User experience optimization'
        ],
        success_metrics: [
          'Course completion rates',
          'Time spent in learning platform',
          'User satisfaction scores',
          'Knowledge retention assessments'
        ],
        timeline: '3-6 months'
      });
    }

    return recommendations;
  }

  /**
   * Analyze retention patterns and risks
   */
  private async analyzeRetention(request: GenerateInsightsRequest): Promise<RetentionAnalysis> {
    const { metrics } = request;
    
    return {
      current_rate: metrics.retention_rate,
      industry_benchmark: 0.87, // Tech industry average
      risk_segments: [
        {
          segment: 'New Hires (0-6 months)',
          size: 25,
          risk_level: 'high',
          top_factors: ['Poor onboarding experience', 'Skill gap stress', 'Cultural misalignment']
        },
        {
          segment: 'Mid-Career (2-5 years)',
          size: 40,
          risk_level: 'medium',
          top_factors: ['Limited growth opportunities', 'Skills becoming outdated', 'Work-life balance']
        },
        {
          segment: 'Senior Staff (5+ years)',
          size: 35,
          risk_level: 'low',
          top_factors: ['Leadership challenges', 'Career plateau', 'Compensation']
        }
      ],
      intervention_strategies: [
        {
          strategy: 'AI-Powered Onboarding Assistant',
          target_segment: 'New Hires (0-6 months)',
          expected_impact: 0.15, // 15% improvement
          cost_estimate: 50000
        },
        {
          strategy: 'Continuous Skills Assessment & Development',
          target_segment: 'Mid-Career (2-5 years)',
          expected_impact: 0.12,
          cost_estimate: 75000
        }
      ]
    };
  }

  /**
   * Start or continue a chat session about insights
   */
  async chatWithAI(request: ChatRequest): Promise<ChatResponse> {
    try {
      // For now, return a mock response. In production, this would call OpenAI API
      const mockResponses = this.generateMockChatResponse(request);
      return mockResponses;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to process chat request');
    }
  }

  /**
   * Create a new chat session
   */
  async createChatSession(companyId: string, topic?: string): Promise<ChatSession> {
    const sessionId = `chat-${companyId}-${Date.now()}`;
    
    return {
      id: sessionId,
      company_id: companyId,
      created_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      messages: [],
      status: 'active',
      topic
    };
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(_sessionId: string): Promise<ChatMessage[]> {
    // In production, this would fetch from database
    return [];
  }

  // Helper methods
  private scoreMetric(value: number, threshold: number, excellent: number): number {
    if (value >= excellent) return 100;
    if (value >= threshold) return 60 + ((value - threshold) / (excellent - threshold)) * 40;
    return Math.max(0, (value / threshold) * 60);
  }

  private calculateHealthScore(metrics: CompanyMetrics): number {
    const weights = {
      retention: 0.25,
      engagement: 0.20,
      training: 0.20,
      productivity: 0.15,
      certification: 0.10,
      satisfaction: 0.10
    };

    const scores = {
      retention: this.scoreMetric(metrics.retention_rate, 0.75, 0.90),
      engagement: this.scoreMetric(metrics.engagement_score, 60, 85),
      training: this.scoreMetric(metrics.training_completion_rate, 0.70, 0.90),
      productivity: this.scoreMetric(metrics.productivity_index, 70, 90),
      certification: this.scoreMetric(metrics.certification_pass_rate, 0.70, 0.90),
      satisfaction: this.scoreMetric(metrics.employee_satisfaction, 60, 85)
    };

    return Math.round(
      Object.entries(weights).reduce((total, [key, weight]) => {
        return total + (scores[key as keyof typeof scores] * weight);
      }, 0)
    );
  }

  private calculateTurnoverSavings(metrics: CompanyMetrics): number {
    const currentTurnover = 1 - metrics.retention_rate;
    const potentialImprovement = Math.min(0.15, currentTurnover * 0.5); // 50% improvement, max 15%
    return potentialImprovement * metrics.turnover_cost * 100; // Assuming 100 employees
  }

  private calculateTrainingROI(metrics: CompanyMetrics): number {
    const currentWaste = (1 - metrics.training_completion_rate) * 0.4; // 40% of training budget wasted
    const annualTrainingBudget = 250000; // Estimated for mid-size company
    return currentWaste * annualTrainingBudget;
  }

  private calculateProductivityGains(metrics: CompanyMetrics): number {
    const productivityGain = 0.25; // 25% improvement potential
    const revenuePerEmployee = metrics.revenue_per_employee || 150000;
    return productivityGain * revenuePerEmployee * 50; // Assuming 50 employees
  }

  private calculateNextReviewDate(): string {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString();
  }

  private generateMockChatResponse(request: ChatRequest): ChatResponse {
    const lowerMessage = request.message.toLowerCase();
    
    if (lowerMessage.includes('retention') || lowerMessage.includes('turnover')) {
      return {
        message: "I can see you're concerned about retention. Based on your current retention rate, implementing targeted intervention strategies could save your company significant costs. The key is identifying at-risk employees early and providing personalized development paths.",
        suggested_actions: [
          "Deploy early warning system for flight risk detection",
          "Create personalized career development plans",
          "Implement stay interviews for high-value employees"
        ],
        related_insights: ["retention-cost-analysis", "engagement-drivers"],
        follow_up_questions: [
          "Which departments have the highest turnover?",
          "What's your current exit interview feedback showing?",
          "How are you measuring employee satisfaction?"
        ]
      };
    }
    
    if (lowerMessage.includes('training') || lowerMessage.includes('learning')) {
      return {
        message: "Your training completion rates indicate there's room for significant improvement. AI-powered personalization can increase completion rates by 40% and reduce time-to-proficiency. The key is matching content to individual learning styles and skill levels.",
        suggested_actions: [
          "Implement Readiness Index assessments",
          "Create adaptive learning paths",
          "Add real-time AI coaching support"
        ],
        related_insights: ["training-efficiency", "skills-gap-analysis"],
        follow_up_questions: [
          "What types of training have the lowest completion rates?",
          "How do you currently measure training effectiveness?",
          "What's your average time-to-proficiency for new hires?"
        ]
      };
    }
    
    return {
      message: "I'm here to help you understand your company's performance data and identify opportunities for improvement. What specific area would you like to explore - retention, training effectiveness, engagement, or productivity?",
      suggested_actions: [
        "Review top profitability opportunities",
        "Analyze engagement improvement strategies",
        "Explore retention cost reduction options"
      ],
      follow_up_questions: [
        "What's your biggest business challenge right now?",
        "Which metrics are you most concerned about?",
        "What would success look like for your team?"
      ]
    };
  }
}