export default class Message {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  //TO DO: validation of type ["primary","secondary","success","warning", "danger", "info","light","dark"]
}
