import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const [
      profilesRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
      examGrowthAreasRes,
      userProgramsRes,
      assessmentsRes,
      evaluationsRes
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, name')
        .is('is_deleted', false),
      (supabase as any)
        .from('personality_exams')
        .select('id, user_id, type'),
      (supabase as any)
        .from('exam_traits')
        .select('exam_id, trait, value'),
      (supabase as any)
        .from('exam_strengths')
        .select('exam_id, strength'),
      (supabase as any)
        .from('exam_growth_areas')
        .select('exam_id, area'),
      (supabase as any)
        .from('user_programs')
        .select('user_id, assessment_id, readiness'),
      supabase
        .from('assessments')
        .select('id, title'),
      // Remove hardcoded filters - get all evaluations
      (supabase as any)
        .from('evaluations')
        .select('id, user_id, assessment_id, is_completed, results')
        .eq('is_completed', true) // Only get completed evaluations
    ])

    // Error handling
    for (const res of [profilesRes, personalityExamsRes, examTraitsRes, examStrengthsRes, examGrowthAreasRes, userProgramsRes, assessmentsRes, evaluationsRes]) {
      if (res.error) {
        console.error('Supabase error:', res.error)
        return NextResponse.json({ error: res.error.message }, { status: 500 })
      }
    }

    const profiles = profilesRes.data!
    const personalityExams = personalityExamsRes.data!
    const examTraits = examTraitsRes.data!
    const examStrengths = examStrengthsRes.data!
    const examGrowthAreas = examGrowthAreasRes.data!
    const userPrograms = userProgramsRes.data!
    const assessments = assessmentsRes.data!
    const evaluations = evaluationsRes.data!

    // Build assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach((a: any) => {
      assessmentLookup[a.id] = a.title
    })

    // Assemble per-user payload
    const payload = profiles.map((profile: any) => {
      // Find this user's personality exam
      const personalityExam = personalityExams.find((e: any) => e.user_id === profile.id)
      
      // Find this user's Big Five evaluation (if any)
      const userEvaluation = evaluations.find((e: any) => e.user_id === profile.id)

      // Build traits map from personality exam
      const traitMap: Record<string, number> = {}
      if (personalityExam) {
        examTraits
          .filter((t: any) => t.exam_id === personalityExam.id)
          .forEach((t: any) => {
            traitMap[t.trait] = t.value
          })
      }

      // Get strengths
      const strengthList = personalityExam
        ? examStrengths
            .filter((s: any) => s.exam_id === personalityExam.id)
            .map((s: any) => s.strength)
        : []

      // Get growth areas
      const growthList = personalityExam
        ? examGrowthAreas
            .filter((g: any) => g.exam_id === personalityExam.id)
            .map((g: any) => g.area)
        : []

      // Get Big Five evaluation results
      const evaluationsList = userEvaluation ? [userEvaluation] : []

      // Get program readiness
      const programReadiness: Record<string, number> = {}
      userPrograms
        .filter((up: any) => up.user_id === profile.id)
        .forEach((up: any) => {
          const title = assessmentLookup[up.assessment_id] || up.assessment_id
          if (!title.toLowerCase().includes('big five')) {
            programReadiness[title] = up.readiness
          }
        })

      return {
        id: profile.id,
        name: profile.name,
        personalityExam: {
          type: personalityExam?.type ?? 'Not Assessed',
          traits: traitMap,
          strengths: strengthList,
          evaluations: evaluationsList,
          growthAreas: growthList,
          recommendedRoles: [] // You can populate this if you add a table
        },
        programReadiness
      }
  })

    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('personality-exam API error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}