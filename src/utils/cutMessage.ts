export const cutMessage = (message: string) => {
  const MAX_LENGTH = 80;

  let result = message.replace(/[\s]+/g, ' ');

  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH - 3) + '...';
  }

  return result;
};
