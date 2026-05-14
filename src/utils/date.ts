import dayjs from "dayjs";

export function parseLocalDateTime(isoLocal: string): Date {
  // isoLocal: "YYYY-MM-DDTHH:mm:ss" interpretado como horário local da máquina.
  // Como você está em America/Sao_Paulo, isso atende o requisito prático de "sensível a data/hora".
  const d = dayjs(isoLocal);
  return d.toDate();
}

export function parseISODate(isoDate: string): Date {
  // isoDate: "YYYY-MM-DD"
  return dayjs(isoDate).startOf("day").toDate();
}

export function formatPtBR(date: Date): string {
  // Formatação amigável pt-BR (sem depender de libs extras)
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatShortPtBR(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
