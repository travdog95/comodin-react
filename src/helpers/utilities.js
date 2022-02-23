export default {
  getMarblePositionValue(position) {
    return parseInt(position.substring(position.indexOf("-") + 1));
  },
  getNextTrack(track, numPlayers) {
    return track === numPlayers ? 1 : track + 1;
  },
};
