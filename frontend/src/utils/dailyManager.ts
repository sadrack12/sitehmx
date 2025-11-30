// Gerenciador global de instâncias do Daily.co
// Garante que apenas uma instância seja criada por vez

let activeInstance: any = null
let isCreating = false

export const dailyManager = {
  /**
   * Verifica se há uma instância ativa
   */
  hasActiveInstance(): boolean {
    return activeInstance !== null
  },

  /**
   * Registra uma nova instância
   */
  registerInstance(instance: any): void {
    if (activeInstance && activeInstance !== instance) {
      console.warn('Já existe uma instância ativa, destruindo antes de registrar nova...')
      try {
        activeInstance.destroy()
      } catch (e) {
        console.warn('Erro ao destruir instância anterior:', e)
      }
    }
    activeInstance = instance
  },

  /**
   * Remove o registro de uma instância
   */
  unregisterInstance(instance: any): void {
    if (activeInstance === instance) {
      activeInstance = null
    }
  },

  /**
   * Destrói a instância ativa
   */
  async destroyActiveInstance(): Promise<void> {
    if (activeInstance) {
      try {
        await activeInstance.destroy()
      } catch (e) {
        console.warn('Erro ao destruir instância ativa:', e)
      }
      activeInstance = null
    }
    
    // Também tentar limpar instâncias globais do Daily.co
    try {
      if ((window as any).DailyIframe) {
        const dailyGlobal = (window as any).DailyIframe
        if (dailyGlobal._instances && Array.isArray(dailyGlobal._instances)) {
          for (const instance of [...dailyGlobal._instances]) {
            try {
              if (instance && typeof instance.destroy === 'function') {
                await instance.destroy()
              }
            } catch (e) {
              // Ignorar erros individuais
            }
          }
          dailyGlobal._instances = []
        }
      }
    } catch (e) {
      console.warn('Erro ao limpar instâncias globais:', e)
    }
  },

  /**
   * Verifica se está criando uma instância
   */
  isCreating(): boolean {
    return isCreating
  },

  /**
   * Marca que está criando uma instância
   */
  setCreating(value: boolean): void {
    isCreating = value
  },

  /**
   * Obtém a instância ativa
   */
  getActiveInstance(): any {
    return activeInstance
  }
}

