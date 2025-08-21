import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateInitials } from '@/utils/initials'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) { 
  const userId = (await params).userId
  try {
    // Fetch all necessary data in parallel
    const [
      profilesRes, 
      userCoreSkillsRes, 
      userProgramsRes, 
      assessmentsRes,
      programRequirementsRes,
      assessmentSkillRequirementsRes,
      assessmentSubskillRequirementsRes,
      skillTypesRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at').eq('is_deleted', false),
      (supabase as any).from('user_core_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      supabase.from('assessments').select('id, title, cover_url'),
      (supabase as any).from('program_skill_requirements').select('assessment_id, skill_key, required_score'),
      (supabase as any).from('assessment_skill_requirements').select('assessment_id, skill_type, required_value'),
      (supabase as any).from('assessment_subskill_requirements').select('assessment_id, skill_id, subskill, required_value'),
      (supabase as any).from('skill_types').select('id, key, name').order('id')
    ])

    // Error handling
    for (const res of [profilesRes, userCoreSkillsRes, userProgramsRes, assessmentsRes, programRequirementsRes, assessmentSkillRequirementsRes, assessmentSubskillRequirementsRes, skillTypesRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userCoreSkills = userCoreSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const assessments = assessmentsRes.data || []
    const programRequirements = programRequirementsRes.data || []
    const assessmentSkillRequirements = assessmentSkillRequirementsRes.data || []
    const assessmentSubskillRequirements = assessmentSubskillRequirementsRes.data || []
    const skillTypes = skillTypesRes.data || []

    // Pick a random user from profiles
    const timestamp = Date.now()
    const selectedUser = profiles.find((p: any) => p.id === userId)
    
    if (!selectedUser) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 })
    }

    // Create assessment lookup with cover URLs
    const assessmentLookup: Record<string, { title: string, cover_url: string | null }> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = { title: a.title, cover_url: a.cover_url }
    })

    // Create program requirements lookup (for ProgramReadinessAssessment)
    const requirementsLookup: Record<string, Record<string, number>> = {}
    programRequirements.forEach((req: any) => {
      const assessmentTitle = assessmentLookup[req.assessment_id]?.title
      if (assessmentTitle) {
        if (!requirementsLookup[assessmentTitle]) {
          requirementsLookup[assessmentTitle] = {}
        }
        requirementsLookup[assessmentTitle][req.skill_key] = req.required_score
      }
    })

    // Create skill type lookup
    const skillTypeLookup: Record<number, { key: string, name: string }> = {}
    skillTypes.forEach((skillType: any) => {
      skillTypeLookup[skillType.id] = { key: skillType.key, name: skillType.name }
    })

    // Create skill requirements lookup (for SkillBubbleChart)
    const skillRequirementsLookup: Record<string, Record<string, number>> = {}
    assessmentSkillRequirements.forEach((req: any) => {
      const assessmentInfo = assessmentLookup[req.assessment_id]
      const skillType = skillTypeLookup[req.skill_type]
      
      if (assessmentInfo && assessmentInfo.title && skillType) {
        const assessmentTitle = assessmentInfo.title
        const skillName = skillType.name
        
        if (!skillRequirementsLookup[skillName]) {
          skillRequirementsLookup[skillName] = {}
        }
        skillRequirementsLookup[skillName][assessmentTitle] = req.required_value
      }
    })

    // Create subskill requirements lookup (for SkillBubbleChart subskills)
    const subskillRequirementsLookup: Record<string, Record<string, number>> = {}
    assessmentSubskillRequirements.forEach((req: any) => {
      const assessmentInfo = assessmentLookup[req.assessment_id]
      const skillType = skillTypeLookup[req.skill_id]
      
      if (assessmentInfo && assessmentInfo.title && skillType) {
        const assessmentTitle = assessmentInfo.title
        const subskillName = req.subskill
        
        if (!subskillRequirementsLookup[subskillName]) {
          subskillRequirementsLookup[subskillName] = {}
        }
        subskillRequirementsLookup[subskillName][assessmentTitle] = req.required_value
      }
    })

    // Get selected user's skills
    const userSkillData = userCoreSkills.filter((s: any) => s.user_id === selectedUser.id)
    const skills = {
      vision: 0,
      grit: 0,
      logic: 0,
      algorithm: 0,
      problemSolving: 0
    }

    // Map database skills to our structure
    userSkillData.forEach((skill: any) => {
      if (skill.category in skills) {
        skills[skill.category as keyof typeof skills] = skill.value
      }
    })

    // Fill in missing skills with reasonable defaults if no data
    Object.keys(skills).forEach(key => {
      if (skills[key as keyof typeof skills] === 0) {
        skills[key as keyof typeof skills] = Math.floor(Math.random() * 40) + 60 // 60-100 fallback
      }
    })

    // Create empty skillDetails - will be populated from skills API in frontend
    const skillDetails: Record<string, Record<string, number>> = {}

    // Get user's program readiness
    const userProgramData = userPrograms.filter((p: any) => p.user_id === selectedUser.id)
    const programReadiness: Record<string, number> = {}
    
    userProgramData.forEach((program: any) => {
      const assessmentInfo = assessmentLookup[program.assessment_id]
      const assessmentTitle = assessmentInfo?.title || `Assessment ${program.assessment_id.slice(0, 8)}`
      // Filter out Big Five assessments
      if (!assessmentTitle.includes('Big Five')) {
        programReadiness[assessmentTitle] = program.readiness
      }
    })

    // Overall readiness (average of skills)
    const skillValues = Object.values(skills).filter(v => v > 0)
    const overallReadiness = skillValues.length > 0 
      ? Math.round(skillValues.reduce((s,v)=>s+v,0) / skillValues.length)
      : 0

    // Find best program (highest readiness score)
    let bestProgram = { name: 'No Program', readiness: 0 }
    Object.entries(programReadiness).forEach(([program, readiness]) => {
      if (readiness > bestProgram.readiness) {
        bestProgram = { name: program, readiness }
      }
    })

    // Calculate user level based on overall readiness
    const level = Math.floor(overallReadiness / 10) + 1

    const userName = selectedUser.name || `User ${selectedUser.id.slice(0, 8)}`
    
    const userData = {
      id: selectedUser.id,
      name: userName,
      role: selectedUser.user_role === 'admin' ? 'Administrator' : 'User',
      level,
      skills,
      overallReadiness,
      programReadiness,
      bestProgram,
      skillDetails,
      initials: generateInitials(userName)
    }

    return NextResponse.json({
      user: userData,
      programRequirements: requirementsLookup,
      skillRequirements: skillRequirementsLookup,
      subskillRequirements: subskillRequirementsLookup,
      programCoverUrls: Object.fromEntries(
        Object.entries(assessmentLookup).map(([id, info]) => [info.title, info.cover_url])
      ),
      success: true
    })

  } catch (error: any) {
    console.error('Program readiness dashboard API error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
} 