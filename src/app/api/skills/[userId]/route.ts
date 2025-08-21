import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // Fetch all necessary data in parallel
    const [
      skillTypesRes,
      userSkillsRes,
      userSkillDetailsRes
    ] = await Promise.all([
      (supabase as any).from('skill_types').select('id, key, name').order('id'),
      (supabase as any).from('user_skills').select('user_id, value, skill').eq('user_id', userId),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value, user_id').eq('user_id', userId)
    ])

    // Error handling
    for (const res of [skillTypesRes, userSkillsRes, userSkillDetailsRes]) {
      if (res.error) throw res.error
    }

    const skillTypes = skillTypesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userSkillDetails = userSkillDetailsRes.data || []

    // Create skill type lookup
    const skillTypeLookup: Record<number, { key: string, name: string }> = {}
    skillTypes.forEach((skillType: any) => {
      skillTypeLookup[skillType.id] = { key: skillType.key, name: skillType.name }
    })

    // Process main skills
    const skills: Record<string, any> = {}
    userSkills.forEach((userSkill: any) => {
      const skillType = skillTypeLookup[userSkill.skill]
      if (skillType) {
        skills[skillType.key] = {
          id: userSkill.skill,
          key: skillType.key,
          name: skillType.name,
          value: userSkill.value
        }
      }
    })

    // Process subskills
    const subskills: Record<string, any[]> = {}
    userSkillDetails.forEach((detail: any) => {
      const skillType = skillTypeLookup[detail.skill_id]
      if (skillType) {
        if (!subskills[skillType.key]) {
          subskills[skillType.key] = []
        }
        
        subskills[skillType.key].push({
          name: detail.subskill,
          value: detail.value
        })
      }
    })

    // Check if user has any skills data
    if (Object.keys(skills).length === 0 && Object.keys(subskills).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No skills data found for this user'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        skills,
        subskills,
        skillTypes
      }
    })

  } catch (error: any) {
    console.error('User skills API error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}
