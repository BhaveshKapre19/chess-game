---
name: Grandmaster Heritage
colors:
  surface: '#151408'
  surface-dim: '#151408'
  surface-bright: '#3c392c'
  surface-container-lowest: '#100e04'
  surface-container-low: '#1e1c10'
  surface-container: '#222013'
  surface-container-high: '#2c2a1d'
  surface-container-highest: '#373527'
  on-surface: '#e8e2cf'
  on-surface-variant: '#c7c6ca'
  inverse-surface: '#e8e2cf'
  inverse-on-surface: '#333123'
  outline: '#909094'
  outline-variant: '#46474a'
  surface-tint: '#c8c6c7'
  primary: '#c8c6c7'
  on-primary: '#303031'
  primary-container: '#1a1a1b'
  on-primary-container: '#848283'
  inverse-primary: '#5f5e5f'
  secondary: '#e9c176'
  on-secondary: '#412d00'
  secondary-container: '#604403'
  on-secondary-container: '#dab36a'
  tertiary: '#c8c6c6'
  on-tertiary: '#303030'
  tertiary-container: '#1a1a1a'
  on-tertiary-container: '#838282'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#151408'
  on-background: '#e8e2cf'
  surface-variant: '#373527'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  mono-stats:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  board-margin: 32px
  container-max: 1200px
---

## Brand & Style

The design system is built upon a **Luxury Modern** aesthetic, blending the intellectual heritage of chess with contemporary high-fidelity digital craftsmanship. It evokes the atmosphere of a private members' club or a high-stakes championship hall: quiet, focused, and profoundly sophisticated.

The style utilizes a **Refined Minimalist** approach with subtle **Tonal Layering**. It prioritizes extreme legibility for gameplay while surrounding the board with a premium interface that feels both substantial and airy. The target audience includes professional players and enthusiasts who value a distraction-free, "tactile digital" experience. Visual weight is distributed to ensure the board remains the focal point, while UI controls are treated as high-end precision instruments.

## Colors

The palette is anchored in deep, desaturated tones to reduce eye strain during long matches. 

- **Primary & Background:** Deep Charcoal and a darker secondary "Deep" variant form the foundation. These provide a high-contrast backdrop for the gold accents.
- **Secondary (Burnished Gold):** Reserved for high-value interactions, success states, and the representation of royalty (Kings/Queens) in UI indicators.
- **The Board:** Creamy Marble and Polished Ebony are calibrated for maximum piece-to-square contrast.
- **Accents:** Soft Ivory and pure white are used sparingly for critical text and active states to maintain a premium, crisp appearance.

## Typography

This design system employs a high-contrast typographic pairing to signal authority and precision.

- **Headlines:** Playfair Display provides a literary, classic feel. It should be used for player names, tournament titles, and major modal headers.
- **UI & Body:** Hanken Grotesk offers a sharp, contemporary counterpoint. Its high legibility is essential for move notations, clock timers, and settings.
- **Labels:** Small labels and secondary metadata should use Hanken Grotesk in uppercase with generous letter spacing to evoke luxury branding.
- **Numerical Data:** For the chess clock and move counters, a technical sans or Geist (if available for mono) should be used to ensure digit alignment during rapid countdowns.

## Layout & Spacing

The layout philosophy follows a **Fixed-Center Grid** for desktop and a **Fluid-Safe Margin** for mobile.

- **Desktop:** The board is centered or offset to the left on a 12-column grid. The right 4 columns are dedicated to move history and chat.
- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm. Use 24px (lg) for major component grouping and 16px (md) for internal element padding.
- **Board Scaling:** The board should always maintain a 1:1 aspect ratio, scaling fluidly until it hits its maximum container size, ensuring it remains the dominant visual element.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering** rather than aggressive light sources.

- **Base Level:** Deep Charcoal (#1A1A1B) background.
- **Surface Level (Cards/Sidebars):** Surface Ebony (#1F1F20) with a 1px solid border in Metallic Gold at 10% opacity.
- **Elevated States (Modals/Popovers):** These use a slightly lighter charcoal with a 24px blur, 15% opacity black shadow to create a sense of floating over the board.
- **Board Interaction:** Active pieces should have a soft "Burnished Gold" outer glow (4px spread) to indicate selection without obstructing the square beneath.

## Shapes

The shape language is **Soft yet Architectural**. 

- **Primary Elements:** Buttons and cards use a 4px (Soft) radius to maintain a crisp, professional look that isn't overly "bubbly."
- **The Board:** The main board container should have a slightly larger 8px radius to frame the game.
- **Inputs:** Search bars and move entry fields use the standard 4px radius. 
- **Icons:** Use sharp or slightly rounded geometric icons. Avoid overly thick or playful stroke weights.

## Components

- **Primary Buttons:** Solid Burnished Gold background with Deep Charcoal text. High-gloss finish with no gradients.
- **Secondary Buttons:** Ghost style with a 1px Metallic Gold border and Ivory text.
- **The Chess Board:** Squares are flat. Pieces are high-detail vectors in Ivory (White) and Polished Ebony (Black) with subtle 1px outlines to ensure visibility on both square colors.
- **Move List:** Alternating row colors (Surface Ebony and Deep Charcoal). The "Active Move" is highlighted with a gold left-border accent.
- **Timers:** Large, mono-spaced digits. When a player has less than 10 seconds, the text color shifts from Ivory to a muted Gold (not red, to maintain the palette's elegance).
- **Cards:** Used for player profiles. Features a 1px subtle gold border and a faint radial gradient background to simulate a metallic sheen.
- **Input Fields:** Deep charcoal background with a gold-bottom border focus state.