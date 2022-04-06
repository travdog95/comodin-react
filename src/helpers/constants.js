const constants = {
  DECK_OF_CARDS_API: "https://deckofcardsapi.com/api/deck/",
  CARDS: {
    EXIT_START: ["JACK", "QUEEN", "KING", "ACE"],
    MOVE_BACKWARDS: ["8"],
    VALUES: {
      ACE: 1,
      JACK: 10,
      QUEEN: 10,
      KING: 10,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
    },
    SPLIT_MOVE: ["7", "9"],
  },
  TRACK: {
    EXIT: "track-9",
    DOOR: "track-4",
    NUM_POSITIONS: 18,
    START_POSITIONS: ["start-1", "start-2", "start-3", "start-4", "start-5"],
    HOME_POSITIONS: ["home-5", "home-4", "home-3", "home-2", "home-1"],
  },
  MARBLES: {
    COLORS: ["yellow", "green", "black", "white", "lightblue", "orange", "red", "blue"],
  },
  PADDLE_ITEMS: [
    { class: "spacer-9" },
    {
      class: "position",
      position: "start-1",
      label: 1,
    },
    { class: "spacer-2" },
    {
      class: "position",
      position: "home-1",
      label: 1,
    },
    { class: "spacer-5" },
    { class: "spacer-8" },
    {
      class: "position",
      position: "start-2",
      label: 2,
    },
    {
      class: "position",
      position: "start-3",
      label: 3,
    },
    {
      class: "position",
      position: "start-4",
      label: 4,
    },
    { class: "spacer-1" },
    {
      class: "position",
      position: "home-2",
      label: 2,
    },
    {
      class: "position",
      position: "home-3",
      label: 3,
    },
    {
      class: "position",
      position: "home-4",
      label: 4,
    },

    { class: "spacer-3" },
    { class: "spacer-9" },
    {
      class: "position",
      position: "start-5",
      label: 5,
    },
    { class: "spacer-4" },
    {
      class: "position",
      position: "home-5",
      label: 5,
    },
    { class: "spacer-3" },
    {
      class: "position",
      position: "track-18",
      label: 18,
    },
    {
      class: "position",
      position: "track-17",
      label: 17,
    },
    {
      class: "position",
      position: "track-16",
      label: 16,
    },
    {
      class: "position",
      position: "track-15",
      label: 15,
    },
    {
      class: "position",
      position: "track-14",
      label: 14,
    },
    {
      class: "position",
      position: "track-13",
      label: 13,
    },
    {
      class: "position",
      position: "track-12",
      label: 12,
    },
    {
      class: "position",
      position: "track-11",
      label: 11,
    },
    {
      class: "position",
      position: "track-10",
      label: 10,
    },
    {
      class: "position",
      position: "track-9",
      label: 9,
    },
    {
      class: "position",
      position: "track-8",
      label: 8,
    },
    {
      class: "position",
      position: "track-7",
      label: 7,
    },
    {
      class: "position",
      position: "track-6",
      label: 6,
    },
    {
      class: "position",
      position: "track-5",
      label: 5,
    },
    {
      class: "position",
      position: "track-4",
      label: 4,
    },
    {
      class: "position",
      position: "track-3",
      label: 3,
    },
    {
      class: "position",
      position: "track-2",
      label: 2,
    },
    {
      class: "position",
      position: "track-1",
      label: 1,
    },
  ],
};

export default constants;
