import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import Card, { CardContent, CardTitle, CardDescription } from './Card'
import { Noticia } from '@/types'
import { cn } from '@/utils'

interface NoticiaCardProps {
  noticia: Noticia
  className?: string
}

export default function NoticiaCard({ noticia, className }: NoticiaCardProps) {
  const hasRealImage = noticia.image && (
    noticia.image.startsWith('/images/') || 
    noticia.image.startsWith('http') ||
    noticia.image.startsWith('/storage/')
  )
  
  const imageUrl = noticia.image?.startsWith('/storage/') 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${noticia.image}`
    : noticia.image
  
  const formattedDate = noticia.date ? new Date(noticia.date).toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : ''
  
  return (
    <Card className={cn('hover:shadow-lg group', className)}>
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
        {hasRealImage ? (
          <>
            {/* Real Image */}
            <div className="relative w-full h-full">
              <Image
                src={imageUrl || '/placeholder.jpg'}
                alt={noticia.title}
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/60 to-green-500/40 group-hover:from-green-600/40 group-hover:to-green-500/20 transition-opacity duration-300"></div>
            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 group-hover:opacity-10 transition-opacity duration-300">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </>
        ) : (
          <>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${noticia.color || 'from-green-100 to-green-200'}`}></div>
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Calendar className="w-12 h-12 opacity-30" />
            </div>
          </>
        )}
        
        {/* Date badge */}
        {formattedDate && (
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold z-20 shadow-md">
            {formattedDate}
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <CardTitle className="text-base mb-1.5 line-clamp-2">{noticia.title}</CardTitle>
        <CardDescription className="text-xs mb-2 line-clamp-2">{noticia.description}</CardDescription>
        <Link
          href={noticia.href || '#'}
          className="inline-flex items-center gap-1 text-green-600 font-semibold text-xs hover:gap-2 transition-all"
        >
          Ler mais
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  )
}

