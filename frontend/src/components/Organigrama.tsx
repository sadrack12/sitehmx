'use client'

import Image from 'next/image'

interface Membro {
  id: number
  name: string
  cargo: string
  bio?: string
  image?: string
  nivel: number
  parent_id?: number | null
  children?: Membro[]
}

interface OrganigramaProps {
  membros: Membro[]
  apiUrl?: string
}

export default function Organigrama({ membros, apiUrl }: OrganigramaProps) {
  // Organizar membros em árvore hierárquica
  const buildTree = (items: Membro[]): Membro | null => {
    if (items.length === 0) return null

    const map = new Map<number, Membro>()
    
    // Criar mapa de todos os membros
    items.forEach(item => {
      map.set(item.id, { ...item, children: [] })
    })

    // Encontrar o Director (nível 1 ou sem parent_id)
    let director: Membro | null = null
    
    // Primeiro, tentar encontrar por nível 1
    items.forEach(item => {
      if (item.nivel === 1 || !item.parent_id) {
        director = map.get(item.id)!
      }
    })

    // Se não encontrou, pegar o primeiro sem parent_id
    if (!director) {
      const root = items.find(item => !item.parent_id)
      if (root) {
        director = map.get(root.id)!
      } else {
        // Se não tem root, pegar o primeiro
        director = map.get(items[0].id)!
      }
    }

    // Verificar se director foi definido
    if (!director) {
      console.error('Não foi possível encontrar o director')
      return null
    }

    // Construir árvore a partir do Director
    items.forEach(item => {
      if (item.id === director!.id) return // Pular o próprio director
      
      const node = map.get(item.id)!
      if (item.parent_id && map.has(item.parent_id)) {
        const parent = map.get(item.parent_id)!
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        // Se não tem parent, adicionar como filho do director
        if (!director!.children) director!.children = []
        director!.children.push(node)
      }
    })

    // Ordenar filhos por ordem
    const sortChildren = (node: Membro): Membro => {
      if (node.children && node.children.length > 0) {
        node.children = node.children.sort((a, b) => {
          // Ordenar por nível primeiro, depois por ordem
          if (a.nivel !== b.nivel) return a.nivel - b.nivel
          return 0
        }).map(sortChildren)
      }
      return node
    }

    return sortChildren(director)
  }

  const director = buildTree(membros)

  if (!director) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum membro do corpo diretivo disponível.</p>
      </div>
    )
  }

  const renderNode = (membro: Membro, level: number = 0): JSX.Element => {
    const hasChildren = membro.children && membro.children.length > 0
    const imageUrl = membro.image 
      ? `${apiUrl?.replace('/api', '') || ''}/storage/${membro.image}`
      : null

    return (
      <div key={membro.id} className="flex flex-col items-center">
        {/* Card do membro */}
        <div className={`group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
          level === 0 ? 'border-green-600 w-72' : 'border-gray-100 hover:border-green-500 w-56'
        }`}>
          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
            level === 0 ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600'
          } opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-bl-full`}></div>
          
          {/* Image Container */}
          <div className="relative flex items-center justify-center py-6 px-4">
            <div className={`relative rounded-full overflow-hidden border-4 ${
              level === 0 ? 'w-36 h-36 border-green-600' : 'w-28 h-28 border-green-500'
            } shadow-xl group-hover:scale-105 transition-all duration-300`}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={membro.name}
                  fill
                  className="object-cover object-top"
                  sizes={level === 0 ? "144px" : "112px"}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${
                  level === 0 ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600'
                } flex items-center justify-center text-white font-bold ${level === 0 ? 'text-3xl' : 'text-2xl'}`}>
                  {membro.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 relative z-10 bg-white">
            <h3 className={`font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-1 text-center ${
              level === 0 ? 'text-xl' : 'text-base'
            }`}>
              {membro.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 bg-gradient-to-br ${
                level === 0 ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600'
              } rounded-full shadow-sm`}></div>
              <p className={`text-transparent bg-clip-text bg-gradient-to-r ${
                level === 0 ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600'
              } font-semibold text-xs text-center`}>
                {membro.cargo}
              </p>
            </div>
            
            {/* Decorative progress bar */}
            <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                level === 0 ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600'
              } w-0 group-hover:w-full transition-all duration-700 rounded-full shadow-sm`}></div>
            </div>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-40"></div>
        </div>

        {/* Linhas conectivas e filhos */}
        {hasChildren && (
          <div className="flex flex-col items-center mt-8 relative w-full">
            {/* Linha vertical principal saindo do Director */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full"
              style={{ 
                width: '4px',
                height: level === 0 ? '64px' : '40px',
                zIndex: 0,
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
              }}
            ></div>
            
            {/* Círculo de conexão no final da linha vertical */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full border-2 border-white"
              style={{ 
                width: '12px',
                height: '12px',
                top: level === 0 ? '64px' : '40px',
                marginTop: '-6px',
                zIndex: 1,
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.4)'
              }}
            ></div>
            
            {/* Container dos subordinados */}
            <div 
              className="relative flex justify-center items-start gap-8 w-full"
              style={{ 
                marginTop: level === 0 ? '64px' : '40px',
                paddingTop: '20px'
              }}
            >
              {/* Linha horizontal conectando todos os subordinados */}
              {membro.children!.length > 1 && (
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full"
                  style={{ 
                    height: '4px',
                    width: `${(membro.children!.length - 1) * 240}px`,
                    zIndex: 0,
                    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
                  }}
                ></div>
              )}
              
              {/* Renderizar cada subordinado */}
              {membro.children!.map((child, index) => {
                const totalChildren = membro.children!.length
                const isFirst = index === 0
                const isLast = index === totalChildren - 1
                
                return (
                  <div key={child.id} className="flex flex-col items-center relative" style={{ zIndex: 2 }}>
                    {/* Linha vertical conectando cada subordinado à linha horizontal */}
                    {totalChildren > 1 && (
                      <>
                        {/* Linha vertical */}
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full"
                          style={{ 
                            width: '4px',
                            height: '20px',
                            top: '-20px',
                            zIndex: 1,
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
                          }}
                        ></div>
                        {/* Círculo de conexão */}
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full border-2 border-white"
                          style={{ 
                            width: '12px',
                            height: '12px',
                            top: '-20px',
                            marginTop: '-6px',
                            zIndex: 2,
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.4)'
                          }}
                        ></div>
                      </>
                    )}
                    
                    {/* Se tiver apenas um filho, mostrar linha vertical simples */}
                    {totalChildren === 1 && (
                      <>
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full"
                          style={{ 
                            width: '4px',
                            height: '20px',
                            top: '-20px',
                            zIndex: 1,
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
                          }}
                        ></div>
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full border-2 border-white"
                          style={{ 
                            width: '12px',
                            height: '12px',
                            top: '-20px',
                            marginTop: '-6px',
                            zIndex: 2,
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.4)'
                          }}
                        ></div>
                      </>
                    )}
                    
                    {/* Renderizar o nó do subordinado */}
                    {renderNode(child, level + 1)}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8 overflow-x-auto w-full">
      {renderNode(director, 0)}
    </div>
  )
}
