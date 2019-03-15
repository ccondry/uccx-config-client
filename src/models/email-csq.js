module.exports = function ({
  userId,
  skillRefUrl,
  channelProviderId,
  channelProviderRefUrl
}) {
  return {
    name: 'Email_' + userId,
    queueType: 'EMAIL',
    queueAlgorithm: 'FIFO',
    routingType: 'NONINTERACTIVE',
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
            '@name':'Email_' + userId,
            refURL: skillRefUrl
            // refURL: 'https://uccx1.dcloud.cisco.com/adminapi/skill/24'
          },
          weight: 1,
        }],
        selectionCriteria:'Longest Available'
      }
    },
    accountUserId: 'support_' + userId + '@cisco.com',
    accountPassword: 'C1sco12345',
    // reviewQueue: {
    //   '@name': 'Email_' + userId,
    //   refURL: 'https://uccx1.dcloud.cisco.com/adminapi/skill/24'
    // },
    channelProvider: {
      '@name': channelProviderId,
      refURL: channelProviderRefUrl
    },
    pollingInterval: 180,
    folderName: 'Inbox',
    snapshotAge: 120
  }
}
