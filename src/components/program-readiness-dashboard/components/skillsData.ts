// Define types for our skills data
export type Certification = {
  id: string;
  name: string;
  icon: string;
};
export type Subskill = {
  id: string;
  name: string;
  proficiency: number;
  required: Record<string, number>;
  certifications: Certification[];
};
export type Skill = {
  id: string;
  name: string;
  category: string;
  color: string;
  proficiency: number;
  required: Record<string, number>;
  subskills: Subskill[];
  certifications: Certification[];
};
export type SkillCorrelation = {
  source: string;
  target: string;
  strength: number;
};
// Sample certifications
const certifications: Record<string, Certification> = {
  aws: {
    id: 'aws',
    name: 'AWS Certified',
    icon: '🔶'
  },
  cisco: {
    id: 'cisco',
    name: 'Cisco Certified',
    icon: '🔵'
  },
  comptia: {
    id: 'comptia',
    name: 'CompTIA',
    icon: '🟢'
  },
  scrum: {
    id: 'scrum',
    name: 'Scrum Master',
    icon: '🔄'
  },
  pmi: {
    id: 'pmi',
    name: 'PMI',
    icon: '📊'
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft Certified',
    icon: '🪟'
  },
  google: {
    id: 'google',
    name: 'Google Certified',
    icon: '🌐'
  },
  linux: {
    id: 'linux',
    name: 'Linux+',
    icon: '🐧'
  }
};
// Define our skills data
export const skills: Skill[] = [{
  id: 'technical',
  name: 'Technical',
  category: 'Hard Skills',
  color: '#3b82f6',
  // blue
  proficiency: 85,
  required: {
    'Cyber Security': 90,
    'Computer Networking': 75,
    'Data Analytics': 80,
    'AI/ML Fundamentals': 90,
    'IoT Tech Support': 65
  },
  subskills: [{
    id: 'programming',
    name: 'Programming',
    proficiency: 88,
    required: {
      'Cyber Security': 85,
      'Computer Networking': 70,
      'Data Analytics': 80,
      'AI/ML Fundamentals': 95,
      'IoT Tech Support': 60
    },
    certifications: [certifications.microsoft]
  }, {
    id: 'networking',
    name: 'Networking',
    proficiency: 82,
    required: {
      'Cyber Security': 90,
      'Computer Networking': 90,
      'Data Analytics': 70,
      'AI/ML Fundamentals': 75,
      'IoT Tech Support': 70
    },
    certifications: [certifications.cisco]
  }, {
    id: 'security',
    name: 'Security',
    proficiency: 90,
    required: {
      'Cyber Security': 95,
      'Computer Networking': 75,
      'Data Analytics': 65,
      'AI/ML Fundamentals': 75,
      'IoT Tech Support': 60
    },
    certifications: [certifications.comptia]
  }, {
    id: 'algorithms',
    name: 'Algorithms',
    proficiency: 78,
    required: {
      'Cyber Security': 80,
      'Computer Networking': 65,
      'Data Analytics': 90,
      'AI/ML Fundamentals': 85,
      'IoT Tech Support': 55
    },
    certifications: []
  }],
  certifications: [certifications.aws, certifications.comptia]
}, {
  id: 'problem_solving',
  name: 'Problem Solving',
  category: 'Cognitive Skills',
  color: '#ef4444',
  // red
  proficiency: 92,
  required: {
    'Cyber Security': 90,
    'Computer Networking': 80,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 95,
    'IoT Tech Support': 70
  },
  subskills: [{
    id: 'analytical',
    name: 'Analytical Thinking',
    proficiency: 94,
    required: {
      'Cyber Security': 90,
      'Computer Networking': 80,
      'Data Analytics': 90,
      'AI/ML Fundamentals': 95,
      'IoT Tech Support': 65
    },
    certifications: []
  }, {
    id: 'debugging',
    name: 'Debugging',
    proficiency: 90,
    required: {
      'Cyber Security': 95,
      'Computer Networking': 85,
      'Data Analytics': 80,
      'AI/ML Fundamentals': 90,
      'IoT Tech Support': 75
    },
    certifications: []
  }, {
    id: 'critical',
    name: 'Critical Thinking',
    proficiency: 88,
    required: {
      'Cyber Security': 90,
      'Computer Networking': 75,
      'Data Analytics': 85,
      'AI/ML Fundamentals': 95,
      'IoT Tech Support': 65
    },
    certifications: []
  }],
  certifications: []
}, {
  id: 'communication',
  name: 'Communication',
  category: 'Soft Skills',
  color: '#10b981',
  // green
  proficiency: 78,
  required: {
    'Cyber Security': 75,
    'Computer Networking': 80,
    'Data Analytics': 85,
    'AI/ML Fundamentals': 70,
    'IoT Tech Support': 90
  },
  subskills: [{
    id: 'written',
    name: 'Written',
    proficiency: 82,
    required: {
      'Cyber Security': 80,
      'Computer Networking': 75,
      'Data Analytics': 85,
      'AI/ML Fundamentals': 75,
      'IoT Tech Support': 85
    },
    certifications: []
  }, {
    id: 'verbal',
    name: 'Verbal',
    proficiency: 75,
    required: {
      'Cyber Security': 70,
      'Computer Networking': 85,
      'Data Analytics': 80,
      'AI/ML Fundamentals': 65,
      'IoT Tech Support': 95
    },
    certifications: []
  }, {
    id: 'presentation',
    name: 'Presentation',
    proficiency: 80,
    required: {
      'Cyber Security': 75,
      'Computer Networking': 80,
      'Data Analytics': 90,
      'AI/ML Fundamentals': 70,
      'IoT Tech Support': 85
    },
    certifications: []
  }],
  certifications: []
}, {
  id: 'emotional_intelligence',
  name: 'Emotional Intelligence',
  category: 'Soft Skills',
  color: '#8b5cf6',
  // purple
  proficiency: 72,
  required: {
    'Cyber Security': 65,
    'Computer Networking': 70,
    'Data Analytics': 75,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 85
  },
  subskills: [{
    id: 'empathy',
    name: 'Empathy',
    proficiency: 75,
    required: {
      'Cyber Security': 60,
      'Computer Networking': 65,
      'Data Analytics': 70,
      'AI/ML Fundamentals': 55,
      'IoT Tech Support': 90
    },
    certifications: []
  }, {
    id: 'self_awareness',
    name: 'Self-Awareness',
    proficiency: 70,
    required: {
      'Cyber Security': 65,
      'Computer Networking': 70,
      'Data Analytics': 75,
      'AI/ML Fundamentals': 60,
      'IoT Tech Support': 80
    },
    certifications: []
  }, {
    id: 'stress_management',
    name: 'Stress Management',
    proficiency: 68,
    required: {
      'Cyber Security': 70,
      'Computer Networking': 75,
      'Data Analytics': 70,
      'AI/ML Fundamentals': 65,
      'IoT Tech Support': 85
    },
    certifications: []
  }],
  certifications: []
}, {
  id: 'creativity',
  name: 'Creativity',
  category: 'Cognitive Skills',
  color: '#f59e0b',
  // amber
  proficiency: 68,
  required: {
    'Cyber Security': 70,
    'Computer Networking': 60,
    'Data Analytics': 80,
    'AI/ML Fundamentals': 85,
    'IoT Tech Support': 65
  },
  subskills: [{
    id: 'innovation',
    name: 'Innovation',
    proficiency: 72,
    required: {
      'Cyber Security': 75,
      'Computer Networking': 60,
      'Data Analytics': 85,
      'AI/ML Fundamentals': 90,
      'IoT Tech Support': 70
    },
    certifications: []
  }, {
    id: 'design_thinking',
    name: 'Design Thinking',
    proficiency: 65,
    required: {
      'Cyber Security': 65,
      'Computer Networking': 55,
      'Data Analytics': 80,
      'AI/ML Fundamentals': 85,
      'IoT Tech Support': 60
    },
    certifications: []
  }, {
    id: 'adaptability',
    name: 'Adaptability',
    proficiency: 70,
    required: {
      'Cyber Security': 75,
      'Computer Networking': 65,
      'Data Analytics': 75,
      'AI/ML Fundamentals': 80,
      'IoT Tech Support': 70
    },
    certifications: []
  }],
  certifications: []
}, {
  id: 'leadership',
  name: 'Leadership',
  category: 'Soft Skills',
  color: '#ec4899',
  // pink
  proficiency: 65,
  required: {
    'Cyber Security': 70,
    'Computer Networking': 65,
    'Data Analytics': 75,
    'AI/ML Fundamentals': 60,
    'IoT Tech Support': 75
  },
  subskills: [{
    id: 'delegation',
    name: 'Delegation',
    proficiency: 62,
    required: {
      'Cyber Security': 65,
      'Computer Networking': 60,
      'Data Analytics': 70,
      'AI/ML Fundamentals': 55,
      'IoT Tech Support': 70
    },
    certifications: []
  }, {
    id: 'motivation',
    name: 'Motivation',
    proficiency: 68,
    required: {
      'Cyber Security': 75,
      'Computer Networking': 70,
      'Data Analytics': 75,
      'AI/ML Fundamentals': 60,
      'IoT Tech Support': 80
    },
    certifications: []
  }, {
    id: 'strategic_thinking',
    name: 'Strategic Thinking',
    proficiency: 70,
    required: {
      'Cyber Security': 80,
      'Computer Networking': 70,
      'Data Analytics': 85,
      'AI/ML Fundamentals': 70,
      'IoT Tech Support': 75
    },
    certifications: [certifications.scrum]
  }],
  certifications: [certifications.scrum, certifications.pmi]
}];
// Define skill correlations
export const skillCorrelations: SkillCorrelation[] = [{
  source: 'technical',
  target: 'problem_solving',
  strength: 0.8
}, {
  source: 'problem_solving',
  target: 'creativity',
  strength: 0.7
}, {
  source: 'communication',
  target: 'leadership',
  strength: 0.9
}, {
  source: 'emotional_intelligence',
  target: 'leadership',
  strength: 0.8
}, {
  source: 'emotional_intelligence',
  target: 'communication',
  strength: 0.7
}, {
  source: 'creativity',
  target: 'technical',
  strength: 0.6
}, {
  source: 'leadership',
  target: 'problem_solving',
  strength: 0.6
}];
// Available programs
export const programs = ['Cyber Security', 'Computer Networking', 'Data Analytics', 'AI/ML Fundamentals', 'IoT Tech Support'];