import { getAll, getByDateRange, getById, add, deleteEntity } from '../Controllers/newHistoricoController.js';

async function historicoRoutes(fastify, options) {
    fastify.get('/:model/action/by-date', getByDateRange);
    fastify.get('/:model', getAll);
    fastify.get('/:model/:id', getById); 
    fastify.post('/:model', add); 
    fastify.delete('/:model/:id', deleteEntity); 
}

export default historicoRoutes;
