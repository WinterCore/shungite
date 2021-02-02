import { Router }     from "express";
import * as UserAgent from "useragent";

import TwitchUser from "../../database/models/twitch-user";
import Token      from "../../database/models/token";

import { co }            from "../helpers";
import { twitchAuth }    from "../middleware/validation/auth";

import * as Twitch from "../services/twitch";
import * as JWT    from "../services/jwt";
import userResource from "./resources/user";

import UnauthenticatedError from "../errors/unauthenticated";

const router = Router();


router.post("/twitch", twitchAuth, co(async (req, res) => {
    let tokenResp: Twitch.TokenResponse;

    try {
        tokenResp = await Twitch.getToken(req.body.code);
    } catch (e) {
        throw new UnauthenticatedError();
    }

    const userData = await Twitch.getUserData(tokenResp.access_token);

    const user = (await TwitchUser.findOneAndUpdate(
        { twitchId: userData.id },
        {
            email    : userData.email,
            twitchId : userData.id,
            username : userData.login,
            name     : userData.display_name,
            picture  : userData.profile_image_url,
        },
        { upsert: true, setDefaultsOnInsert: true, new: true },
    ))!;

    const jwtToken = await JWT.encrypt({ id: user._id });

    const agent = UserAgent.parse(req.headers["user-agent"]);
    await Token.create({
        owner   : user._id,
        token   : jwtToken,
        os      : agent.os.toString(),
        browser : agent.toAgent(),
        ip      : req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    res.json({ data: userResource(user), token: jwtToken });
}));

export default router;
