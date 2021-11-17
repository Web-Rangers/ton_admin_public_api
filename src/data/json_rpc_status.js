let status = {
    electionId: 0,
    tpsAvg: [],
    totalValidators: 0,
    onlineValidators: 0,
    startValidation: 0,
    endValidation: 0,
    startNextElection: 0,
    services:[],
    liteservers:[],
    config_votings:[],
    slashing:[],
    validator_elections:{},
    blocks:[]
}

module.exports.status = status