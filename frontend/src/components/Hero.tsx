import turtle from '../assets/character/turtle.webp'
import heroPhoto from '../assets/photos/hero.webp'
import { ko as t } from '../content/ko'
import type { SignupResult } from '../lib/api'
import { SignupForm, type Preselect } from './SignupForm'

// 모바일에서는 사진을 받지 않는다(폼을 먼저 보여 주기 위해). 1x1 투명 GIF를 대신 둔다.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export function Hero({ preselect, onDone }: { preselect: Preselect; onDone: (result: SignupResult) => void }) {
  const h = t.hero
  return (
    <div className="hero-band">
      <div className="hero">
        <div className="hero__intro">
          <div className="hero__heading">
            <h1 className="hero__title">{h.title}</h1>
            <img className="hero__character" src={turtle} alt={h.characterAlt} width={640} height={566} />
          </div>
          <p className="hero__lead">{h.lead}</p>
          <picture className="hero__photo">
            <source media="(min-width: 960px)" srcSet={heroPhoto} />
            <img src={BLANK} alt={h.photoAlt} width={1600} height={1067} fetchPriority="high" />
          </picture>
        </div>
        <SignupForm preselect={preselect} onDone={onDone} />
      </div>
    </div>
  )
}
