import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AIInsightsService } from '../ai-insights.service';
import { CompanyMetrics, GenerateInsightsRequest, ChatRequest } from '@/types/ai-insights';

describe('AIInsightsService', () => {
  let service: AIInsightsService;
  let mockMetrics: CompanyMetrics;
  let mockRequest: GenerateInsightsRequest;

  beforeEach(() => {
    service = new AIInsightsService();
    
    mockMetrics = {
      retention_rate: 0.82,
      engagement_score: 72,
      productivity_index: 78,
      training_completion_rate: 0.75,
      certification_pass_rate: 0.68,
      skill_gap_score: 65,
      employee_satisfaction: 74,
      revenue_per_employee: 150000,
      time_to_proficiency: 120,
      turnover_cost: 75000
    };

    mockRequest = {
      company_id: 'test-company-123',
      metrics: mockMetrics,
      industry_context: 'Technology',
      company_size: 'medium',
      priorities: ['retention', 'training']
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateInsights', () => {
    it('should generate comprehensive insights for a company', async () => {
      const result = await service.generateInsights(mockRequest);

      expect(result).toBeDefined();
      expect(result.company_id).toBe('test-company-123');
      expect(result.overall_health_score).toBeGreaterThan(0);
      expect(result.overall_health_score).toBeLessThanOrEqual(100);
      expect(result.top_opportunities).toBeInstanceOf(Array);
      expect(result.engagement_recommendations).toBeInstanceOf(Array);
      expect(result.retention_analysis).toBeDefined();
      expect(result.key_metrics).toEqual(mockMetrics);
      expect(new Date(result.generated_at)).toBeInstanceOf(Date);
      expect(new Date(result.next_review_date)).toBeInstanceOf(Date);
    });

    it('should calculate health score correctly for good metrics', async () => {
      const goodMetrics: CompanyMetrics = {
        ...mockMetrics,
        retention_rate: 0.95,
        engagement_score: 88,
        productivity_index: 92,
        training_completion_rate: 0.93,
        certification_pass_rate: 0.89,
        employee_satisfaction: 87
      };

      const goodRequest = { ...mockRequest, metrics: goodMetrics };
      const result = await service.generateInsights(goodRequest);

      expect(result.overall_health_score).toBeGreaterThan(85);
    });

    it('should calculate health score correctly for poor metrics', async () => {
      const poorMetrics: CompanyMetrics = {
        ...mockMetrics,
        retention_rate: 0.65,
        engagement_score: 45,
        productivity_index: 52,
        training_completion_rate: 0.58,
        certification_pass_rate: 0.55,
        employee_satisfaction: 48
      };

      const poorRequest = { ...mockRequest, metrics: poorMetrics };
      const result = await service.generateInsights(poorRequest);

      expect(result.overall_health_score).toBeLessThan(60);
    });

    it('should generate retention insights for low retention rates', async () => {
      const lowRetentionMetrics = { ...mockMetrics, retention_rate: 0.70 };
      const request = { ...mockRequest, metrics: lowRetentionMetrics };
      
      const result = await service.generateInsights(request);
      
      const retentionInsight = result.top_opportunities.find(
        insight => insight.category === 'retention'
      );
      
      expect(retentionInsight).toBeDefined();
      expect(retentionInsight?.type).toBe('cost_reduction');
      expect(retentionInsight?.priority).toBe('high');
      expect(retentionInsight?.estimated_value).toBeGreaterThan(0);
    });

    it('should generate training insights for low completion rates', async () => {
      const lowTrainingMetrics = { ...mockMetrics, training_completion_rate: 0.65 };
      const request = { ...mockRequest, metrics: lowTrainingMetrics };
      
      const result = await service.generateInsights(request);
      
      const trainingInsight = result.top_opportunities.find(
        insight => insight.category === 'training'
      );
      
      expect(trainingInsight).toBeDefined();
      expect(trainingInsight?.type).toBe('efficiency_gain');
      expect(trainingInsight?.priority).toBe('critical');
      expect(trainingInsight?.action_items.length).toBeGreaterThan(0);
    });

    it('should generate productivity insights for low productivity index', async () => {
      const lowProductivityMetrics = { ...mockMetrics, productivity_index: 65 };
      const request = { ...mockRequest, metrics: lowProductivityMetrics };
      
      const result = await service.generateInsights(request);
      
      const productivityInsight = result.top_opportunities.find(
        insight => insight.category === 'performance'
      );
      
      expect(productivityInsight).toBeDefined();
      expect(productivityInsight?.type).toBe('revenue_increase');
      expect(productivityInsight?.estimated_value).toBeGreaterThan(0);
    });

    it('should sort insights by impact score', async () => {
      const result = await service.generateInsights(mockRequest);
      
      for (let i = 1; i < result.top_opportunities.length; i++) {
        expect(result.top_opportunities[i-1].impact_score)
          .toBeGreaterThanOrEqual(result.top_opportunities[i].impact_score);
      }
    });

    it('should include retention analysis with risk segments', async () => {
      const result = await service.generateInsights(mockRequest);
      
      expect(result.retention_analysis.current_rate).toBe(mockMetrics.retention_rate);
      expect(result.retention_analysis.industry_benchmark).toBeDefined();
      expect(result.retention_analysis.risk_segments).toBeInstanceOf(Array);
      expect(result.retention_analysis.risk_segments.length).toBeGreaterThan(0);
      expect(result.retention_analysis.intervention_strategies).toBeInstanceOf(Array);
      
      // Check risk segment structure
      const firstSegment = result.retention_analysis.risk_segments[0];
      expect(firstSegment).toHaveProperty('segment');
      expect(firstSegment).toHaveProperty('size');
      expect(firstSegment).toHaveProperty('risk_level');
      expect(firstSegment).toHaveProperty('top_factors');
      expect(['low', 'medium', 'high']).toContain(firstSegment.risk_level);
    });

    it('should generate engagement recommendations for low engagement', async () => {
      const lowEngagementMetrics = { ...mockMetrics, engagement_score: 65 };
      const request = { ...mockRequest, metrics: lowEngagementMetrics };
      
      const result = await service.generateInsights(request);
      
      expect(result.engagement_recommendations.length).toBeGreaterThan(0);
      
      const firstRec = result.engagement_recommendations[0];
      expect(firstRec).toHaveProperty('title');
      expect(firstRec).toHaveProperty('description');
      expect(firstRec).toHaveProperty('current_metric');
      expect(firstRec).toHaveProperty('target_metric');
      expect(firstRec).toHaveProperty('improvement_potential');
      expect(firstRec.target_metric).toBeGreaterThan(firstRec.current_metric);
    });
  });

  describe('chatWithAI', () => {
    it('should respond to retention-related questions', async () => {
      const chatRequest: ChatRequest = {
        session_id: 'test-session',
        message: 'How can I improve retention in my company?',
        context: {}
      };

      const response = await service.chatWithAI(chatRequest);

      expect(response.message).toContain('retention');
      expect(response.suggested_actions).toBeInstanceOf(Array);
      expect(response.suggested_actions.length).toBeGreaterThan(0);
      expect(response.follow_up_questions).toBeInstanceOf(Array);
      expect(response.related_insights).toBeInstanceOf(Array);
    });

    it('should respond to training-related questions', async () => {
      const chatRequest: ChatRequest = {
        session_id: 'test-session',
        message: 'What can I do about low training completion rates?',
        context: {}
      };

      const response = await service.chatWithAI(chatRequest);

      expect(response.message).toContain('training');
      expect(response.suggested_actions).toBeInstanceOf(Array);
      expect(response.suggested_actions.length).toBeGreaterThan(0);
      expect(response.follow_up_questions).toBeInstanceOf(Array);
    });

    it('should provide general help for unrecognized questions', async () => {
      const chatRequest: ChatRequest = {
        session_id: 'test-session',
        message: 'Hello, what can you help me with?',
        context: {}
      };

      const response = await service.chatWithAI(chatRequest);

      expect(response.message).toBeDefined();
      expect(response.suggested_actions).toBeInstanceOf(Array);
      expect(response.follow_up_questions).toBeInstanceOf(Array);
      expect(response.follow_up_questions.length).toBeGreaterThan(0);
    });

    it('should handle empty messages gracefully', async () => {
      const chatRequest: ChatRequest = {
        session_id: 'test-session',
        message: '',
        context: {}
      };

      const response = await service.chatWithAI(chatRequest);

      expect(response.message).toBeDefined();
      expect(response.message.length).toBeGreaterThan(0);
    });
  });

  describe('createChatSession', () => {
    it('should create a new chat session', async () => {
      const companyId = 'test-company-123';
      const topic = 'Retention Analysis';

      const session = await service.createChatSession(companyId, topic);

      expect(session.id).toContain(companyId);
      expect(session.company_id).toBe(companyId);
      expect(session.topic).toBe(topic);
      expect(session.status).toBe('active');
      expect(session.messages).toEqual([]);
      expect(new Date(session.created_at)).toBeInstanceOf(Date);
      expect(new Date(session.last_message_at)).toBeInstanceOf(Date);
    });

    it('should create session without topic', async () => {
      const companyId = 'test-company-456';

      const session = await service.createChatSession(companyId);

      expect(session.id).toContain(companyId);
      expect(session.company_id).toBe(companyId);
      expect(session.topic).toBeUndefined();
      expect(session.status).toBe('active');
    });

    it('should generate unique session IDs', async () => {
      const companyId = 'test-company-789';

      const session1 = await service.createChatSession(companyId);
      // Add larger delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));
      const session2 = await service.createChatSession(companyId);

      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe('getChatHistory', () => {
    it('should return empty array for new session', async () => {
      const sessionId = 'test-session-123';

      const history = await service.getChatHistory(sessionId);

      expect(history).toEqual([]);
    });
  });

  describe('helper methods', () => {
    it('should calculate accurate turnover savings', () => {
      const metrics = { ...mockMetrics, retention_rate: 0.70, turnover_cost: 100000 };
      
      // Access private method through any casting for testing
      const service_any = service as any;
      const savings = service_any.calculateTurnoverSavings(metrics);
      
      expect(savings).toBeGreaterThan(0);
      expect(typeof savings).toBe('number');
    });

    it('should calculate training ROI correctly', () => {
      const metrics = { ...mockMetrics, training_completion_rate: 0.60 };
      
      const service_any = service as any;
      const roi = service_any.calculateTrainingROI(metrics);
      
      expect(roi).toBeGreaterThan(0);
      expect(typeof roi).toBe('number');
    });

    it('should calculate productivity gains accurately', () => {
      const metrics = { ...mockMetrics, productivity_index: 65, revenue_per_employee: 120000 };
      
      const service_any = service as any;
      const gains = service_any.calculateProductivityGains(metrics);
      
      expect(gains).toBeGreaterThan(0);
      expect(typeof gains).toBe('number');
    });

    it('should score metrics within valid range', () => {
      const service_any = service as any;
      
      expect(service_any.scoreMetric(0.95, 0.80, 0.90)).toBe(100);
      expect(service_any.scoreMetric(0.85, 0.80, 0.90)).toBeCloseTo(80, 1);
      expect(service_any.scoreMetric(0.75, 0.80, 0.90)).toBeLessThan(60);
      expect(service_any.scoreMetric(0, 0.80, 0.90)).toBe(0);
    });
  });
});