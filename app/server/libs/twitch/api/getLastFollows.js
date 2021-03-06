const twitch = require("../index");
const Viewer = require("../../../db/Models/Viewer");

let offlineFollow = true;

module.exports = async function getLastFollows() {
  const user = await twitch.api.helix.users.getMe(true);
  const followsPaginated = await twitch.api.helix.users.getFollowsPaginated({
    followedUser: user,
  });

  const newFollows = [];

  let follows = await followsPaginated.getNext();

  for (let i = 0, l = follows.length; i < l; i++) {
    const { _data } = follows[i];

    const oldFollow = await Viewer.findByPk(_data.from_id);

    if (oldFollow) break;

    const newFollow = await Viewer.create({
      id: _data.from_id,
      name: _data.from_name,
      followedAt: _data.followed_at,
      isFollowing: true,
      offlineFollow,
    });

    if (!offlineFollow) {
      newFollows.push(newFollow);
    }
  }

  offlineFollow = false;

  return newFollows;
};
