import KnownError from '@/helpers/KnownError';
import { COMMAND_TITLE } from '@/types';
import generalMessage from '@/commands/Help/generalMessage';

const commands = {
  generalMessage,
  commands: {
    [COMMAND_TITLE.ROLL]: {
      desc: '/roll: (\nnumber N (=1),\nnumber D (=6)\n) — simulation of throwing (--N) dices with (--D) dimensions.',
      examples: ['/roll', '/roll --N 3', '/roll --D 20'],
    },
    [COMMAND_TITLE.WEATHER]: {
      /* eslint-disable-next-line max-len */
      desc: '/weather: (\nstring city (required),\nstring country (auto),\nnumber days (=1),\n) — sends data about the weather in the city (--city) of the country (--country) for (--days) further days.',
      examples: [
        '/weather --city Moscow',
        '/weather --city Moscow --country ru',
        '/weather --city Moscow --days 5',
        '/weather --city Moscow --lang ru',
      ],
    },
    [COMMAND_TITLE.PIXEL]: {
      /* eslint-disable-next-line max-len */
      desc: '/pixel: (\nnumber size (=10)\n) — creates pixel art of the the input image with pixel size (--size) times larger than usual.\n\nPICTURE REQUIRED!',
      examples: ['/pixel', '/pixel --size 25'],
    },
    [COMMAND_TITLE.ASCII]: {
      /* eslint-disable-next-line max-len */
      desc: '/ascii: (\nnumber W (auto),\nboolean compact (=false)\n) — sends text with (--W) symbols per line that visually mimics the given image; sends compactly if (--compact).\n\nPICTURE REQUIRED!',
      examples: ['/ascii', '/ascii --W 15', '/ascii --compact'],
    },
    [COMMAND_TITLE.CYPHER]: {
      desc: "/cypher: (\ntext phrase (auto),\nstring key (auto)\n) — encrypts ('text') by (--key).",
      examples: ['/cypher', "/cypher 'cypher this'", '/cypher --key key'],
    },
    [COMMAND_TITLE.DECYPHER]: {
      desc: "/decypher: (\ntext phrase (required),\nstring key (required)\n) - decrypts ('text') by (--key).",
      examples: ["/decypher --key key 'decypher this'"],
    },
    [COMMAND_TITLE.FUNNY_ANIMALS]: {
      desc: '/funny_animals: () — sends a picture of a funny animal :).',
      examples: ['/funny_animals'],
    },
    [COMMAND_TITLE.HAPPY_NORMING]: {
      desc: '/happy_norming: () — sends a picture with a wish for a good day of the week today.',
      examples: ['/happy_norming'],
    },
  } as {
    [title in COMMAND_TITLE]: {
      desc: string;
      examples: string[];
    };
  },
};

const _ERRORS_MESSAGES = {
  commandNotFound: (commandTitle: string) => `Command '${commandTitle}' not found, send /help to see commands list`,
};

export default class Help {
  constructor(private readonly commandTitle: string) {}

  public getResult() {
    const addSpecialDescription = (commandTitle: string) => {
      const theCommand = commands.commands[commandTitle as COMMAND_TITLE];

      if (!theCommand) {
        throw new KnownError(_ERRORS_MESSAGES.commandNotFound(commandTitle));
      }

      return theCommand.examples.reduce(
        (acc, example) => (acc += '```\n' + example + '```'),
        theCommand.desc.replace(/_/g, '\\_') + '\n\nExamples:\n',
      );
    };

    const isCommandTitleExist = Boolean(this.commandTitle);

    return {
      result: isCommandTitleExist ? addSpecialDescription(this.commandTitle) : commands.generalMessage,
      shouldUseMd: isCommandTitleExist,
    };
  }
}
