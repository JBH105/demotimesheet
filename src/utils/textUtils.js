export const toTitleCase = (str) => {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  