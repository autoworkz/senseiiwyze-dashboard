// app/api/vision-board/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const [
      profilesRes,
      boardsRes,
      goalsRes,
      focusRes,
      keywordsRes,
      journalsRes,
      programsRes,
      skillsRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, name').eq('is_deleted', false),
      supabase.from('vision_boards').select('id, user_id, img_url'),
      (supabase as any).from('vision_goals').select('board_id, goal_text'),
      (supabase as any).from('vision_focus_areas').select('board_id, focus_area'),
      (supabase as any).from('vision_keywords').select('board_id, keyword'),
      (supabase as any).from('vision_journal_entries').select('board_id, entry_date, content'),
      (supabase as any).from('user_programs').select('user_id, readiness, assessments!inner(title)'),
      (supabase as any).from('user_core_skills').select('user_id, category')
    ])

    for (const resp of [profilesRes, boardsRes, goalsRes, focusRes, keywordsRes, journalsRes, programsRes, skillsRes]) {
      if (resp.error) {
        return NextResponse.json({ error: resp.error.message }, { status: 500 })
      }
    }

    const profiles   = profilesRes.data!
    const boards     = boardsRes.data!
    const goals      = goalsRes.data!
    const focusAreas = focusRes.data!
    const keywords   = keywordsRes.data!
    const journals   = journalsRes.data!
    const programs   = programsRes.data!
    const skills     = skillsRes.data!

    // helper to map goal → skill key
    function mapGoalToSkill(goal: string): string | null {
      const g = goal.toLowerCase()
      if (g.includes('lead') || g.includes('team'))       return 'Leadership'
      if (g.includes('architect') || g.includes('design')) return 'Architecture'
      if (g.includes('develop') || g.includes('build') || g.includes('code')) return 'Development'
      if (g.includes('ai') || g.includes('ml') || g.includes('machine learning')) return 'AI/ML'
      if (g.includes('security') || g.includes('secure'))  return 'Security'
      if (g.includes('data') || g.includes('analytics'))   return 'Data Analytics'
      return null
    }

    const result = profiles.map(p => {
      const board = boards.find(b => b.user_id === p.id)
      const boardId = board?.id

      const userGoals = boardId
        ? goals.filter((g: any) => g.board_id === boardId).map((g: any) => g.goal_text)
        : []

      // count relatedSkills
      const counts: Record<string, number> = {}
      userGoals.forEach((goal: string) => {
        const skill = mapGoalToSkill(goal)
        if (skill) counts[skill] = (counts[skill] || 0) + 1
      })
      const relatedSkills = Object.entries(counts)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)

      // other vision data
      const userFocus = boardId
        ? focusAreas.filter((f: any) => f.board_id === boardId).map((f: any) => f.focus_area)
        : []
      const userKeywords = boardId
        ? keywords.filter((k: any) => k.board_id === boardId).map((k: any) => k.keyword)
        : []
      const userJournals = boardId
        ? journals
            .filter((j: any) => j.board_id === boardId)
            .map((j: any) => ({ date: j.entry_date, content: j.content }))
        : []

      // program readiness
      const programReadiness: Record<string, number> = {}
      programs
        .filter((up: any) => up.user_id === p.id)
        .forEach((up: any) => {
          programReadiness[up.assessments.title] = up.readiness
        })

              return {
          id: p.id,
          name: p.name,
          visionBoard: {
            goals: userGoals,
            focusAreas: userFocus,
            keywords: userKeywords,
            journalEntries: userJournals
          },
          programReadiness,
          relatedSkills,
          coverUrl: board?.img_url || null
        }
    })

    return NextResponse.json(result)
  }
  catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
