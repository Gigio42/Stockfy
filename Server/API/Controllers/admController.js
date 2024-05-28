import Maquina from "../Models/Maquina.js";

class AdmController {
  constructor() {}

  async getMaquina() {
    const maquinas = await Maquina.findMany();
    return maquinas;
  }

  async getChapasInItemsInMaquinas() {
    const maquinas = await Maquina.findMany({
      include: {
        items: {
          include: {
            Item: {
              include: {
                chapas: true,
              },
            },
          },
        },
      },
    });

    console.log(maquinas);

    return maquinas;
  }
}

export default AdmController;
