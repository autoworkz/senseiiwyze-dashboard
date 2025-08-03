// AI Insights Types for SenseiiWyze Dashboard

export interface CompanyMetrics {
  retention_rate: number;
  engagement_score: number;
  productivity_index: number;
  training_completion_rate: number;
  certification_pass_rate: number;
  skill_gap_score: number;
  employee_satisfaction: number;
  revenue_per_employee: number;
  time_to_proficiency: number; // days
  turnover_cost: number; // USD
}

export interface ProfitabilityInsight {
  id: string;
  type: 'cost_reduction' | 'revenue_increase' | 'efficiency_gain' | 'risk_mitigation';
  title: string;
  description: string;
  impact_score: number; // 1-10
  confidence: number; // 0-1
  estimated_value: number; // USD
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  action_items: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'training' | 'retention' | 'engagement' | 'performance' | 'compliance';
}

export interface EngagementRecommendation {
  id: string;
  title: string;
  description: string;
  current_metric: number;
  target_metric: number;
  improvement_potential: number; // percentage
  implementation_effort: 'low' | 'medium' | 'high';
  resources_needed: string[];
  success_metrics: string[];
  timeline: string;
}

export interface RetentionAnalysis {
  current_rate: number;
  industry_benchmark: number;
  risk_segments: {
    segment: string;
    size: number;
    risk_level: 'low' | 'medium' | 'high';
    top_factors: string[];
  }[];
  intervention_strategies: {
    strategy: string;
    target_segment: string;
    expected_impact: number;
    cost_estimate: number;
  }[];
}

export interface AIInsightsSummary {
  company_id: string;
  generated_at: string;
  overall_health_score: number; // 1-100
  top_opportunities: ProfitabilityInsight[];
  engagement_recommendations: EngagementRecommendation[];
  retention_analysis: RetentionAnalysis;
  key_metrics: CompanyMetrics;
  next_review_date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    insight_id?: string;
    metric_name?: string;
    recommendation_id?: string;
  };
}

export interface ChatSession {
  id: string;
  company_id: string;
  created_at: string;
  last_message_at: string;
  messages: ChatMessage[];
  status: 'active' | 'archived';
  topic?: string;
}

export interface GenerateInsightsRequest {
  company_id: string;
  metrics: CompanyMetrics;
  industry_context?: string;
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  priorities?: string[];
}

export interface ChatRequest {
  session_id: string;
  message: string;
  context?: {
    current_insights?: AIInsightsSummary;
    focus_area?: string;
  };
}

export interface ChatResponse {
  message: string;
  suggested_actions?: string[];
  related_insights?: string[];
  follow_up_questions?: string[];
}