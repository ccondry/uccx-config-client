module.exports = function ({userId, skillRefUrl}) {
  return {
    name: 'Voice_' + userId,
    queueType: 'VOICE',
    queueAlgorithm: 'FIFO',
    autoWork: true,
    wrapupTime: 1,
    resourcePoolType: 'SKILL_GROUP',
    serviceLevel: 5,
    serviceLevelPercentage: 70,
    poolSpecificInfo: {
      skillGroup: {
        skillCompetency: [{
          competencelevel: 5,
          skillNameUriPair:{
            '@name':'Voice_' + userId,
            refURL: skillRefUrl
          },
          weight: 1,
        }],
        selectionCriteria:'Longest Available'
      }
    }
  }
}
