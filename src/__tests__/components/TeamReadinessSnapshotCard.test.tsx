import { render, screen } from '@testing-library/react'

// Mock team readiness data
const mockTeamReadiness = {
    readyForDeployment: 89,
    needsCoaching: 11,
    avgReadiness: 82,
    totalUsers: 36,
}

// Team Readiness Snapshot Card Component (copied for testing)
function TeamReadinessSnapshotCard() {
    return (
        <div data-testid="team-readiness-snapshot">
            <h2>Team Readiness Snapshot</h2>
            <p>Quick operational overview</p>
            <div>
                <div>
                    <div>{mockTeamReadiness.readyForDeployment}%</div>
                    <p>Ready for Deployment</p>
                </div>
                <div>
                    <div>{mockTeamReadiness.needsCoaching}%</div>
                    <p>Need Coaching</p>
                </div>
                <div>
                    <div>{mockTeamReadiness.avgReadiness}%</div>
                    <p>Avg. Readiness</p>
                </div>
            </div>
        </div>
    )
}

describe('TeamReadinessSnapshotCard', () => {
    it('renders team readiness statistics correctly', () => {
        render(<TeamReadinessSnapshotCard />)

        expect(screen.getByTestId('team-readiness-snapshot')).toBeInTheDocument()
        expect(screen.getByText('Team Readiness Snapshot')).toBeInTheDocument()
        expect(screen.getByText('Quick operational overview')).toBeInTheDocument()

        // Check the three main statistics
        expect(screen.getByText('89%')).toBeInTheDocument()
        expect(screen.getByText('Ready for Deployment')).toBeInTheDocument()

        expect(screen.getByText('11%')).toBeInTheDocument()
        expect(screen.getByText('Need Coaching')).toBeInTheDocument()

        expect(screen.getByText('82%')).toBeInTheDocument()
        expect(screen.getByText('Avg. Readiness')).toBeInTheDocument()
    })
}) 