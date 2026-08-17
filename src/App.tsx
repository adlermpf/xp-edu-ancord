import { appConfig } from "./config/appConfig";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "./components/Modal";
import { Toast } from "./components/Toast";

type Step = "notice" | "record_result";
type CentralGroup = "notifications" | "messages";
type CentralMobilePane = "list" | "detail";

type RecordForm = {
  recordNumber: string; // somente números (sem "AI-")
};

type LoginForm = {
  email: string;
  password: string;
};

type NoticeProps = {
  candidateName: string;
  onOpenLookup: () => void;
  onOpenResult: () => void;
};

type PortfolioNotification = {
  id: string;
  from: string;
  subject: string;
  date: string;
  preview: string;
  body: string[];
  read: boolean;
};

type ChatAttachment = {
  id: string;
  name: string;
  type: "pdf" | "image";
};

type ChatMessage = {
  id: string;
  author: "user" | "contact";
  sender: string;
  sentAt: string;
  text: string;
  attachments?: ChatAttachment[];
};

type PortfolioChat = {
  id: string;
  contact: string;
  role: string;
  subject: string;
  date: string;
  read: boolean;
  messages: ChatMessage[];
};

const RECORD_PREFIX = "AI-";
const VALID_RECORD_NUMBER = "3001665";

const RECORD_FULL = `${RECORD_PREFIX}${VALID_RECORD_NUMBER}`;
const LOGIN_EMAIL = "adlerferreira@xp.com.br";
const LOGIN_PASSWORD = "@dleR3107";
const NOTIFICATION_READ_STORAGE_KEY = "xp-edu-ancord:notification-read-ids";
const CHAT_READ_STORAGE_KEY = "xp-edu-ancord:chat-read-ids";
const CHAT_SENT_STORAGE_KEY = "xp-edu-ancord:chat-sent-messages";

const INITIAL_NOTIFICATIONS: Omit<PortfolioNotification, "read">[] = [
  {
    id: "xp-rh-invite-sjrp",
    from: "Débora Cristina Fischer | Hub de Relações Humanas, Grupo XP",
    subject:
      "Convite para contratação: Assessor de Investimentos em São José do Rio Preto",
    date: "17/08/2026",
    preview:
      "Convite formal para conhecer os AAIs parceiros do Grupo XP em São José do Rio Preto - SP.",
    body: [
      "Prezado Adler Moreira Pires Ferreira,",
      "É com satisfação que convidamos você a integrar o maior grupo de investimentos da América Latina e a participar da etapa de relacionamento com os agentes autônomos de investimento (AAIs) parceiros do Grupo XP em São José do Rio Preto - SP, a partir de 18 de setembro de 2026.",
      "Como São José do Rio Preto - SP conta com mais de um AAI parceiro, cada escritório entrará em contato por esta central de notificações para agendar a visita obrigatória. Nessa etapa, você conhecerá as instalações, o modelo de atendimento, a abordagem comercial, a equipe local e participará de uma breve entrevista com o RH.",
      "Ao final das visitas, você poderá indicar quais AAIs estão mais alinhados ao seu perfil pessoal e profissional. A efetivação da contratação seguirá conforme interesse mútuo, validação documental e critérios internos do Grupo XP.",
      "Nos próximos dias, a lâmina institucional e o Guia dos Assessores do Grupo XP serão disponibilizados nesta mesma central, com informações sobre vínculo contratual aplicável, política comercial, comissionamento, metas, governança, normas de conduta, obrigações regulatórias, política de suitability, prevenção à lavagem de dinheiro, confidencialidade, proteção de dados, pagamentos, treinamentos obrigatórios e canais de suporte operacional.",
      "Atenciosamente,\nDébora Cristina Fischer\nChefe do Departamento de Relações Humanas\nGrupo XP",
    ],
  },
  {
    id: "admission-documents",
    from: "Central de Admissão | Grupo XP",
    subject: "Checklist documental para etapa de admissão",
    date: "17/08/2026",
    preview:
      "Relação de documentos necessários para continuidade do processo de contratação.",
    body: [
      "Prezado Adler,",
      "Para dar continuidade ao processo de admissão, solicitamos a organização dos documentos pessoais, comprovante de endereço, comprovantes de certificação e dados bancários para validação interna.",
      "A conferência documental será realizada antes da etapa de escolha do escritório parceiro. Caso algum item precise de ajuste, a equipe de admissão enviará uma nova mensagem por esta central.",
      "Atenciosamente,\nCentral de Admissão\nGrupo XP",
    ],
  },
  {
    id: "advisor-guide",
    from: "Academia XP | Desenvolvimento de Assessores",
    subject: "Guia de preparação para visitas aos escritórios parceiros",
    date: "17/08/2026",
    preview:
      "Orientações para entrevistas, visitas obrigatórias e apresentação profissional aos AAIs.",
    body: [
      "Prezado Adler,",
      "Em breve disponibilizaremos nesta central um guia inicial para apoiar sua preparação para as visitas aos escritórios parceiros. O material resume temas esperados nas conversas, boas práticas de apresentação profissional e pontos importantes sobre a rotina de atendimento ao investidor.",
      "Recomendamos revisar sua experiência comercial, conhecimentos sobre suitability, produtos de investimento, ética profissional e relacionamento de longo prazo com clientes.",
      "Atenciosamente,\nAcademia XP\nGrupo XP",
    ],
  },
];

const INITIAL_CHATS: Omit<PortfolioChat, "read">[] = [
  // {
  //   id: "wit-invest-visit",
  //   contact: "Mariana Lopes | WIT Invest",
  //   role: "AAI parceiro - São José do Rio Preto",
  //   subject: "Agendamento de visita ao escritório",
  //   date: "17/08/2026",
  //   messages: [
  //     {
  //       id: "wit-1",
  //       author: "contact",
  //       sender: "Mariana Lopes",
  //       sentAt: "17/08/2026 09:42",
  //       text: "Olá, Adler. Recebemos sua indicação pelo Grupo XP para a etapa de visitas obrigatórias aos escritórios parceiros de São José do Rio Preto.",
  //     },
  //     {
  //       id: "wit-2",
  //       author: "contact",
  //       sender: "Mariana Lopes",
  //       sentAt: "17/08/2026 09:44",
  //       text: "Encaminho a lâmina institucional inicial para você conhecer nossa estrutura, áreas de atendimento e modelo de trabalho antes do agendamento.",
  //       attachments: [
  //         {
  //           id: "wit-lamina",
  //           name: "Lâmina institucional - WIT Invest.pdf",
  //           type: "pdf",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "guide-xp-assessores",
  //   contact: "Academia XP",
  //   role: "Desenvolvimento de Assessores",
  //   subject: "Guia dos assessores disponível",
  //   date: "17/08/2026",
  //   messages: [
  //     {
  //       id: "guide-1",
  //       author: "contact",
  //       sender: "Academia XP",
  //       sentAt: "17/08/2026 11:10",
  //       text: "Adler, o Guia dos Assessores do Grupo XP já está disponível nesta conversa para consulta durante sua preparação.",
  //       attachments: [
  //         {
  //           id: "guide-pdf",
  //           name: "Guia dos Assessores Grupo XP.pdf",
  //           type: "pdf",
  //         },
  //         {
  //           id: "guide-cover",
  //           name: "Resumo visual do processo.png",
  //           type: "image",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

// Dados fixos (como você pediu)
const RECORD_DATA = {
  certification: `Certificação Ancord: ${RECORD_FULL}`,
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
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [centralOpen, setCentralOpen] = useState(false);
  const [centralGroup, setCentralGroup] =
    useState<CentralGroup>("notifications");
  const [centralMobilePane, setCentralMobilePane] =
    useState<CentralMobilePane>("list");
  const [selectedNotificationId, setSelectedNotificationId] = useState(
    INITIAL_NOTIFICATIONS[0]?.id ?? "",
  );
  const [selectedChatId, setSelectedChatId] = useState(
    INITIAL_CHATS[0]?.id ?? "",
  );
  const [chatDraft, setChatDraft] = useState("");
  const [notifications, setNotifications] = useState<PortfolioNotification[]>(
    () => {
      let readIds: string[] = [];

      if (typeof window !== "undefined") {
        try {
          const saved = window.localStorage.getItem(
            NOTIFICATION_READ_STORAGE_KEY,
          );
          readIds = saved ? JSON.parse(saved) : [];
        } catch {
          readIds = [];
        }
      }

      return INITIAL_NOTIFICATIONS.map((notification) => ({
        ...notification,
        read: readIds.includes(notification.id),
      }));
    },
  );
  const [chats, setChats] = useState<PortfolioChat[]>(() => {
    let readIds: string[] = [];
    let sentMessagesByChat: Record<string, ChatMessage[]> = {};

    if (typeof window !== "undefined") {
      try {
        const savedReadIds = window.localStorage.getItem(CHAT_READ_STORAGE_KEY);
        readIds = savedReadIds ? JSON.parse(savedReadIds) : [];
      } catch {
        readIds = [];
      }

      try {
        const savedMessages = window.localStorage.getItem(
          CHAT_SENT_STORAGE_KEY,
        );
        sentMessagesByChat = savedMessages ? JSON.parse(savedMessages) : {};
      } catch {
        sentMessagesByChat = {};
      }
    }

    return INITIAL_CHATS.map((chat) => ({
      ...chat,
      read: readIds.includes(chat.id),
      messages: [...chat.messages, ...(sentMessagesByChat[chat.id] ?? [])],
    }));
  });

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
  const selectedNotification = useMemo(
    () =>
      notifications.find(
        (notification) => notification.id === selectedNotificationId,
      ) ?? notifications[0],
    [notifications, selectedNotificationId],
  );
  const selectedNotificationIndex = useMemo(
    () =>
      notifications.findIndex(
        (notification) => notification.id === selectedNotification?.id,
      ),
    [notifications, selectedNotification?.id],
  );
  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? chats[0],
    [chats, selectedChatId],
  );
  const selectedChatIndex = useMemo(
    () => chats.findIndex((chat) => chat.id === selectedChat?.id),
    [chats, selectedChat?.id],
  );
  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const unreadChatCount = chats.filter((chat) => !chat.read).length;
  const totalUnreadCount = unreadNotificationCount + unreadChatCount;

  useEffect(() => {
    // garante que a próxima tela comece no topo (especialmente no mobile)
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" as ScrollBehavior });
  }, [step]);

  useEffect(() => {
    const readIds = notifications
      .filter((notification) => notification.read)
      .map((notification) => notification.id);
    window.localStorage.setItem(
      NOTIFICATION_READ_STORAGE_KEY,
      JSON.stringify(readIds),
    );
  }, [notifications]);

  useEffect(() => {
    const readIds = chats.filter((chat) => chat.read).map((chat) => chat.id);
    const sentMessagesByChat = chats.reduce<Record<string, ChatMessage[]>>(
      (acc, chat) => {
        const initialMessageIds = new Set(
          INITIAL_CHATS.find(
            (initialChat) => initialChat.id === chat.id,
          )?.messages.map((message) => message.id) ?? [],
        );
        const sentMessages = chat.messages.filter(
          (message) => !initialMessageIds.has(message.id),
        );

        if (sentMessages.length > 0) {
          acc[chat.id] = sentMessages;
        }

        return acc;
      },
      {},
    );

    window.localStorage.setItem(CHAT_READ_STORAGE_KEY, JSON.stringify(readIds));
    window.localStorage.setItem(
      CHAT_SENT_STORAGE_KEY,
      JSON.stringify(sentMessagesByChat),
    );
  }, [chats]);

  useEffect(() => {
    if (!centralOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCentralOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [centralOpen]);

  useEffect(() => {
    const shouldLockScroll =
      !authenticated || centralOpen || lookupOpen || resultOpen;

    if (!shouldLockScroll) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [authenticated, centralOpen, lookupOpen, resultOpen]);

  function showToast(message: string, variant: typeof toastVariant = "info") {
    setToastMsg(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validCredentials =
      loginForm.email.trim().toLowerCase() === LOGIN_EMAIL &&
      loginForm.password === LOGIN_PASSWORD;

    if (!validCredentials) {
      setLoginError("E-mail ou senha inválidos.");
      return;
    }

    setLoginError("");
    setAuthenticated(true);
  }

  function openLookup() {
    setRecordForm({ recordNumber: "" });
    setLookupOpen(true);
  }

  function markNotificationAsRead(notificationId: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }

  function markNotificationAsUnread(notificationId: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: false }
          : notification,
      ),
    );
  }

  function markChatAsRead(chatId: string) {
    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === chatId ? { ...chat, read: true } : chat,
      ),
    );
  }

  function markChatAsUnread(chatId: string) {
    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === chatId ? { ...chat, read: false } : chat,
      ),
    );
  }

  function openCentral() {
    const firstUnreadNotification = notifications.find(
      (notification) => !notification.read,
    );
    const firstUnreadChat = chats.find((chat) => !chat.read);

    if (!firstUnreadNotification && firstUnreadChat) {
      setCentralGroup("messages");
      setSelectedChatId(firstUnreadChat.id);
    } else {
      setCentralGroup("notifications");
      setSelectedNotificationId(
        firstUnreadNotification?.id ?? selectedNotification?.id ?? "",
      );
    }

    setCentralMobilePane("list");
    setCentralOpen(true);

    if (window.matchMedia("(min-width: 1024px)").matches) {
      if (firstUnreadNotification?.id) {
        markNotificationAsRead(firstUnreadNotification.id);
      } else if (firstUnreadChat?.id) {
        markChatAsRead(firstUnreadChat.id);
      }
    }
  }

  function selectCentralGroup(group: CentralGroup) {
    setCentralGroup(group);
    setCentralMobilePane("list");

    if (window.matchMedia("(min-width: 1024px)").matches) {
      if (group === "notifications" && selectedNotification?.id) {
        markNotificationAsRead(selectedNotification.id);
      }

      if (group === "messages" && selectedChat?.id) {
        markChatAsRead(selectedChat.id);
      }
    }
  }

  function selectNotification(notificationId: string) {
    setSelectedNotificationId(notificationId);
    setCentralMobilePane("detail");
    markNotificationAsRead(notificationId);
  }

  function selectChat(chatId: string) {
    setSelectedChatId(chatId);
    setCentralMobilePane("detail");
    markChatAsRead(chatId);
  }

  function showCentralList() {
    setCentralMobilePane("list");
  }

  function goToRelativeNotification(direction: -1 | 1) {
    const nextIndex = selectedNotificationIndex + direction;
    const nextNotification = notifications[nextIndex];

    if (!nextNotification) return;
    setSelectedNotificationId(nextNotification.id);
    markNotificationAsRead(nextNotification.id);
  }

  function goToRelativeChat(direction: -1 | 1) {
    const nextIndex = selectedChatIndex + direction;
    const nextChat = chats[nextIndex];

    if (!nextChat) return;
    setSelectedChatId(nextChat.id);
    markChatAsRead(nextChat.id);
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedDraft = chatDraft.trim();
    if (!selectedChat?.id || !trimmedDraft) return;

    const sentMessage: ChatMessage = {
      id: `sent-${Date.now()}`,
      author: "user",
      sender: candidateName,
      sentAt: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      text: trimmedDraft,
    };

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              read: true,
              messages: [...chat.messages, sentMessage],
            }
          : chat,
      ),
    );
    setChatDraft("");
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

  if (!authenticated) {
    return (
      <LoginOverlay
        error={loginError}
        form={loginForm}
        open
        onChange={setLoginForm}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-4xl px-4 py-7">
        <header className="mb-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-lg text-muted">
                <img src={appConfig.xpLogoUrl} alt="Grupo XP Investimentos" />
              </p>
              <p className="mt-2 font-semibold text-text">
                Central de Comunicação
              </p>
            </div>
            <CentralButton
              totalUnreadCount={totalUnreadCount}
              unreadNotificationCount={unreadNotificationCount}
              unreadChatCount={unreadChatCount}
              onClick={openCentral}
            />
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
              className="min-h-10 w-full rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-white/5 sm:w-auto"
              onClick={() => setLookupOpen(false)}
            >
              Cancelar
            </button>
            <button
              form="record-lookup-form"
              type="submit"
              className="min-h-10 w-full rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-white/5 sm:w-auto"
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

      <CommunicationsOverlay
        open={centralOpen}
        activeGroup={centralGroup}
        notifications={notifications}
        chats={chats}
        selectedNotification={selectedNotification}
        selectedChat={selectedChat}
        selectedIndex={selectedNotificationIndex}
        selectedChatIndex={selectedChatIndex}
        unreadNotificationCount={unreadNotificationCount}
        unreadChatCount={unreadChatCount}
        mobilePane={centralMobilePane}
        chatDraft={chatDraft}
        onClose={() => setCentralOpen(false)}
        onShowList={showCentralList}
        onSelectGroup={selectCentralGroup}
        onSelect={selectNotification}
        onSelectChat={selectChat}
        onPrevious={() => goToRelativeNotification(-1)}
        onNext={() => goToRelativeNotification(1)}
        onPreviousChat={() => goToRelativeChat(-1)}
        onNextChat={() => goToRelativeChat(1)}
        onMarkNotificationUnread={markNotificationAsUnread}
        onMarkChatUnread={markChatAsUnread}
        onChatDraftChange={setChatDraft}
        onChatSubmit={handleChatSubmit}
      />

      <Toast
        open={toastOpen}
        message={toastMsg}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}

function CentralButton(props: {
  totalUnreadCount: number;
  unreadNotificationCount: number;
  unreadChatCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex min-h-14 w-full min-w-0 items-center gap-3 rounded-xl border border-white/70 bg-[#101312] px-3 py-2 text-left text-text shadow-soft transition hover:border-xpgreen hover:bg-[#151917] focus:outline-none focus:ring-2 focus:ring-xpgreen/50 sm:w-auto sm:min-w-43"
      aria-label={`Abrir central. ${props.totalUnreadCount} itens não lidos.`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-card text-text">
        <InboxIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center justify-between gap-2">
          <span className="text-sm font-semibold">Central de Comunicação</span>
          <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-white/30  px-1 text-xs font-bold leading-none text-white shadow-[0_0_0_2px_rgba(0,0,0,.35)]">
            {props.totalUnreadCount}
          </span>
        </span>
        <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted">
          <span className="rounded-full border border-border px-2 py-0.5">
            Notificações {props.unreadNotificationCount}
          </span>
          <span className="rounded-full border border-border px-2 py-0.5">
            Mensagens {props.unreadChatCount}
          </span>
        </span>
      </span>
    </button>
  );
}

function LoginOverlay(props: {
  error: string;
  form: LoginForm;
  open: boolean;
  onChange: React.Dispatch<React.SetStateAction<LoginForm>>;
  onSubmit: (event: React.FormEvent) => void;
}) {
  if (!props.open) return null;

  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-appbg px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Tela de login"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-6">
          <img
            src={appConfig.xpLogoUrl}
            alt="Grupo XP Investimentos"
            className="max-h-12 w-auto"
          />
          <h1 className="mt-5 text-xl font-semibold text-text">
            Acesso ao sistema
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Informe suas credenciais para acessar a central de comunicação.
          </p>
        </div>

        <form className="space-y-4" onSubmit={props.onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text">
              E-mail
            </label>
            <input
              autoComplete="email"
              className="min-h-11 w-full rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-text outline-none focus:border-xpgreen/70"
              inputMode="email"
              type="email"
              value={props.form.email}
              onChange={(event) =>
                props.onChange((currentForm) => ({
                  ...currentForm,
                  email: event.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-text">
              Senha
            </label>
            <input
              autoComplete="current-password"
              className="min-h-11 w-full rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-text outline-none focus:border-xpgreen/70"
              type="password"
              value={props.form.password}
              onChange={(event) =>
                props.onChange((currentForm) => ({
                  ...currentForm,
                  password: event.target.value,
                }))
              }
              required
            />
          </div>

          {props.error ? (
            <p className="rounded-xl border border-xpred/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
              {props.error}
            </p>
          ) : null}

          <button
            type="submit"
            className="min-h-12 w-full rounded-xl border border-xpgreen/50 bg-green-900 px-4 py-3 text-base font-semibold text-text transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-xpgreen/50"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function CommunicationsOverlay(props: {
  open: boolean;
  activeGroup: CentralGroup;
  notifications: PortfolioNotification[];
  chats: PortfolioChat[];
  selectedNotification?: PortfolioNotification;
  selectedChat?: PortfolioChat;
  selectedIndex: number;
  selectedChatIndex: number;
  unreadNotificationCount: number;
  unreadChatCount: number;
  mobilePane: CentralMobilePane;
  chatDraft: string;
  onClose: () => void;
  onShowList: () => void;
  onSelectGroup: (group: CentralGroup) => void;
  onSelect: (notificationId: string) => void;
  onSelectChat: (chatId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPreviousChat: () => void;
  onNextChat: () => void;
  onMarkNotificationUnread: (notificationId: string) => void;
  onMarkChatUnread: (chatId: string) => void;
  onChatDraftChange: (value: string) => void;
  onChatSubmit: (event: React.FormEvent) => void;
}) {
  if (!props.open) return null;

  const showingNotifications = props.activeGroup === "notifications";
  const activeUnreadCount = showingNotifications
    ? props.unreadNotificationCount
    : props.unreadChatCount;
  const activeTotalCount = showingNotifications
    ? props.notifications.length
    : props.chats.length;

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-hidden bg-black/60 p-0 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Central de relacionamento"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Fechar central"
        onClick={props.onClose}
      />

      <section className="relative flex h-dvh w-full max-w-5xl flex-col overflow-hidden border-border bg-card shadow-soft sm:mt-8 sm:h-[min(780px,calc(100vh-4rem))] sm:rounded-2xl sm:border">
        <header className="shrink-0 border-b border-border px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">
                Central de relacionamento
              </h2>
              <p className="text-xs text-muted">
                {activeTotalCount} itens no grupo, {activeUnreadCount} não lidos
              </p>
            </div>
            <button
              type="button"
              onClick={props.onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted transition hover:bg-white/5 hover:text-text focus:outline-none focus:ring-2 focus:ring-xpgreen/50"
              aria-label="Fechar"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-appbg p-1">
            <CentralTab
              active={props.activeGroup === "notifications"}
              count={props.unreadNotificationCount}
              label="Notificações"
              onClick={() => props.onSelectGroup("notifications")}
            />
            <CentralTab
              active={props.activeGroup === "messages"}
              count={props.unreadChatCount}
              label="Mensagens"
              onClick={() => props.onSelectGroup("messages")}
            />
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
          {showingNotifications ? (
            <>
              <NotificationList
                mobilePane={props.mobilePane}
                notifications={props.notifications}
                selectedNotification={props.selectedNotification}
                onSelect={props.onSelect}
              />
              <NotificationDetail
                mobilePane={props.mobilePane}
                notification={props.selectedNotification}
                notificationCount={props.notifications.length}
                selectedIndex={props.selectedIndex}
                onBack={props.onShowList}
                onPrevious={props.onPrevious}
                onNext={props.onNext}
                onMarkUnread={props.onMarkNotificationUnread}
              />
            </>
          ) : props.chats.length === 0 ? (
            <EmptyMessagesState />
          ) : (
            <>
              <ChatList
                chats={props.chats}
                mobilePane={props.mobilePane}
                selectedChat={props.selectedChat}
                onSelect={props.onSelectChat}
              />
              <ChatDetail
                chat={props.selectedChat}
                chatCount={props.chats.length}
                chatDraft={props.chatDraft}
                mobilePane={props.mobilePane}
                selectedIndex={props.selectedChatIndex}
                onBack={props.onShowList}
                onDraftChange={props.onChatDraftChange}
                onMarkUnread={props.onMarkChatUnread}
                onNext={props.onNextChat}
                onPrevious={props.onPreviousChat}
                onSubmit={props.onChatSubmit}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyMessagesState() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-appbg/70 px-6 py-10 text-center lg:col-span-2">
      <div className="max-w-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted">
          <MessageIcon />
        </div>
        <h3 className="mt-4 text-base font-semibold text-text">
          Nenhuma mensagem disponível
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Aguarde até um AAI ou um representante do Grupo XP entrar em contato.
          Todas as mensagens enviadas e recebidas serão exibidas aqui.
        </p>
      </div>
    </div>
  );
}

function CentralTab(props: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        props.active ? "bg-card text-text" : "text-muted hover:bg-white/5"
      }`}
    >
      <span>{props.label}</span>
      <span
        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
          props.count > 0 ? "bg-xpred text-white" : "bg-border text-muted"
        }`}
      >
        {props.count}
      </span>
    </button>
  );
}

function NotificationList(props: {
  mobilePane: CentralMobilePane;
  notifications: PortfolioNotification[];
  selectedNotification?: PortfolioNotification;
  onSelect: (notificationId: string) => void;
}) {
  return (
    <nav
      className={`min-h-0 overflow-y-auto overscroll-contain bg-appbg/70 lg:block lg:border-r ${
        props.mobilePane === "list" ? "block" : "hidden"
      }`}
      aria-label="Lista de notificações"
    >
      {props.notifications.map((notification) => {
        const selected = notification.id === props.selectedNotification?.id;

        return (
          <button
            key={notification.id}
            type="button"
            onClick={() => props.onSelect(notification.id)}
            className={`block w-full border-b border-border px-4 py-4 text-left transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-xpgreen/40 sm:px-5 ${
              selected ? "bg-white/5" : ""
            }`}
            aria-current={selected ? "true" : undefined}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="flex items-center justify-between gap-3 text-xs text-muted">
                  <span className="min-w-0 truncate font-semibold">
                    {notification.from}
                  </span>
                  <span className="shrink-0">{notification.date}</span>
                </span>
                <span
                  className={`mt-3 block truncate text-sm font-semibold ${
                    notification.read ? "text-muted" : "text-text"
                  }`}
                >
                  {notification.subject}
                </span>
                <span className="mt-2 line-clamp-2 block text-sm text-muted lg:text-xs">
                  {notification.preview}
                </span>
              </span>
              {!notification.read ? (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-xpgreen" />
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function NotificationDetail(props: {
  mobilePane: CentralMobilePane;
  notification?: PortfolioNotification;
  notificationCount: number;
  selectedIndex: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMarkUnread: (notificationId: string) => void;
}) {
  if (!props.notification) return null;

  const isFirstNotification = props.selectedIndex <= 0;
  const isLastNotification = props.selectedIndex >= props.notificationCount - 1;

  return (
    <article
      className={`min-h-0 flex-col overflow-hidden bg-card lg:flex ${
        props.mobilePane === "detail" ? "flex" : "hidden"
      }`}
    >
      <div className="flex shrink-0 justify-between items-center gap-3 border-b border-border bg-appbg/70 px-3 py-3 lg:hidden">
        <button
          type="button"
          onClick={props.onBack}
          className="flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text"
        >
          <ChevronLeftIcon />
          Notificações
        </button>
        <span className="text-xs text-muted">
          {props.selectedIndex + 1} de {props.notificationCount}
        </span>
      </div>
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="min-w-0">
            <p className="line-clamp-2 text-[11px] font-semibold uppercase leading-snug text-muted sm:text-md">
              De: {props.notification.from}
            </p>
            <h3 className="mt-1 text-md font-semibold leading-snug text-text sm:text-md">
              {props.notification.subject}
            </h3>
          </div>

          <p className="text-xs text-muted">
            Recebida em {props.notification.date}
          </p>
          <div className="flex gap-3 justify-between">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                props.notification.read
                  ? "border-border text-muted"
                  : "border-xpgreen/50 text-xpgreen"
              }`}
            >
              {props.notification.read ? "Lida" : "Não lido"}
            </span>

            {props.notification.read ? (
              <button
                type="button"
                onClick={() => props.onMarkUnread(props.notification!.id)}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text hover:bg-white/5"
              >
                Marcar como não lida
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <div className="space-y-4 text-left text-sm leading-relaxed text-text">
          {props.notification.body.map((paragraph) => (
            <p key={paragraph} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={props.onPrevious}
          disabled={isFirstNotification}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-text transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon />
          Anterior
        </button>
        <span className="text-xs text-muted">
          {props.selectedIndex + 1} de {props.notificationCount}
        </span>
        <button
          type="button"
          onClick={props.onNext}
          disabled={isLastNotification}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-text transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
          <ChevronRightIcon />
        </button>
      </footer>
    </article>
  );
}

function ChatList(props: {
  chats: PortfolioChat[];
  mobilePane: CentralMobilePane;
  selectedChat?: PortfolioChat;
  onSelect: (chatId: string) => void;
}) {
  return (
    <nav
      className={`min-h-0 overflow-y-auto overscroll-contain bg-appbg/70 lg:block lg:border-r ${
        props.mobilePane === "list" ? "block" : "hidden"
      }`}
      aria-label="Lista de mensagens"
    >
      {props.chats.map((chat) => {
        const selected = chat.id === props.selectedChat?.id;
        const lastMessage = chat.messages[chat.messages.length - 1];

        return (
          <button
            key={chat.id}
            type="button"
            onClick={() => props.onSelect(chat.id)}
            className={`block w-full border-b border-border px-4 py-4 text-left transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-xpgreen/40 sm:px-5 ${
              selected ? "bg-white/5" : ""
            }`}
            aria-current={selected ? "true" : undefined}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="flex items-center justify-between gap-3 text-xs text-muted">
                  <span className="min-w-0 truncate font-semibold">
                    {chat.contact}
                  </span>
                  <span className="shrink-0">{chat.date}</span>
                </span>
                <span
                  className={`mt-1 block truncate text-sm font-semibold ${
                    chat.read ? "text-muted" : "text-text"
                  }`}
                >
                  {chat.subject}
                </span>
                <span className="mt-2 line-clamp-2 block text-sm text-muted lg:text-xs">
                  {lastMessage?.text}
                </span>
              </span>
              {!chat.read ? (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-xpgreen" />
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function ChatDetail(props: {
  chat?: PortfolioChat;
  chatCount: number;
  chatDraft: string;
  mobilePane: CentralMobilePane;
  selectedIndex: number;
  onBack: () => void;
  onDraftChange: (value: string) => void;
  onMarkUnread: (chatId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!props.chat) return null;

  const isFirstChat = props.selectedIndex <= 0;
  const isLastChat = props.selectedIndex >= props.chatCount - 1;

  function handleSubmit(event: React.FormEvent) {
    props.onSubmit(event);
    if (props.chatDraft.trim()) {
      setSelectedFiles([]);
    }
  }

  return (
    <article
      className={`min-h-0 flex-col overflow-hidden bg-card lg:flex ${
        props.mobilePane === "detail" ? "flex" : "hidden"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-appbg/70 px-3 py-3 lg:hidden">
        <button
          type="button"
          onClick={props.onBack}
          className="flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text"
        >
          <ChevronLeftIcon />
          Mensagens
        </button>
        <span className="text-xs text-muted">
          {props.selectedIndex + 1} de {props.chatCount}
        </span>
      </div>

      <div className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase leading-snug text-muted">
              {props.chat.role}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-snug text-text sm:text-xl">
              {props.chat.contact}
            </h3>
            <p className="mt-1 text-xs text-muted">{props.chat.subject}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                props.chat.read
                  ? "border-border text-muted"
                  : "border-xpgreen/50 text-xpgreen"
              }`}
            >
              {props.chat.read ? "Lida" : "Nova"}
            </span>
            <button
              type="button"
              onClick={() => props.onMarkUnread(props.chat!.id)}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text hover:bg-white/5"
            >
              Marcar como não lida
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-appbg px-4 py-5 sm:px-6">
        <div className="space-y-4">
          {props.chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.author === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[86%] rounded-2xl border px-4 py-3 text-sm shadow-soft ${
                  message.author === "user"
                    ? "border-xpgreen/30 bg-green-950/60 text-text"
                    : "border-border bg-card text-muted"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-muted">
                  <span className="font-semibold">{message.sender}</span>
                  <span>{message.sentAt}</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">
                  {message.text}
                </p>
                {message.attachments?.length ? (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 rounded-xl border border-border bg-black/20 px-3 py-2 text-xs text-text"
                      >
                        {attachment.type === "pdf" ? (
                          <FileTextIcon />
                        ) : (
                          <ImageIcon />
                        )}
                        <span className="min-w-0 truncate">
                          {attachment.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6"
      >
        {selectedFiles.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file) => (
              <span
                key={`${file.name}-${file.lastModified}`}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {file.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-muted hover:bg-white/5">
            <PaperclipIcon />
            <input
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="sr-only"
              onChange={(event) =>
                setSelectedFiles(Array.from(event.target.files ?? []))
              }
            />
          </label>
          <textarea
            className="min-h-11 max-h-28 flex-1 resize-none rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-text outline-none focus:border-xpgreen/70"
            placeholder="Escreva uma resposta"
            rows={1}
            value={props.chatDraft}
            onChange={(event) => props.onDraftChange(event.target.value)}
          />
          <button
            type="submit"
            disabled={!props.chatDraft.trim()}
            className="min-h-11 rounded-xl border border-xpgreen/50 bg-green-900 px-4 py-2 text-sm font-semibold text-text transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </form>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={props.onPrevious}
          disabled={isFirstChat}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-text transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon />
          Anterior
        </button>
        <span className="text-xs text-muted">
          {props.selectedIndex + 1} de {props.chatCount}
        </span>
        <button
          type="button"
          onClick={props.onNext}
          disabled={isLastChat}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-text transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
          <ChevronRightIcon />
        </button>
      </footer>
    </article>
  );
}

function InboxIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 13h4l1.6 3h4.8l1.6-3h4M5.5 19h13A1.5 1.5 0 0 0 20 17.5v-11A1.5 1.5 0 0 0 18.5 5h-13A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19Z"
      />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l8.5-8.5a4 4 0 0 1 5.7 5.7l-8.5 8.5a2 2 0 0 1-2.8-2.8l7.8-7.8"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5A2.5 2.5 0 0 1 16.5 15H11l-4.5 4v-4A2.5 2.5 0 0 1 5 12.5v-5Z"
      />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3v5h5M8 13h8M8 17h5"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect width="16" height="14" x="4" y="5" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 16 4-4 3 3 2-2 7 7M8.5 9.5h.01"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  );
}

function NoticeCard({
  candidateName,
  onOpenLookup,
  onOpenResult,
}: NoticeProps) {
  return (
    <section>
      <div className="flex flex-col p-1">
        <div className="bg-appbg text-justify p-3 rounded-xl">
          <h1 className="text-lg font-semibold">Assessor {candidateName}</h1>
          <p className="text-md text-muted text-justify"></p>

          <p className="mt-3 text-sm text-muted leading-relaxed">
            Bem-vindo ao canal de comunicação.
          </p>

          <div className="mt-3">
            <p className="text-sm">Fique atento às mensagens neste canal.</p>

            <p className="text-sm">Ative as notificações do seu navegador.</p>
          </div>

          <div className="mt-4 rounded-xl border border-xpgreen/25 bg-gray-900/20 p-2 space-y-1">
            <p className="text-md text-text font-semibold">Registro</p>

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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onOpenLookup}
            className="min-h-12 rounded-xl border border-green-700/70 bg-green-900 px-4 py-3 text-center text-base font-semibold text-text transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-xpgreen/50"
          >
            Detalhes do registro
          </button>
          <button
            type="button"
            onClick={onOpenResult}
            className="min-h-12 rounded-xl border border-blue-700/70 bg-blue-900 px-4 py-3 text-center text-base font-semibold text-text transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text">
              Consulta:{" "}
              <span className="text-text font-semibold">{RECORD_FULL}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={props.onBack}
            className="min-h-10 w-full rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-white/5 sm:w-auto"
          >
            Voltar
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-black/20 p-4">
            <p className="text-sm text-text font-semibold text-pretty">
              {RECORD_DATA.certification}
            </p>
            <p className="text-xs text-muted">
              Status:{" "}
              <span className="font-semibold text-xpgreen">
                {RECORD_DATA.status}{" "}
              </span>
              <span className="text-text font-semibold">
                ({RECORD_DATA.deadline})
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <Info
              label="Título: Assessor de investimentos"
              value={RECORD_DATA.advisorName}
            />
          </div>

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
      <div className="flex items-start justify-between gap-3">
        <div className="text-lg font-semibold text-text">
          Resultado da Avaliação
          <p className="text-sm">Certificação Ancord</p>
        </div>

        <button
          type="button"
          onClick={props.onBack}
          className="min-h-10 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text hover:bg-white/5"
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
