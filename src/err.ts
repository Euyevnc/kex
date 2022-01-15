function setPrototypeOf(obj: any, proto: any) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(obj, proto);
  } else {
    obj.__proto__ = proto;
  }
}

export default function EtaErr(message: string): Error {
  const err = new Error(message);
  setPrototypeOf(err, EtaErr.prototype);
  return err;
}

EtaErr.prototype = Object.create(Error.prototype, {
  name: { value: "Eta Error", enumerable: false },
});

/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */

export function ParseErr(message: string, str: string, indx: number): void {
  const whitespace = str.slice(0, indx).split(/\n/);

  const lineNo = whitespace.length;
  const colNo = whitespace[lineNo - 1].length + 1;
  message +=
    " at line " +
    lineNo +
    " col " +
    colNo +
    ":\n\n" +
    "  " +
    str.split(/\n/)[lineNo - 1] +
    "\n" +
    "  " +
    Array(colNo).join(" ") +
    "^";
  throw EtaErr(message);
}
