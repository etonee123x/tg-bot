export const joinStr = (...args: Array<string | boolean | undefined | null>) =>
  args
    .slice(0, args.length - 1)
    .filter(Boolean)
    .join(String(args.at(-1)));
