const Event = (props) => {
  const game = props.game;
  {
    game.events.map((event, index) => {
      return (
        <div className="event" key={index}>
          {event}
        </div>
      );
    });
  }
};

export default Event;
