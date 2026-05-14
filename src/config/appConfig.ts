export type AppConfig = {
  candidateName: string;

  xpLogoUrl: string;

  // liberação do botão de agendamento (horário local do Brasil/São Paulo)
  scheduleUnlockLocalISO: string; // ex: "2026-02-01T09:00:00"

  // credenciais de teste (estáticas)
  staticLoginEmail: string;
  staticLoginPassword: string;

  // primeira data permitida para seleção (dd/mm/aaaa)
  minExamDateISO: string; // "2026-02-09"

  // datas desabilitadas (dd/mm/aaaa)
  disableDate1SO: string;
  disableDate2ISO: string;
  disableDate3ISO: string;
  disableDate4ISO: string;
  disableDate5ISO: string;
  disabaleDate6ISO: string;
  disableDate7ISO: string;
  disableDate8ISO: string;
  disableDate9ISO: string;
  disableDate10ISO: string;
  disableDate11ISO: string;
  disableDate12ISO: string;
  disableDate13ISO: string;
  disableDate14ISO: string;
  disableDate15ISO: string;
  disableDate16ISO: string;
  disableDate17ISO: string;
  disableDate18ISO: string;
  disableDate19ISO: string;
  disableDate20ISO: string;
  disableDate21ISO: string;
  disableDate22ISO: string;

  // local fixo (São José do Rio Preto)
  examCenterName: string;
  examCenterAddress: string;

  // texto do programa (para eventuais ajustes)
  programName: string;
  organizationName: string;
};

export const appConfig: AppConfig = {
  candidateName: "Adler Moreira Pires Ferreira",

  xpLogoUrl: "/logo-xp-investimentos-256.png",

  // Ajuste aqui quando quiser (data/hora local de São Paulo)
  scheduleUnlockLocalISO: "2026-02-04T10:00:00",

  staticLoginEmail: "adlermpf@me.com",
  staticLoginPassword: "1234Adler!",

  minExamDateISO: "2026-02-23",

  disableDate1SO: "2026-02-25",
  disableDate2ISO: "2026-03-07",
  disableDate3ISO: "2026-03-08",
  disableDate4ISO: "2026-02-27",
  disableDate5ISO: "2026-03-14",
  disabaleDate6ISO: "2026-03-21",
  disableDate7ISO: "2026-03-15",
  disableDate8ISO: "2026-03-26",
  disableDate9ISO: "2026-03-16",
  disableDate10ISO: "2026-03-29",
  disableDate11ISO: "2026-03-22",
  disableDate12ISO: "2026-03-13",
  disableDate13ISO: "2026-03-06",

  examCenterName: "Polo FGV - Rio Preto",
  examCenterAddress: "Av. da Saudade, 3700 - Vila Santa Cruz, São José do Rio Preto - SP",

  programName: "bolsistas",
  organizationName: "Grupo XP",
  disableDate14ISO: "2026-02-28",
  disableDate15ISO: "",
  disableDate16ISO: "",
  disableDate17ISO: "",
  disableDate18ISO: "",
  disableDate19ISO: "",
  disableDate20ISO: "",
  disableDate21ISO: "",
  disableDate22ISO: ""
};
