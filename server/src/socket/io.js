// Small holder for the Socket.IO instance so controllers can emit events
// without creating a circular import with server.js.
let ioInstance = null;

export const setIO = (instance) => {
  ioInstance = instance;
};

export const getIO = () => ioInstance;