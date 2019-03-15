module.exports = function ({userId, skillRefUrl}) {
  return {
    name: 'Chat_' + userId,
    queueType: 'CHAT',
    queueAlgorithm: 'FIFO',
    routingType: 'INTERACTIVE',
    // autoWork: true,
    // wrapupTime: 1,
    resourcePoolType: 'SKILL_GROUP',
    // serviceLevel: 5,
    // serviceLevelPercentage: 70,
    poolSpecificInfo: {
      skillGroup: {
        skillCompetency: [{
          competencelevel: 5,
          skillNameUriPair:{
            '@name':'Chat_' + userId,
            refURL: skillRefUrl
          },
          weight: 1,
        }],
        selectionCriteria:'Longest Available'
      }
    }
  }
}
