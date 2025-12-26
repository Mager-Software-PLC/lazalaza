import { useCMS } from '@/contexts/CMSContext'
import { useMemo } from 'react'

export function useSectionStyle(sectionKey: string) {
  const { sectionStyles } = useCMS()
  const style = sectionStyles[sectionKey] || {}

  // Debug logging
  if (import.meta.env.DEV && Object.keys(style).length > 0) {
    console.log(`[useSectionStyle] ${sectionKey}:`, style)
  }

  const sectionStyle = useMemo(() => {
    const cssStyle: React.CSSProperties = {}
    const cardStyle: React.CSSProperties = {}
    const headingStyle: React.CSSProperties = {}
    const textStyle: React.CSSProperties = {}

    // Background
    if (style.background_gradient) {
      try {
        const gradient = JSON.parse(style.background_gradient)
        cssStyle.background = `linear-gradient(${gradient.direction || '135deg'}, ${gradient.colors?.join(', ') || '#06b6d4, #a855f7'})`
      } catch {
        cssStyle.background = style.background_color || undefined
      }
    } else if (style.background_color) {
      cssStyle.backgroundColor = style.background_color
    }

    if (style.background_image) {
      const imageUrl = style.background_image.startsWith('http') 
        ? style.background_image 
        : style.background_image.startsWith('/') 
          ? style.background_image 
          : `/uploads/${style.background_image}`
      cssStyle.backgroundImage = `url(${imageUrl})`
      cssStyle.backgroundSize = 'cover'
      cssStyle.backgroundPosition = 'center'
    }

    if (style.background_overlay) {
      cssStyle.position = 'relative'
    }

    // Text colors
    if (style.text_color) {
      cssStyle.color = style.text_color
      textStyle.color = style.text_color
    }
    if (style.heading_color) {
      headingStyle.color = style.heading_color
    }
    if (style.subheading_color) {
      // Can be applied to subheadings
    }

    // Fonts
    if (style.font_family) {
      cssStyle.fontFamily = style.font_family
      textStyle.fontFamily = style.font_family
    }
    if (style.heading_font) {
      headingStyle.fontFamily = style.heading_font
    }
    if (style.body_font) {
      textStyle.fontFamily = style.body_font
    }
    if (style.font_size_base) {
      cssStyle.fontSize = style.font_size_base
      textStyle.fontSize = style.font_size_base
    }

    // Card styles
    if (style.card_background) cardStyle.backgroundColor = style.card_background
    if (style.card_border_color) cardStyle.borderColor = style.card_border_color
    if (style.card_border_radius) cardStyle.borderRadius = style.card_border_radius
    if (style.card_shadow) cardStyle.boxShadow = style.card_shadow
    if (style.card_text_color) cardStyle.color = style.card_text_color

    return {
      sectionStyle: cssStyle,
      cardStyle,
      headingStyle,
      textStyle,
      overlayColor: style.background_overlay,
      buttonStyle: {
        backgroundColor: style.button_background,
        color: style.button_text_color,
        '--hover-bg': style.button_hover_background,
      } as React.CSSProperties & { '--hover-bg'?: string },
    }
  }, [style])

  return sectionStyle
}

