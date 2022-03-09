const utilities = {
  getMarblePositionValue(position) {
    return parseInt(position.substring(position.indexOf("-") + 1));
  },
  getNextTrack(track, numPlayers) {
    return track === numPlayers ? 1 : track + 1;
  },
  getNextPlayerId(currentPlayerId, players) {
    let nextPlayerIdIndex;
    players.forEach((player, index) => {
      if (currentPlayerId === player.id) {
        nextPlayerIdIndex = index + 1;
      }
    });

    //If currentPlayerId is the last player, set nextPlayerIndex to 0
    nextPlayerIdIndex = nextPlayerIdIndex === players.length ? 0 : nextPlayerIdIndex;

    return players[nextPlayerIdIndex].id;
  },
  getPlayerById(players, playerId) {
    const playerArray = players.filter((player) => player.id === playerId);

    return playerArray[0];
  },
};

export default utilities;
