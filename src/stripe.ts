import { TAppointment } from "./domain/entities/appointment-entity";
import { buscarCliente } from "./model/DAO/cliente/usuario";
import dotenv from 'dotenv';
dotenv.config();

import { Stripe } from "stripe";
import { getIdByName } from "./model/DAO/psicologo/usuario";
import { listarDisponibilidadesPorProfissional } from "./model/DAO/disponibilidade/disponibilidade";
import { TAvailability } from "./domain/entities/availability-entity";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export const makePayment = async (data: TAppointment, id_cliente: number) => {

  try {
    let usuario = await buscarCliente(id_cliente)

    let idPsico = await getIdByName(data.tbl_psicologos.nome)

    const disponibilidadesPsicologo = await listarDisponibilidadesPorProfissional(Number(idPsico))


    const disponibilidadesArray = Array.isArray(disponibilidadesPsicologo.disponibilidades)
      ? disponibilidadesPsicologo.disponibilidades
      : [];


    let disponibilidadeSelecionada: TAvailability | null = null

    function getDiaSemana(dataISO: string): string {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

      const dataObj = new Date(dataISO);
      const diaIndex = dataObj.getDay();

      return diasSemana[diaIndex];
    }

    function getHorario(dataISO: string): string {
      const dataObj = new Date(dataISO);
      const horas = String(dataObj.getUTCHours())
      const minutos = String(dataObj.getUTCMinutes())

      return `${horas}:${minutos}`;
    }

    for (const disp of disponibilidadesArray) {
      console.log('DISP:', disp)

      const diaDisponibilidade = disp.dia_semana;
      const horarioInicio = disp.horario_inicio
      const horarioFim = disp.horario_fim
      const diaConsulta = getDiaSemana(data.data_consulta)
      const horarioConsulta = getHorario(data.data_consulta)

      if (
        diaConsulta === diaDisponibilidade &&
        horarioConsulta >= horarioInicio &&
        horarioConsulta <= horarioFim
      ) {
        disponibilidadeSelecionada = disp;
        break;
      }
    }

    if (!disponibilidadeSelecionada) {
      throw new Error('Nenhuma disponibilidade correspondente encontrada!');
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: String(usuario?.id),
        consultaId: String(data.id),
        disponibilidadeId: JSON.stringify(disponibilidadeSelecionada),
        psicoId: String(idPsico)
      }
    })


    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Consulta Terapêutica - Individual',
            },
            unit_amount: data.valor * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      customer: customer.id,
      success_url: `http://localhost:5173/PaymentStatus?success=true`,
      cancel_url: `http://localhost:5173/PaymentStatus?success=false`,
      metadata: {
        userId: String(usuario?.id),
        consultaId: String(data.id),
        disponibilidade: JSON.stringify(disponibilidadeSelecionada),
        psicoId: String(idPsico)
      },
    });

    return { url: session.url }

  } catch (error) {
    return error
  }

};
