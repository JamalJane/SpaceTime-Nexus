import React from 'react'
import { useNavStore } from '../store'
import { audio } from '../lib/audio'

interface GlossaryLinkProps {
    term: string
    children?: React.ReactNode
}

export default function GlossaryLink({ term, children }: GlossaryLinkProps) {
    const { setGlossaryTerm } = useNavStore()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        audio.click()
        setGlossaryTerm(term)
    }

    return (
        <span
            onClick={handleClick}
            onMouseEnter={() => audio.hover()}
            style={{
                color: 'var(--coral)',
                textDecoration: 'underline',
                textDecorationStyle: 'dashed',
                textUnderlineOffset: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'opacity 0.2s',
            }}
            className="glossary-link"
        >
            {children || term}
        </span>
    )
}
