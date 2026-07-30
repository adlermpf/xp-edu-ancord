import { appConfig } from "./config/appConfig";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "./components/Modal";
import { Toast } from "./components/Toast";

type Step = "notice" | "record_result";

type RecordForm = {
  recordNumber: string; // somente números (sem "AI-")
};

type NoticeProps = {
  candidateName: string;
  onOpenLookup: () => void;
  onOpenResult: () => void;
};

const RECORD_PREFIX = "AI-";
const VALID_RECORD_NUMBER = "3001665";

const RECORD_FULL = `${RECORD_PREFIX}${VALID_RECORD_NUMBER}`;

// Dados fixos (como você pediu)
const RECORD_DATA = {
  certification: `Certificação Ancord: ${RECORD_FULL} — Registro definitivo`,
  status: `Homologado`,
  deadline: `30/07/2026`,
  queryDate: "19/06/2026",
  expirationDate: "31/07/2026",
  advisorName: "Adler Moreira Pires Ferreira",
  cpf: "396.532.928-62",
  motherName: "Aurismar Belém Moreira",
  birthCity: "Bodocó - PE",
  address:
    "Rua Édson Nores Lui 147 Q23L11, Gaivota 2, São José do Rio Preto - SP, CEP: 15063-065",
  requestingManager:
    "WIT INVEST ASSESSORIA DE INVESTIMENTO LTDA. CNPJ: 10.411.461/0001-00.",
  underResponsibility:
    "Sob responsabilidade de Grupo XP Investimentos Corretora de Câmbio, Títulos e Valores Mobiliários S/A. CNPJ: 02.332.886/0001-04.",
};

type ModuleResult = {
  id: number;
  name: string;
  questions: number;
  correct: number;
  min?: number;
};

const EXAM_RESULTS: ModuleResult[] = [
  { id: 1, name: "Atividade do Assessor", questions: 12, correct: 10, min: 6 },
  { id: 2, name: "Ética e Comportamento", questions: 2, correct: 2 },
  { id: 3, name: "Lavagem de Dinheiro", questions: 4, correct: 4, min: 2 },
  { id: 4, name: "Fundamentos de Economia", questions: 2, correct: 1 },
  { id: 5, name: "Sistema Financeiro Nacional", questions: 3, correct: 3 },
  { id: 6, name: "Instituições Financeiras", questions: 3, correct: 2 },
  { id: 7, name: "Administração de Risco", questions: 4, correct: 3 },
  { id: 8, name: "Mercado de Capitais", questions: 20, correct: 18, min: 10 },
  { id: 9, name: "Fundos de Investimento", questions: 12, correct: 11 },
  { id: 10, name: "Outros Fundos (FII, FIP...)", questions: 2, correct: 2 },
  { id: 11, name: "Securitização de Recebíveis", questions: 1, correct: 1 },
  { id: 12, name: "Clubes de Investimento", questions: 2, correct: 2 },
  { id: 13, name: "Matemática Financeira", questions: 4, correct: 3 },
  { id: 14, name: "Mercado de Renda Fixa", questions: 7, correct: 6 },
  { id: 15, name: "Mercado de Derivativos", questions: 2, correct: 1 },
];

export default function App() {
  const [step, setStep] = useState<Step>("notice");

  // modal de consulta
  const [lookupOpen, setLookupOpen] = useState(false);
  const [recordForm, setRecordForm] = useState<RecordForm>({
    recordNumber: "",
  });
  const [resultOpen, setResultOpen] = useState(false);

  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "info" | "success" | "warning" | "danger"
  >("info");

  // Seu props.candidateName original está vindo do NoticeCard;
  // aqui deixo um candidato “default” para não quebrar.
  const candidateName = useMemo(() => appConfig.candidateName, []);

  useEffect(() => {
    // garante que a próxima tela comece no topo (especialmente no mobile)
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" as ScrollBehavior });
  }, [step]);

  function showToast(message: string, variant: typeof toastVariant = "info") {
    setToastMsg(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  function openLookup() {
    setRecordForm({ recordNumber: "" });
    setLookupOpen(true);
  }

  function sanitizeNumericOnly(value: string) {
    return value.replace(/\D/g, "");
  }

  function handleLookupSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleaned = sanitizeNumericOnly(recordForm.recordNumber);

    if (cleaned !== VALID_RECORD_NUMBER) {
      showToast(
        "Registro inválido. Verifique o número e tente novamente.",
        "danger",
      );
      return;
    }

    setLookupOpen(false);
    setStep("record_result");
    showToast("Registro validado com sucesso.", "success");
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-4xl px-4 py-7">
        <header className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg text-muted">
                <img src={appConfig.xpLogoUrl} alt="Grupo XP Investimentos" />
              </p>
              <p className="mt-2 font-semibold text-text">
                Certificação Ancord
              </p>
            </div>
          </div>
        </header>

        <main className="rounded-2xl border border-border bg-card shadow-soft">
          {step === "notice" ? (
            <NoticeCard
              candidateName={candidateName}
              onOpenLookup={openLookup}
              onOpenResult={() => setResultOpen(true)}
            />
          ) : null}

          {step === "record_result" ? (
            <RecordResultCard
              candidateName={candidateName}
              onBack={() => setStep("notice")}
            />
          ) : null}
        </main>

        <footer className="mt-8 text-xs text-muted text-center">
          <p>Grupo XP Investimentos © Todos os direitos reservados.</p>
        </footer>
      </div>

      {/* MODAL EMBED ANCORD */}
      <Modal
        open={lookupOpen}
        title="ANCORD — Consulta de Autenticidade"
        onClose={() => setLookupOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="rounded-xl border border-border px-4 py-2 text-sm text-text hover:bg-white/5"
              onClick={() => setLookupOpen(false)}
            >
              Cancelar
            </button>
            <button
              form="record-lookup-form"
              type="submit"
              className="rounded-xl border border-border px-4 py-2 text-sm text-text hover:bg-white/5"
            >
              Consultar
            </button>
          </>
        }
      >
        {/* Estilização para “parecer embed” */}
        <div className="rounded-2xl border border-border bg-appbg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-muted">Sistema de Consulta</p>
              <p className="text-sm font-semibold text-text">
                Autenticidade de Registro
              </p>
            </div>
            <div className="text-sm text-muted">ancord.org.br</div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted">Informe o número do registro.</p>

            <form
              id="record-lookup-form"
              onSubmit={handleLookupSubmit}
              className="mt-3 space-y-3"
            >
              <div className="flex items-stretch gap-2">
                <div className="flex items-center rounded-xl border border-border bg-black/20 px-3 text-sm text-muted">
                  {RECORD_PREFIX}
                </div>

                <input
                  className="w-full rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-text outline-none focus:border-xpgreen/60"
                  inputMode="numeric"
                  placeholder="Informe o número do registro"
                  value={recordForm.recordNumber}
                  onChange={(e) =>
                    setRecordForm({
                      recordNumber: sanitizeNumericOnly(e.target.value),
                    })
                  }
                  maxLength={12}
                  aria-label="Número do registro (somente dígitos)"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal open={resultOpen} onClose={() => setResultOpen(false)}>
        <ExamResult onBack={() => setResultOpen(false)} />
      </Modal>

      <Toast
        open={toastOpen}
        message={toastMsg}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}

function NoticeCard({
  candidateName,
  onOpenLookup,
  onOpenResult,
}: NoticeProps) {
  return (
    <section>
      <div className="flex flex-col p-4">
        <div className="bg-appbg text-justify">
          <h1 className="text-lg font-semibold">Prezado {candidateName},</h1>
          <p className="text-md text-muted text-justify"></p>

          <p className="mt-3 text-sm text-muted leading-relaxed">
            O Grupo XP, em parceria com a ANCORD, informa a conclusão do
            processo de homologação junto a CVM e emissão do registro definitivo
            de <strong>Assessor de Investimentos</strong>.
          </p>

          <p className="mt-1 text-xs">
           Para consultar a autenticidade, clique no botão abaixo e informe o
            número do registro.
          </p>

          <p className="mt-3 text-sm text-muted leading-relaxed">
            <span className="text-sm text-muted">
              Nós próximos dias, um escritório parceiro da XP Investimetos de
              São José do Rio Preto, SP, entrará em contato para fornecer os
              detalhes sobre a vaga de{" "}
              <strong> Assessor de Investimentos Júnior</strong>, bem como os
              próximos passos do processo de admissão.
            </span>
          </p>

          <p className="mt-3 text-sm text-muted leading-relaxed">
            Em breve, esperamos contar com você em nosso time de profissionais de
            investimentos, contribuindo para o crescimento do Grupo XP e para o
            sucesso de nossos investidores.
          </p>

          <div className="mt-4 rounded-xl border border-xpgreen/25 bg-gray-900/20 p-3 space-y-2">
            <p className="text-md text-text font-semibold">
              Registro definitivo
            </p>

            <p className="text-sm">
              <span className="font-semibold">ANCORD:</span>{" "}
              <span className="font-semibold">AI-3001665</span>
              {" — "}
              {candidateName}
            </p>

            <div className="mt-1 p-2">
              <p className="text-xs text-text font-bold">Atenção:</p>

              <p className="mt-1 text-xs text-muted">
                O profissional detém a{" "}
                <span className="font-semibold text-text">
                  certificação e credenciamento válidos para o exercício da
                  atividade de assessor de investimentos
                </span>
                , comprometendo-se a atuar em conformidade com a{" "}
                <span className="font-semibold text-text">
                  Resolução CVM nº 178
                </span>
                , com as demais normas aplicáveis e sob a responsabilidade da
                instituição integrante do sistema de distribuição de valores
                mobiliários à qual estiver vinculado. O fornecimento de
                informações falsas, inexatas ou desatualizadas poderá resultar
                na adoção das medidas administrativas, civis e penais cabíveis.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-row gap-3 sm:flex-row sm:items-center justify-between">
          <button
            type="button"
            onClick={onOpenLookup}
            className="mb-2 rounded-xl border border-border px-4 py-2 text-lg text-text text-nowrap bg-green-900 hover:bg-green-800 transition"
          >
            Detalhes do registro
          </button>
          <button
            type="button"
            onClick={onOpenResult}
            className="
            mb-2
    sm:w-auto
    rounded-xl
    border border-border
    px-4 py-2
    text-lg
    text-text
    bg-blue-900 hover:bg-blue-800
    transition
    text-nowrap
  "
          >
            Desempenho
          </button>
        </div>
      </div>
    </section>
  );
}

function RecordResultCard(props: {
  candidateName: string;
  onBack: () => void;
}) {
  return (
    <section>
      <div className=" bg-appbg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text">
              Consulta:{" "}
              <span className="text-text font-semibold">{RECORD_FULL}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={props.onBack}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text hover:bg-white/5"
          >
            Voltar
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-black/20 p-4">
            <p className="text-sm text-text font-semibold text-pretty">
              {RECORD_DATA.certification}
            </p>
            <p className="mt-1 text-xs text-muted">
              <span className="text-text font-semibold">
                Data da requisição: {RECORD_DATA.queryDate}
              </span>
            </p>
            <p className="text-xs text-muted">
              Status:{" "}
              <span className="text-text font-semibold text-green-500">
                {RECORD_DATA.status}
              </span>
            </p>
            <p className="text-xs text-muted">
              Homologado em:{" "}
              <span className="text-text font-semibold">
                {RECORD_DATA.deadline}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info
              label="Título: Assessor de investimentos"
              value={RECORD_DATA.advisorName}
            />
            <Info label="CPF:" value={RECORD_DATA.cpf} />
            <Info label="Nome da mãe:" value={RECORD_DATA.motherName} />
            <Info label="Cidade natal:" value={RECORD_DATA.birthCity} />
          </div>

          <Info label="Logradouro:" value={RECORD_DATA.address} />

          <div className="rounded-xl border border-border bg-black/20 p-4">
            <p className="text-xs text-muted">Gestor solicitante:</p>
            <p className="mt-1 text-sm text-text">
              {RECORD_DATA.requestingManager}
            </p>
            <p className="mt-1 text-sm text-text">
              {RECORD_DATA.underResponsibility}
            </p>
          </div>

          <div className="rounded-xl border border-xpred/30 bg-black/20 p-4">
            <p className="text-sm text-text font-semibold">Aviso:</p>
            <p className="mt-1 text-xs text-muted">
              O profissional detém{" "}
              <span className="font-semibold text-text">
                certificação e credenciamento válidos para o exercício da
                atividade de assessor de investimentos
              </span>
              , comprometendo-se a atuar em conformidade com a{" "}
              <span className="font-semibold text-text">
                Resolução CVM nº 178
              </span>
              , com as demais normas aplicáveis e sob a responsabilidade da
              instituição integrante do sistema de distribuição de valores
              mobiliários à qual estiver vinculado. O fornecimento de
              informações falsas, inexatas ou desatualizadas poderá resultar na
              adoção das medidas administrativas, civis e penais cabíveis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-black/20 p-4">
      <p className="text-xs text-muted">{props.label}</p>
      <p className="mt-1 text-sm text-text">{props.value}</p>
    </div>
  );
}

function ExamResult(props: { onBack: () => void }) {
  const totalQuestions = EXAM_RESULTS.reduce((acc, m) => acc + m.questions, 0);
  const totalCorrect = EXAM_RESULTS.reduce((acc, m) => acc + m.correct, 0);
  const overallPercent = ((totalCorrect / totalQuestions) * 100).toFixed(2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-text">
          Resultado da Avaliação
          <p className="text-sm">Certificação Ancord</p>
        </p>

        <button
          type="button"
          onClick={props.onBack}
          className="rounded-xl border border-border px-3 py-3 text-md text-text hover:bg-white/5"
        >
          Voltar
        </button>
      </div>
      <div className="overflow-auto max-h-[60vh] border border-border rounded-xl">
        <p className=" p-2 text-md font-semibold text-center text-text">
          Desempenho: {totalCorrect}/{totalQuestions} acertos ({overallPercent}
          %)
        </p>
      </div>

      {/* MOBILE VERSION */}
      <div className="mt-3 space-y-4 max-h-[65vh] overflow-auto overscroll-contain">
        {EXAM_RESULTS.map((m) => {
          const percent = ((m.correct / m.questions) * 100).toFixed(1);
          const approved = m.min !== undefined ? m.correct >= m.min : true;

          return (
            <div key={m.id} className="rounded-xl border border-border p-2 ">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-text">
                  {m.id}. {m.name}
                </p>

                <span
                  className={`text-xs font-semibold ${
                    approved ? "text-xpgreen" : "text-xpred"
                  }`}
                >
                  {approved ? "Aprovado" : "Reprovado"}
                </span>
              </div>

              <div className="grid grid-cols-2 text-sm text-muted">
                <div>
                  <p>Questões</p>
                  <p className="text-text font-semibold">{m.questions}</p>
                </div>

                <div>
                  <p>Acertos</p>
                  <p className="text-text font-semibold">
                    {m.correct}
                    {m.min ? ` (Mín. ${m.min})` : ""}
                  </p>
                </div>

                <div>
                  <p>Percentual</p>
                  <p className="text-text font-semibold">{percent}%</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="mt-3">
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      approved ? "bg-green-700" : "bg-xpred"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
