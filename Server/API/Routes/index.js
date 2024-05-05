import comprasRoute from './comprasRoute.js';
import recebimentoRoute from './recebimentoRoute.js';
import pcpRoute from './PCPRoute.js';
/* import ADMroute from './ADMRoute.js';
import producaoRoute from './producaoRoute.js'; */
import testeRoute from "./TesteRoute.js";

export default function(fastify) {
  fastify.register(comprasRoute, { prefix: '/compras' });
  fastify.register(recebimentoRoute, { prefix: '/recebimento' });
  fastify.register(pcpRoute, { prefix: '/PCP' });
  /* fastify.register(ADMroute, { prefix: '/ADM' });
  fastify.register(producaoRoute, { prefix: '/producao' }); */
  fastify.register(testeRoute, { prefix: '/teste' });
}