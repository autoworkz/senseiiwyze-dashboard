import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all necessary data in parallel
    const [
      skillTypesRes,
      userSkillsRes,
      userSkillDetailsRes
    ] = await Promise.all([
      (supabase as any).from('skill_types').select('id, key, name').order('id'),
      (supabase as any).from('user_skills').select('user_id, value, skill'),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value, user_id')
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

    // Group data by user
    const userSkillsMap: Record<string, any> = {}

    // Process main skills for each user
    userSkills.forEach((userSkill: any) => {
      const userId = userSkill.user_id
      const skillType = skillTypeLookup[userSkill.skill]
      
      if (!userSkillsMap[userId]) {
        userSkillsMap[userId] = {
          userId,
          skills: {},
          subskills: {}
        }
      }

      if (skillType) {
        userSkillsMap[userId].skills[skillType.key] = {
          id: userSkill.skill,
          key: skillType.key,
          name: skillType.name,
          value: userSkill.value
        }
      }
    })

    // Process subskills for each user
    userSkillDetails.forEach((detail: any) => {
      const userId = detail.user_id
      const skillType = skillTypeLookup[detail.skill_id]
      
      if (!userSkillsMap[userId]) {
        userSkillsMap[userId] = {
          userId,
          skills: {},
          subskills: {}
        }
      }

      if (skillType) {
        if (!userSkillsMap[userId].subskills[skillType.key]) {
          userSkillsMap[userId].subskills[skillType.key] = []
        }
        
        userSkillsMap[userId].subskills[skillType.key].push({
          name: detail.subskill,
          value: detail.value
        })
      }
    })

    // Convert to array format
    const allUsersSkills = Object.values(userSkillsMap)

    return NextResponse.json({
      success: true,
      data: {
        skillTypes,
        users: allUsersSkills
      }
    })

  } catch (error: any) {
    console.error('Skills API error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}
