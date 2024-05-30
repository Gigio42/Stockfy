import { setUserInfo, setMachineName } from './scripts/userInfo.js';
import { render } from './scripts/render.js';

const name = "riscador";

setUserInfo();
setMachineName(name);
render(name);