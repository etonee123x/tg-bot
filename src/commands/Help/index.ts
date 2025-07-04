import { GENERAL_MESSAGE } from '@/constants/generalMessage';
import { COMMAND_TITLE, isCommandTitle } from '@/types';
import { createErrorClient } from '@etonee123x/shared/helpers/error';

const ERRORS_MESSAGES = {
  commandNotFound: (commandTitle: string) => `Command '${commandTitle}' not found, send /help to see commands list`,
};

const COMMAND_TITLE_TO_HELP = {
  [COMMAND_TITLE.ECHO]: {
    // TODO: сделать text
    desc: '/echo: () — lifecheck',
    examples: ['/echo', '/echo text to echo'],
  },
  [COMMAND_TITLE.ROLL]: {
    desc: '/roll: (\nnumber N (=1),\nnumber D (=6)\n) — simulation of throwing (--N) dices with (--D) dimensions.',
    examples: ['/roll', '/roll --N 3', '/roll --D 20'],
  },
  [COMMAND_TITLE.WEATHER]: {
    desc: '/weather: (\nstring city (required),\nstring country (auto),\nnumber days (=1),\n) — sends data about the weather in the city (--city) of the country (--country) for (--days) further days.',
    examples: ['/weather --city Moscow', '/weather --city Moscow --country ru', '/weather --city Moscow --days 5'],
  },
  [COMMAND_TITLE.PIXEL]: {
    desc: '/pixel: (\nnumber size (=10)\n) — creates pixel art of the the input image with pixel size (--size) times larger than usual.\n\nPICTURE REQUIRED!',
    examples: ['/pixel', '/pixel --size 25'],
  },
  [COMMAND_TITLE.ASCII]: {
    desc: '/ascii: (\nnumber W (auto),\nboolean compact (=false)\n) — sends text with (--W) symbols per line that visually mimics the given image; sends compactly if (--compact).\n\nPICTURE REQUIRED!',
    examples: ['/ascii', '/ascii --W 15', '/ascii --compact'],
  },
  [COMMAND_TITLE.FUNNY_ANIMALS]: {
    desc: '/funny_animals: () — sends a picture of a funny animal :).',
    examples: ['/funny_animals'],
  },
  [COMMAND_TITLE.HAPPY_NORMING]: {
    desc: '/happy_norming: () — sends a picture with a wish for a good day of the week today.',
    examples: ['/happy_norming'],
  },
  [COMMAND_TITLE.HELP]: {
    // TODO: сделать text
    desc: "/help: () — sends list of the commands or command's documentation if command's title is presented.",
    examples: ['/help', '/help roll'],
  },
} as const;

export class Help {
  constructor(private readonly commandTitle: string) {}

  public getResult() {
    const addSpecialDescription = (commandTitle: COMMAND_TITLE) => {
      if (commandTitle === COMMAND_TITLE.AUTH) {
        throw createErrorClient(ERRORS_MESSAGES.commandNotFound(commandTitle));
      }

      const theCommand = COMMAND_TITLE_TO_HELP[commandTitle];

      return theCommand.examples.reduce(
        (acc, example) => (acc += '```\n' + example + '```'),
        theCommand.desc.replace(/_/g, '\\_') + '\n\nExamples:\n',
      );
    };

    const isCommandTitleExist = Boolean(this.commandTitle);

    return {
      result: isCommandTitle(this.commandTitle) ? addSpecialDescription(this.commandTitle) : GENERAL_MESSAGE,
      shouldUseMd: isCommandTitleExist,
    };
  }
}
