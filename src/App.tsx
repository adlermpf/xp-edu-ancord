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
  certification: `Certificação Ancord: ${RECORD_FULL} registro temporário – avaliação psicológica pendente`,
  issueDate: "02/03/2026",
  expirationDate: "31/07/2026",
  advisorName: "Adler Moreira Pires Ferreira",
  cpf: "396.532.928-62",
  motherName: "Aurismar Belém Moreira",
  birthCity: "Bodocó - PE",
  address:
    "Rua Édson Nores Lui 147 Q23L11, Gaivota 2, São José do Rio Preto - SP, CEP: 15063-065",
  requestingManager:
    "WIT INVEST ASSESSOR DE INVESTIMENTO LTDA. CNPJ: 10.411.461/0001-00.",
  underResponsibility:
    "Sob responsabilidade de XP Investimentos Corretora de Câmbio, Títulos e Valores Mobiliários S/A. CNPJ: 02.332.886/0001-04.",
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
                <img src={appConfig.xpLogoUrl} alt="XP Educação" />
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
          <p>XP Educação © Todos os direitos reservados.</p>
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
      <div className="flex flex-col p-6">
        <div className="bg-appbg text-justify">
          <h1 className="text-lg font-semibold">Prezado {candidateName},</h1>
          <p className="text-md text-muted text-justify">
            gostariamos de parabeniza-lo pelo desempenho e dedicação durante o
            programa de formação para a certificação Ancord.
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenResult}
              className="
    w-full sm:w-auto
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
              Confira seu desempenho
            </button>
          </div>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Você concluiu com êxito as etapas do programa e está muito perto de
            obter o{" "}
            <span className="text-text font-semibold">
              Certificado de Assessor(a) de Investimento (Ancord)
            </span>
            . Falta apenas mais um processo obrigatório:{" "}
            <span className="text-text font-semibold">
              a avaliação psicológica
            </span>
            .
          </p>

          <div className="mt-3 space-y-3 text-sm text-muted leading-relaxed">
            <p>
              A avaliação será realizada{" "}
              <span className="text-text font-semibold">online</span> no dia{" "}
              <span className="text-text font-semibold">25/05/2026</span>. O
              teste possui duração aproximada de{" "}
              <span className="text-text font-semibold">2 horas</span> e será
              aplicado por um{" "}
              <span className="text-text font-semibold">
                psicólogo credenciado
              </span>
              , por meio da plataforma{" "}
              <span className="text-text font-semibold">SATEPSI</span> do
              Conselho Federal de Psicologia (CFP).
            </p>

            <p>
              No dia do exame, o psicólogo responsável entrará em contato para
              esclarecimentos e orientações por meio do{" "}
              <span className="text-text font-semibold">
                telefone cadastrado
              </span>
              .
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-xpgreen/25 bg-gray-900/20 p-3 space-y-2">
            <p className="text-md text-text font-semibold">
              Registro temporário
            </p>

            <p className="text-sm">
              <span className="font-semibold">ANCORD:</span>{" "}
              <span className="font-semibold">AI-3001665</span>{" "}
              <p className="text-muted">{candidateName}</p>
            </p>

            <p className="text-sm text-text">
              Este registro deverá ser{" "}
              <span className="font-semibold">
                informado ao psicólogo responsável
              </span>{" "}
              quando solicitado.
            </p>

            <div className="mt-3 rounded-xl border  bg-black/20 p-3">
              <p className=" text-sm text-text font-semibold">Atenção:</p>
              <p className="mt-2 text-sm text-muted">
                O registro em questão{" "}
                <span className="text-text font-semibold">
                  não possui validade junto à CVM
                </span>{" "}
                até a aprovação na avaliação psicológica. Portanto, está{" "}
                <span className="text-text font-semibold">vedada</span> sua
                utilização para o exercício de assessor(a) de investimentos,
                conforme as resoluções{" "}
                <span className="text-text font-semibold">CVM 178</span> e{" "}
                <span className="text-text font-semibold">CVM 179 </span>
                (marco dos assessores), em conjunto com a{" "}
                <span className="text-text font-semibold">
                  Instrução CVM 610
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onOpenLookup}
            className=" mb-2 rounded-xl border border-border px-4 py-2 text-md text-text bg-green-900 hover:bg-green-800 transition"
          >
            Consulte os detalhes do registro
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
            <h2 className="text-xl font-semibold text-text">Resultado</h2>
            <p className="mt-2 text-sm text-muted">
              Consulta:{" "}
              <span className="text-text font-semibold">{RECORD_FULL}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={props.onBack}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text hover:bg-white/5"
          >
            Voltar
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-black/20 p-4">
            <p className="text-sm text-text font-semibold text-pretty">
              {RECORD_DATA.certification}
            </p>
            <div className="">
              <p className="mt-1 text-xs text-muted">
                Data da emissão: {RECORD_DATA.issueDate}
              </p>
              <p className="text-xs text-muted">
                Validade: {RECORD_DATA.expirationDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info
              label="Assessor — via registro temporário"
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
            <p className="mt-2 text-sm text-muted leading-relaxed text-justify">
              Este registro é temporário e não autoriza o exercício de
              assessor(a) de investimentos até a aprovação na avaliação
              psicológica, conforme CVM 178 e 179, em conjunto com a Instrução
              CVM 610.
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
