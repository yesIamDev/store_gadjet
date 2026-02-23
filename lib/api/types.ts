export interface LoginDto {
  username: string
  password: string
}

export interface RegisterDto {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export interface Article {
  id: string
  nom: string
  description: string | null
  quantiteEnStock: number
  quantiteMagasin: number
  quantiteDepot: number
  prixDeVente: number | string
  createdAt: string
  updatedAt: string
}

export interface CreateArticleDto {
  nom: string
  description?: string
  quantiteMagasin: number
  quantiteDepot: number
  prixDeVente: number
}

export interface UpdateArticleDto {
  nom?: string
  description?: string
  quantiteMagasin?: number
  quantiteDepot?: number
  prixDeVente?: number
}

export enum MovementType {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
}

export enum LocationType {
  MAGASIN = 'MAGASIN',
  DEPOT = 'DEPOT',
}

export interface StockMovementItem {
  id: string
  article: Article
  quantite: number
  emplacement: LocationType
}

export interface StockMovement {
  id: string
  code: string
  items: StockMovementItem[]
  type: MovementType
  motif: string | null
  createdAt: string
  updatedAt: string
}

export interface StockMovementItemDto {
  articleId: string
  quantite: number
  emplacement: LocationType
}

export interface CreateStockMovementDto {
  type: MovementType
  items: StockMovementItemDto[]
  motif?: string
}

export interface UpdateStockMovementDto {
  type?: MovementType
  items?: StockMovementItemDto[]
  motif?: string
}

export enum ClientType {
  INDIVIDU = 'INDIVIDU',
  ENTREPRISE = 'ENTREPRISE',
}

export interface Client {
  id: string
  type: ClientType
  nom: string
  telephone: string | null
  nomPersonneReference: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateClientDto {
  type: ClientType
  nom: string
  telephone: string
  nomPersonneReference?: string
}

export interface UpdateClientDto {
  type?: ClientType
  nom?: string
  telephone?: string
  nomPersonneReference?: string
}

export enum InvoiceStatus {
  NON_PAYE = 'NON_PAYE',
  PAYE = 'PAYE',
}

export interface InvoiceItem {
  id: string
  nom: string
  description: string | null
  prixUnitaire: number | string
  quantite: number
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  montant: number | string
  note: string | null
  invoiceId: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  numeroFacture: string
  numeroBonLivraison: string | null
  montantTotal: number | string
  status: InvoiceStatus
  stockMovement: StockMovement | null
  items: InvoiceItem[]
  payments: Payment[]
  montantPaye: number | string
  montantRestant: number | string
  client: Client | null
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceItemDto {
  nom: string
  description?: string
  prixUnitaire: number
  quantite: number
}

export interface CreatePaymentDto {
  montant: number
  note?: string
}

export interface CreateInvoiceDto {
  numeroFacture: string
  numeroBonLivraison?: string
  montantTotal?: number
  status?: InvoiceStatus
  stockMovementCode?: string
  items?: CreateInvoiceItemDto[]
  clientId?: string
}

export interface UpdateInvoiceDto {
  numeroFacture?: string
  numeroBonLivraison?: string
  montantTotal?: number
  status?: InvoiceStatus
  stockMovementCode?: string
  items?: CreateInvoiceItemDto[]
  clientId?: string
}

export enum PendingArticleStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  PARTIELLEMENT_RECU = 'PARTIELLEMENT_RECU',
  RECU = 'RECU',
}

export interface PendingArticle {
  id: string
  article: Article
  quantiteAttendue: number
  quantiteRecue: number
  dateAttendue: string | null
  dateReception: string | null
  status: PendingArticleStatus
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePendingArticleDto {
  articleId: string
  quantiteAttendue: number
  dateAttendue?: string
  note?: string
}

export interface UpdatePendingArticleDto {
  articleId?: string
  quantiteAttendue?: number
  dateAttendue?: string
  note?: string
}

export interface ReceivePendingArticleDto {
  quantiteRecue: number
  emplacement: LocationType
  motif?: string
}

export interface ReceivePendingArticleResponse {
  pendingArticle: PendingArticle
  stockMovement: StockMovement
}

