export function calculateTransitionInsights(transitions, history) {
    const completed = transitions['IN_PROGRESS -> COMPLETED'] || 0
    
    const cancelledFromPending = transitions['PENDING -> CANCELLED'] || 0
    const cancelledFromInProgress = transitions['IN_PROGRESS -> CANCELLED'] || 0
    const totalCancelled = cancelledFromPending + cancelledFromInProgress
    
    const movedToInProgress = transitions['PENDING -> IN_PROGRESS'] || 0
    
    const totalProcessed = completed + totalCancelled
    
    const completionRate = totalProcessed > 0 
        ? Math.round((completed / totalProcessed) * 100) 
        : 0
    
    const cancellationRate = totalProcessed > 0 
        ? Math.round((totalCancelled / totalProcessed) * 100) 
        : 0
    
    const startedWorkRate = movedToInProgress > 0
        ? Math.round((cancelledFromInProgress / movedToInProgress) * 100)
        : 0

    return {
        completionRate,
        cancellationRate,
        directCancellationFromPending: cancelledFromPending,
        cancellationAfterStarted: cancelledFromInProgress,
        startedWorkRate,
        totalCompleted: completed,
        totalCancelled: totalCancelled,
        totalStarted: movedToInProgress
    }
}