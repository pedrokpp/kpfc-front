import type { Messages } from './enUS';

const messages: Messages = {
	// Nav
	'nav.myDecks': 'Meus Decks',
	'nav.explore': 'Explorar',
	'nav.profile': 'Perfil',
	'nav.logout': 'Sair',
	'nav.login': 'Entrar',
	'nav.register': 'Cadastrar',
	'nav.toggleDarkMode': 'Alternar tema escuro',
	'nav.toggleLanguage': 'Alterar idioma',

	// Footer
	'footer.tagline': 'Flashcards com repetição espaçada.',
	'footer.apiSource': 'Código da API',

	// Layout
	'layout.pageTitle': 'kpfc — Flashcards',

	// Home
	'home.tagline': 'Flashcards com repetição espaçada, feitos para durar.',
	'home.studySmarter': 'Estude de forma mais inteligente com o',
	'home.algorithm': 'algoritmo.',
	'home.description': 'Crie decks, mantenha sequências e explore decks públicos da comunidade.',
	'home.getStarted': 'Começar',
	'home.exploreDecks': 'Explorar decks',

	// Error
	'error.somethingWrong': 'Algo deu errado',
	'error.backToDashboard': 'Voltar para o início',

	// Auth
	'auth.signIn': 'Entrar',
	'auth.welcomeBack': 'Bem-vindo de volta',
	'auth.email': 'E-mail',
	'auth.password': 'Senha',
	'auth.noAccount': 'Sem conta?',
	'auth.alreadyHaveAccount': 'Já tem uma conta?',
	'auth.createAccount': 'Criar conta',
	'auth.startStudying': 'Estude de forma mais inteligente',
	'auth.displayName': 'Nome de exibição',
	'auth.optional': 'Opcional',
	'auth.welcomeBackToast': 'Bem-vindo de volta!',
	'auth.accountCreatedToast': 'Conta criada! Bem-vindo ao kpfc.',
	'auth.loggedOutToast': 'Sessão encerrada.',
	'auth.loginFailed': 'Falha no login.',
	'auth.registrationFailed': 'Falha no cadastro.',

	// Dashboard
	'dashboard.title': 'Meus Decks',
	'dashboard.dayStreak': 'dias seguidos',
	'dashboard.pts': 'pts',
	'dashboard.newDeck': 'Novo deck',
	'dashboard.noDecksTitle': 'Nenhum deck ainda',
	'dashboard.noDecksDesc': 'Crie seu primeiro deck para começar a estudar.',
	'dashboard.createDeck': 'Criar deck',
	'dashboard.editDeck': 'Editar deck',
	'dashboard.deleteDeck': 'Excluir deck',
	'dashboard.deleteConfirmPre': 'Tem certeza que quer excluir',
	'dashboard.deleteConfirmPost': '? Todos os cards serão removidos. Esta ação não pode ser desfeita.',
	'dashboard.deckCreated': 'Deck criado.',
	'dashboard.deckUpdated': 'Deck atualizado.',
	'dashboard.deckDeleted': 'Deck excluído.',
	'dashboard.failedToLoad': 'Falha ao carregar decks.',
	'dashboard.failedToCreate': 'Falha ao criar deck.',
	'dashboard.failedToUpdate': 'Falha ao atualizar deck.',
	'dashboard.failedToDelete': 'Falha ao excluir deck.',

	// Explore
	'explore.title': 'Explorar',
	'explore.top': 'Popular',
	'explore.newest': 'Mais recente',
	'explore.noDecksTitle': 'Nenhum deck público ainda',
	'explore.noDecksDesc': 'Seja o primeiro a compartilhar um deck com a comunidade.',
	'explore.upvoteDeck': 'Curtir deck',
	'explore.loginToUpvote': 'Faça login para curtir decks.',
	'explore.failedToLoad': 'Falha ao carregar decks públicos.',
	'explore.failedToUpvote': 'Falha ao curtir.',

	// Deck viewer
	'deck.myDecks': 'Meus Decks',
	'deck.public': 'Público',
	'deck.card': 'card',
	'deck.cards': 'cards',
	'deck.due': 'para revisar',
	'deck.editDeck': 'Editar deck',
	'deck.study': 'Estudar',
	'deck.addCard': 'Adicionar card',
	'deck.noCardsTitle': 'Nenhum card ainda',
	'deck.noCardsDesc': 'Adicione o primeiro card a este deck.',
	'deck.preview': 'Visualizar',
	'deck.editCard': 'Editar card',
	'deck.deleteCard': 'Excluir card',
	'deck.deleteCardConfirm': 'Tem certeza que quer excluir este card? Esta ação não pode ser desfeita.',
	'deck.cardAdded': 'Card adicionado.',
	'deck.cardUpdated': 'Card atualizado.',
	'deck.cardDeleted': 'Card excluído.',
	'deck.failedToLoad': 'Falha ao carregar o deck.',
	'deck.failedToAddCard': 'Falha ao adicionar card.',
	'deck.failedToUpdateCard': 'Falha ao atualizar card.',
	'deck.failedToDeleteCard': 'Falha ao excluir card.',
	'deck.failedToUpdateDeck': 'Falha ao atualizar deck.',

	// DeckCard
	'deckCard.editDeck': 'Editar deck',
	'deckCard.deleteDeck': 'Excluir deck',

	// DeckForm
	'deckForm.title': 'Título',
	'deckForm.description': 'Descrição',
	'deckForm.descriptionPlaceholder': 'Descrição opcional',
	'deckForm.makePublic': 'Tornar este deck público',
	'deckForm.cancel': 'Cancelar',
	'deckForm.saveChanges': 'Salvar alterações',
	'deckForm.createDeck': 'Criar deck',

	// CardForm
	'cardForm.title': 'Título',
	'cardForm.titleOptional': 'opcional',
	'cardForm.titlePlaceholder': 'Etiqueta curta para este card',
	'cardForm.basic': 'Básico',
	'cardForm.cloze': 'Cloze',
	'cardForm.front': 'Frente',
	'cardForm.text': 'Texto',
	'cardForm.clozeHintPost': 'para lacunas de cloze.',
	'cardForm.frontPlaceholderBasic': 'Pergunta ou termo',
	'cardForm.back': 'Verso',
	'cardForm.backPlaceholder': 'Resposta ou definição',
	'cardForm.extra': 'Extra',
	'cardForm.extraOptional': 'opcional',
	'cardForm.extraPlaceholder': 'Notas adicionais mostradas após a revelação',
	'cardForm.attachFile': 'Anexar arquivo',
	'cardForm.uploading': 'Enviando...',
	'cardForm.fileHint': 'Imagens ou áudio, máx. 10 MB',
	'cardForm.cancel': 'Cancelar',
	'cardForm.saveChanges': 'Salvar alterações',
	'cardForm.addCard': 'Adicionar card',
	'cardForm.unsupportedFileType': 'Tipo de arquivo não suportado. Use PNG, JPEG, GIF, WebP, SVG, MP3 ou M4A.',
	'cardForm.fileTooLarge': 'Arquivo muito grande. O tamanho máximo é 10 MB.',
	'cardForm.fileUploaded': 'Arquivo enviado.',
	'cardForm.uploadFailed': 'Falha no envio.',

	// CardItem
	'cardItem.previewCard': 'Visualizar card',
	'cardItem.editCard': 'Editar card',
	'cardItem.deleteCard': 'Excluir card',
	'cardItem.dueForReview': 'Para revisar',
	'cardItem.next': 'Próximo:',
	'cardItem.interval': 'Intervalo:',
	'cardItem.days': 'd',
	'cardItem.reps': 'Reps:',

	// Modal
	'modal.closeDialog': 'Fechar diálogo',

	// Study
	'study.pageTitle': 'Estudar',
	'study.backToDeck': '← Voltar ao deck',
	'study.titlePrefix': 'Estudar:',
	'study.spacedRepetition': 'Repetição Espaçada',
	'study.spacedDesc': 'Revise cards com prazo hoje com base no algoritmo SM-2. Mais eficiente para a memória de longo prazo.',
	'study.randomPractice': 'Prática Aleatória',
	'study.randomDesc': 'Revise todos os cards em ordem aleatória. Bom para auto-avaliação. O estado SM-2 não é modificado.',
	'study.exit': '← Sair',
	'study.deckNotFound': 'Deck não encontrado.',
	'study.noCardsDue': 'Nenhum card para revisar agora.',
	'study.failedToStart': 'Falha ao iniciar sessão.',
	'study.failedToSubmit': 'Falha ao enviar avaliação.',

	// QualityRating
	'rating.question': 'Quão bem você se lembrou?',
	'rating.blackout': 'Bloqueio',
	'rating.wrong': 'Errado',
	'rating.hard': 'Difícil',
	'rating.good': 'Bom',
	'rating.perfect': 'Perfeito',
	'rating.noRecall': 'Sem lembrança',
	'rating.feltFamiliar': 'Pareceu familiar',
	'rating.easyOnceSeen': 'Fácil ao ver',
	'rating.significantEffort': 'Esforço significativo',
	'rating.someHesitation': 'Alguma hesitação',
	'rating.instantRecall': 'Lembrança imediata',

	// SessionSummary
	'summary.complete': 'Sessão concluída!',
	'summary.reviewedPre': 'Você revisou todos os cards em',
	'summary.cardsReviewed': 'Cards revisados',
	'summary.correct': 'Corretos (≥3)',
	'summary.avgQuality': 'Qualidade média',
	'summary.backToDeck': 'Voltar ao deck',
	'summary.studyAgain': 'Estudar novamente',

	// Flashcard
	'flashcard.revealAnswer': 'Revelar resposta',
	'flashcard.clickToReveal': 'Clique para revelar a resposta',
	'flashcard.question': 'Pergunta',
	'flashcard.text': 'Texto',
	'flashcard.answer': 'Resposta',
	'flashcard.extra': 'Extra',

	// Profile
	'profile.title': 'Perfil',
	'profile.dayStreak': 'Dias seguidos',
	'profile.totalPoints': 'Pontos totais',
	'profile.account': 'Conta',
	'profile.email': 'E-mail',
	'profile.displayName': 'Nome de exibição',
	'profile.yourName': 'Seu nome',
	'profile.save': 'Salvar',
	'profile.cancel': 'Cancelar',
	'profile.edit': 'Editar',
	'profile.updated': 'Perfil atualizado.',
	'profile.failedToUpdate': 'Falha ao atualizar o perfil.',
};

export default messages;
