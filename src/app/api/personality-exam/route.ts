import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/api/with-auth'

export const GET = withAuth(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  try {
    let profilesQuery = supabase
      .from('profiles')
      .select('id, name')
      .is('is_deleted', false)

    if (userId) {
      profilesQuery = profilesQuery.eq('id', userId)
    }

    let examsQuery = (supabase as any)
      .from('personality_exams')
      .select('id, user_id, type')

    if (userId) {
      examsQuery = examsQuery.eq('user_id', userId)
    }

    let userProgramsQuery = (supabase as any)
      .from('user_programs')
      .select('user_id, assessment_id, readiness')

    if (userId) {
      userProgramsQuery = userProgramsQuery.eq('user_id', userId)
    }

    let evaluationsQuery = supabase
      .from('evaluations')
      .select(
        "id , user_id , assessment_id ,is_completed, results, user:profiles (id, email, name)"
      )
      .eq("workplace_id", "406f9926-0670-4a95-9252-c064c25912e4")
      .eq("assessment_id", "3ac68f05-2ea9-4223-b139-d88373859379")
      .order("created_at", { ascending: false })

    if (userId) {
      evaluationsQuery = evaluationsQuery.eq('user_id', userId)
    }

    const [
      profilesRes,
      examsRes,
      traitsRes,
      strengthsRes,
      growthAreasRes,
      userProgramsRes,
      assessmentsRes,
      evaluationRes
    ] = await Promise.all([
      profilesQuery,
      examsQuery,
      (supabase as any)
        .from('exam_traits')
        .select('exam_id, trait, value'),
      (supabase as any)
        .from('exam_strengths')
        .select('exam_id, strength'),
      (supabase as any)
        .from('exam_growth_areas')
        .select('exam_id, area'),
      userProgramsQuery,
      supabase
        .from('assessments')
        .select('id, title'),
      evaluationsQuery
    ])
    // 2️⃣ Error handling
    for (const res of [profilesRes, examsRes, traitsRes, strengthsRes, growthAreasRes, userProgramsRes, assessmentsRes, evaluationRes]) {
      if (res.error) {
        console.error('Supabase error:', res.error)
        return NextResponse.json({ error: res.error.message }, { status: 500 })
      }
    }

    const profiles      = profilesRes.data!
    const exams         = examsRes.data!
    const traits        = traitsRes.data!
    const strengths     = strengthsRes.data!
    const growthAreas   = growthAreasRes.data!
    const userPrograms  = userProgramsRes.data!
    const assessments   = assessmentsRes.data!
    const evaluations = evaluationRes.data!
    console.log(evaluations)
    // 3️⃣ Build an assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach((a: any) => {
      assessmentLookup[a.id] = a.title
    })

    // 4️⃣ Assemble per‐user payload
    const payload = profiles.map((p: any) => {
      // find this user's exam, if any
      const exam = exams.find((e: any) => e.user_id === p.id)

      // traits map
      const traitMap: Record<string, number> = {}
      if (exam) {
        traits
          .filter((t: any) => t.exam_id === exam.id)
          .forEach((t: any) => {
            traitMap[t.trait] = t.value
          })
      }

      // strengths
      const strengthList = exam
        ? strengths
            .filter((s: any) => s.exam_id === exam.id)
            .map((s: any) => s.strength)
        : []
      
      const evaluationsList = evaluations
        ? evaluations
            .filter((e: any) => e.user.id === p.id )
        : []

      // growth areas
      const growthList = exam
        ? growthAreas
            .filter((g: any) => g.exam_id === exam.id)
            .map((g: any) => g.area)
        : []

      // program readiness
      const progRead: Record<string, number> = {}
      userPrograms
        .filter((up: any) => up.user_id === p.id)
        .forEach((up: any) => {
          const title = assessmentLookup[up.assessment_id] || up.assessment_id
          // skip “Big Five” internal copies
          if (!title.toLowerCase().includes('big five')) {
            progRead[title] = up.readiness
          }
        })

      return {
        id: p.id,
        name: p.name,
        personalityExam: {
          type: exam?.type ?? 'Not Assessed',
          traits: traitMap,
          strengths: strengthList,
          evaluations:evaluationsList,
          growthAreas: growthList,
          recommendedRoles: [] as string[] // populate if you add a table
        },
        programReadiness: progRead
      }
    })

    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('personality-exam API error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
})
