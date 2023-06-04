const debug = false;

export const log = function (message) {
  if (debug) {
    console.log(message);
  }
};

export const error = function (message) {
  if (debug) {
    console.error(message);
  }
};
