import comprasRoute from './comprasRoute.js';
import recebimentoRoute from './recebimentoRoute.js';
// import pcpRoute from './PCPRoute.js';
// import admRoute from './ADMRoute.js';
//import producaoRoute from './producaoRoute.js'; 
// import testeRoute from "./TesteRoute.js";

export default function(fastify) {
  fastify.register(comprasRoute, { prefix: '/compras' });
  fastify.register(recebimentoRoute, { prefix: '/recebimento' });
  // fastify.register(pcpRoute, { prefix: '/PCP' });
  // fastify.register(admRoute, { prefix: '/adm' });
  // //fastify.register(producaoRoute, { prefix: '/producao' }); 
  // fastify.register(testeRoute, { prefix: '/teste' });
}