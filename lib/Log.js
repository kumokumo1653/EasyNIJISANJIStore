const debug = true;

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
