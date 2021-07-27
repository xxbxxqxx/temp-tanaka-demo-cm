import * as React from "react"

const nl2br = text => {
  var regex = /(\n)/g;
  return text.split(regex).map(function (line) {
    if (line.match(regex)) {
      return React.createElement('br');
    } else {
      return line;
    }
  });
};

export default nl2br;
