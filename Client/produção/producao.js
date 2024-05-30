import { setUserInfo, setMachineName } from './scripts/userInfo.js';
import { render } from './scripts/render.js';

const username = "João";
const name = "riscador";

setUserInfo(username);
setMachineName(name);
render(name);