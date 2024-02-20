export function getFeesAPY(fee24hUsd: number, liquidityUsd: number) {
  return (fee24hUsd / liquidityUsd) * 365 * 100
}

export function getStakeAPY(stakeRewardPerSecUsd: number, poolAllocPoints: number, totalAllocPoints: number, poolStakenUsd: number) {
  const yearReward = stakeRewardPerSecUsd * 60 * 60 * 24 * 365

  return (yearReward * (poolAllocPoints / totalAllocPoints)) / poolStakenUsd
}
