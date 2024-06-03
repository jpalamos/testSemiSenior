

let socketInstance;

const initializeSocket = (socket) => {
  socketInstance = socket;
};

const dashboardEvent_updateConstumer = (totalConsumer) => {
  if (socketInstance)
    socketInstance.emit('dashboard:updateConsumer', totalConsumer);
};

const dashboardEvent_updateAssistence = (newItem) => {
  if (socketInstance)
    socketInstance.emit('dashboard:updateAssistence', newItem);
};

module.exports = {
  initializeSocket,
  dashboardEvent_updateConstumer,
  dashboardEvent_updateAssistence,
};