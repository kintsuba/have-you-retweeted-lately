import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import * as dotenv from "dotenv";
import { exit } from "process";
dotenv.config();

import { TwitterApi, UserV2 } from "twitter-api-v2";
import { Readline } from "readline/promises";

const rl = readline.createInterface({ input, output });

if (!process.env) {
  console.error(".env file not found");
  exit(-1);
}

const main = async () => {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    console.error("BEARER_TOKEN does not exist in .env file");
    exit(-1);
  }

  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
  const readOnlyClient = twitterClient.readOnly;

  if (!process.env.USER_NAME) {
    console.error("USER_NAME does not exist in .env file");
    exit(-1);
  }

  const targetUser = await readOnlyClient.v2.userByUsername(
    process.env.USER_NAME
  );
  const followersOfTargetAsPaginator = await readOnlyClient.v2.followers(
    targetUser.data.id,
    { asPaginator: true }
  );

  const screen = new Readline(output);
  const noRTUsers: UserV2[] = [];

  process.stdout.write("\x1B[?25l"); // ローディング表示のためにカーソルを一旦消す

  for (const follower of followersOfTargetAsPaginator) {
    screen.clearLine(0);
    screen.commit();
    process.stdout.write(`Checking ${follower.name}.\r`);

    const userTL = await readOnlyClient.v2.userTimeline(follower.id);

    if (
      userTL.data.data &&
      !userTL.data.data.some((tweet) => /^RT/.test(tweet.text))
    ) {
      noRTUsers.push(follower);
    }
  }

  process.stderr.write("\x1B[?25h"); //消したカーソルを戻す

  console.log("----- List of followers who have not retweeted recently -----");

  noRTUsers.forEach((user) => {
    console.log(`${user.name} (@${user.username})`);
  });

  console.log("--------------------------------------------------------------");
};

main();
