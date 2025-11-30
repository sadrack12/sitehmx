import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { Evento } from '@/types'
import { cn } from '@/utils'

interface EventoCardProps {
  evento: Evento
  className?: string
}

export default function EventoCard({ evento, className }: EventoCardProps) {
  const hasRealImage = evento.image && (
    evento.image.startsWith('/images/') || 
    evento.image.startsWith('http') ||
    evento.image.startsWith('/storage/')
  )
  
  const imageUrl = evento.image?.startsWith('/storage/') 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${evento.image}`
    : evento.image
  
  const formattedDate = evento.date ? new Date(evento.date).toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : ''
  
  return (
    <div
      className={cn(
        'bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all hover:-translate-y-1 group',
        className
      )}
    >
      <div className={cn('h-32 relative overflow-hidden', !hasRealImage && `bg-gradient-to-br ${evento.color || 'from-green-100 to-green-200'}`)}>
        {hasRealImage ? (
          <>
            {/* Real Image */}
            <div className="relative w-full h-full">
              <Image
                src={imageUrl || '/placeholder.jpg'}
                alt={evento.title}
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/30 to-transparent group-hover:from-gray-900/50 group-hover:via-gray-900/20 transition-opacity duration-300"></div>
            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 group-hover:opacity-20 transition-opacity duration-300">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </>
        ) : (
          <>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${evento.color || 'from-green-100 to-green-200'}`}></div>
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Calendar className="w-12 h-12 opacity-30 text-green-600" />
            </div>
          </>
        )}
        
        {/* Badge */}
        {evento.featured && (
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md z-20">
            <span>⭐</span>
            DESTAQUE
          </div>
        )}
        {!evento.featured && (
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md z-20">
            EVENTO
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold mb-2 text-gray-900 line-clamp-2">{evento.title}</h3>
        {evento.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{evento.description}</p>
        )}
        {formattedDate && (
          <p className="text-gray-600 text-xs">{formattedDate}</p>
        )}
      </div>
    </div>
  )
}

