export interface UserData {
  id: number;
  name: string;
  role: string;
  level: number;
  skills: {
    vision: number;
    grit: number;
    logic: number;
    algorithm: number;
    problemSolving: number;
  };
  overallReadiness: number;
  programReadiness: {
    [program: string]: number;
  };
  skillDetails: {
    [category: string]: {
      [subskill: string]: number;
    };
  };
  gamingData: {
    levelsCompleted: number;
    totalLevels: number;
    avgTimePerLevel: number;
    gamesPlayed: {
      name: string;
      score: number;
      difficulty: 'easy' | 'medium' | 'hard';
      completed: boolean;
      timeSpent?: number;
    }[];
  };
  visionBoard: {
    goals: string[];
    focusAreas: string[];
    journalEntries: {
      date: string;
      content: string;
    }[];
    keywords: string[];
  };
  personalityExam: {
    type: string;
    traits: {
      [trait: string]: number;
    };
    strengths: string[];
    growthAreas: string[];
    recommendedRoles: string[];
  };
}
export const programThresholds:any = {
  'AI/ML Fundamentals': 85,
  'IoT Tech Support': 60,
  'Data Analytics': 75,
  'Computer Networking': 75,
  'Cyber Security': 80
};
export const userData: any[] = [{
  id: 1,
  name: 'Alex Thompson',
  role: 'Senior Developer',
  level: 8,
  skills: {
    vision: 85,
    grit: 92,
    logic: 78,
    algorithm: 88,
    problemSolving: 82
  },
  overallReadiness: 85,
  programReadiness: {
    'Cyber Security': 85,
    'Computer Networking': 72,
    'Data Analytics': 78,
    'AI/ML Fundamentals': 88,
    'IoT Tech Support': 72
  },
  skillDetails: {
    Technical: {
      Programming: 88,
      Networking: 82,
      Security: 90,
      Algorithms: 78
    },
    'Problem Solving': {
      'Analytical Thinking': 94,
      Debugging: 90,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 82,
      Verbal: 75,
      Presentation: 80
    },
    Leadership: {
      Delegation: 62,
      Motivation: 68,
      'Strategic Thinking': 70
    }
  },
  gamingData: {
    levelsCompleted: 24,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Code Maze',
      score: 850,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.7
    }, {
      name: 'Algorithm Challenge',
      score: 720,
      difficulty: 'medium',
      completed: true,
      timeSpent: 3.5
    }, {
      name: 'Debug Master',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.8
    }]
  },
  visionBoard: {
    goals: ['Lead a development team', 'Master cloud architecture', 'Contribute to open source'],
    focusAreas: ['Leadership', 'Architecture', 'Community'],
    journalEntries: [{
      date: '2023-06-15',
      content: 'Working on improving my delegation skills to prepare for team leadership.'
    }, {
      date: '2023-07-02',
      content: 'Completed my first major contribution to an open source project today.'
    }],
    keywords: ['leadership', 'innovation', 'mentorship', 'architecture']
  },
  personalityExam: {
    type: 'Architect (INTJ)',
    traits: {
      Introversion: 75,
      Intuition: 85,
      Thinking: 90,
      Judging: 80,
      Analytical: 95,
      Creative: 75,
      Efficient: 85,
      Strategic: 90
    },
    strengths: ['Strategic planning', 'Problem-solving', 'System design'],
    growthAreas: ['Emotional expression', 'Team collaboration', 'Patience with less skilled colleagues'],
    recommendedRoles: ['Systems Architect', 'Security Specialist', 'Data Scientist', 'Technical Lead']
  }
}, {
  id: 2,
  name: 'Sarah Johnson',
  role: 'DevOps Engineer',
  level: 7,
  skills: {
    vision: 78,
    grit: 85,
    logic: 90,
    algorithm: 75,
    problemSolving: 88
  },
  overallReadiness: 82,
  programReadiness: {
    'Cyber Security': 88,
    'Computer Networking': 92,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 62,
    'IoT Tech Support': 85
  },
  skillDetails: {
    Technical: {
      Programming: 82,
      Networking: 94,
      Security: 86,
      Algorithms: 72
    },
    'Problem Solving': {
      'Analytical Thinking': 88,
      Debugging: 92,
      'Critical Thinking': 85
    },
    Communication: {
      Written: 78,
      Verbal: 72,
      Presentation: 75
    },
    Leadership: {
      Delegation: 68,
      Motivation: 72,
      'Strategic Thinking': 74
    }
  },
  gamingData: {
    levelsCompleted: 21,
    totalLevels: 30,
    avgTimePerLevel: 2.1,
    gamesPlayed: [{
      name: 'Network Simulator',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'Security Challenge',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 1.9
    }, {
      name: 'Cloud Architect',
      score: 760,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Build automated CI/CD pipelines', 'Achieve cloud certification', 'Improve security practices'],
    focusAreas: ['Automation', 'Cloud', 'Security'],
    journalEntries: [{
      date: '2023-05-20',
      content: 'Successfully implemented my first fully automated deployment pipeline today.'
    }, {
      date: '2023-06-18',
      content: 'Started studying for AWS certification. Finding the networking concepts challenging.'
    }],
    keywords: ['automation', 'efficiency', 'reliability', 'security']
  },
  personalityExam: {
    type: 'Logistician (ISTJ)',
    traits: {
      Introversion: 70,
      Sensing: 80,
      Thinking: 85,
      Judging: 90,
      Practical: 95,
      Reliable: 90,
      Organized: 85,
      Detail_oriented: 90
    },
    strengths: ['Process optimization', 'Reliability', 'Practical problem-solving'],
    growthAreas: ['Adaptability to change', 'Creative thinking', 'Work-life balance'],
    recommendedRoles: ['DevOps Engineer', 'System Administrator', 'Network Engineer', 'Security Analyst']
  }
}, {
  id: 3,
  name: 'Michael Chen',
  role: 'Data Scientist',
  level: 6,
  skills: {
    vision: 92,
    grit: 78,
    logic: 95,
    algorithm: 90,
    problemSolving: 94
  },
  overallReadiness: 90,
  programReadiness: {
    'Cyber Security': 75,
    'Computer Networking': 68,
    'Data Analytics': 95,
    'AI/ML Fundamentals': 92,
    'IoT Tech Support': 65
  },
  skillDetails: {
    Technical: {
      Programming: 92,
      Networking: 70,
      Security: 75,
      Algorithms: 94
    },
    'Problem Solving': {
      'Analytical Thinking': 98,
      Debugging: 88,
      'Critical Thinking': 95
    },
    Communication: {
      Written: 85,
      Verbal: 78,
      Presentation: 82
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 27,
    totalLevels: 30,
    avgTimePerLevel: 1.8,
    gamesPlayed: [{
      name: 'Data Miner',
      score: 980,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.5
    }, {
      name: 'ML Predictor',
      score: 950,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.7
    }, {
      name: 'Statistics Challenge',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 1.4
    }]
  },
  visionBoard: {
    goals: ['Develop an AI research paper', 'Build predictive models for healthcare', 'Master quantum computing'],
    focusAreas: ['Research', 'Healthcare AI', 'Advanced Computing'],
    journalEntries: [{
      date: '2023-04-10',
      content: 'My healthcare prediction model achieved 92% accuracy today. Need to improve specificity.'
    }, {
      date: '2023-05-28',
      content: 'Started learning about quantum computing applications in machine learning.'
    }],
    keywords: ['innovation', 'research', 'algorithms', 'prediction']
  },
  personalityExam: {
    type: 'Analyst (INTP)',
    traits: {
      Introversion: 80,
      Intuition: 90,
      Thinking: 95,
      Perceiving: 75,
      Analytical: 98,
      Curious: 90,
      Logical: 95,
      Innovative: 85
    },
    strengths: ['Complex problem-solving', 'Pattern recognition', 'Theoretical modeling'],
    growthAreas: ['Practical implementation', 'Regular communication', 'Project completion'],
    recommendedRoles: ['Data Scientist', 'AI Researcher', 'Algorithm Developer', 'Systems Analyst']
  }
}, {
  id: 4,
  name: 'Emily Rodriguez',
  role: 'UI/UX Designer',
  level: 5,
  skills: {
    vision: 96,
    grit: 75,
    logic: 82,
    algorithm: 68,
    problemSolving: 78
  },
  overallReadiness: 75,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 82,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 72
  },
  skillDetails: {
    Technical: {
      Programming: 72,
      Networking: 65,
      Security: 68,
      Algorithms: 70
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 75,
      'Critical Thinking': 82
    },
    Communication: {
      Written: 88,
      Verbal: 90,
      Presentation: 92
    },
    Leadership: {
      Delegation: 70,
      Motivation: 78,
      'Strategic Thinking': 75
    }
  },
  gamingData: {
    levelsCompleted: 18,
    totalLevels: 30,
    avgTimePerLevel: 2.7,
    gamesPlayed: [{
      name: 'UI Challenge',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Design Sprint',
      score: 890,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'User Flow Architect',
      score: 850,
      difficulty: 'easy',
      completed: true,
      timeSpent: 1.8
    }]
  },
  visionBoard: {
    goals: ['Create accessible interfaces', 'Design for emerging technologies', 'Build a design system'],
    focusAreas: ['Accessibility', 'Innovation', 'Systematization'],
    journalEntries: [{
      date: '2023-06-05',
      content: 'Completed my first fully accessible design system component library today.'
    }, {
      date: '2023-07-12',
      content: 'Exploring AR/VR interfaces and how they change user interaction patterns.'
    }],
    keywords: ['creativity', 'empathy', 'accessibility', 'innovation']
  },
  personalityExam: {
    type: 'Mediator (INFP)',
    traits: {
      Introversion: 65,
      Intuition: 85,
      Feeling: 90,
      Perceiving: 80,
      Creative: 95,
      Empathetic: 90,
      Idealistic: 85,
      Adaptable: 75
    },
    strengths: ['User empathy', 'Creative design', 'Seeing potential'],
    growthAreas: ['Technical implementation', 'Data analysis', 'Assertiveness'],
    recommendedRoles: ['UX Designer', 'Creative Director', 'Content Strategist', 'User Researcher']
  }
}, {
  id: 5,
  name: 'David Wilson',
  role: 'Security Analyst',
  level: 7,
  skills: {
    vision: 82,
    grit: 88,
    logic: 85,
    algorithm: 78,
    problemSolving: 90
  },
  overallReadiness: 88,
  programReadiness: {
    'Cyber Security': 96,
    'Computer Networking': 88,
    'Data Analytics': 72,
    'AI/ML Fundamentals': 65,
    'IoT Tech Support': 78
  },
  skillDetails: {
    Technical: {
      Programming: 80,
      Networking: 88,
      Security: 96,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 92,
      Debugging: 85,
      'Critical Thinking': 90
    },
    Communication: {
      Written: 85,
      Verbal: 80,
      Presentation: 78
    },
    Leadership: {
      Delegation: 72,
      Motivation: 75,
      'Strategic Thinking': 82
    }
  },
  gamingData: {
    levelsCompleted: 23,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Cyber Defense',
      score: 960,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Ethical Hacking',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Encryption Challenge',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 1.9
    }]
  },
  visionBoard: {
    goals: ['Build secure systems', 'Implement zero-trust architecture', 'Educate on security best practices'],
    focusAreas: ['Security', 'Education', 'Architecture'],
    journalEntries: [{
      date: '2023-05-15',
      content: 'Identified and patched a critical vulnerability in our authentication system.'
    }, {
      date: '2023-06-22',
      content: 'Conducted a security workshop for the development team. Good engagement.'
    }],
    keywords: ['security', 'vigilance', 'protection', 'education']
  },
  personalityExam: {
    type: 'Defender (ISFJ)',
    traits: {
      Introversion: 70,
      Sensing: 85,
      Feeling: 65,
      Judging: 90,
      Protective: 95,
      Detail_oriented: 90,
      Loyal: 85,
      Responsible: 95
    },
    strengths: ['Threat detection', 'Meticulous analysis', 'Procedural security'],
    growthAreas: ['Innovation in approaches', 'Work-life balance', 'Delegation'],
    recommendedRoles: ['Security Analyst', 'Compliance Officer', 'System Administrator', 'Risk Analyst']
  }
}, {
  id: 6,
  name: 'Lisa Kim',
  role: 'Junior Developer',
  level: 3,
  skills: {
    vision: 72,
    grit: 80,
    logic: 75,
    algorithm: 70,
    problemSolving: 68
  },
  overallReadiness: 68,
  programReadiness: {
    'Cyber Security': 62,
    'Computer Networking': 65,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 55,
    'IoT Tech Support': 68
  },
  skillDetails: {
    Technical: {
      Programming: 75,
      Networking: 65,
      Security: 60,
      Algorithms: 68
    },
    'Problem Solving': {
      'Analytical Thinking': 72,
      Debugging: 70,
      'Critical Thinking': 68
    },
    Communication: {
      Written: 75,
      Verbal: 65,
      Presentation: 62
    },
    Leadership: {
      Delegation: 55,
      Motivation: 60,
      'Strategic Thinking': 58
    }
  },
  gamingData: {
    levelsCompleted: 15,
    totalLevels: 30,
    avgTimePerLevel: 3.1,
    gamesPlayed: [{
      name: 'Code Basics',
      score: 780,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.8
    }, {
      name: 'Logic Puzzles',
      score: 720,
      difficulty: 'easy',
      completed: true,
      timeSpent: 3.2
    }, {
      name: 'Debug Challenge',
      score: 650,
      difficulty: 'medium',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Master full-stack development', 'Contribute to a team project', 'Learn cloud deployment'],
    focusAreas: ['Technical Skills', 'Collaboration', 'Cloud'],
    journalEntries: [{
      date: '2023-06-10',
      content: 'Completed my first React component today. Still struggling with state management.'
    }, {
      date: '2023-07-05',
      content: 'Working on a team project has been challenging but rewarding.'
    }],
    keywords: ['learning', 'growth', 'persistence', 'development']
  },
  personalityExam: {
    type: 'Adventurer (ISFP)',
    traits: {
      Introversion: 60,
      Sensing: 70,
      Feeling: 85,
      Perceiving: 75,
      Artistic: 80,
      Curious: 75,
      Adaptable: 85,
      Practical: 70
    },
    strengths: ['Adaptability', 'Aesthetic sense', 'Hands-on learning'],
    growthAreas: ['Theoretical concepts', 'Long-term planning', 'Technical documentation'],
    recommendedRoles: ['Front-end Developer', 'UI Developer', 'Creative Technologist', 'QA Tester']
  }
}, {
  id: 7,
  name: 'James Parker',
  role: 'Backend Developer',
  level: 6,
  skills: {
    vision: 75,
    grit: 84,
    logic: 92,
    algorithm: 88,
    problemSolving: 86
  },
  overallReadiness: 84,
  programReadiness: {
    'Cyber Security': 76,
    'Computer Networking': 80,
    'Data Analytics': 78,
    'AI/ML Fundamentals': 72,
    'IoT Tech Support': 65
  },
  skillDetails: {
    Technical: {
      Programming: 92,
      Networking: 78,
      Security: 74,
      Algorithms: 90
    },
    'Problem Solving': {
      'Analytical Thinking': 88,
      Debugging: 92,
      'Critical Thinking': 84
    },
    Communication: {
      Written: 76,
      Verbal: 70,
      Presentation: 68
    },
    Leadership: {
      Delegation: 65,
      Motivation: 62,
      'Strategic Thinking': 70
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.4,
    gamesPlayed: [{
      name: 'Database Master',
      score: 890,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'API Challenge',
      score: 840,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'System Architecture',
      score: 780,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Master microservices architecture', 'Contribute to database optimization', 'Learn Rust programming'],
    focusAreas: ['Architecture', 'Performance', 'New Technologies'],
    journalEntries: [{
      date: '2023-05-12',
      content: 'Implemented my first microservice today. Challenging but rewarding.'
    }, {
      date: '2023-06-20',
      content: 'Optimized database queries resulting in 40% performance improvement.'
    }],
    keywords: ['backend', 'performance', 'architecture', 'Algorithms']
  },
  personalityExam: {
    type: 'Logician (INTP)',
    traits: {
      Introversion: 75,
      Intuition: 80,
      Thinking: 90,
      Perceiving: 70,
      Analytical: 92,
      Logical: 95,
      Independent: 85,
      Innovative: 78
    },
    strengths: ['System design', 'Logical analysis', 'Problem decomposition'],
    growthAreas: ['Team communication', 'Patience with less technical stakeholders', 'Documenting processes'],
    recommendedRoles: ['Backend Developer', 'Database Administrator', 'Systems Architect', 'API Designer']
  }
}, {
  id: 8,
  name: 'Olivia Martinez',
  role: 'Product Manager',
  level: 7,
  skills: {
    vision: 94,
    grit: 86,
    logic: 82,
    algorithm: 70,
    problemSolving: 88
  },
  overallReadiness: 86,
  programReadiness: {
    'Cyber Security': 70,
    'Computer Networking': 65,
    'Data Analytics': 88,
    'AI/ML Fundamentals': 75,
    'IoT Tech Support': 68
  },
  skillDetails: {
    Technical: {
      Programming: 70,
      Networking: 65,
      Security: 72,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 78,
      'Critical Thinking': 92
    },
    Communication: {
      Written: 94,
      Verbal: 92,
      Presentation: 90
    },
    Leadership: {
      Delegation: 88,
      Motivation: 90,
      'Strategic Thinking': 92
    }
  },
  gamingData: {
    levelsCompleted: 20,
    totalLevels: 30,
    avgTimePerLevel: 2.5,
    gamesPlayed: [{
      name: 'Product Strategy',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'User Insights',
      score: 890,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Market Simulation',
      score: 850,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.8
    }]
  },
  visionBoard: {
    goals: ['Launch innovative product', 'Build high-performing team', 'Develop market analysis skills'],
    focusAreas: ['Leadership', 'Innovation', 'Market Analysis'],
    journalEntries: [{
      date: '2023-05-18',
      content: 'Successfully launched our new feature with 30% higher adoption than expected.'
    }, {
      date: '2023-06-25',
      content: 'Working on improving my technical understanding to better communicate with developers.'
    }],
    keywords: ['leadership', 'strategy', 'innovation', 'communication']
  },
  personalityExam: {
    type: 'Commander (ENTJ)',
    traits: {
      Extraversion: 85,
      Intuition: 80,
      Thinking: 75,
      Judging: 90,
      Strategic: 92,
      Decisive: 88,
      Confident: 85,
      Efficient: 90
    },
    strengths: ['Strategic planning', 'Team leadership', 'Decision-making'],
    growthAreas: ['Empathy in communication', 'Patience with process', 'Detail-oriented work'],
    recommendedRoles: ['Product Manager', 'Project Manager', 'Team Lead', 'Strategy Consultant']
  }
}, {
  id: 9,
  name: 'Robert Lee',
  role: 'QA Engineer',
  level: 5,
  skills: {
    vision: 78,
    grit: 85,
    logic: 88,
    algorithm: 75,
    problemSolving: 82
  },
  overallReadiness: 80,
  programReadiness: {
    'Cyber Security': 78,
    'Computer Networking': 72,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 65,
    'IoT Tech Support': 82
  },
  skillDetails: {
    Technical: {
      Programming: 78,
      Networking: 72,
      Security: 80,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 92,
      'Critical Thinking': 80
    },
    Communication: {
      Written: 85,
      Verbal: 78,
      Presentation: 75
    },
    Leadership: {
      Delegation: 68,
      Motivation: 72,
      'Strategic Thinking': 70
    }
  },
  gamingData: {
    levelsCompleted: 19,
    totalLevels: 30,
    avgTimePerLevel: 2.6,
    gamesPlayed: [{
      name: 'Bug Hunter',
      score: 910,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Test Automation',
      score: 850,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.7
    }, {
      name: 'Edge Case Master',
      score: 780,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Master test automation', 'Implement CI/CD testing', 'Learn performance testing'],
    focusAreas: ['Automation', 'Quality', 'Performance'],
    journalEntries: [{
      date: '2023-05-22',
      content: 'Reduced manual testing time by 60% through new automation framework.'
    }, {
      date: '2023-06-30',
      content: 'Identified critical performance bottleneck that would have affected launch.'
    }],
    keywords: ['quality', 'testing', 'automation', 'reliability']
  },
  personalityExam: {
    type: 'Inspector (ISTJ)',
    traits: {
      Introversion: 70,
      Sensing: 85,
      Thinking: 80,
      Judging: 90,
      Thorough: 95,
      Reliable: 90,
      Practical: 85,
      Organized: 88
    },
    strengths: ['Attention to detail', 'Process adherence', 'Thoroughness'],
    growthAreas: ['Flexibility with change', 'Creative approaches', 'Theoretical concepts'],
    recommendedRoles: ['QA Engineer', 'Test Automation Specialist', 'Quality Analyst', 'Compliance Specialist']
  }
}, {
  id: 10,
  name: 'Sophia Williams',
  role: 'Frontend Developer',
  level: 5,
  skills: {
    vision: 88,
    grit: 75,
    logic: 82,
    algorithm: 76,
    problemSolving: 80
  },
  overallReadiness: 78,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 72,
    'AI/ML Fundamentals': 68,
    'IoT Tech Support': 62
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 62,
      Security: 68,
      Algorithms: 70
    },
    'Problem Solving': {
      'Analytical Thinking': 80,
      Debugging: 84,
      'Critical Thinking': 78
    },
    Communication: {
      Written: 82,
      Verbal: 78,
      Presentation: 75
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 68
    }
  },
  gamingData: {
    levelsCompleted: 18,
    totalLevels: 30,
    avgTimePerLevel: 2.7,
    gamesPlayed: [{
      name: 'UI Builder',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'React Challenge',
      score: 820,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.8
    }, {
      name: 'Animation Master',
      score: 760,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Master React and frontend frameworks', 'Create accessible components', 'Learn advanced animations'],
    focusAreas: ['UI/UX', 'Accessibility', 'Animation'],
    journalEntries: [{
      date: '2023-05-25',
      content: 'Built my first fully accessible component library with ARIA support.'
    }, {
      date: '2023-07-08',
      content: 'Started learning advanced CSS animations and transitions for better UX.'
    }],
    keywords: ['frontend', 'design', 'accessibility', 'user experience']
  },
  personalityExam: {
    type: 'Advocate (INFJ)',
    traits: {
      Introversion: 65,
      Intuition: 80,
      Feeling: 75,
      Judging: 70,
      Creative: 88,
      Empathetic: 85,
      Organized: 75,
      Visionary: 82
    },
    strengths: ['User empathy', 'Design thinking', 'Attention to detail'],
    growthAreas: ['Technical depth', 'Performance optimization', 'Assertiveness'],
    recommendedRoles: ['Frontend Developer', 'UI Developer', 'Interaction Designer', 'Design System Developer']
  }
}, {
  id: 11,
  name: 'Daniel Garcia',
  role: 'Cloud Architect',
  level: 8,
  skills: {
    vision: 90,
    grit: 85,
    logic: 92,
    algorithm: 80,
    problemSolving: 88
  },
  overallReadiness: 89,
  programReadiness: {
    'Cyber Security': 85,
    'Computer Networking': 92,
    'Data Analytics': 78,
    'AI/ML Fundamentals': 75,
    'IoT Tech Support': 88
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 92,
      Security: 88,
      Algorithms: 82
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 85,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 80,
      Verbal: 85,
      Presentation: 82
    },
    Leadership: {
      Delegation: 78,
      Motivation: 80,
      'Strategic Thinking': 92
    }
  },
  gamingData: {
    levelsCompleted: 26,
    totalLevels: 30,
    avgTimePerLevel: 2.0,
    gamesPlayed: [{
      name: 'Cloud Builder',
      score: 950,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.8
    }, {
      name: 'Infrastructure Challenge',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Disaster Recovery',
      score: 880,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.3
    }]
  },
  visionBoard: {
    goals: ['Design scalable cloud solutions', 'Master multi-cloud strategies', 'Implement serverless architectures'],
    focusAreas: ['Scalability', 'Security', 'Cost Optimization'],
    journalEntries: [{
      date: '2023-04-18',
      content: 'Successfully migrated our entire infrastructure to a multi-cloud setup.'
    }, {
      date: '2023-06-05',
      content: 'Reduced cloud costs by 35% while improving performance through optimization.'
    }],
    keywords: ['architecture', 'cloud', 'scalability', 'infrastructure']
  },
  personalityExam: {
    type: 'Architect (INTJ)',
    traits: {
      Introversion: 70,
      Intuition: 90,
      Thinking: 85,
      Judging: 80,
      Strategic: 95,
      Analytical: 90,
      Independent: 85,
      Innovative: 80
    },
    strengths: ['Systems thinking', 'Strategic planning', 'Technical architecture'],
    growthAreas: ['Team communication', 'Patience with less technical stakeholders', 'Documenting processes'],
    recommendedRoles: ['Cloud Architect', 'Solutions Architect', 'Infrastructure Engineer', 'DevOps Lead']
  }
}, {
  id: 12,
  name: 'Aisha Patel',
  role: 'Machine Learning Engineer',
  level: 6,
  skills: {
    vision: 85,
    grit: 80,
    logic: 94,
    algorithm: 92,
    problemSolving: 90
  },
  overallReadiness: 87,
  programReadiness: {
    'Cyber Security': 70,
    'Computer Networking': 65,
    'Data Analytics': 90,
    'AI/ML Fundamentals': 95,
    'IoT Tech Support': 68
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 65,
      Security: 72,
      Algorithms: 85
    },
    'Problem Solving': {
      'Analytical Thinking': 94,
      Debugging: 88,
      'Critical Thinking': 92
    },
    Communication: {
      Written: 85,
      Verbal: 80,
      Presentation: 78
    },
    Leadership: {
      Delegation: 70,
      Motivation: 75,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 24,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Neural Network Builder',
      score: 930,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'ML Challenge',
      score: 910,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Data Visualization',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 1.9
    }]
  },
  visionBoard: {
    goals: ['Develop state-of-the-art ML models', 'Apply AI to solve real-world problems', 'Research neural network architectures'],
    focusAreas: ['Research', 'Application', 'Optimization'],
    journalEntries: [{
      date: '2023-05-02',
      content: 'My computer vision model achieved 95% accuracy on the benchmark dataset.'
    }, {
      date: '2023-06-15',
      content: 'Started exploring reinforcement learning techniques for our recommendation system.'
    }],
    keywords: ['machine learning', 'AI', 'research', 'algorithms']
  },
  personalityExam: {
    type: 'Logician (INTP)',
    traits: {
      Introversion: 75,
      Intuition: 90,
      Thinking: 95,
      Perceiving: 70,
      Analytical: 95,
      Curious: 90,
      Logical: 95,
      Innovative: 85
    },
    strengths: ['Algorithm development', 'Pattern recognition', 'Research'],
    growthAreas: ['Practical implementation', 'Team communication', 'Project timelines'],
    recommendedRoles: ['Machine Learning Engineer', 'AI Researcher', 'Data Scientist', 'Algorithm Developer']
  }
}, {
  id: 13,
  name: 'Marcus Johnson',
  role: 'Mobile Developer',
  level: 5,
  skills: {
    vision: 80,
    grit: 85,
    logic: 82,
    algorithm: 78,
    problemSolving: 80
  },
  overallReadiness: 79,
  programReadiness: {
    'Cyber Security': 72,
    'Computer Networking': 68,
    'Data Analytics': 65,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 75
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 70,
      Security: 75,
      Algorithms: 72
    },
    'Problem Solving': {
      'Analytical Thinking': 80,
      Debugging: 85,
      'Critical Thinking': 78
    },
    Communication: {
      Written: 75,
      Verbal: 78,
      Presentation: 72
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 68
    }
  },
  gamingData: {
    levelsCompleted: 19,
    totalLevels: 30,
    avgTimePerLevel: 2.5,
    gamesPlayed: [{
      name: 'Mobile UI Builder',
      score: 860,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'App Performance',
      score: 820,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.6
    }, {
      name: 'Cross-Platform Challenge',
      score: 780,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Master cross-platform development', 'Create intuitive mobile interfaces', 'Learn native app optimization'],
    focusAreas: ['Mobile UX', 'Performance', 'Cross-Platform'],
    journalEntries: [{
      date: '2023-05-10',
      content: 'Successfully launched our app on both iOS and Android with a single codebase.'
    }, {
      date: '2023-06-22',
      content: 'Working on reducing app size and improving startup performance.'
    }],
    keywords: ['mobile', 'user experience', 'performance', 'cross-platform']
  },
  personalityExam: {
    type: 'Virtuoso (ISTP)',
    traits: {
      Introversion: 65,
      Sensing: 75,
      Thinking: 80,
      Perceiving: 70,
      Practical: 85,
      Adaptable: 80,
      Logical: 82,
      Efficient: 78
    },
    strengths: ['Technical problem-solving', 'Adaptability', 'Efficiency'],
    growthAreas: ['Long-term planning', 'Documentation', 'Theoretical concepts'],
    recommendedRoles: ['Mobile Developer', 'Frontend Developer', 'UI Engineer', 'App Developer']
  }
}, {
  id: 14,
  name: 'Emma Taylor',
  role: 'Technical Writer',
  level: 4,
  skills: {
    vision: 82,
    grit: 75,
    logic: 78,
    algorithm: 65,
    problemSolving: 72
  },
  overallReadiness: 72,
  programReadiness: {
    'Cyber Security': 68,
    'Computer Networking': 65,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 62,
    'IoT Tech Support': 75
  },
  skillDetails: {
    Technical: {
      Programming: 70,
      Networking: 65,
      Security: 68,
      Algorithms: 62
    },
    'Problem Solving': {
      'Analytical Thinking': 75,
      Debugging: 68,
      'Critical Thinking': 80
    },
    Communication: {
      Written: 95,
      Verbal: 85,
      Presentation: 82
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 72
    }
  },
  gamingData: {
    levelsCompleted: 16,
    totalLevels: 30,
    avgTimePerLevel: 2.8,
    gamesPlayed: [{
      name: 'Documentation Master',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'API Documentation',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.7
    }, {
      name: 'Technical Storytelling',
      score: 850,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.3
    }]
  },
  visionBoard: {
    goals: ['Create comprehensive documentation', 'Master technical communication', 'Learn content management systems'],
    focusAreas: ['Documentation', 'Communication', 'User Education'],
    journalEntries: [{
      date: '2023-05-15',
      content: 'Completely revamped our API documentation, resulting in 40% fewer support tickets.'
    }, {
      date: '2023-06-28',
      content: 'Working on creating interactive tutorials to improve user onboarding.'
    }],
    keywords: ['documentation', 'clarity', 'communication', 'education']
  },
  personalityExam: {
    type: 'Mediator (INFP)',
    traits: {
      Introversion: 70,
      Intuition: 80,
      Feeling: 75,
      Perceiving: 65,
      Empathetic: 85,
      Creative: 82,
      Idealistic: 78,
      Expressive: 88
    },
    strengths: ['Clear communication', 'User empathy', 'Simplifying concepts'],
    growthAreas: ['Technical depth', 'Process adherence', 'Handling criticism'],
    recommendedRoles: ['Technical Writer', 'Documentation Specialist', 'Content Developer', 'User Education Specialist']
  }
}, {
  id: 15,
  name: 'Jamal Washington',
  role: 'System Administrator',
  level: 6,
  skills: {
    vision: 75,
    grit: 90,
    logic: 85,
    algorithm: 72,
    problemSolving: 88
  },
  overallReadiness: 82,
  programReadiness: {
    'Cyber Security': 85,
    'Computer Networking': 90,
    'Data Analytics': 65,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 88
  },
  skillDetails: {
    Technical: {
      Programming: 75,
      Networking: 92,
      Security: 88,
      Algorithms: 78
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 90,
      'Critical Thinking': 82
    },
    Communication: {
      Written: 78,
      Verbal: 75,
      Presentation: 72
    },
    Leadership: {
      Delegation: 70,
      Motivation: 75,
      'Strategic Thinking': 72
    }
  },
  gamingData: {
    levelsCompleted: 21,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Network Defense',
      score: 910,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Server Management',
      score: 890,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Disaster Recovery',
      score: 850,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.5
    }]
  },
  visionBoard: {
    goals: ['Build resilient infrastructure', 'Automate system management', 'Improve security posture'],
    focusAreas: ['Automation', 'Reliability', 'Security'],
    journalEntries: [{
      date: '2023-04-25',
      content: 'Implemented automated server provisioning, reducing setup time from days to hours.'
    }, {
      date: '2023-06-10',
      content: 'Successfully handled a major outage with minimal downtime through our new DR plan.'
    }],
    keywords: ['infrastructure', 'reliability', 'automation', 'security']
  },
  personalityExam: {
    type: 'Defender (ISFJ)',
    traits: {
      Introversion: 65,
      Sensing: 85,
      Feeling: 70,
      Judging: 90,
      Reliable: 95,
      Practical: 90,
      Detail_oriented: 85,
      Protective: 88
    },
    strengths: ['System reliability', 'Problem prevention', 'Crisis handling'],
    growthAreas: ['Embracing change', 'Strategic planning', 'Delegation'],
    recommendedRoles: ['System Administrator', 'Network Engineer', 'Infrastructure Specialist', 'IT Operations Manager']
  }
}, {
  id: 16,
  name: 'Natalie Wong',
  role: 'Business Analyst',
  level: 5,
  skills: {
    vision: 88,
    grit: 80,
    logic: 85,
    algorithm: 70,
    problemSolving: 82
  },
  overallReadiness: 78,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 88,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 62
  },
  skillDetails: {
    Technical: {
      Programming: 68,
      Networking: 60,
      Security: 65,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 75,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 90,
      Verbal: 88,
      Presentation: 85
    },
    Leadership: {
      Delegation: 75,
      Motivation: 80,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 18,
    totalLevels: 30,
    avgTimePerLevel: 2.6,
    gamesPlayed: [{
      name: 'Requirements Gathering',
      score: 900,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Process Modeling',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'Stakeholder Management',
      score: 850,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.2
    }]
  },
  visionBoard: {
    goals: ['Bridge business and technical teams', 'Improve requirements processes', 'Learn data analysis techniques'],
    focusAreas: ['Communication', 'Process Improvement', 'Analysis'],
    journalEntries: [{
      date: '2023-05-08',
      content: 'Successfully facilitated a requirements workshop that aligned all stakeholders.'
    }, {
      date: '2023-06-20',
      content: 'Working on improving my SQL skills to better analyze business data.'
    }],
    keywords: ['analysis', 'requirements', 'communication', 'process']
  },
  personalityExam: {
    type: 'Consul (ESFJ)',
    traits: {
      Extraversion: 80,
      Sensing: 75,
      Feeling: 85,
      Judging: 70,
      Organized: 85,
      Communicative: 90,
      Supportive: 85,
      Practical: 80
    },
    strengths: ['Stakeholder management', 'Communication', 'Process organization'],
    growthAreas: ['Technical depth', 'Independent decision-making', 'Handling conflict'],
    recommendedRoles: ['Business Analyst', 'Product Owner', 'Requirements Analyst', 'Process Improvement Specialist']
  }
}, {
  id: 17,
  name: 'Tyler Robinson',
  role: 'Game Developer',
  level: 4,
  skills: {
    vision: 85,
    grit: 78,
    logic: 82,
    algorithm: 80,
    problemSolving: 84
  },
  overallReadiness: 76,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 68,
    'AI/ML Fundamentals': 75,
    'IoT Tech Support': 62
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 62,
      Security: 60,
      Algorithms: 68
    },
    'Problem Solving': {
      'Analytical Thinking': 82,
      Debugging: 85,
      'Critical Thinking': 80
    },
    Communication: {
      Written: 75,
      Verbal: 72,
      Presentation: 70
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 75
    }
  },
  gamingData: {
    levelsCompleted: 17,
    totalLevels: 30,
    avgTimePerLevel: 2.7,
    gamesPlayed: [{
      name: 'Game Physics',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'Graphics Programming',
      score: 840,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.8
    }, {
      name: 'AI Pathfinding',
      score: 790,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Create immersive game experiences', 'Master 3D graphics programming', 'Learn game AI techniques'],
    focusAreas: ['Graphics', 'Game Mechanics', 'User Experience'],
    journalEntries: [{
      date: '2023-05-12',
      content: 'Implemented a new physics system that makes character movement much more realistic.'
    }, {
      date: '2023-06-25',
      content: 'Working on optimizing rendering for better performance on mobile devices.'
    }],
    keywords: ['games', 'graphics', 'physics', 'interactive']
  },
  personalityExam: {
    type: 'Adventurer (ISFP)',
    traits: {
      Introversion: 65,
      Sensing: 70,
      Feeling: 75,
      Perceiving: 80,
      Creative: 90,
      Artistic: 85,
      Practical: 75,
      Adaptable: 80
    },
    strengths: ['Creative problem-solving', 'Visual design', 'User empathy'],
    growthAreas: ['Project planning', 'Technical documentation', 'Team communication'],
    recommendedRoles: ['Game Developer', 'Graphics Programmer', 'Game Designer', 'Interactive Media Developer']
  }
}, {
  id: 18,
  name: 'Priya Sharma',
  role: 'Database Administrator',
  level: 7,
  skills: {
    vision: 78,
    grit: 85,
    logic: 90,
    algorithm: 82,
    problemSolving: 85
  },
  overallReadiness: 84,
  programReadiness: {
    'Cyber Security': 80,
    'Computer Networking': 75,
    'Data Analytics': 92,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 65
  },
  skillDetails: {
    Technical: {
      Programming: 82,
      Networking: 75,
      Security: 85,
      Algorithms: 95
    },
    'Problem Solving': {
      'Analytical Thinking': 88,
      Debugging: 90,
      'Critical Thinking': 85
    },
    Communication: {
      Written: 80,
      Verbal: 75,
      Presentation: 72
    },
    Leadership: {
      Delegation: 70,
      Motivation: 68,
      'Strategic Thinking': 75
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Query Optimizer',
      score: 950,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Database Design',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Performance Tuning',
      score: 900,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }]
  },
  visionBoard: {
    goals: ['Optimize database performance', 'Implement robust data security', 'Master distributed database systems'],
    focusAreas: ['Performance', 'Security', 'Scalability'],
    journalEntries: [{
      date: '2023-04-20',
      content: 'Optimized our main transaction database, reducing query times by 60%.'
    }, {
      date: '2023-06-08',
      content: 'Implemented a new backup and recovery system with zero data loss guarantee.'
    }],
    keywords: ['Algorithms', 'performance', 'data', 'optimization']
  },
  personalityExam: {
    type: 'Logistician (ISTJ)',
    traits: {
      Introversion: 75,
      Sensing: 85,
      Thinking: 90,
      Judging: 85,
      Organized: 92,
      Detail_oriented: 95,
      Reliable: 90,
      Practical: 85
    },
    strengths: ['Data organization', 'System reliability', 'Optimization'],
    growthAreas: ['Adapting to rapid changes', 'Communicating with non-technical users', 'Strategic vision'],
    recommendedRoles: ['Database Administrator', 'Data Engineer', 'Database Architect', 'Data Operations Specialist']
  }
}, {
  id: 19,
  name: 'Jason Miller',
  role: 'Network Engineer',
  level: 6,
  skills: {
    vision: 75,
    grit: 88,
    logic: 85,
    algorithm: 78,
    problemSolving: 82
  },
  overallReadiness: 80,
  programReadiness: {
    'Cyber Security': 85,
    'Computer Networking': 95,
    'Data Analytics': 65,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 82
  },
  skillDetails: {
    Technical: {
      Programming: 70,
      Networking: 95,
      Security: 88,
      Algorithms: 65
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 90,
      'Critical Thinking': 82
    },
    Communication: {
      Written: 75,
      Verbal: 78,
      Presentation: 72
    },
    Leadership: {
      Delegation: 70,
      Motivation: 72,
      'Strategic Thinking': 75
    }
  },
  gamingData: {
    levelsCompleted: 21,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Network Simulator',
      score: 950,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Routing Challenge',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Security Defense',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }]
  },
  visionBoard: {
    goals: ['Build resilient network architectures', 'Implement software-defined networking', 'Master network security'],
    focusAreas: ['Reliability', 'Performance', 'Security'],
    journalEntries: [{
      date: '2023-05-05',
      content: 'Completed our network segmentation project, improving both security and performance.'
    }, {
      date: '2023-06-18',
      content: 'Working on implementing SD-WAN to improve our branch connectivity.'
    }],
    keywords: ['networking', 'infrastructure', 'connectivity', 'security']
  },
  personalityExam: {
    type: 'Inspector (ISTJ)',
    traits: {
      Introversion: 70,
      Sensing: 85,
      Thinking: 80,
      Judging: 85,
      Methodical: 90,
      Reliable: 92,
      Detail_oriented: 85,
      Practical: 88
    },
    strengths: ['Technical troubleshooting', 'System reliability', 'Attention to detail'],
    growthAreas: ['Adapting to new technologies', 'Strategic planning', 'Interpersonal communication'],
    recommendedRoles: ['Network Engineer', 'Network Architect', 'Systems Engineer', 'Infrastructure Specialist']
  }
}, {
  id: 20,
  name: 'Zoe Anderson',
  role: 'Content Strategist',
  level: 4,
  skills: {
    vision: 92,
    grit: 78,
    logic: 75,
    algorithm: 65,
    problemSolving: 80
  },
  overallReadiness: 74,
  programReadiness: {
    'Cyber Security': 60,
    'Computer Networking': 55,
    'Data Analytics': 78,
    'AI/ML Fundamentals': 65,
    'IoT Tech Support': 60
  },
  skillDetails: {
    Technical: {
      Programming: 65,
      Networking: 55,
      Security: 60,
      Algorithms: 68
    },
    'Problem Solving': {
      'Analytical Thinking': 82,
      Debugging: 70,
      'Critical Thinking': 85
    },
    Communication: {
      Written: 95,
      Verbal: 88,
      Presentation: 90
    },
    Leadership: {
      Delegation: 75,
      Motivation: 82,
      'Strategic Thinking': 88
    }
  },
  gamingData: {
    levelsCompleted: 16,
    totalLevels: 30,
    avgTimePerLevel: 2.8,
    gamesPlayed: [{
      name: 'Content Planning',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'User Journey Mapping',
      score: 890,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.7
    }, {
      name: 'Information Architecture',
      score: 850,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.3
    }]
  },
  visionBoard: {
    goals: ['Create cohesive content strategies', 'Improve user engagement', 'Develop content measurement frameworks'],
    focusAreas: ['User Experience', 'Engagement', 'Analytics'],
    journalEntries: [{
      date: '2023-05-10',
      content: 'Our new content strategy increased user engagement by 45% in the first month.'
    }, {
      date: '2023-06-22',
      content: 'Working on developing better content metrics to measure business impact.'
    }],
    keywords: ['content', 'strategy', 'communication', 'user experience']
  },
  personalityExam: {
    type: 'Protagonist (ENFJ)',
    traits: {
      Extraversion: 85,
      Intuition: 80,
      Feeling: 85,
      Judging: 75,
      Empathetic: 90,
      Communicative: 92,
      Strategic: 85,
      Inspiring: 88
    },
    strengths: ['Communication strategy', 'User empathy', 'Team inspiration'],
    growthAreas: ['Technical understanding', 'Data analysis', 'Detail management'],
    recommendedRoles: ['Content Strategist', 'UX Writer', 'Communications Manager', 'Brand Strategist']
  }
}, {
  id: 21,
  name: 'Ryan Cooper',
  role: 'IT Support Specialist',
  level: 3,
  skills: {
    vision: 70,
    grit: 85,
    logic: 78,
    algorithm: 65,
    problemSolving: 80
  },
  overallReadiness: 70,
  programReadiness: {
    'Cyber Security': 72,
    'Computer Networking': 78,
    'Data Analytics': 60,
    'AI/ML Fundamentals': 55,
    'IoT Tech Support': 85
  },
  skillDetails: {
    Technical: {
      Programming: 68,
      Networking: 80,
      Security: 75,
      Algorithms: 65
    },
    'Problem Solving': {
      'Analytical Thinking': 78,
      Debugging: 85,
      'Critical Thinking': 75
    },
    Communication: {
      Written: 80,
      Verbal: 85,
      Presentation: 75
    },
    Leadership: {
      Delegation: 65,
      Motivation: 70,
      'Strategic Thinking': 62
    }
  },
  gamingData: {
    levelsCompleted: 15,
    totalLevels: 30,
    avgTimePerLevel: 2.9,
    gamesPlayed: [{
      name: 'Troubleshooting Master',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.7
    }, {
      name: 'Help Desk Simulator',
      score: 850,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'Network Diagnostics',
      score: 780,
      difficulty: 'medium',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Improve technical troubleshooting', 'Learn automation for common issues', 'Develop customer service skills'],
    focusAreas: ['Troubleshooting', 'Automation', 'Communication'],
    journalEntries: [{
      date: '2023-05-15',
      content: 'Created my first PowerShell script to automate password resets, saving hours each week.'
    }, {
      date: '2023-06-28',
      content: 'Working on improving my networking knowledge to better handle connectivity issues.'
    }],
    keywords: ['support', 'troubleshooting', 'service', 'resolution']
  },
  personalityExam: {
    type: 'Consul (ESFJ)',
    traits: {
      Extraversion: 80,
      Sensing: 75,
      Feeling: 85,
      Judging: 70,
      Helpful: 90,
      Practical: 85,
      Organized: 75,
      Communicative: 88
    },
    strengths: ['User support', 'Clear communication', 'Problem resolution'],
    growthAreas: ['Technical depth', 'Handling difficult users', 'Advanced troubleshooting'],
    recommendedRoles: ['IT Support Specialist', 'Help Desk Technician', 'Technical Support Engineer', 'Customer Success Specialist']
  }
}, {
  id: 22,
  name: 'Leila Nguyen',
  role: 'Project Manager',
  level: 6,
  skills: {
    vision: 88,
    grit: 90,
    logic: 82,
    algorithm: 65,
    problemSolving: 85
  },
  overallReadiness: 83,
  programReadiness: {
    'Cyber Security': 70,
    'Computer Networking': 65,
    'Data Analytics': 78,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 72
  },
  skillDetails: {
    Technical: {
      Programming: 65,
      Networking: 60,
      Security: 70,
      Algorithms: 68
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 75,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 90,
      Verbal: 92,
      Presentation: 88
    },
    Leadership: {
      Delegation: 90,
      Motivation: 92,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 20,
    totalLevels: 30,
    avgTimePerLevel: 2.5,
    gamesPlayed: [{
      name: 'Project Simulator',
      score: 930,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Resource Management',
      score: 910,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Risk Assessment',
      score: 880,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.7
    }]
  },
  visionBoard: {
    goals: ['Lead successful project deliveries', 'Implement agile methodologies', 'Develop team leadership skills'],
    focusAreas: ['Leadership', 'Process', 'Delivery'],
    journalEntries: [{
      date: '2023-04-28',
      content: 'Successfully delivered our major platform upgrade two weeks ahead of schedule.'
    }, {
      date: '2023-06-15',
      content: 'Working on improving our sprint planning process to better manage dependencies.'
    }],
    keywords: ['project management', 'leadership', 'delivery', 'organization']
  },
  personalityExam: {
    type: 'Commander (ENTJ)',
    traits: {
      Extraversion: 85,
      Intuition: 75,
      Thinking: 80,
      Judging: 90,
      Organized: 92,
      Decisive: 88,
      Strategic: 85,
      Efficient: 90
    },
    strengths: ['Project planning', 'Team leadership', 'Problem resolution'],
    growthAreas: ['Empathy with team members', 'Flexibility with change', 'Technical depth'],
    recommendedRoles: ['Project Manager', 'Program Manager', 'Delivery Lead', 'Scrum Master']
  }
}, {
  id: 23,
  name: 'Carlos Mendez',
  role: 'AR/VR Developer',
  level: 5,
  skills: {
    vision: 92,
    grit: 78,
    logic: 85,
    algorithm: 80,
    problemSolving: 82
  },
  overallReadiness: 81,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 78,
    'IoT Tech Support': 75
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 65,
      Security: 68,
      Algorithms: 70
    },
    'Problem Solving': {
      'Analytical Thinking': 82,
      Debugging: 85,
      'Critical Thinking': 80
    },
    Communication: {
      Written: 78,
      Verbal: 80,
      Presentation: 82
    },
    Leadership: {
      Delegation: 70,
      Motivation: 75,
      'Strategic Thinking': 80
    }
  },
  gamingData: {
    levelsCompleted: 19,
    totalLevels: 30,
    avgTimePerLevel: 2.6,
    gamesPlayed: [{
      name: '3D Environment',
      score: 900,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'User Interaction',
      score: 880,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'Performance Optimization',
      score: 840,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Create immersive AR/VR experiences', 'Explore spatial computing', 'Develop intuitive 3D interfaces'],
    focusAreas: ['Immersion', 'Performance', 'User Experience'],
    journalEntries: [{
      date: '2023-05-08',
      content: 'Completed my first fully interactive VR environment with natural hand tracking.'
    }, {
      date: '2023-06-20',
      content: 'Working on optimizing rendering for better performance on standalone headsets.'
    }],
    keywords: ['AR/VR', 'immersion', '3D', 'interaction']
  },
  personalityExam: {
    type: 'Virtuoso (ISTP)',
    traits: {
      Introversion: 65,
      Sensing: 70,
      Thinking: 80,
      Perceiving: 75,
      Creative: 85,
      Technical: 90,
      Practical: 82,
      Adaptable: 78
    },
    strengths: ['Spatial reasoning', 'Technical problem-solving', 'User experience design'],
    growthAreas: ['Long-term planning', 'Team communication', 'Documentation'],
    recommendedRoles: ['AR/VR Developer', '3D Programmer', 'Immersive Experience Designer', 'Game Developer']
  }
}, {
  id: 24,
  name: 'Samantha Lewis',
  role: 'Blockchain Developer',
  level: 6,
  skills: {
    vision: 85,
    grit: 82,
    logic: 90,
    algorithm: 88,
    problemSolving: 85
  },
  overallReadiness: 85,
  programReadiness: {
    'Cyber Security': 88,
    'Computer Networking': 75,
    'Data Analytics': 80,
    'AI/ML Fundamentals': 72,
    'IoT Tech Support': 65
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 78,
      Security: 92,
      Algorithms: 80
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 85,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 80,
      Verbal: 75,
      Presentation: 78
    },
    Leadership: {
      Delegation: 70,
      Motivation: 75,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Crypto Challenge',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Smart Contract Builder',
      score: 900,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Consensus Simulator',
      score: 870,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.5
    }]
  },
  visionBoard: {
    goals: ['Develop secure blockchain solutions', 'Create decentralized applications', 'Research consensus mechanisms'],
    focusAreas: ['Security', 'Decentralization', 'Scalability'],
    journalEntries: [{
      date: '2023-04-25',
      content: 'Successfully deployed our first production smart contract with full audit clearance.'
    }, {
      date: '2023-06-12',
      content: 'Working on implementing a more efficient consensus algorithm for our private blockchain.'
    }],
    keywords: ['blockchain', 'security', 'decentralization', 'cryptography']
  },
  personalityExam: {
    type: 'Architect (INTJ)',
    traits: {
      Introversion: 75,
      Intuition: 85,
      Thinking: 90,
      Judging: 80,
      Analytical: 92,
      Strategic: 88,
      Independent: 85,
      Innovative: 80
    },
    strengths: ['System design', 'Security thinking', 'Algorithmic development'],
    growthAreas: ['Team collaboration', 'Explaining complex concepts', 'User experience focus'],
    recommendedRoles: ['Blockchain Developer', 'Smart Contract Engineer', 'Cryptography Specialist', 'Protocol Developer']
  }
}, {
  id: 25,
  name: 'Benjamin Harris',
  role: 'IoT Engineer',
  level: 5,
  skills: {
    vision: 82,
    grit: 85,
    logic: 88,
    algorithm: 80,
    problemSolving: 85
  },
  overallReadiness: 82,
  programReadiness: {
    'Cyber Security': 80,
    'Computer Networking': 85,
    'Data Analytics': 75,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 95
  },
  skillDetails: {
    Technical: {
      Programming: 85,
      Networking: 88,
      Security: 82,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 88,
      'Critical Thinking': 82
    },
    Communication: {
      Written: 78,
      Verbal: 75,
      Presentation: 72
    },
    Leadership: {
      Delegation: 68,
      Motivation: 72,
      'Strategic Thinking': 75
    }
  },
  gamingData: {
    levelsCompleted: 20,
    totalLevels: 30,
    avgTimePerLevel: 2.4,
    gamesPlayed: [{
      name: 'Device Network',
      score: 910,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'Sensor Integration',
      score: 890,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Edge Computing',
      score: 850,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.6
    }]
  },
  visionBoard: {
    goals: ['Build connected device ecosystems', 'Implement edge computing solutions', 'Develop secure IoT protocols'],
    focusAreas: ['Connectivity', 'Security', 'Efficiency'],
    journalEntries: [{
      date: '2023-05-05',
      content: 'Successfully deployed our sensor network with 99.9% uptime and minimal power usage.'
    }, {
      date: '2023-06-18',
      content: 'Working on implementing edge processing to reduce cloud dependency and latency.'
    }],
    keywords: ['IoT', 'connected devices', 'sensors', 'edge computing']
  },
  personalityExam: {
    type: 'Thinker (INTP)',
    traits: {
      Introversion: 70,
      Intuition: 75,
      Thinking: 85,
      Perceiving: 70,
      Analytical: 88,
      Innovative: 82,
      Logical: 90,
      Adaptable: 75
    },
    strengths: ['System integration', 'Problem-solving', 'Technical innovation'],
    growthAreas: ['Project completion', 'Documentation', 'User-centered design'],
    recommendedRoles: ['IoT Engineer', 'Embedded Systems Developer', 'Hardware Integration Specialist', 'Edge Computing Developer']
  }
}, {
  id: 26,
  name: 'Grace Liu',
  role: 'AI Ethics Researcher',
  level: 7,
  skills: {
    vision: 95,
    grit: 82,
    logic: 88,
    algorithm: 80,
    problemSolving: 85
  },
  overallReadiness: 85,
  programReadiness: {
    'Cyber Security': 78,
    'Computer Networking': 65,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 92,
    'IoT Tech Support': 60
  },
  skillDetails: {
    Technical: {
      Programming: 80,
      Networking: 65,
      Security: 78,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 92,
      Debugging: 80,
      'Critical Thinking': 95
    },
    Communication: {
      Written: 92,
      Verbal: 88,
      Presentation: 90
    },
    Leadership: {
      Delegation: 78,
      Motivation: 85,
      'Strategic Thinking': 90
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Ethical Dilemmas',
      score: 950,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Bias Detection',
      score: 930,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'Fairness Evaluation',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.5
    }]
  },
  visionBoard: {
    goals: ['Develop ethical AI frameworks', 'Research bias mitigation techniques', 'Create responsible AI guidelines'],
    focusAreas: ['Ethics', 'Fairness', 'Accountability'],
    journalEntries: [{
      date: '2023-04-30',
      content: 'Published my research on algorithmic bias detection with positive peer reviews.'
    }, {
      date: '2023-06-15',
      content: 'Working on developing an ethics assessment toolkit for AI practitioners.'
    }],
    keywords: ['ethics', 'AI', 'fairness', 'responsibility']
  },
  personalityExam: {
    type: 'Advocate (INFJ)',
    traits: {
      Introversion: 70,
      Intuition: 90,
      Feeling: 85,
      Judging: 75,
      Idealistic: 92,
      Analytical: 85,
      Principled: 90,
      Insightful: 88
    },
    strengths: ['Ethical analysis', 'Systems thinking', 'Communication of complex ideas'],
    growthAreas: ['Technical implementation', 'Pragmatic solutions', 'Work-life balance'],
    recommendedRoles: ['AI Ethics Researcher', 'Ethics Consultant', 'Policy Advisor', 'Responsible AI Lead']
  }
}, {
  id: 27,
  name: 'Malik Jackson',
  role: 'Cybersecurity Analyst',
  level: 6,
  skills: {
    vision: 80,
    grit: 88,
    logic: 85,
    algorithm: 82,
    problemSolving: 88
  },
  overallReadiness: 85,
  programReadiness: {
    'Cyber Security': 95,
    'Computer Networking': 88,
    'Data Analytics': 75,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 80
  },
  skillDetails: {
    Technical: {
      Programming: 82,
      Networking: 88,
      Security: 95,
      Algorithms: 78
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 88,
      'Critical Thinking': 92
    },
    Communication: {
      Written: 82,
      Verbal: 80,
      Presentation: 78
    },
    Leadership: {
      Delegation: 75,
      Motivation: 78,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 23,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Threat Hunter',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Penetration Testing',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'Incident Response',
      score: 900,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }]
  },
  visionBoard: {
    goals: ['Master threat detection techniques', 'Develop security automation tools', 'Implement zero-trust architectures'],
    focusAreas: ['Detection', 'Prevention', 'Response'],
    journalEntries: [{
      date: '2023-05-02',
      content: 'Successfully detected and contained a sophisticated phishing attempt before damage.'
    }, {
      date: '2023-06-18',
      content: 'Working on implementing our new security automation framework to speed response times.'
    }],
    keywords: ['security', 'cybersecurity', 'defense', 'protection']
  },
  personalityExam: {
    type: 'Defender (ISTJ)',
    traits: {
      Introversion: 70,
      Sensing: 80,
      Thinking: 85,
      Judging: 90,
      Vigilant: 95,
      Methodical: 90,
      Detail_oriented: 88,
      Responsible: 92
    },
    strengths: ['Threat detection', 'Security analysis', 'Procedural thoroughness'],
    growthAreas: ['Creative approaches', 'Communication with non-technical users', 'Work-life balance'],
    recommendedRoles: ['Cybersecurity Analyst', 'Security Engineer', 'Threat Intelligence Analyst', 'Security Operations Specialist']
  }
}, {
  id: 28,
  name: 'Rachel Green',
  role: 'User Researcher',
  level: 5,
  skills: {
    vision: 90,
    grit: 78,
    logic: 82,
    algorithm: 65,
    problemSolving: 85
  },
  overallReadiness: 76,
  programReadiness: {
    'Cyber Security': 60,
    'Computer Networking': 55,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 65,
    'IoT Tech Support': 62
  },
  skillDetails: {
    Technical: {
      Programming: 65,
      Networking: 55,
      Security: 60,
      Algorithms: 70
    },
    'Problem Solving': {
      'Analytical Thinking': 88,
      Debugging: 70,
      'Critical Thinking': 90
    },
    Communication: {
      Written: 92,
      Verbal: 95,
      Presentation: 90
    },
    Leadership: {
      Delegation: 75,
      Motivation: 85,
      'Strategic Thinking': 82
    }
  },
  gamingData: {
    levelsCompleted: 18,
    totalLevels: 30,
    avgTimePerLevel: 2.6,
    gamesPlayed: [{
      name: 'User Interview',
      score: 950,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Usability Testing',
      score: 930,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Research Analysis',
      score: 900,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.2
    }]
  },
  visionBoard: {
    goals: ['Uncover deep user insights', 'Develop research methodologies', 'Create user-centered design processes'],
    focusAreas: ['User Understanding', 'Research Methods', 'Design Impact'],
    journalEntries: [{
      date: '2023-05-08',
      content: 'Completed a major user research study that completely changed our product direction.'
    }, {
      date: '2023-06-20',
      content: 'Working on developing better ways to translate research insights into design requirements.'
    }],
    keywords: ['research', 'users', 'insights', 'empathy']
  },
  personalityExam: {
    type: 'Campaigner (ENFP)',
    traits: {
      Extraversion: 85,
      Intuition: 90,
      Feeling: 85,
      Perceiving: 75,
      Empathetic: 95,
      Curious: 90,
      Communicative: 92,
      Insightful: 88
    },
    strengths: ['User empathy', 'Communication', 'Pattern recognition'],
    growthAreas: ['Quantitative analysis', 'Process adherence', 'Focus on details'],
    recommendedRoles: ['User Researcher', 'UX Researcher', 'Design Strategist', 'Customer Insights Specialist']
  }
}, {
  id: 29,
  name: 'Thomas Wright',
  role: 'Technical Architect',
  level: 8,
  skills: {
    vision: 92,
    grit: 85,
    logic: 94,
    algorithm: 88,
    problemSolving: 92
  },
  overallReadiness: 92,
  programReadiness: {
    'Cyber Security': 88,
    'Computer Networking': 90,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 82,
    'IoT Tech Support': 78
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 92,
      Security: 88,
      Algorithms: 90
    },
    'Problem Solving': {
      'Analytical Thinking': 95,
      Debugging: 90,
      'Critical Thinking': 94
    },
    Communication: {
      Written: 85,
      Verbal: 88,
      Presentation: 90
    },
    Leadership: {
      Delegation: 85,
      Motivation: 82,
      'Strategic Thinking': 95
    }
  },
  gamingData: {
    levelsCompleted: 28,
    totalLevels: 30,
    avgTimePerLevel: 1.9,
    gamesPlayed: [{
      name: 'System Architect',
      score: 980,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.7
    }, {
      name: 'Enterprise Design',
      score: 960,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.8
    }, {
      name: 'Technology Strategy',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }]
  },
  visionBoard: {
    goals: ['Design scalable enterprise architectures', 'Lead technical transformation', 'Mentor next generation architects'],
    focusAreas: ['Architecture', 'Strategy', 'Mentorship'],
    journalEntries: [{
      date: '2023-04-15',
      content: 'Completed our cloud migration architecture that will save millions in operational costs.'
    }, {
      date: '2023-06-02',
      content: 'Working on developing an architectural governance framework for our organization.'
    }],
    keywords: ['architecture', 'strategy', 'enterprise', 'systems']
  },
  personalityExam: {
    type: 'Architect (INTJ)',
    traits: {
      Introversion: 75,
      Intuition: 95,
      Thinking: 90,
      Judging: 85,
      Strategic: 98,
      Analytical: 95,
      Visionary: 90,
      Independent: 85
    },
    strengths: ['Systems thinking', 'Strategic planning', 'Technical depth'],
    growthAreas: ['Patience with less technical stakeholders', 'Team collaboration', 'Handling ambiguity'],
    recommendedRoles: ['Technical Architect', 'Enterprise Architect', 'Solutions Architect', 'Chief Architect']
  }
}, {
  id: 30,
  name: 'Hannah Kim',
  role: 'Automation Engineer',
  level: 6,
  skills: {
    vision: 82,
    grit: 88,
    logic: 90,
    algorithm: 85,
    problemSolving: 88
  },
  overallReadiness: 86,
  programReadiness: {
    'Cyber Security': 78,
    'Computer Networking': 82,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 80,
    'IoT Tech Support': 88
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 82,
      Security: 78,
      Algorithms: 85
    },
    'Problem Solving': {
      'Analytical Thinking': 88,
      Debugging: 92,
      'Critical Thinking': 85
    },
    Communication: {
      Written: 82,
      Verbal: 78,
      Presentation: 75
    },
    Leadership: {
      Delegation: 72,
      Motivation: 75,
      'Strategic Thinking': 80
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Process Automation',
      score: 930,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Test Automation',
      score: 910,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'CI/CD Pipeline',
      score: 890,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }]
  },
  visionBoard: {
    goals: ['Automate repetitive processes', 'Build reliable CI/CD pipelines', 'Implement infrastructure as code'],
    focusAreas: ['Automation', 'Efficiency', 'Reliability'],
    journalEntries: [{
      date: '2023-05-05',
      content: 'Reduced our deployment time from days to minutes with the new automation pipeline.'
    }, {
      date: '2023-06-18',
      content: 'Working on implementing infrastructure as code for our entire cloud environment.'
    }],
    keywords: ['automation', 'efficiency', 'pipelines', 'reliability']
  },
  personalityExam: {
    type: 'Logistician (ISTJ)',
    traits: {
      Introversion: 65,
      Sensing: 80,
      Thinking: 85,
      Judging: 90,
      Organized: 92,
      Efficient: 95,
      Practical: 88,
      Reliable: 90
    },
    strengths: ['Process optimization', 'Reliability engineering', 'Systematic approach'],
    growthAreas: ['Adapting to rapid changes', 'Creative problem-solving', 'Team communication'],
    recommendedRoles: ['Automation Engineer', 'DevOps Engineer', 'Release Engineer', 'SRE (Site Reliability Engineer)']
  }
}, {
  id: 31,
  name: 'Kevin Roberts',
  role: 'Digital Accessibility Specialist',
  level: 5,
  skills: {
    vision: 88,
    grit: 80,
    logic: 78,
    algorithm: 70,
    problemSolving: 82
  },
  overallReadiness: 78,
  programReadiness: {
    'Cyber Security': 65,
    'Computer Networking': 60,
    'Data Analytics': 70,
    'AI/ML Fundamentals': 62,
    'IoT Tech Support': 68
  },
  skillDetails: {
    Technical: {
      Programming: 75,
      Networking: 60,
      Security: 68,
      Algorithms: 65
    },
    'Problem Solving': {
      'Analytical Thinking': 82,
      Debugging: 78,
      'Critical Thinking': 85
    },
    Communication: {
      Written: 90,
      Verbal: 88,
      Presentation: 85
    },
    Leadership: {
      Delegation: 72,
      Motivation: 80,
      'Strategic Thinking': 78
    }
  },
  gamingData: {
    levelsCompleted: 18,
    totalLevels: 30,
    avgTimePerLevel: 2.6,
    gamesPlayed: [{
      name: 'Accessibility Audit',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.4
    }, {
      name: 'Inclusive Design',
      score: 900,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.5
    }, {
      name: 'ARIA Implementation',
      score: 870,
      difficulty: 'hard',
      completed: false
    }]
  },
  visionBoard: {
    goals: ['Create accessible digital experiences', 'Promote inclusive design practices', 'Develop accessibility testing frameworks'],
    focusAreas: ['Accessibility', 'Inclusion', 'Standards'],
    journalEntries: [{
      date: '2023-05-12',
      content: 'Successfully brought our main application to WCAG AA compliance, opening it to all users.'
    }, {
      date: '2023-06-25',
      content: 'Working on developing an automated accessibility testing pipeline for our CI/CD process.'
    }],
    keywords: ['accessibility', 'inclusion', 'standards', 'usability']
  },
  personalityExam: {
    type: 'Advocate (INFJ)',
    traits: {
      Introversion: 70,
      Intuition: 85,
      Feeling: 80,
      Judging: 75,
      Empathetic: 92,
      Principled: 90,
      Determined: 85,
      Insightful: 88
    },
    strengths: ['User advocacy', 'Attention to detail', 'Standards implementation'],
    growthAreas: ['Technical implementation', 'Balancing standards with business needs', 'Team influence'],
    recommendedRoles: ['Accessibility Specialist', 'Inclusive Design Consultant', 'UX Researcher', 'Digital Compliance Specialist']
  }
}, {
  id: 32,
  name: 'Diana Evans',
  role: 'Technical Program Manager',
  level: 7,
  skills: {
    vision: 90,
    grit: 88,
    logic: 85,
    algorithm: 75,
    problemSolving: 88
  },
  overallReadiness: 87,
  programReadiness: {
    'Cyber Security': 78,
    'Computer Networking': 75,
    'Data Analytics': 82,
    'AI/ML Fundamentals': 80,
    'IoT Tech Support': 76
  },
  skillDetails: {
    Technical: {
      Programming: 78,
      Networking: 75,
      Security: 80,
      Algorithms: 78
    },
    'Problem Solving': {
      'Analytical Thinking': 90,
      Debugging: 82,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 92,
      Verbal: 90,
      Presentation: 92
    },
    Leadership: {
      Delegation: 90,
      Motivation: 92,
      'Strategic Thinking': 88
    }
  },
  gamingData: {
    levelsCompleted: 23,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Program Strategy',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Cross-team Coordination',
      score: 920,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Risk Management',
      score: 900,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.4
    }]
  },
  visionBoard: {
    goals: ['Lead complex technical programs', 'Develop cross-functional collaboration', 'Create scalable program frameworks'],
    focusAreas: ['Leadership', 'Coordination', 'Strategy'],
    journalEntries: [{
      date: '2023-04-25',
      content: 'Successfully delivered our multi-team platform migration ahead of schedule.'
    }, {
      date: '2023-06-10',
      content: 'Working on improving our dependency management across engineering teams.'
    }],
    keywords: ['program management', 'leadership', 'coordination', 'strategy']
  },
  personalityExam: {
    type: 'Commander (ENTJ)',
    traits: {
      Extraversion: 85,
      Intuition: 80,
      Thinking: 85,
      Judging: 90,
      Strategic: 92,
      Decisive: 90,
      Organized: 88,
      Efficient: 92
    },
    strengths: ['Strategic planning', 'Cross-team leadership', 'Problem resolution'],
    growthAreas: ['Patience with process', 'Technical depth', 'Work-life balance'],
    recommendedRoles: ['Technical Program Manager', 'Engineering Manager', 'Product Operations Lead', 'Delivery Director']
  }
}, {
  id: 33,
  name: 'Omar Hassan',
  role: 'Performance Engineer',
  level: 6,
  skills: {
    vision: 80,
    grit: 85,
    logic: 92,
    algorithm: 88,
    problemSolving: 90
  },
  overallReadiness: 87,
  programReadiness: {
    'Cyber Security': 75,
    'Computer Networking': 85,
    'Data Analytics': 82,
    'AI/ML Fundamentals': 78,
    'IoT Tech Support': 72
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 85,
      Security: 78,
      Algorithms: 92
    },
    'Problem Solving': {
      'Analytical Thinking': 94,
      Debugging: 92,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 80,
      Verbal: 78,
      Presentation: 75
    },
    Leadership: {
      Delegation: 70,
      Motivation: 72,
      'Strategic Thinking': 80
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.2,
    gamesPlayed: [{
      name: 'Load Testing',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Optimization Challenge',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Bottleneck Analysis',
      score: 900,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }]
  },
  visionBoard: {
    goals: ['Create high-performance systems', 'Master optimization techniques', 'Develop performance testing frameworks'],
    focusAreas: ['Performance', 'Optimization', 'Scalability'],
    journalEntries: [{
      date: '2023-05-02',
      content: 'Improved our main transaction system to handle 10x the load with the same resources.'
    }, {
      date: '2023-06-15',
      content: 'Working on implementing distributed tracing to better identify performance bottlenecks.'
    }],
    keywords: ['performance', 'optimization', 'scalability', 'efficiency']
  },
  personalityExam: {
    type: 'Thinker (INTP)',
    traits: {
      Introversion: 75,
      Intuition: 80,
      Thinking: 90,
      Perceiving: 70,
      Analytical: 95,
      Logical: 92,
      Innovative: 85,
      Detail_oriented: 88
    },
    strengths: ['System optimization', 'Analytical problem-solving', 'Technical depth'],
    growthAreas: ['Communicating technical concepts', 'Project planning', 'Team collaboration'],
    recommendedRoles: ['Performance Engineer', 'Optimization Specialist', 'Systems Engineer', 'Backend Developer']
  }
}, {
  id: 34,
  name: 'Sophia Chen',
  role: 'Technical Account Manager',
  level: 5,
  skills: {
    vision: 85,
    grit: 88,
    logic: 80,
    algorithm: 70,
    problemSolving: 85
  },
  overallReadiness: 80,
  programReadiness: {
    'Cyber Security': 75,
    'Computer Networking': 78,
    'Data Analytics': 72,
    'AI/ML Fundamentals': 68,
    'IoT Tech Support': 82
  },
  skillDetails: {
    Technical: {
      Programming: 72,
      Networking: 78,
      Security: 75,
      Algorithms: 70
    },
    'Problem Solving': {
      'Analytical Thinking': 85,
      Debugging: 80,
      'Critical Thinking': 88
    },
    Communication: {
      Written: 92,
      Verbal: 95,
      Presentation: 90
    },
    Leadership: {
      Delegation: 82,
      Motivation: 88,
      'Strategic Thinking': 85
    }
  },
  gamingData: {
    levelsCompleted: 20,
    totalLevels: 30,
    avgTimePerLevel: 2.4,
    gamesPlayed: [{
      name: 'Client Management',
      score: 930,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.2
    }, {
      name: 'Technical Translation',
      score: 910,
      difficulty: 'medium',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Relationship Building',
      score: 940,
      difficulty: 'easy',
      completed: true,
      timeSpent: 2.0
    }]
  },
  visionBoard: {
    goals: ['Bridge technical and business needs', 'Ensure client technical success', 'Develop strategic client relationships'],
    focusAreas: ['Client Success', 'Technical Solutions', 'Relationship Management'],
    journalEntries: [{
      date: '2023-05-08',
      content: 'Successfully helped our largest client implement our solution across their organization.'
    }, {
      date: '2023-06-20',
      content: 'Working on developing a technical roadmap with clients to better align with their goals.'
    }],
    keywords: ['client success', 'technical leadership', 'relationship', 'solutions']
  },
  personalityExam: {
    type: 'Protagonist (ENFJ)',
    traits: {
      Extraversion: 90,
      Intuition: 80,
      Feeling: 85,
      Judging: 75,
      Communicative: 95,
      Empathetic: 90,
      Strategic: 85,
      Persuasive: 92
    },
    strengths: ['Client relationship', 'Technical translation', 'Strategic planning'],
    growthAreas: ['Technical depth', 'Setting boundaries', 'Work-life balance'],
    recommendedRoles: ['Technical Account Manager', 'Customer Success Manager', 'Solutions Consultant', 'Client Technical Advisor']
  }
}, {
  id: 35,
  name: 'Jordan Rivera',
  role: 'Bioinformatics Developer',
  level: 6,
  skills: {
    vision: 85,
    grit: 80,
    logic: 92,
    algorithm: 88,
    problemSolving: 90
  },
  overallReadiness: 87,
  programReadiness: {
    'Cyber Security': 70,
    'Computer Networking': 65,
    'Data Analytics': 92,
    'AI/ML Fundamentals': 88,
    'IoT Tech Support': 60
  },
  skillDetails: {
    Technical: {
      Programming: 90,
      Networking: 65,
      Security: 70,
      Algorithms: 85
    },
    'Problem Solving': {
      'Analytical Thinking': 94,
      Debugging: 88,
      'Critical Thinking': 92
    },
    Communication: {
      Written: 85,
      Verbal: 80,
      Presentation: 78
    },
    Leadership: {
      Delegation: 70,
      Motivation: 75,
      'Strategic Thinking': 82
    }
  },
  gamingData: {
    levelsCompleted: 22,
    totalLevels: 30,
    avgTimePerLevel: 2.3,
    gamesPlayed: [{
      name: 'Sequence Analysis',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.1
    }, {
      name: 'Genomic Data Processing',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.3
    }, {
      name: 'Molecular Modeling',
      score: 890,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.5
    }]
  },
  visionBoard: {
    goals: ['Develop tools for genomic analysis', 'Create algorithms for protein folding', 'Build pipelines for clinical data'],
    focusAreas: ['Algorithms', 'Data Processing', 'Scientific Applications'],
    journalEntries: [{
      date: '2023-04-28',
      content: 'Our sequence analysis tool successfully identified novel patterns in the dataset.'
    }, {
      date: '2023-06-12',
      content: 'Working on optimizing our pipeline to process genomic data 5x faster.'
    }],
    keywords: ['bioinformatics', 'genomics', 'algorithms', 'data science']
  },
  personalityExam: {
    type: 'Logician (INTP)',
    traits: {
      Introversion: 80,
      Intuition: 85,
      Thinking: 90,
      Perceiving: 75,
      Analytical: 95,
      Curious: 92,
      Logical: 95,
      Innovative: 85
    },
    strengths: ['Algorithm development', 'Complex problem-solving', 'Interdisciplinary thinking'],
    growthAreas: ['Project completion', 'Communicating with non-technical stakeholders', 'Practical implementation'],
    recommendedRoles: ['Bioinformatics Developer', 'Computational Biologist', 'Research Software Engineer', 'Data Scientist']
  }
}, {
  id: 36,
  name: 'Elijah Williams',
  role: 'Quantum Computing Researcher',
  level: 7,
  skills: {
    vision: 90,
    grit: 85,
    logic: 95,
    algorithm: 92,
    problemSolving: 94
  },
  overallReadiness: 91,
  programReadiness: {
    'Cyber Security': 80,
    'Computer Networking': 70,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 90,
    'IoT Tech Support': 65
  },
  skillDetails: {
    Technical: {
      Programming: 92,
      Networking: 70,
      Security: 80,
      Algorithms: 75
    },
    'Problem Solving': {
      'Analytical Thinking': 96,
      Debugging: 90,
      'Critical Thinking': 94
    },
    Communication: {
      Written: 88,
      Verbal: 85,
      Presentation: 82
    },
    Leadership: {
      Delegation: 75,
      Motivation: 80,
      'Strategic Thinking': 90
    }
  },
  gamingData: {
    levelsCompleted: 25,
    totalLevels: 30,
    avgTimePerLevel: 2.0,
    gamesPlayed: [{
      name: 'Quantum Algorithms',
      score: 960,
      difficulty: 'hard',
      completed: true,
      timeSpent: 1.8
    }, {
      name: 'Quantum Simulation',
      score: 940,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.0
    }, {
      name: 'Quantum Cryptography',
      score: 920,
      difficulty: 'hard',
      completed: true,
      timeSpent: 2.2
    }]
  },
  visionBoard: {
    goals: ['Develop quantum algorithms', 'Research quantum error correction', 'Create quantum computing applications'],
    focusAreas: ['Algorithms', 'Theory', 'Applications'],
    journalEntries: [{
      date: '2023-04-20',
      content: 'Made a breakthrough in our quantum optimization algorithm that shows promising results.'
    }, {
      date: '2023-06-05',
      content: 'Working on implementing our algorithm on the latest quantum hardware platform.'
    }],
    keywords: ['quantum', 'algorithms', 'research', 'computation']
  },
  personalityExam: {
    type: 'Architect (INTJ)',
    traits: {
      Introversion: 80,
      Intuition: 95,
      Thinking: 95,
      Judging: 80,
      Analytical: 98,
      Theoretical: 95,
      Strategic: 90,
      Innovative: 92
    },
    strengths: ['Theoretical modeling', 'Algorithm development', 'Abstract thinking'],
    growthAreas: ['Practical application', 'Explaining complex concepts', 'Team collaboration'],
    recommendedRoles: ['Quantum Computing Researcher', 'Quantum Algorithm Developer', 'Theoretical Computer Scientist', 'Research Scientist']
  }
}];