import IpEntry from "../models/ip.js";
import faker from "faker";
import * as geoip from "fast-geoip";

const {
  internet: { ip: randomIp },
} = faker;

async function validate(ctx, next) {
  let ipString = ctx.request.headers["x-real-ip"];
  //TODO disable mock ip
  ipString = randomIp();
  const { country } = await geoip.lookup(ipString);
  const newIp = new IpEntry({ ip: ipString, country });
  await newIp.validate();

  try {
    const document = await newIp.save();
    ctx.state = {
      ...ctx.state,
      ip: { country, string: ipString, _id: document._id },
    };
    return next();
  } catch (e) {
    const { code } = e;
    if (code === 11000) {
      ctx.throw("IP already used");
    } else {
      ctx.throw("Error during save");
    }
  }
}

export { validate };
