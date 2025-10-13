import { PrismaClient } from '@prisma/client';
import { ScheduleType } from '../../validator/schedule/scheduleValidator';
import { format } from 'date-fns';
import { sendWhatsapp } from '../fonte/fonteService';
import { id as idLocale } from 'date-fns/locale';

const prisma = new PrismaClient();

export const getAllSchedulesPatientService = async (userId: string) => {
  try {
    const result = await prisma.schedule.findMany({
      where: {
        patient_id: userId,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching schedules patients: ' + error.message);
    }
    throw new Error('Unknown error fetching schedules patients');
  }
};

export const getAllSchedulesNakesService = async (userId: string) => {
  try {
    const result = await prisma.schedule.findMany({
      where: {
        medical_id: userId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching schedules nakes: ' + error.message);
    }
    throw new Error('Unknown error fetching schedules nakes');
  }
};

export const getCountTodaySchedulesNakesService = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const count = await prisma.schedule.count({
      where: {
        medical_id: userId,
        schedule_date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return count;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Error counting today's schedules for nakes: " + error.message,
      );
    }
    throw new Error("Unknown error counting today's schedules for nakes");
  }
};

export const createScheduleService = async (data: ScheduleType) => {
  try {
    const result = await prisma.schedule.create({
      data,
      include: {
        patient: true,
      },
    });

    if (result.patient?.phone_number) {
      const patientName = result.patient.name;
      const scheduleDate = format(
        new Date(result.schedule_date),
        'EEEE, dd MMMM yyyy HH:mm',
        { locale: idLocale },
      );
      const title = result.title;
      const notes = result.notes ?? 'Tidak ada catatan tambahan.';

      const message = `
Halo, ${patientName},

Kami ingin memberitahukan bahwa Anda memiliki jadwal terapi baru di Rumah Sakit Nasional Diponegoro (RSND) Universitas Diponegoro:

Judul Terapi: ${title}
Tanggal & Waktu: ${scheduleDate}
Lokasi: RSND, Jl. Prof. Moeljono S. Trastotenojo, Tembalang, Semarang 50275
Catatan Tambahan: ${notes}

Mohon pastikan untuk hadir tepat waktu dan membawa dokumen atau persiapan yang diperlukan.

_Pesan ini dibuat otomatis oleh sistem DipoAssist. Mohon jangan membalas pesan ini._

Terima kasih atas perhatian Anda.

Salam sehat,
Tim DipoAssist
      `;

      console.log('Sending WA to:', result.patient.phone_number);

      await sendWhatsapp(result.patient.phone_number, message);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating schedule: ' + error.message);
    }
    throw new Error('Unknown error creating schedule');
  }
};

export const updateScheduleService = async (
  scheduleId: string,
  data: ScheduleType,
) => {
  try {
    const result = await prisma.schedule.update({
      where: {
        id: scheduleId,
      },
      data,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating schedule: ' + error.message);
    }
    throw new Error('Unknown error updating schedule');
  }
};

export const deleteScheduleService = async (scheduleId: string) => {
  try {
    const result = await prisma.schedule.delete({
      where: {
        id: scheduleId,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting schedule: ' + error.message);
    }
    throw new Error('Unknown error deleting schedule');
  }
};
