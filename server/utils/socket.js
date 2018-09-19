let io;

/**
 * @class Notification
 */
class Socket {
  /**
   * find a user by username
   * @param {*} ioObj - Request object
   * @returns {user} token - JWT token(Optional)
   */
  static connect(ioObj) {
    io = ioObj;
    io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log('New user connected', socket.id);
    });
  }

  /**
   * sends notifications
   * @param {*} type
   * @param {*} payload
   * @param {*} userId
   *
   * @returns {null} null;
   */
  static send(type, payload) {
    io.emit(type, payload);
  }
}

export default Socket;
