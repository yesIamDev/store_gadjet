import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type {
  StockMovement,
  CreateStockMovementDto,
  UpdateStockMovementDto,
} from './types'

const normalizeStockMovement = (movement: StockMovement): StockMovement => ({
  ...movement,
  items: movement.items.map((item) => ({
    ...item,
    article: {
      ...item.article,
      prixDeVente:
        typeof item.article.prixDeVente === 'string'
          ? parseFloat(item.article.prixDeVente)
          : item.article.prixDeVente,
      quantiteEnStock:
        typeof item.article.quantiteEnStock === 'string'
          ? parseInt(item.article.quantiteEnStock, 10)
          : item.article.quantiteEnStock,
    },
  })),
})

export const stockMovementsApi = {
  async getAll(articleId?: string): Promise<StockMovement[]> {
    const endpoint = articleId
      ? API_ENDPOINTS.STOCK_MOVEMENTS.BY_ARTICLE(articleId)
      : API_ENDPOINTS.STOCK_MOVEMENTS.BASE
    const movements = await apiClient.get<StockMovement[]>(endpoint)
    return movements.map(normalizeStockMovement)
  },

  async getById(id: string): Promise<StockMovement> {
    const movement = await apiClient.get<StockMovement>(
      API_ENDPOINTS.STOCK_MOVEMENTS.BY_ID(id),
    )
    return normalizeStockMovement(movement)
  },

  async create(data: CreateStockMovementDto): Promise<StockMovement> {
    const movement = await apiClient.post<StockMovement>(
      API_ENDPOINTS.STOCK_MOVEMENTS.BASE,
      data,
    )
    return normalizeStockMovement(movement)
  },

  async update(
    id: string,
    data: UpdateStockMovementDto,
  ): Promise<StockMovement> {
    const movement = await apiClient.patch<StockMovement>(
      API_ENDPOINTS.STOCK_MOVEMENTS.BY_ID(id),
      data,
    )
    if (!movement) {
      throw new Error('Aucune réponse du serveur')
    }
    return normalizeStockMovement(movement)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.STOCK_MOVEMENTS.BY_ID(id))
  },
}
