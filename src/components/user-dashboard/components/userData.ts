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
  // New data types
  gamingData: {
    levelsCompleted: number;
    totalLevels: number;
    avgTimePerLevel: number; // in minutes
    gamesPlayed: {
      name: string;
      score: number;
      difficulty: 'easy' | 'medium' | 'hard';
      completed: boolean;
      timeSpent?: number; // in minutes
    }[];
  };
  visionBoard: {
    goals: string[];
    suggestedGoals?: string[];
    focusAreas: string[];
    journalEntries: {
      date: string;
      content: string;
    }[];
    keywords: string[];
    img_url?: string;
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
// Program readiness thresholds
export const programThresholds = {
  'AI/ML Fundamentals': 85,
  'IoT Tech Support': 60,
  'Data Analytics': 75,
  'Computer Networking': 75,
  'Cyber Security': 80
};
export const userData: UserData[] = [
  {
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
}];