import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, LucideIcon } from 'lucide-react'
import Card, { CardContent, CardTitle, CardDescription } from './Card'
import { Servico } from '@/types'
import { cn } from '@/utils'

interface ServicoCardProps {
  servico: Servico
  className?: string
}

export default function ServicoCard({ servico, className }: ServicoCardProps) {
  const Icon = servico.icon as LucideIcon
  const hasRealImage = servico.image && servico.image.startsWith('/images/')
  
  return (
    <Card className={cn('hover:shadow-lg group', className)}>
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
        {hasRealImage && servico.image ? (
          <>
            {/* Real Image */}
            <div className="relative w-full h-full">
              <Image
                src={servico.image}
                alt={servico.title}
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/60 to-green-500/40 group-hover:from-green-600/40 group-hover:to-green-500/20 transition-opacity duration-300"></div>
            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 group-hover:opacity-10 transition-opacity duration-300">
              <Icon className="w-12 h-12 text-white" />
            </div>
          </>
        ) : (
          <>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${servico.image || 'from-green-100 to-green-200'}`}></div>
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Icon className="w-12 h-12 opacity-30" />
            </div>
          </>
        )}
      </div>
      <CardContent className="p-3">
        <CardTitle className="text-base mb-1.5 line-clamp-2">{servico.title}</CardTitle>
        <CardDescription className="text-xs mb-2 line-clamp-2">{servico.description}</CardDescription>
        <Link
          href={servico.href || '#'}
          className="inline-flex items-center gap-1 text-green-600 font-semibold text-xs hover:gap-2 transition-all"
        >
          Ver mais
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  )
}

