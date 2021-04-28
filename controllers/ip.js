import IpEntry from "../models/ip.js";
import faker from "faker";
const {
  internet: { ip: randomIp },
} = faker;

async function save(ctx, next) {
  //TODO disable mock ip
  // ipString = randomIp();
  const newIp = new IpEntry({ ip: ipString });

  ipString = await newIp.validate();
  try {
    const result = await newIp.save();
    //TODO response
    return; //
  } catch (e) {
    const { code } = e;
    if (code === 11000) {
      ctx.throw("IP already used");
    } else {
      ctx.throw("Error during save");
    }
  }
}

export { save };
